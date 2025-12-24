#!/bin/bash
# Bulkhead Governance Framework - Onboarding Script
# Usage: ./onboard.sh /path/to/your/project

set -e

TARGET_DIR="${1:-.}"

if [ "$TARGET_DIR" = "." ]; then
    echo "Usage: ./onboard.sh /path/to/your/project"
    echo "This will copy the governance framework to your project."
    exit 1
fi

if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Target directory '$TARGET_DIR' does not exist."
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Onboarding Bulkhead Governance to: $TARGET_DIR"

# Copy .agent directory (workflows and rules)
echo "📁 Copying .agent/ (workflows & rules)..."
cp -r "$SCRIPT_DIR/.agent" "$TARGET_DIR/"

# Copy schemas
echo "📁 Copying schemas/..."
cp -r "$SCRIPT_DIR/schemas" "$TARGET_DIR/"

# Copy templates
echo "📁 Copying templates/..."
cp -r "$SCRIPT_DIR/templates" "$TARGET_DIR/"

# Copy governance docs
echo "📁 Copying governance/..."
cp -r "$SCRIPT_DIR/governance" "$TARGET_DIR/"

# Copy pre-commit config
echo "📁 Copying .pre-commit-config.yaml..."
cp "$SCRIPT_DIR/.pre-commit-config.yaml" "$TARGET_DIR/"

# Copy GitHub Actions
echo "📁 Copying .github/workflows/..."
mkdir -p "$TARGET_DIR/.github/workflows"
cp "$SCRIPT_DIR/.github/workflows/validate-schemas.yml" "$TARGET_DIR/.github/workflows/"

# Create architecture directory
echo "📁 Creating architecture/ ledger..."
mkdir -p "$TARGET_DIR/architecture"

echo ""
echo "✅ Onboarding complete!"
echo ""
echo "Next steps:"
echo "  1. cd $TARGET_DIR"
echo "  2. git add .agent schemas templates governance .pre-commit-config.yaml .github"
echo "  3. git commit -m 'feat: add Bulkhead governance framework'"
echo "  4. Run /phase-0-triage to start your first governed change"
