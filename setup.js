#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('\n🪨 Setting up Cave Timer integration with Claude Code...\n');

// Paths
const homeDir = os.homedir();
const claudeDir = path.join(homeDir, '.claude');
const statusScriptPath = path.join(claudeDir, 'cave-status.sh');
const settingsPath = path.join(claudeDir, 'settings.json');

// Create .claude directory if it doesn't exist
if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
    console.log('✅ Created ~/.claude directory');
}

// Status script content
const statusScript = `#!/bin/bash

# Cave Timer Status Line Integration
# Shows cave timer status in Claude Code status line

# Get cave timer status
if command -v cave >/dev/null 2>&1; then
    # Use the cave command to get status
    cave_output=$(cave status 2>/dev/null)
    
    if echo "$cave_output" | grep -q "Time remaining:"; then
        # Extract the remaining time
        remaining=$(echo "$cave_output" | grep -o 'Time remaining: [0-9]\\+ minutes' | sed 's/Time remaining: //')
        if [ -n "$remaining" ]; then
            printf "🪨 In the cave: %s remaining" "$remaining"
        fi
    elif echo "$cave_output" | grep -q "No active session"; then
        # Timer is not running, show nothing (empty status)
        printf ""
    else
        # Fallback - show nothing if we can't parse the output
        printf ""
    fi
else
    # Cave command not found, show nothing
    printf ""
fi
`;

// Write status script
fs.writeFileSync(statusScriptPath, statusScript);
fs.chmodSync(statusScriptPath, 0o755); // Make executable
console.log('✅ Created cave status script: ~/.claude/cave-status.sh');

// Handle Claude Code settings.json
let settings = {};
let settingsUpdated = false;

if (fs.existsSync(settingsPath)) {
    try {
        const settingsContent = fs.readFileSync(settingsPath, 'utf8');
        settings = JSON.parse(settingsContent);
        console.log('📖 Found existing Claude Code settings');
    } catch (error) {
        console.log('⚠️  Could not parse existing settings.json, will create new one');
        settings = {};
    }
} else {
    console.log('📝 Creating new Claude Code settings.json');
}

// Add or update status line configuration
if (!settings.statusLine || settings.statusLine.command !== '~/.claude/cave-status.sh') {
    settings.statusLine = {
        type: "command",
        command: "~/.claude/cave-status.sh",
        padding: 0
    };
    settingsUpdated = true;
}

// Write settings if updated
if (settingsUpdated) {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    console.log('✅ Updated Claude Code status line configuration');
} else {
    console.log('✅ Claude Code status line already configured');
}

console.log('\n🎉 Cave Timer setup complete!');
console.log('\nYour Claude Code status bar will now show:');
console.log('🪨 In the cave: X minutes remaining (when timer is active)');
console.log('\nTry it: cave start');
console.log('');