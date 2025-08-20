#!/bin/bash

# Claude Code Cave Timer Installation Script
echo "🌄 Installing Claude Code Cave Timer..."

# Detect shell
SHELL_RC=""
if [[ "$SHELL" == *"zsh"* ]]; then
    SHELL_RC="$HOME/.zshrc"
elif [[ "$SHELL" == *"bash"* ]]; then
    SHELL_RC="$HOME/.bashrc"
else
    echo "⚠️  Unsupported shell. Please add 'alias cave=\"node ~/.claude-cave/cave.js\"' to your shell config manually."
    SHELL_RC=""
fi

# Create cave command alias
if [[ -n "$SHELL_RC" ]]; then
    if ! grep -q "alias cave=" "$SHELL_RC"; then
        echo "" >> "$SHELL_RC"
        echo "# Claude Code Cave Timer" >> "$SHELL_RC"
        echo "alias cave=\"node ~/.claude-cave/cave.js\"" >> "$SHELL_RC"
        echo "✅ Added 'cave' command to $SHELL_RC"
    else
        echo "✅ 'cave' command already exists in $SHELL_RC"
    fi
fi

# Make cave.js executable
chmod +x cave.js

# Set up Claude Code status bar integration
CLAUDE_DIR="$HOME/.claude"
CLAUDE_SETTINGS="$CLAUDE_DIR/settings.json"

if [[ -d "$CLAUDE_DIR" ]]; then
    echo "🔍 Found Claude Code directory, setting up status bar integration..."
    
    # Copy status script
    cp cave-status.sh "$CLAUDE_DIR/"
    chmod +x "$CLAUDE_DIR/cave-status.sh"
    echo "✅ Installed status bar script"
    
    # Check if settings.json needs statusLine configuration
    if [[ -f "$CLAUDE_SETTINGS" ]]; then
        if ! grep -q "statusLine" "$CLAUDE_SETTINGS"; then
            echo ""
            echo "📝 To enable status bar integration, add this to your Claude Code settings.json:"
            echo ""
            echo "  \"statusLine\": {"
            echo "    \"type\": \"command\","
            echo "    \"command\": \"~/.claude/cave-status.sh\","
            echo "    \"padding\": 0"
            echo "  }"
            echo ""
        else
            echo "✅ Status bar already configured in Claude Code"
        fi
    fi
else
    echo "ℹ️  Claude Code not found. Status bar integration skipped."
fi

# Create initial CLAUDE.md documentation if in a project directory
if [[ -f "CLAUDE.md" ]] && ! grep -q "Cave Timer" "CLAUDE.md"; then
    echo "" >> CLAUDE.md
    echo "## Cave Timer Commands" >> CLAUDE.md
    echo "Cave Timer is a deep work focus tool installed globally at ~/.claude-cave/" >> CLAUDE.md
    echo "- \`cave start [minutes]\` - Start focus session (default 90 min)" >> CLAUDE.md
    echo "- \`cave stop\` - End current session" >> CLAUDE.md
    echo "- \`cave status\` - Check remaining time" >> CLAUDE.md
    echo "- Natural language: \"I need to focus for 2 hours\", \"stop timer\", etc." >> CLAUDE.md
    echo "✅ Added Cave Timer docs to CLAUDE.md"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "🚀 Quick start:"
echo "   source $SHELL_RC    # Reload shell"
echo "   cave start          # Start 90-minute focus session"
echo "   cave status         # Check timer"
echo "   cave stop           # End session"
echo ""
echo "📖 Full documentation: https://github.com/acstener/claude-code-cave"
echo "🔥 Happy focusing!"