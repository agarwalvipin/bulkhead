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

# Create .bulkhead directory
BULKHEAD_DIR="$TARGET_DIR/.bulkhead"
mkdir -p "$BULKHEAD_DIR"

# Components to copy into .bulkhead/
COMPONENTS=("schemas" "templates" "governance")

# Mergeable files - files that projects commonly customize
MERGEABLE_FILES=(".pre-commit-config.yaml")

# Track pending merges
PENDING_MERGES=()

# Backup and pending directories (inside .bulkhead/)
BACKUP_DIR="$BULKHEAD_DIR/backup"
PENDING_DIR="$BULKHEAD_DIR/pending"

# Function to compute directory checksum
compute_checksum() {
    local dir="$1"
    find "$dir" -type f -exec sha256sum {} \; 2>/dev/null | sort | sha256sum | cut -d' ' -f1
}

# Function to handle mergeable files
handle_mergeable_file() {
    local filename="$1"
    local source_file="$SCRIPT_DIR/$filename"
    local target_file="$TARGET_DIR/$filename"
    
    if [ ! -f "$source_file" ]; then
        return
    fi
    
    if [ -f "$target_file" ]; then
        # File exists - backup and create pending
        echo "⚠️  Conflict detected: $filename"
        
        # Create backup directory
        mkdir -p "$BACKUP_DIR"
        cp "$target_file" "$BACKUP_DIR/$filename"
        echo "   → Backed up to: .bulkhead/backup/$filename"
        
        # Create pending directory with Bulkhead's version
        mkdir -p "$PENDING_DIR"
        cp "$source_file" "$PENDING_DIR/$filename"
        echo "   → Bulkhead version: .bulkhead/pending/$filename"
        
        PENDING_MERGES+=("$filename")
    else
        # File doesn't exist - copy normally
        echo "📁 Copying $filename..."
        cp "$source_file" "$target_file"
    fi
}

# Copy .agent directory (stays at root - agent convention)
echo "📁 Copying .agent/ (workflows & rules)..."
cp -r "$SCRIPT_DIR/.agent" "$TARGET_DIR/"

# Copy components into .bulkhead/
for component in "${COMPONENTS[@]}"; do
    echo "📁 Copying .bulkhead/$component/..."
    cp -r "$SCRIPT_DIR/$component" "$BULKHEAD_DIR/"
done

# Create architecture directory inside .bulkhead/
echo "📁 Creating .bulkhead/architecture/ ledger..."
mkdir -p "$BULKHEAD_DIR/architecture"

# Copy default config.yaml if template exists
if [ -f "$BULKHEAD_DIR/templates/config.yaml" ]; then
    echo "📁 Creating .bulkhead/config.yaml (default: standard rigor)..."
    cp "$BULKHEAD_DIR/templates/config.yaml" "$BULKHEAD_DIR/config.yaml"
fi

# Handle mergeable files with conflict detection
echo ""
echo "📝 Checking for file conflicts..."
for file in "${MERGEABLE_FILES[@]}"; do
    handle_mergeable_file "$file"
done

# Copy GitHub Actions (stays at .github/ - GitHub convention)
echo ""
echo "📁 Copying .github/workflows/..."
mkdir -p "$TARGET_DIR/.github/workflows"
if [ -f "$TARGET_DIR/.github/workflows/validate-schemas.yml" ]; then
    echo "⚠️  Conflict detected: .github/workflows/validate-schemas.yml"
    mkdir -p "$BACKUP_DIR/.github/workflows"
    cp "$TARGET_DIR/.github/workflows/validate-schemas.yml" "$BACKUP_DIR/.github/workflows/"
    mkdir -p "$PENDING_DIR/.github/workflows"
    cp "$SCRIPT_DIR/.github/workflows/validate-schemas.yml" "$PENDING_DIR/.github/workflows/"
    PENDING_MERGES+=(".github/workflows/validate-schemas.yml")
else
    cp "$SCRIPT_DIR/.github/workflows/validate-schemas.yml" "$TARGET_DIR/.github/workflows/"
fi

# Copy update script into .bulkhead/
echo "📁 Copying .bulkhead/update.sh..."
cp "$SCRIPT_DIR/update.sh" "$BULKHEAD_DIR/"
chmod +x "$BULKHEAD_DIR/update.sh"

# Compute checksums for installed components
echo ""
echo "📝 Creating manifest..."
CHECKSUMS="{"
for component in "${COMPONENTS[@]}"; do
    if [ -d "$BULKHEAD_DIR/$component" ]; then
        checksum=$(compute_checksum "$BULKHEAD_DIR/$component")
        CHECKSUMS="$CHECKSUMS\"$component/\":\"sha256:$checksum\","
    fi
done
# Add .agent checksum
if [ -d "$TARGET_DIR/.agent" ]; then
    checksum=$(compute_checksum "$TARGET_DIR/.agent")
    CHECKSUMS="$CHECKSUMS\".agent/\":\"sha256:$checksum\","
fi
CHECKSUMS="${CHECKSUMS%,}}"

# Build pending merges JSON array
PENDING_JSON="["
for merge in "${PENDING_MERGES[@]}"; do
    PENDING_JSON="$PENDING_JSON\"$merge\","
done
PENDING_JSON="${PENDING_JSON%,}]"

# Create manifest file inside .bulkhead/
MANIFEST_FILE="$BULKHEAD_DIR/manifest.json"
cat > "$MANIFEST_FILE" << EOF
{
    "bulkhead_version": "$VERSION",
    "installed_at": "$(date -Iseconds)",
    "source_repo": "$SOURCE_REPO",
    "checksums": $CHECKSUMS,
    "pending_merges": $PENDING_JSON,
    "backup_location": ".bulkhead/backup/"
}
EOF

echo ""
echo "✅ Onboarding complete!"
echo ""
echo "Installed Bulkhead version: $VERSION"
echo "Manifest created: .bulkhead/manifest.json"

# Show merge instructions if there are pending merges
if [ ${#PENDING_MERGES[@]} -gt 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚠️  MERGE REQUIRED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "The following files already exist and need manual merging:"
    echo ""
    for merge in "${PENDING_MERGES[@]}"; do
        echo "  📄 $merge"
        echo "     Your original:     .bulkhead/backup/$merge"
        echo "     Bulkhead version:  .bulkhead/pending/$merge"
        echo ""
    done
    echo "Please merge Bulkhead's additions into your existing files."
    echo "After merging, you can delete .bulkhead/backup/ and .bulkhead/pending/"
    echo ""
fi

echo ""
echo "📂 Structure created:"
echo "   .agent/              → Workflows & rules"
echo "   .bulkhead/"
echo "   ├── architecture/    → Governance artifacts"
echo "   ├── governance/      → Philosophy docs"
echo "   ├── schemas/         → JSON Schemas"
echo "   ├── templates/       → Phase templates"
echo "   ├── config.yaml      → Rigor configuration"
echo "   └── manifest.json    → Version tracking"
echo ""
echo "Next steps:"
echo "  1. cd $TARGET_DIR"
if [ ${#PENDING_MERGES[@]} -gt 0 ]; then
    echo "  2. Merge pending files (see above)"
    echo "  3. git add .agent .bulkhead .github"
else
    echo "  2. git add .agent .bulkhead .pre-commit-config.yaml .github"
fi
echo "  4. git commit -m 'feat: add Bulkhead governance framework v$VERSION'"
echo "  5. Run /phase-0-triage to start your first governed change"
echo ""
echo "To update Bulkhead in the future, run:"
echo "  .bulkhead/update.sh"
