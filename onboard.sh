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

# Read version from VERSION file
if [ -f "$SCRIPT_DIR/VERSION" ]; then
    VERSION=$(cat "$SCRIPT_DIR/VERSION" | tr -d '[:space:]')
else
    VERSION="unknown"
fi

# Get source repo URL
SOURCE_REPO=$(git -C "$SCRIPT_DIR" remote get-url origin 2>/dev/null || echo "https://github.com/agarwalvipin/bulkhead.git")

echo "🚀 Onboarding Bulkhead Governance v$VERSION to: $TARGET_DIR"

# Components to copy
COMPONENTS=(".agent" "schemas" "templates" "governance")

# Function to compute directory checksum
compute_checksum() {
    local dir="$1"
    find "$dir" -type f -exec sha256sum {} \; 2>/dev/null | sort | sha256sum | cut -d' ' -f1
}

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

# Copy update script
echo "📁 Copying update.sh..."
cp "$SCRIPT_DIR/update.sh" "$TARGET_DIR/"
chmod +x "$TARGET_DIR/update.sh"

# Create architecture directory
echo "📁 Creating architecture/ ledger..."
mkdir -p "$TARGET_DIR/architecture"

# Compute checksums for installed components
echo "📝 Creating manifest..."
CHECKSUMS="{"
for component in "${COMPONENTS[@]}"; do
    if [ -d "$TARGET_DIR/$component" ]; then
        checksum=$(compute_checksum "$TARGET_DIR/$component")
        CHECKSUMS="$CHECKSUMS\"$component/\":\"sha256:$checksum\","
    fi
done
CHECKSUMS="${CHECKSUMS%,}}"

# Create manifest file
MANIFEST_FILE="$TARGET_DIR/.bulkhead-manifest.json"
cat > "$MANIFEST_FILE" << EOF
{
    "bulkhead_version": "$VERSION",
    "installed_at": "$(date -Iseconds)",
    "source_repo": "$SOURCE_REPO",
    "checksums": $CHECKSUMS
}
EOF

echo ""
echo "✅ Onboarding complete!"
echo ""
echo "Installed Bulkhead version: $VERSION"
echo "Manifest created: .bulkhead-manifest.json"
echo ""
echo "Next steps:"
echo "  1. cd $TARGET_DIR"
echo "  2. git add .agent schemas templates governance .pre-commit-config.yaml .github update.sh .bulkhead-manifest.json"
echo "  3. git commit -m 'feat: add Bulkhead governance framework v$VERSION'"
echo "  4. Run /phase-0-triage to start your first governed change"
echo ""
echo "To update Bulkhead in the future, run:"
echo "  ./update.sh"
