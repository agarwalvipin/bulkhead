#!/bin/bash
# Bulkhead Governance Framework - Update Script
# Usage: ./update.sh [--check] [--force]
#
# Options:
#   --check   Only check for updates, don't apply
#   --force   Skip confirmation prompts

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MANIFEST_FILE=".bulkhead-manifest.json"
BACKUP_DIR=".bulkhead-backup"
TEMP_DIR="/tmp/bulkhead-update-$$"
TIMEOUT_SECONDS=30

# Components to update
COMPONENTS=(".agent" "schemas" "templates" "governance")

# Parse arguments
CHECK_ONLY=false
FORCE=false
for arg in "$@"; do
    case $arg in
        --check) CHECK_ONLY=true ;;
        --force) FORCE=true ;;
        *) echo "Unknown option: $arg"; exit 1 ;;
    esac
done

log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

cleanup() {
    rm -rf "$TEMP_DIR" 2>/dev/null || true
}
trap cleanup EXIT

# Check if we're in an onboarded project
if [ ! -f "$MANIFEST_FILE" ]; then
    log_error "No $MANIFEST_FILE found. Is this a Bulkhead-onboarded project?"
    log_info "Run the onboard.sh script first to initialize Bulkhead in this project."
    exit 1
fi

# Read current manifest
CURRENT_VERSION=$(jq -r '.bulkhead_version' "$MANIFEST_FILE")
SOURCE_REPO=$(jq -r '.source_repo' "$MANIFEST_FILE")

if [ -z "$CURRENT_VERSION" ] || [ "$CURRENT_VERSION" = "null" ]; then
    log_error "Invalid manifest: missing bulkhead_version"
    exit 1
fi

if [ -z "$SOURCE_REPO" ] || [ "$SOURCE_REPO" = "null" ]; then
    log_error "Invalid manifest: missing source_repo"
    exit 1
fi

log_info "Current Bulkhead version: ${GREEN}$CURRENT_VERSION${NC}"
log_info "Source repository: $SOURCE_REPO"

# Clone the latest version to temp directory
log_info "Fetching latest version..."
mkdir -p "$TEMP_DIR"

if ! timeout "$TIMEOUT_SECONDS" git clone --depth 1 --quiet "$SOURCE_REPO" "$TEMP_DIR/bulkhead" 2>/dev/null; then
    log_error "Failed to fetch from $SOURCE_REPO (timeout: ${TIMEOUT_SECONDS}s)"
    exit 1
fi

# Read latest version
if [ ! -f "$TEMP_DIR/bulkhead/VERSION" ]; then
    log_error "Remote repository has no VERSION file. Cannot determine version."
    exit 1
fi

LATEST_VERSION=$(cat "$TEMP_DIR/bulkhead/VERSION" | tr -d '[:space:]')
log_info "Latest Bulkhead version: ${GREEN}$LATEST_VERSION${NC}"

# Compare versions
if [ "$CURRENT_VERSION" = "$LATEST_VERSION" ]; then
    log_success "You're already on the latest version!"
    exit 0
fi

# Version comparison (simple string comparison for semver)
log_warning "Update available: $CURRENT_VERSION → $LATEST_VERSION"

if [ "$CHECK_ONLY" = true ]; then
    echo ""
    log_info "Run without --check to apply the update."
    exit 0
fi

# Show changelog if available
if [ -f "$TEMP_DIR/bulkhead/CHANGELOG.md" ]; then
    echo ""
    log_info "Changelog since your version:"
    echo "─────────────────────────────────────────"
    # Extract changelog entries (simplified)
    head -50 "$TEMP_DIR/bulkhead/CHANGELOG.md" | tail -40
    echo "─────────────────────────────────────────"
    echo ""
fi

# Confirm update
if [ "$FORCE" != true ]; then
    read -p "Do you want to proceed with the update? [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Update cancelled."
        exit 0
    fi
fi

# Create backup
BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/$BACKUP_TIMESTAMP"
log_info "Creating backup in $BACKUP_PATH..."
mkdir -p "$BACKUP_PATH"

for component in "${COMPONENTS[@]}"; do
    if [ -d "$component" ]; then
        cp -r "$component" "$BACKUP_PATH/"
        log_success "Backed up $component"
    fi
done

# Copy manifest to backup
cp "$MANIFEST_FILE" "$BACKUP_PATH/"

# Function to compute directory checksum
compute_checksum() {
    local dir="$1"
    if [ -d "$dir" ]; then
        find "$dir" -type f -exec sha256sum {} \; 2>/dev/null | sort | sha256sum | cut -d' ' -f1
    else
        echo ""
    fi
}

# Function to check if component was modified
is_modified() {
    local component="$1"
    local stored_checksum=$(jq -r ".checksums[\"$component/\"] // empty" "$MANIFEST_FILE")
    local current_checksum=$(compute_checksum "$component")
    
    if [ -z "$stored_checksum" ]; then
        # No stored checksum, assume unmodified
        return 1
    fi
    
    if [ "$stored_checksum" != "$current_checksum" ]; then
        return 0  # Modified
    else
        return 1  # Unmodified
    fi
}

# Function to merge a file using git merge-file
merge_file() {
    local original="$1"  # Original from last install
    local current="$2"   # Current (possibly modified)
    local new="$3"       # New from update
    local output="$4"    # Output file
    
    # If git merge-file is available, use 3-way merge
    if command -v git &>/dev/null; then
        # Create temp files for merge
        local tmp_original=$(mktemp)
        local tmp_current=$(mktemp)
        local tmp_new=$(mktemp)
        
        cp "$original" "$tmp_original" 2>/dev/null || touch "$tmp_original"
        cp "$current" "$tmp_current" 2>/dev/null || touch "$tmp_current"
        cp "$new" "$tmp_new"
        
        # Attempt merge
        if git merge-file -p "$tmp_current" "$tmp_original" "$tmp_new" > "$output" 2>/dev/null; then
            rm -f "$tmp_original" "$tmp_current" "$tmp_new"
            return 0  # Clean merge
        else
            # Conflict - file contains conflict markers
            rm -f "$tmp_original" "$tmp_current" "$tmp_new"
            return 1  # Conflict
        fi
    else
        # No git available, just copy new version
        cp "$new" "$output"
        return 0
    fi
}

# Update each component
CONFLICTS=()
for component in "${COMPONENTS[@]}"; do
    if [ ! -d "$TEMP_DIR/bulkhead/$component" ]; then
        log_warning "Component $component not found in update, skipping..."
        continue
    fi
    
    if is_modified "$component"; then
        log_warning "$component has local modifications, attempting merge..."
        
        # For directories with modifications, we need to merge file by file
        find "$TEMP_DIR/bulkhead/$component" -type f | while read new_file; do
            relative_path="${new_file#$TEMP_DIR/bulkhead/}"
            current_file="$relative_path"
            backup_file="$BACKUP_PATH/$relative_path"
            
            if [ -f "$current_file" ]; then
                # File exists in both, attempt merge
                mkdir -p "$(dirname "$current_file")"
                if ! merge_file "$backup_file" "$current_file" "$new_file" "$current_file.merged"; then
                    log_warning "Conflict in $relative_path (saved as $relative_path.merged)"
                    CONFLICTS+=("$relative_path")
                    mv "$current_file.merged" "$current_file"
                else
                    mv "$current_file.merged" "$current_file"
                fi
            else
                # New file, just copy
                mkdir -p "$(dirname "$current_file")"
                cp "$new_file" "$current_file"
            fi
        done
        
        log_success "Merged $component"
    else
        # No modifications, safe to overwrite
        rm -rf "$component"
        cp -r "$TEMP_DIR/bulkhead/$component" .
        log_success "Updated $component"
    fi
done

# Update other files
for file in ".pre-commit-config.yaml"; do
    if [ -f "$TEMP_DIR/bulkhead/$file" ]; then
        cp "$TEMP_DIR/bulkhead/$file" .
        log_success "Updated $file"
    fi
done

# Compute new checksums
log_info "Computing new checksums..."
NEW_CHECKSUMS="{"
for component in "${COMPONENTS[@]}"; do
    if [ -d "$component" ]; then
        checksum=$(compute_checksum "$component")
        NEW_CHECKSUMS="$NEW_CHECKSUMS\"$component/\":\"sha256:$checksum\","
    fi
done
NEW_CHECKSUMS="${NEW_CHECKSUMS%,}}"

# Update manifest
log_info "Updating manifest..."
jq --arg version "$LATEST_VERSION" \
   --arg date "$(date -Iseconds)" \
   --argjson checksums "$NEW_CHECKSUMS" \
   '.bulkhead_version = $version | .updated_at = $date | .checksums = $checksums' \
   "$MANIFEST_FILE" > "$MANIFEST_FILE.tmp" && mv "$MANIFEST_FILE.tmp" "$MANIFEST_FILE"

echo ""
log_success "Update complete! $CURRENT_VERSION → $LATEST_VERSION"

if [ ${#CONFLICTS[@]} -gt 0 ]; then
    echo ""
    log_warning "The following files had merge conflicts:"
    for conflict in "${CONFLICTS[@]}"; do
        echo "  - $conflict"
    done
    log_info "Please review these files and resolve any conflict markers."
fi

log_info "Backup saved to: $BACKUP_PATH"
