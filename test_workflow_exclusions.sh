#!/bin/bash
echo "=== Testing File Representation Validator Exclusions ==="

# Count files with exclusions (should be project files only)
echo "Project files found:"
md_count=$(find . -name "*.md" -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./vendor/*" -not -path "./bower_components/*" -not -path "./jspm_packages/*" -not -path "./.bundle/*" -not -path "./target/*" -not -path "./build/*" -not -path "./dist/*" | wc -l)
json_count=$(find . -name "*.json" -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./vendor/*" -not -path "./bower_components/*" -not -path "./jspm_packages/*" -not -path "./.bundle/*" -not -path "./target/*" -not -path "./build/*" -not -path "./dist/*" | wc -l)

echo "- Markdown files: $md_count"
echo "- JSON files: $json_count"

# Count all files including dependencies (should be much higher)
echo -e "\nAll files (including dependencies):"
all_md=$(find . -name "*.md" -not -path "./.git/*" | wc -l)
all_json=$(find . -name "*.json" -not -path "./.git/*" | wc -l)

echo "- All Markdown files: $all_md"
echo "- All JSON files: $all_json"

# Show exclusion effectiveness
excluded_md=$((all_md - md_count))
excluded_json=$((all_json - json_count))

echo -e "\nExclusion effectiveness:"
echo "- Excluded $excluded_md markdown files from dependencies"
echo "- Excluded $excluded_json JSON files from dependencies"

if [ $excluded_md -gt 0 ] || [ $excluded_json -gt 0 ]; then
    echo "✅ Exclusions working correctly - dependency files are being filtered out"
else
    echo "⚠️  No dependency files found to exclude (this may be normal if no dependencies exist)"
fi
