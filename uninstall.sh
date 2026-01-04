#!/bin/bash
# Bulkhead Governance Framework - Uninstall Script
# Usage: .bulkhead/uninstall.sh [--force] [--keep-architecture]
#
# Options:
#   --force             Skip confirmation prompts
#   --keep-architecture Preserve .bulkhead/architecture/ (user artifacts)

set -e

# Determine project root (script is in .bulkhead/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ "$(basename "$SCRIPT_DIR")" == ".bulkhead" ]]; then
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
else
    PROJECT_ROOT="$SCRIPT_DIR"
fi
cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

# Parse arguments
FORCE=false
KEEP_ARCHITECTURE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --force) FORCE=true; shift ;;
        --keep-architecture) KEEP_ARCHITECTURE=true; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# Check if Bulkhead is installed
if [ ! -d ".bulkhead" ]; then
    log_error "Bulkhead is not installed in this project."
    exit 1
fi

echo ""
log_warning "This will remove Bulkhead from your project."
echo ""
echo "The following will be DELETED:"
echo "  📁 .agent/                 (workflows & rules)"
echo "  📁 .bulkhead/schemas/"
echo "  📁 .bulkhead/templates/"
echo "  📁 .bulkhead/governance/"
echo "  📁 .bulkhead/backup/"
echo "  📁 .bulkhead/migrations/"
echo "  📄 .bulkhead/manifest.json"
echo "  📄 .bulkhead/config.yaml"
echo "  📄 .bulkhead/update.sh"
echo "  📄 .bulkhead/uninstall.sh"
echo "  📄 .github/workflows/validate-schemas.yml"
echo ""

if [ "$KEEP_ARCHITECTURE" = true ]; then
    log_info "Keeping .bulkhead/architecture/ (--keep-architecture)"
else
    echo "  📁 .bulkhead/architecture/  ⚠️  (YOUR GOVERNANCE ARTIFACTS)"
fi
echo ""

# Confirm uninstall
if [ "$FORCE" != true ]; then
    read -p "Are you sure you want to uninstall Bulkhead? [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Uninstall cancelled."
        exit 0
    fi
    echo ""
fi

# Remove .agent directory
if [ -d ".agent" ]; then
    rm -rf ".agent"
    log_success "Removed .agent/"
fi

# Remove .bulkhead components
BULKHEAD_COMPONENTS=("schemas" "templates" "governance" "backup" "migrations")
for component in "${BULKHEAD_COMPONENTS[@]}"; do
    if [ -d ".bulkhead/$component" ]; then
        rm -rf ".bulkhead/$component"
        log_success "Removed .bulkhead/$component/"
    fi
done

# Remove .bulkhead files (except uninstall.sh - delete at end)
BULKHEAD_FILES=("manifest.json" "config.yaml" "update.sh" "audit.log" "current_phase")
for file in "${BULKHEAD_FILES[@]}"; do
    if [ -f ".bulkhead/$file" ]; then
        rm -f ".bulkhead/$file"
        log_success "Removed .bulkhead/$file"
    fi
done

# Handle architecture directory
if [ "$KEEP_ARCHITECTURE" = true ]; then
    log_info "Preserved .bulkhead/architecture/"
else
    if [ -d ".bulkhead/architecture" ]; then
        rm -rf ".bulkhead/architecture"
        log_success "Removed .bulkhead/architecture/"
    fi
fi

# Delete this script (uninstall.sh) - must be last file deletion
SELF_PATH=".bulkhead/uninstall.sh"
if [ -f "$SELF_PATH" ]; then
    rm -f "$SELF_PATH"
    log_success "Removed .bulkhead/uninstall.sh"
fi

# Remove .bulkhead directory if empty
if [ -d ".bulkhead" ]; then
    remaining=$(ls -A ".bulkhead" 2>/dev/null)
    if [ -z "$remaining" ]; then
        rmdir ".bulkhead"
        log_success "Removed empty .bulkhead/"
    else
        log_info ".bulkhead/ not empty, keeping directory"
        log_info "Remaining contents:"
        ls -la ".bulkhead/"
    fi
fi

# Remove GitHub workflow
if [ -f ".github/workflows/validate-schemas.yml" ]; then
    rm -f ".github/workflows/validate-schemas.yml"
    log_success "Removed .github/workflows/validate-schemas.yml"
    
    # Remove workflows directory if empty
    if [ -d ".github/workflows" ] && [ -z "$(ls -A .github/workflows)" ]; then
        rmdir ".github/workflows"
    fi
    # Remove .github if empty
    if [ -d ".github" ] && [ -z "$(ls -A .github)" ]; then
        rmdir ".github"
    fi
fi

echo ""
log_success "Bulkhead has been uninstalled."
echo ""
log_info "To reinstall, run the onboard.sh script from the Bulkhead repository."
