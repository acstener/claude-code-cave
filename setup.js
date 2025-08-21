#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('\n🪨 Setting up Cave Timer integration with Claude Code...\n');

// Paths
const homeDir = os.homedir();
const claudeDir = path.join(homeDir, '.claude');
const statusScriptPath = path.join(claudeDir, 'cave-status.sh');
const globalSettingsPath = path.join(claudeDir, 'settings.json');
const localClaudeDir = path.join(process.cwd(), '.claude');
const localSettingsPath = path.join(localClaudeDir, 'settings.json');

// Create .claude directory if it doesn't exist
if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
    console.log('✅ Created ~/.claude directory');
}

// Status script content
const statusScript = `#!/bin/bash

# Cave Timer Status Line Integration
# Shows cave timer status in Claude Code status line

# Consume JSON input from stdin (required by Claude Code status line API)
input=$(cat)

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

// Function to update settings file
function updateSettingsFile(settingsPath, description) {
    let settings = {};
    let settingsUpdated = false;

    if (fs.existsSync(settingsPath)) {
        try {
            const settingsContent = fs.readFileSync(settingsPath, 'utf8');
            settings = JSON.parse(settingsContent);
            console.log(`📖 Found existing ${description}`);
        } catch (error) {
            console.log(`⚠️  Could not parse ${description}, will create new one`);
            settings = {};
        }
    } else {
        console.log(`📝 Creating new ${description}`);
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
        console.log(`✅ Updated ${description}`);
        return true;
    } else {
        console.log(`✅ ${description} already configured`);
        return false;
    }
}

// Update global settings
updateSettingsFile(globalSettingsPath, 'global Claude Code settings');

// Update local project settings if they exist
if (fs.existsSync(localClaudeDir)) {
    updateSettingsFile(localSettingsPath, 'local project Claude Code settings');
}

console.log('\n🎉 Cave Timer setup complete!');
console.log('\nYour Claude Code status bar will now show:');
console.log('🪨 In the cave: X minutes remaining (when timer is active)');
console.log('\nTry it: cave start');
console.log('');