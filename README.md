# Claude Code Cave Timer

A deep work focus timer designed specifically for Claude Code users. Cave Timer helps you maintain focus during coding sessions by softly blocking distracting websites and providing gentle reminders to stay on task.

## Features

🎯 **Deep Work Timer** - Customizable focus sessions (default 90 minutes)  
🔒 **Smart Distraction Blocking** - Monitors Chrome/Safari and detects visits to distracting sites  
🔔 **Gentle Shame Mode** - Native macOS popup alerts when you get distracted  
📊 **Session Analytics** - Track your focus sessions, streaks, and blocked distractions  
⏱️ **Claude Code Integration** - Live timer in your status bar showing "🪨 In the cave: X minutes remaining"  
🗣️ **Natural Language** - Commands like "focus for 2 hours" or "stop timer"

## Quick Start

```bash
# Install via npm (easiest!)
npm install -g claude-cave-timer

# Start focusing!
cave start          # 90-minute session
cave start 45       # 45-minute session  
cave status         # Check remaining time
cave stop           # End session
```

## Installation

### NPM Installation (Recommended)
```bash
npm install -g claude-cave-timer
```

### Git Installation
```bash
# Clone and install
git clone https://github.com/acstener/claude-code-cave.git ~/.claude-cave
cd ~/.claude-cave
./install.sh
```

### Automatic Installation
```bash
curl -fsSL https://raw.githubusercontent.com/acstener/claude-code-cave/main/install.sh | bash
```

### Manual Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/acstener/claude-code-cave.git ~/.claude-cave
   cd ~/.claude-cave
   ```

2. **Set up the cave command:**
   ```bash
   echo 'alias cave="node ~/.claude-cave/cave.js"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Configure Claude Code status bar (optional):**
   Add to your Claude Code `settings.json`:
   ```json
   {
     "statusLine": {
       "type": "command",
       "command": "~/.claude/cave-status.sh",
       "padding": 0
     }
   }
   ```
   Then copy the status script:
   ```bash
   cp ~/.claude-cave/cave-status.sh ~/.claude/
   chmod +x ~/.claude/cave-status.sh
   ```

## Usage

### Basic Commands
```bash
cave start           # Start 90-minute focus session
cave start 45        # Start 45-minute session
cave start 2h        # Start 2-hour session
cave status          # Check current session
cave stop            # End session
cave stats           # View your statistics
```

### Natural Language
Cave Timer understands natural language through Claude Code:
- "I need to focus for 2 hours"
- "start a 45 minute timer"
- "stop the timer"
- "how much time is left?"

## Blocked Sites

Cave Timer monitors these distracting sites by default:
- Social Media: Twitter/X, Facebook, Instagram, LinkedIn, TikTok
- Entertainment: YouTube, Netflix, Hulu, Twitch
- Communication: Discord, Slack, Telegram, WhatsApp
- News: Reddit

## How It Works

1. **URL Monitoring** - Uses AppleScript to check active browser tabs in Chrome/Safari
2. **Distraction Detection** - Checks every 3 seconds for blocked sites
3. **Gentle Notifications** - Native macOS notifications with sound alerts
4. **Focus Reinforcement** - Notifications every 3 seconds while on blocked sites
5. **Progress Tracking** - Logs sessions, streaks, and distraction counts

## Privacy & Security

**Cave Timer is completely private and secure:**

🔒 **No Data Collection** - URLs are only checked locally against a hardcoded list of blocked sites  
🏠 **Stays on Your Machine** - No data is ever transmitted to external servers  
📝 **No Logging** - Browser URLs are never stored, logged, or saved anywhere  
🔍 **Read-Only Access** - Only reads current tab URL, cannot modify browser or access history  
⚡ **Minimal Permissions** - Uses standard macOS AppleScript for browser tab access  
🗑️ **Clean Uninstall** - Complete removal leaves no traces on your system  

Your browsing data remains completely private to your machine.

## Requirements

- macOS (uses AppleScript for browser monitoring)
- Node.js 14+ (built-in on most systems)
- Chrome or Safari browser
- Claude Code (for status bar integration)

## Claude Code Integration

Cave Timer integrates seamlessly with Claude Code:

- **Status Bar**: Shows live countdown timer
- **Natural Language**: Control through chat
- **CLAUDE.md Documentation**: Auto-updates project docs

## Statistics

Track your productivity with built-in analytics:
- Total focus time
- Session streaks
- Distractions blocked
- Average session length

## Uninstallation

To completely remove Cave Timer:

### Automatic Uninstall
```bash
# If you still have Cave Timer installed:
~/.claude-cave/uninstall.sh

# Or download and run the uninstall script:
curl -fsSL https://raw.githubusercontent.com/acstener/claude-code-cave/main/uninstall.sh | bash
```

### Manual Uninstall
```bash
# Remove files
rm -rf ~/.claude-cave

# Remove shell alias (choose your shell)
sed -i '' '/alias cave=/d' ~/.zshrc    # For zsh
sed -i '' '/alias cave=/d' ~/.bashrc   # For bash

# Remove Claude Code integration
rm -f ~/.claude/cave-status.sh

# Remove from Claude Code settings.json (manual)
# Delete the "statusLine" section from ~/.claude/settings.json
```

### Manual Cleanup
1. **Remove Cave Timer directory:**
   ```bash
   rm -rf ~/.claude-cave
   ```

2. **Remove shell alias:**
   Edit your shell config (`~/.zshrc` or `~/.bashrc`) and delete:
   ```bash
   alias cave="node ~/.claude-cave/cave.js"
   ```

3. **Remove Claude Code integration:**
   ```bash
   rm -f ~/.claude/cave-status.sh
   ```
   Then remove the `statusLine` section from `~/.claude/settings.json`

4. **Clean up project files (optional):**
   Remove Cave Timer sections from any `CLAUDE.md` files in your projects

## Installation & Troubleshooting

**Quick Install:**
```bash
npm install -g claude-cave-timer
cave start  # Should just work!
```

**Having issues?** 
- 📋 See [INSTALLATION_FAQ.md](INSTALLATION_FAQ.md) for step-by-step help
- 🔧 See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed debugging
- 🤖 **Ask Claude Code directly!** Just say: *"Help me debug Cave Timer installation"*

**Common Issues:**
- Status bar not showing → Check package version and script permissions
- Notifications not working → Ensure System Preferences allows popup notifications  
- Package mismatch → Use `claude-cave-timer` NOT `@acstener/cave-timer`

## Contributing

Cave Timer is open source! Contributions welcome:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

- 🐛 Report bugs: [GitHub Issues](https://github.com/acstener/claude-code-cave/issues)
- 💡 Feature requests: [GitHub Discussions](https://github.com/acstener/claude-code-cave/discussions)
- 📖 Documentation: This README

---

**Focus better. Code better. Ship better.** 🚀