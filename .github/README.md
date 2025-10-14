# GitHub Actions Workflows

This directory contains automated workflows for the AD Response J7 repository.

## Workflows

### File Representation Validator (`file-representations.yml`)

**Purpose**: Ensures every file in the repository has both markdown (`.md`) and JSON (`.json`) representations.

**When it runs**:
- On push to `main` branch
- On pull requests to `main` branch
- Manually via workflow dispatch

**What it does**:

1. **Analysis Phase**:
   - Scans the repository for all `.md` and `.json` files
   - Identifies missing counterparts (MD files without JSON, JSON files without MD)
   - Reports statistics in the job summary

2. **Generation Phase**:
   - Converts markdown files to structured JSON format with:
     - Title extraction
     - Section parsing (headings and content)
     - Metadata (source file, creation date)
   - Converts JSON files to readable markdown format
   - Preserves directory structure

3. **Validation Phase**:
   - Commits any newly generated files
   - Performs final validation to ensure 100% coverage
   - Reports success/failure in job summary

**File Structure Generated**:

For markdown files, the JSON structure includes:
```json
{
  "title": "Document Title",
  "source_file": "/path/to/source.md",
  "created_at": "ISO datetime",
  "file_type": "markdown",
  "sections": [
    {
      "heading": "Section Name",
      "level": 2,
      "content": "Section content...",
      "subsections": [
        {
          "heading": "Subsection",
          "level": 3,
          "content": "Subsection content..."
        }
      ]
    }
  ]
}
```

For JSON files, generates readable markdown with proper heading levels and content sections.

**Benefits**:
- **Dual Format Access**: Every document accessible in both human-readable (MD) and machine-readable (JSON) formats
- **Automated Maintenance**: No manual effort required to keep formats in sync
- **Structured Data**: JSON format enables programmatic analysis and processing
- **Documentation Consistency**: Ensures all documentation follows the same structural patterns

### Legacy Workflow (`blank.yml`)

The original CI workflow has been updated to use the same file representation validation logic. This ensures backward compatibility while providing the new functionality.

## Usage

The workflows run automatically, but you can also:

1. **Trigger manually**: Go to Actions tab → Select "File Representation Validator" → Click "Run workflow"

2. **Check results**: View the job summary for detailed statistics and any issues

3. **Local testing**: The converter script can be extracted and run locally for testing before committing changes

## Troubleshooting

If the workflow fails:

1. Check the job summary for specific error messages
2. Verify file permissions and Git configuration
3. Ensure no binary files are being processed as text
4. Check for JSON parsing errors in existing files

## Maintenance

- The workflow automatically commits generated files using the GitHub Actions bot account
- Generated files include metadata comments indicating their automated origin
- The workflow respects `.gitignore` patterns and excludes system directories