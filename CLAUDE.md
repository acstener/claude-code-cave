# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cave Timer Architecture

Cave Timer is a productivity tool designed specifically for Claude Code users that helps maintain focus during coding sessions by blocking distracting websites and providing gentle reminders.

### Core Components

- **cave.js** - Main CLI application and timer logic (Node.js)
- **cave-status.sh** - Shell script for Claude Code status bar integration  
- **setup.js** - Post-install script that configures Claude Code integration
- **install.sh/uninstall.sh** - Installation/removal scripts

### Key Design Patterns

**Timer Management**: Uses JSON files in `~/.claude-cave/` for persistence:
- `status.json` - Current session state (active/inactive, start/end times)
- `stats.json` - Historical data (total sessions, streaks, distractions blocked)

**Distraction Monitoring**: Background process uses AppleScript to monitor Chrome/Safari active tabs, checking URLs against hardcoded blocked site list every 3 seconds.

**Native macOS Integration**: Uses `osascript` for system alerts and notification sounds rather than third-party libraries.

**Claude Code Integration**: Status bar shows live countdown via shell script that parses `cave status` output.

### Commands

```bash
# Core commands
npm run start           # Same as: node cave.js
node cave.js start [minutes]   # Start focus session
node cave.js stop       # End current session  
node cave.js status     # Check remaining time
node cave.js stats      # View analytics
node cave.js monitor    # Background monitoring (auto-started)

# Natural language processing
node cave.js "focus for 2 hours"
node cave.js "stop timer"
```

### Installation Flow

1. `npm install -g claude-cave-timer` triggers `postinstall` script (setup.js)
2. setup.js creates `~/.claude/cave-status.sh` and configures settings.json
3. For git installs, `install.sh` creates shell alias and copies status script

### Browser Monitoring Logic

The monitoring system (cave.js:110-151):
1. Spawns detached background process running `monitor` command
2. Polls active browser tab URL every 3 seconds via AppleScript
3. Checks URL against blocked sites array (cave.js:179-184)
4. Triggers macOS system alert + sound if distraction detected
5. Continues "shame mode" with 3-second alerts until user returns to allowed sites

### Status Bar Integration

The `cave-status.sh` script:
- Executes `cave status` and parses output for remaining time
- Returns formatted string "🪨 In the cave: X minutes remaining" 
- Returns empty string when no active session (hides status)
- Handles various installation locations and fallbacks gracefully