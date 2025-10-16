const fs = require('fs');
          const path = require('path');
          const glob = require('glob');

          class TodoIssueGenerator {
            constructor() {
              this.issues = [];
              this.existingIssues = new Set();
            }

            // Parse markdown content to extract actionable items
            parseMarkdownForTasks(content, filename) {
              const lines = content.split('\n');
              const tasks = [];
              let currentSection = '';
              let currentPriority = 'medium';
              let inPrioritySection = false;
              
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                // Track current section for context
                if (line.match(/^#{1,4}\s+/)) {
                  currentSection = line.replace(/^#+\s+/, '');
                  
                  // Extract priority from section headers
                  if (line.toLowerCase().includes('critical') || line.toLowerCase().includes('priority 1')) {
                    currentPriority = 'critical';
                  } else if (line.toLowerCase().includes('high') || line.toLowerCase().includes('priority 2')) {
                    currentPriority = 'high';
                  } else if (line.toLowerCase().includes('medium') || line.toLowerCase().includes('priority 3')) {
                    currentPriority = 'medium';
                  } else if (line.toLowerCase().includes('low') || line.toLowerCase().includes('priority 4')) {
                    currentPriority = 'low';
                  }
                  
                  // Check if we're in a priority recommendation section
                  inPrioritySection = line.toLowerCase().includes('priority recommendations') ||
                                    line.toLowerCase().includes('must-do') ||
                                    line.toLowerCase().includes('should-do') ||
                                    line.toLowerCase().includes('nice-to-have') ||
                                    line.toLowerCase().includes('phase 1') ||
                                    line.toLowerCase().includes('phase 2') ||
                                    line.toLowerCase().includes('phase 3') ||
                                    line.toLowerCase().includes('phase 4');
                }
                
                // Look for numbered tasks in priority sections
                if (inPrioritySection) {
                  const numberedTask = line.match(/^\d+\.\s*(.+)$/);
                  if (numberedTask) {
                    const task = numberedTask[1].trim();
                    if (task.length > 10) {
                      tasks.push({
                        task: task,
                        section: currentSection,
                        priority: this.determinePriorityFromSection(currentSection),
                        file: filename,
                        lineNumber: i + 1,
                        type: 'priority_task'
                      });
                    }
                  }
                }
                
                // Look for specific actionable patterns
                const actionablePatterns = [
                  /^-\s*(.*(?:implement|add|create|fix|update|improve|enhance|develop|build|establish|provide|include|demonstrate|expand|complete|review).*)/i,
                  /^\*\s*(.*(?:implement|add|create|fix|update|improve|enhance|develop|build|establish|provide|include|demonstrate|expand|complete|review).*)/i
                ];
                
                for (const pattern of actionablePatterns) {
                  const match = line.match(pattern);
                  if (match) {
                    const task = match[1].trim();
                    
                    if (this.isHighQualityTask(task)) {
                      tasks.push({
                        task: task,
                        section: currentSection,
                        priority: currentPriority,
                        file: filename,
                        lineNumber: i + 1,
                        type: 'actionable_item'
                      });
                    }
                    break;
                  }
                }
                
                // Look for specific recommendation sections
                if (line.includes('**Improvements Needed**:') || 
                    line.includes('**Action Required**:') ||
                    line.includes('**Recommended Actions**:')) {
                  
                  // Next lines likely contain tasks
                  for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
                    const nextLine = lines[j].trim();
                    
                    if (nextLine.startsWith('-')) {
                      const taskMatch = nextLine.match(/^-\s*(.+)$/);
                      if (taskMatch) {
                        const taskText = taskMatch[1].trim();
                        if (this.isHighQualityTask(taskText)) {
                          tasks.push({
                            task: taskText,
                            section: currentSection,
                            priority: currentPriority,
                            file: filename,
                            lineNumber: j + 1,
                            type: 'improvement_item'
                          });
                        }
                      }
                    } else if (nextLine.length === 0) {
                      continue;
                    } else if (nextLine.match(/^#{1,6}\s+/) || nextLine.includes('**')) {
                      break;
                    }
                  }
                }
              }
              
              return tasks;
            }

            // Determine priority from section name
            determinePriorityFromSection(section) {
              const sectionLower = section.toLowerCase();
              
              if (sectionLower.includes('must-do') || sectionLower.includes('phase 1') || sectionLower.includes('critical')) {
                return 'critical';
              } else if (sectionLower.includes('should-do') || sectionLower.includes('phase 2') || sectionLower.includes('high')) {
                return 'high';
              } else if (sectionLower.includes('nice-to-have') || sectionLower.includes('phase 3') || sectionLower.includes('phase 4')) {
                return 'medium';
              }
              
              return 'medium';
            }

            // Determine if a task is high quality and actionable
            isHighQualityTask(task) {
              // Skip if too short
              if (task.length < 15) {
                return false;
              }
              
              // Skip formatting artifacts and non-actionable text
              const skipPatterns = [
                /^\*\*.*\*\*$/,  // Just bold text
                /^\*\*.*\*\*:$/,  // Bold text ending with colon (section headers)
                /^\*\*Current Coverage\*\*:/i,  // Bold "Current Coverage:" with text after
                /^Current Coverage/i,  // Any line starting with "Current Coverage"
                /^Legal Significance:/i,
                /^Framework Phase:/i,
                /^Impact:/i,
                /^Estimated effort:/i,
                /^Total.*effort:/i,
                /^When compared against/i,
                /^The (current|existing|draft)/i,
                /^This (document|analysis|section)/i,
                /^Improvements? Needed:?$/i,  // Section header pattern
                /^Actions? Required:?$/i,     // Section header pattern
                /^Recommended Actions?:?$/i,  // Section header pattern
                /hours?$/i,  // Ends with "hours" - likely effort estimate
                /^Show\s+/i,  // Lines starting with "Show" - usually examples
                /^Demonstrate\s+/i,  // Lines starting with "Demonstrate" - usually descriptions
                /^Provide\s+/i,  // Lines starting with "Provide" - often descriptive
                /^Include\s+/i,  // Lines starting with "Include" - often descriptive
                /^Emphasize\s+/i,  // Lines starting with "Emphasize" - descriptive
                /^Highlight\s+/i,  // Lines starting with "Highlight" - descriptive
                /^Reference\s+/i,  // Lines starting with "Reference" - descriptive
                /^Expose\s+/i,  // Lines starting with "Expose" - descriptive
                /\(.*\)$/,  // Lines ending with parentheses - often annotations
                /^\[x\]/i,  // Completed checkbox items
                /✅/,  // Lines with checkmark emoji
                /COMPLETED/i,  // Lines marked as completed
                /^-\s*\*\*/,  // Bullet points starting with bold text
                /^\d+\.\s*\*\*/  // Numbered lists starting with bold text
              ];
              
              for (const pattern of skipPatterns) {
                if (pattern.test(task)) {
                  return false;
                }
              }
              
              // Skip lines that are just descriptions or analysis statements
              const descriptionPatterns = [
                /^.*your .* role/i,
                /^.*Peter's .*/i,
                /^.*timing correlation/i,
                /^.*director loan account/i,
                /^.*historical context/i,
                /^.*industry.?standard/i,
                /^.*sudden objection/i,
                /^.*established practice/i,
                /^.*comprehensive analysis/i,
                /^.*external validation/i,
                /^.*bad faith/i,
                /^.*point.?by.?point/i,
                /^.*general refutation/i,
                /^.*business norms/i,
                /^.*loan account credit/i,
                /^.*director.*owe/i,
                /^.*inconsistent with/i,
                /^.*participation in/i,
                /^.*informal model/i,
                /^.*partially addressed/i,
                /^.*accounting records/i,
                /^.*pretext evidence/i
              ];
              
              for (const pattern of descriptionPatterns) {
                if (pattern.test(task)) {
                  return false;
                }
              }
              
              // Only accept if it's clearly a TODO or action item
              const actionPatterns = [
                /^(TODO|FIXME|TASK|ACTION):/i,
                /^(Implement|Create|Build|Fix|Add|Update|Develop)\s+a\s+/i,
                /^(Write|Draft|Prepare|Design|Setup|Configure)\s+/i,
                /^(Test|Validate|Verify|Check)\s+/i,
                /monitoring and alerting/i,
                /automated testing pipeline/i,
                /comprehensive test suite/i,
                /duplicate prevention/i,
                /JSON parsing/i,
                /workflow functionality/i
              ];
              
              const hasExplicitAction = actionPatterns.some(pattern => 
                pattern.test(task)
              );
              
              return hasExplicitAction;
            }

            // Generate GitHub issue content
            generateIssueContent(task) {
              const labels = ['todo', 'enhancement'];
              
              // Add priority labels
              if (task.priority === 'critical') {
                labels.push('priority: critical', 'bug');
              } else if (task.priority === 'high') {
                labels.push('priority: high');
              } else if (task.priority === 'medium') {
                labels.push('priority: medium');
              } else if (task.priority === 'low') {
                labels.push('priority: low');
              }

              // Generate a clean title
              let title = task.task;
              
              // Remove markdown formatting
              title = title.replace(/\*\*(.+?)\*\*/g, '$1');
              title = title.replace(/\*(.+?)\*/g, '$1');
              title = title.replace(/`(.+?)`/g, '$1');
              
              // Trim and clean
              title = title.replace(/^[-*\d.\s]+/, '').trim();
              
              // Limit length
              if (title.length > 80) {
                title = title.substring(0, 77) + '...';
              }

              const body = '## Task Description\\n\\n' +
                task.task + '\\n\\n' +
                '## Context\\n\\n' +
                '**Source File:** `' + task.file + '`\\n' +
                '**Section:** ' + task.section + '\\n' +
                '**Priority:** ' + task.priority + '\\n' +
                '**Line:** ' + task.lineNumber + '\\n\\n' +
                '## Implementation Notes\\n\\n' +
                'This task was automatically generated from the todo folder. Please review the source file for additional context and requirements.\\n\\n' +
                '## Acceptance Criteria\\n\\n' +
                '- [ ] Review the task requirements in the source file\\n' +
                '- [ ] Implement the necessary changes\\n' +
                '- [ ] Test the implementation\\n' +
                '- [ ] Update documentation if needed\\n' +
                '- [ ] Close this issue when complete\\n\\n' +
                '---\\n\\n' +
                '*Generated automatically from todo files by GitHub Actions*';

              return {
                title: title,
                body: body,
                labels: labels,
                source: task
              };
            }

            // Process all todo files
            processFiles() {
              console.log('🔄 Processing todo files for actionable tasks...');
              
              let todoFiles;
              try {
                todoFiles = glob.sync('todo/**/*.md');
                console.log(`Found ${todoFiles.length} todo files to process`);
              } catch (error) {
                console.error('❌ Error scanning todo directory:', error.message);
                console.error('Ensure the todo/ directory exists and is accessible');
                process.exit(1);
              }

              if (todoFiles.length === 0) {
                console.log('ℹ️ No todo files found to process');
                return this.issues;
              }

              let totalTasks = 0;
              let processedFiles = 0;
              let failedFiles = [];

              for (const file of todoFiles) {
                console.log(`📋 Processing: ${file}`);
                
                try {
                  // Check file accessibility
                  if (!fs.existsSync(file)) {
                    throw new Error(`File not found: ${file}`);
                  }

                  const stats = fs.statSync(file);
                  if (!stats.isFile()) {
                    throw new Error(`Not a regular file: ${file}`);
                  }

                  // Read file with encoding validation
                  const content = fs.readFileSync(file, 'utf8');
                  
                  if (!content || content.trim() === '') {
                    console.log(`  ⚠️ Skipping empty file: ${file}`);
                    continue;
                  }

                  const tasks = this.parseMarkdownForTasks(content, file);
                  console.log(`  Found ${tasks.length} potential tasks`);
                  
                  for (const task of tasks) {
                    try {
                      const issue = this.generateIssueContent(task);
                      this.issues.push(issue);
                      totalTasks++;
                    } catch (issueError) {
                      console.error(`  ❌ Error generating issue for task in ${file}:`, issueError.message);
                      console.error(`  Task content: ${task.task ? task.task.substring(0, 100) : 'N/A'}...`);
                    }
                  }
                  
                  processedFiles++;
                  
                } catch (error) {
                  console.error(`❌ Error processing ${file}:`);
                  console.error(`  Error type: ${error.name || 'Unknown'}`);
                  console.error(`  Error message: ${error.message}`);
                  console.error(`  File: ${file}`);
                  
                  failedFiles.push({
                    file: file,
                    error: error.message,
                    type: error.name || 'Unknown'
                  });
                  
                  // Continue processing other files instead of failing completely
                  continue;
                }
              }

              // Report processing results
              console.log(`\n📊 Processing Summary:`);
              console.log(`  ✅ Successfully processed: ${processedFiles} files`);
              console.log(`  ❌ Failed to process: ${failedFiles.length} files`);
              console.log(`  📋 Total actionable tasks found: ${totalTasks}`);

              if (failedFiles.length > 0) {
                console.log(`\n⚠️ Files that failed processing:`);
                failedFiles.forEach(failure => {
                  console.log(`  - ${failure.file}: ${failure.error} (${failure.type})`);
                });
              }

              if (processedFiles === 0) {
                console.error('❌ No files were successfully processed');
                process.exit(1);
              }

              console.log(`\n✅ Processing complete! Found ${totalTasks} actionable tasks across ${processedFiles} successfully processed files.`);
              return this.issues;
            }

            // Generate output for GitHub Actions
            generateOutput() {
              try {
                const output = {
                  summary: {
                    total_issues: this.issues.length,
                    priorities: {
                      critical: this.issues.filter(i => i.source && i.source.priority === 'critical').length,
                      high: this.issues.filter(i => i.source && i.source.priority === 'high').length,
                      medium: this.issues.filter(i => i.source && i.source.priority === 'medium').length,
                      low: this.issues.filter(i => i.source && i.source.priority === 'low').length
                    },
                    files_processed: [...new Set(this.issues.map(i => i.source ? i.source.file : 'unknown').filter(f => f !== 'unknown'))].length
                  },
                  issues: this.issues,
                  generated_at: new Date().toISOString(),
                  generator_version: '2.0'
                };

                // Validate output before writing
                if (!output.issues || !Array.isArray(output.issues)) {
                  throw new Error('Invalid issues array in output');
                }

                // Write to file for GitHub Actions to use
                const outputJSON = JSON.stringify(output, null, 2);
                
                try {
                  fs.writeFileSync('todo-issues.json', outputJSON);
                  console.log('✅ Successfully wrote output to todo-issues.json');
                } catch (writeError) {
                  console.error('❌ Failed to write output file:', writeError.message);
                  throw writeError;
                }
                
                return output;
                
              } catch (error) {
                console.error('❌ Error generating output:', error.message);
                console.error('Stack trace:', error.stack);
                
                // Create minimal fallback output
                const fallbackOutput = {
                  summary: {
                    total_issues: 0,
                    priorities: { critical: 0, high: 0, medium: 0, low: 0 },
                    files_processed: 0
                  },
                  issues: [],
                  generated_at: new Date().toISOString(),
                  error: error.message
                };
                
                fs.writeFileSync('todo-issues.json', JSON.stringify(fallbackOutput, null, 2));
                throw error;
              }
            }
          }

          // Run the generator with comprehensive error handling
          try {
            console.log('🚀 Starting Todo Issue Generator...');
            
            const generator = new TodoIssueGenerator();
            const issues = generator.processFiles();
            const output = generator.generateOutput();

            console.log(`\n📊 Final Summary:`);
            console.log(`- Total actionable tasks: ${output.summary.total_issues}`);
            console.log(`- Critical priority: ${output.summary.priorities.critical}`);
            console.log(`- High priority: ${output.summary.priorities.high}`);
            console.log(`- Medium priority: ${output.summary.priorities.medium}`);
            console.log(`- Low priority: ${output.summary.priorities.low}`);
            console.log(`- Files processed: ${output.summary.files_processed}`);
            console.log(`- Generated at: ${output.generated_at}`);

            if (output.summary.total_issues === 0) {
              console.log('\n⚠️ No actionable tasks found. This could indicate:');
              console.log('  - Todo files don\'t contain recognizable task patterns');
              console.log('  - Tasks don\'t meet quality filtering criteria');
              console.log('  - Files are empty or contain only non-actionable content');
              process.exit(0);
            }

            console.log('\n🎉 Todo Issue Generator completed successfully!');
            process.exit(0);
            
          } catch (error) {
            console.error('\n💥 Fatal Error in Todo Issue Generator:');
            console.error(`Error type: ${error.name || 'Unknown'}`);
            console.error(`Error message: ${error.message}`);
            console.error(`Stack trace: ${error.stack}`);
            
            // Ensure we have some output file for GitHub Actions
            const errorOutput = {
              summary: {
                total_issues: 0,
                priorities: { critical: 0, high: 0, medium: 0, low: 0 },
                files_processed: 0
              },
              issues: [],
              generated_at: new Date().toISOString(),
              error: {
                type: error.name || 'Unknown',
                message: error.message,
                stack: error.stack
              }
            };
            
            try {
              fs.writeFileSync('todo-issues.json', JSON.stringify(errorOutput, null, 2));
            } catch (writeError) {
              console.error('❌ Failed to write error output:', writeError.message);
            }
            
            process.exit(1);
          }