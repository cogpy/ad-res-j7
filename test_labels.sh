#!/bin/bash
# Test the new label parsing logic

# Simulate the workflow logic
labels_json='["todo", "enhancement", "priority: critical", "bug"]'
echo "Testing labels: $labels_json"

# Parse labels array and create individual --label flags (new approach)
gh_args=("echo" "issue" "create" "--title" "Test Title" "--body" "Test Body")
if [ "$labels_json" != "[]" ] && [ "$labels_json" != "null" ]; then
  while IFS= read -r label; do
    if [ -n "$label" ] && [ "$label" != "null" ]; then
      gh_args+=("--label" "$label")
    fi
  done < <(echo "$labels_json" | jq -r '.[]' 2>/dev/null || echo "")
fi

echo "Generated command:"
echo "${gh_args[@]}"
