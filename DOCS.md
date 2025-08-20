# Cave Timer Documentation

## Overview

Cave Timer is a deep work focus tool designed specifically for Claude Code users. It helps maintain focus during coding sessions by monitoring browser activity and providing gentle reminders when you visit distracting websites.

## Architecture

### Core Components

1. **Timer Engine** (`cave.js`) - Main application logic
2. **Monitor Process** - Background browser URL monitoring  
3. **Status Integration** (`cave-status.sh`) - Claude Code status bar integration
4. **Storage** - JSON files in `~/.claude-cave/`

### Data Flow

```
User Command → Timer Engine → Background Monitor → Browser Detection → Alert System
                           → Status Files → Status Bar Display
```

## Installation Methods

### NPM (Recommended)
```bash
npm install -g claude-cave-timer
```
- ✅ Automatic global binary installation
- ✅ Easy updates with `npm update -g claude-cave-timer`
- ✅ Clean uninstall with `npm uninstall -g claude-cave-timer`

### Manual Git Installation
```bash
git clone https://github.com/acstener/claude-code-cave.git ~/.claude-cave
cd ~/.claude-cave
./install.sh
```
- ✅ Latest development features
- ✅ Easy to modify and contribute
- ❌ Manual update process

## Status Bar Integration

### Setup
Claude Code settings.json:
```json
{
  "statusLine": {
    "type": "command", 
    "command": "~/.claude/cave-status.sh",
    "padding": 0
  }
}
```

### Status Script Behavior
- Shows `🪨 In the cave: X minutes remaining` when timer is active
- Shows nothing when timer is inactive (clean status bar)
- Updates every few seconds automatically
- Handles multiple timer installations gracefully

### Common Issues
- **Script not executable**: Run `chmod +x ~/.claude/cave-status.sh`
- **Wrong package installed**: Use `claude-cave-timer` not `@acstener/cave-timer`
- **Script missing**: Install creates it automatically, manual setup requires copying

## Distraction Blocking

### Detection Method
- Uses AppleScript to query active browser tab URLs
- Supports Chrome and Safari browsers
- Checks every 3 seconds during active sessions
- Falls back gracefully if browser access fails

### Blocked Sites List
```javascript
const blockedSites = [
  'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 
  'reddit.com', 'youtube.com', 'tiktok.com', 'linkedin.com',
  'netflix.com', 'hulu.com', 'twitch.tv', 'discord.com',
  'slack.com', 'telegram.org', 'whatsapp.com'
];
```

### Alert System
- **Current**: macOS popup alerts (`osascript -e 'display alert ...'`)
- **Previous**: Broken notification system (fixed in v1.0.4+)
- **Auto-dismiss**: Alerts auto-close after 3-10 seconds
- **Shame mode**: Continues alerting every 3 seconds while on blocked sites

## Data Storage

### Location
All data stored in `~/.claude-cave/`:
- `status.json` - Current session state
- `stats.json` - Historical statistics

### Status File Format
```json
{
  "active": true,
  "start_time": 1692564000000,
  "end_time": 1692569400000, 
  "duration": 90,
  "distractions_blocked": 5
}
```

### Stats File Format
```json
{
  "total_sessions": 42,
  "total_minutes": 3780,
  "avg_session_length": 90,
  "total_distractions_blocked": 127,
  "streak": 7,
  "last_session": "2023-08-20T19:00:00.000Z"
}
```

## Process Management

### Background Monitor
- Spawned automatically when session starts
- Runs detached process: `node cave.js monitor`
- Self-terminates when session ends
- Multiple monitors can run safely (handles session end gracefully)

### Process Lifecycle
1. `cave start` → Spawns background monitor
2. Monitor checks browser URLs every 3 seconds
3. When timer expires → Monitor calls `complete()` and exits
4. Manual `cave stop` → Sets `active: false`, monitor exits next check

## Natural Language Processing

### Supported Patterns
- "focus for X hours/minutes" → `start` command
- "stop timer/session" → `stop` command  
- "check status/time" → `status` command

### Implementation
```javascript
processNaturalLanguage(input) {
  const lower = input.toLowerCase();
  if (lower.includes('focus') || lower.includes('start')) {
    const minutes = this.parseTime(input);
    this.start(minutes);
  }
  // ... other patterns
}
```

## Claude Code Integration

### CLAUDE.md Integration
Project files can include Cave Timer documentation:
```markdown
## Cave Timer Commands
Cave Timer is a deep work focus tool installed globally at ~/.claude-cave/
- `cave start [minutes]` - Start focus session (default 90 min)
- `cave stop` - End current session  
- `cave status` - Check remaining time
- Natural language: "I need to focus for 2 hours", "stop timer", etc.
```

### Status Line Display
- Real-time timer updates
- Cave-themed emoji (🪨)
- Compact format for terminal display
- Automatic hide/show based on session state

## Version History & Package Issues

### Package Confusion
- ❌ `@acstener/cave-timer@1.0.0` - Initial broken release
- ✅ `claude-cave-timer@1.0.4+` - Fixed releases

### Critical Bug Fixes (v1.0.4)
1. **Undefined notifier**: Fixed `notifier.notify()` crash in session completion
2. **Alert system**: Replaced broken notifications with reliable macOS alerts  
3. **Status bar**: Fixed status script format and permissions
4. **Package naming**: Moved to proper package name

### Migration Path
```bash
# Remove old broken package
npm uninstall -g @acstener/cave-timer

# Install working package
npm install -g claude-cave-timer

# Fix permissions if needed
chmod +x ~/.claude/cave-status.sh
```

## Development

### Local Development
```bash
git clone https://github.com/acstener/claude-code-cave.git
cd claude-code-cave
node cave.js start 1  # Test locally
```

### Testing
```bash
# Test status script
bash cave-status.sh

# Test alerts
osascript -e 'display alert "Test" message "Testing alerts"'

# Monitor processes
ps aux | grep "cave.js monitor"
```

### Release Process
1. Update version in `package.json`
2. Test changes locally
3. Commit and push to GitHub
4. Publish to npm: `npm publish`

## Security Considerations

### Browser Access
- Uses AppleScript for read-only browser URL access
- Requires macOS accessibility permissions for some browsers
- No data is transmitted or stored externally
- URLs are only checked against local blocked sites list

### File Permissions
- Status scripts must be executable (`chmod +x`)
- Data files stored in user home directory
- No system-wide modifications required

## Performance

### Resource Usage
- Minimal CPU usage (checks every 3 seconds when active)
- ~1MB memory footprint for monitor process
- No network requests during operation
- Background monitor automatically cleans up

### Scalability
- Single user per machine
- Handles multiple simultaneous sessions gracefully
- Status file is atomic (safe for concurrent access)
- Monitor processes don't conflict

## Future Enhancements

### Planned Features
- [ ] Firefox browser support
- [ ] Custom blocked sites configuration
- [ ] Focus session templates
- [ ] Slack/Discord integration
- [ ] Team focus sessions

### API Considerations
- All functionality currently CLI-based
- Status available via JSON files
- Extension points for custom integrations
- Natural language processing expandable