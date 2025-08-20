# Claude Code Cave Timer

A deep work focus timer designed specifically for Claude Code users. Cave Timer helps you maintain focus during coding sessions by softly blocking distracting websites and providing gentle reminders to stay on task.

## Features

🎯 **Deep Work Timer** - Customizable focus sessions (default 90 minutes)  
🔒 **Smart Distraction Blocking** - Monitors Chrome/Safari and detects visits to distracting sites  
🔔 **Gentle Shame Mode** - Native macOS notifications with sound when you get distracted  
📊 **Session Analytics** - Track your focus sessions, streaks, and blocked distractions  
⏱️ **Claude Code Integration** - Live timer in your status bar  
🗣️ **Natural Language** - Commands like "focus for 2 hours" or "stop timer"

## Quick Start

```bash
# Clone and install
git clone https://github.com/acstener/claude-code-cave.git ~/.claude-cave
cd ~/.claude-cave
./install.sh

# Start focusing!
cave start          # 90-minute session
cave start 45       # 45-minute session  
cave status         # Check remaining time
cave stop           # End session
```

## Installation

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

## Troubleshooting

**Notifications not working?**
- Ensure System Preferences > Notifications allows Terminal/Claude Code notifications

**URL detection not working?**
- Grant accessibility permissions to Terminal in System Preferences > Security & Privacy

**Status bar not updating?**
- Check Claude Code settings.json has correct statusLine configuration
- Ensure cave-status.sh is executable: `chmod +x ~/.claude/cave-status.sh`

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