#!/bin/bash
# Test edge case labels

# Test with labels containing special characters and spaces
labels_json='["todo", "priority: critical", "bug: high-priority", "needs \"quotes\""]'
echo "Testing edge case labels: $labels_json"

gh_args=("echo" "issue" "create" "--title" "Test" "--body" "Test")
if [ "$labels_json" != "[]" ] && [ "$labels_json" != "null" ]; then
  while IFS= read -r label; do
    if [ -n "$label" ] && [ "$label" != "null" ]; then
      gh_args+=("--label" "$label")
    fi
  done < <(echo "$labels_json" | jq -r '.[]' 2>/dev/null || echo "")
fi

echo "Generated command:"
printf '%q ' "${gh_args[@]}"
echo
