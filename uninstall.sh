#!/bin/bash

# Claude Code Cave Timer Uninstallation Script
echo "🗑️  Uninstalling Claude Code Cave Timer..."

# Stop any running cave timer
if command -v cave &> /dev/null; then
    echo "⏹️  Stopping active Cave Timer session..."
    cave stop 2>/dev/null || true
fi

# Remove shell aliases
REMOVED_ALIAS=false

# Check and remove from .zshrc
if [[ -f "$HOME/.zshrc" ]] && grep -q "alias cave=" "$HOME/.zshrc"; then
    echo "🔧 Removing cave alias from .zshrc..."
    sed -i '' '/alias cave=/d' "$HOME/.zshrc"
    sed -i '' '/# Claude Code Cave Timer/d' "$HOME/.zshrc"
    REMOVED_ALIAS=true
fi

# Check and remove from .bashrc
if [[ -f "$HOME/.bashrc" ]] && grep -q "alias cave=" "$HOME/.bashrc"; then
    echo "🔧 Removing cave alias from .bashrc..."
    sed -i '' '/alias cave=/d' "$HOME/.bashrc"
    sed -i '' '/# Claude Code Cave Timer/d' "$HOME/.bashrc"
    REMOVED_ALIAS=true
fi

# Remove Claude Code integration
if [[ -f "$HOME/.claude/cave-status.sh" ]]; then
    echo "🔧 Removing Claude Code status bar integration..."
    rm -f "$HOME/.claude/cave-status.sh"
    echo "⚠️  Note: You may need to manually remove the 'statusLine' section from ~/.claude/settings.json"
fi

# Remove Cave Timer directory
if [[ -d "$HOME/.claude-cave" ]]; then
    echo "🗂️  Removing Cave Timer files..."
    rm -rf "$HOME/.claude-cave"
    echo "✅ Removed ~/.claude-cave directory"
else
    echo "ℹ️  Cave Timer directory not found (already removed?)"
fi

echo ""
if [[ "$REMOVED_ALIAS" == true ]]; then
    echo "🎉 Cave Timer uninstalled successfully!"
    echo ""
    echo "🔄 Please restart your terminal or run:"
    echo "   source ~/.zshrc    # (or ~/.bashrc)"
    echo ""
    echo "📝 Manual cleanup (if needed):"
    echo "   - Remove 'statusLine' section from ~/.claude/settings.json"
    echo "   - Remove Cave Timer sections from project CLAUDE.md files"
else
    echo "🎉 Cave Timer files removed!"
    echo "ℹ️  No shell aliases found to remove"
fi

echo ""
echo "👋 Thanks for using Cave Timer! Focus well!"