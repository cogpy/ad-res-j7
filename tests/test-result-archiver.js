/**
 * Test Result Archiver
 * 
 * Archives test results to prevent merge conflicts in the tests/ folder.
 * Results are stored in test-data/ directory which is gitignored.
 * 
 * Directory structure:
 * - test-data/latest/        - Most recent test results (always current)
 * - test-data/archives/      - Timestamped archive of past test runs
 * - tests/                   - Backward compatibility copies (gitignored via pattern)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TestResultArchiver {
  constructor() {
    this.testDataDir = path.join(process.cwd(), 'test-data');
    this.latestDir = path.join(this.testDataDir, 'latest');
    this.archiveDir = path.join(this.testDataDir, 'archives');
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  /**
   * Ensure all required directories exist
   */
  ensureDirectories() {
    [this.testDataDir, this.latestDir, this.archiveDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    // Create .gitkeep file in test-data to track the directory
    const gitkeepPath = path.join(this.testDataDir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
    }
  }

  /**
   * Get git metadata for the current state
   */
  getGitMetadata() {
    try {
      return {
        git_branch: execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim(),
        git_commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
        git_commit_short: execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
      };
    } catch (error) {
      // If git is not available or not in a git repo, return defaults
      return {
        git_branch: 'unknown',
        git_commit: 'unknown',
        git_commit_short: 'unknown'
      };
    }
  }

  /**
   * Archive a test result
   * 
   * @param {string} filename - Name of the result file (e.g., 'comprehensive-test-results.json')
   * @param {object} data - Test result data to save
   * @param {object} options - Additional options
   * @param {string} options.testType - Type of test (e.g., 'comprehensive-test')
   * @param {object} options.metadata - Additional metadata
   * @param {object} options.summary - Test summary
   */
  archiveTestResult(filename, data, options = {}) {
    const timestamp = new Date().toISOString();
    const gitMetadata = this.getGitMetadata();
    
    // Prepare the data with metadata
    const archivedData = {
      ...data,
      _metadata: {
        archived_at: timestamp,
        test_type: options.testType || 'unknown',
        ...gitMetadata,
        ...options.metadata
      }
    };

    // Save to latest directory (overwrites previous)
    const latestPath = path.join(this.latestDir, filename);
    this.saveJSON(latestPath, archivedData);

    // Save to timestamped archive
    const archiveFilename = this.generateArchiveFilename(filename, timestamp);
    const archivePath = path.join(this.archiveDir, archiveFilename);
    
    // Add summary metadata for easy browsing
    const archiveData = {
      ...archivedData,
      _archive_summary: {
        test_type: options.testType,
        test_stats: {
          total_tests: options.summary?.total_tests || options.summary?.total || 0,
          passed_tests: options.summary?.passed_tests || options.summary?.passed || 0,
          failed_tests: options.summary?.failed_tests || options.summary?.failed || 0,
          success_rate: options.summary?.success_rate || 0
        }
      }
    };
    
    this.saveJSON(archivePath, archiveData);

    // Also save to tests/ directory for backward compatibility (gitignored)
    const testsPath = path.join(process.cwd(), 'tests', filename);
    this.saveJSON(testsPath, data);

    console.log(`📁 Test results archived:`);
    console.log(`   ✓ Latest: ${path.relative(process.cwd(), latestPath)}`);
    console.log(`   ✓ Archive: ${path.relative(process.cwd(), archivePath)}`);
    console.log(`   ✓ Compatibility: ${path.relative(process.cwd(), testsPath)}`);
  }

  /**
   * Generate a timestamped archive filename
   */
  generateArchiveFilename(originalFilename, timestamp) {
    const basename = path.basename(originalFilename, path.extname(originalFilename));
    const ext = path.extname(originalFilename);
    const dateStr = timestamp.replace(/[:.]/g, '-').replace('T', '_').substring(0, 19);
    return `${basename}_${dateStr}${ext}`;
  }

  /**
   * Save data as JSON file
   */
  saveJSON(filepath, data) {
    try {
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error saving JSON to ${filepath}:`, error.message);
    }
  }

  /**
   * Get recent archives
   * 
   * @param {number} limit - Maximum number of archives to return
   * @returns {Array} Array of archive info objects
   */
  getRecentArchives(limit = 10) {
    try {
      const files = fs.readdirSync(this.archiveDir);
      
      const archives = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filepath = path.join(this.archiveDir, file);
          const stats = fs.statSync(filepath);
          
          let summary = null;
          try {
            const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
            summary = content._archive_summary;
          } catch (e) {
            // If we can't read the file, skip summary
          }
          
          return {
            name: file,
            path: filepath,
            created: stats.mtime.toISOString(),
            size: stats.size,
            summary
          };
        })
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, limit);
      
      return archives;
    } catch (error) {
      console.error('Error reading archives:', error.message);
      return [];
    }
  }

  /**
   * Clean old archives (keep only most recent N)
   * 
   * @param {number} keepCount - Number of recent archives to keep
   */
  cleanOldArchives(keepCount = 50) {
    try {
      const files = fs.readdirSync(this.archiveDir);
      const archives = files
        .filter(file => file.endsWith('.json'))
        .map(file => ({
          name: file,
          path: path.join(this.archiveDir, file),
          mtime: fs.statSync(path.join(this.archiveDir, file)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);

      if (archives.length > keepCount) {
        const toDelete = archives.slice(keepCount);
        toDelete.forEach(archive => {
          fs.unlinkSync(archive.path);
          console.log(`🗑️  Deleted old archive: ${archive.name}`);
        });
      }
    } catch (error) {
      console.error('Error cleaning old archives:', error.message);
    }
  }
}

module.exports = TestResultArchiver;
