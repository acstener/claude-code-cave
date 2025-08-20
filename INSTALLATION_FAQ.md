# Cave Timer Installation FAQ

## Quick Install

```bash
npm install -g claude-cave-timer
cave start
```

**That's it!** Everything should work automatically. If not, see troubleshooting below.

---

## ❓ Common Issues & Solutions

### 🚫 "cave not found" after install

**Problem**: The `cave` command isn't available after npm install.

**Solutions**:
```bash
# Try refreshing your shell
source ~/.zshrc  # or ~/.bashrc

# Check if it was installed
npm list -g claude-cave-timer

# If missing, reinstall
npm install -g claude-cave-timer
```

### 📱 Status bar not showing timer

**Problem**: Claude Code status bar doesn't show cave timer.

**Solutions**:
1. **Check if script exists and is executable**:
   ```bash
   ls -la ~/.claude/cave-status.sh
   # Should show: -rwxr-xr-x (executable permissions)
   ```

2. **If missing permissions**:
   ```bash
   chmod +x ~/.claude/cave-status.sh
   ```

3. **If script is missing entirely**:
   ```bash
   # Reinstall to trigger setup
   npm uninstall -g claude-cave-timer
   npm install -g claude-cave-timer
   ```

4. **Test status script manually**:
   ```bash
   cave start 1
   bash ~/.claude/cave-status.sh
   # Should show: 🪨 In the cave: 1 minutes remaining
   ```

### 🚨 No distraction alerts showing

**Problem**: Not seeing popup alerts when visiting blocked sites.

**Solutions**:
1. **Check if monitor is running**:
   ```bash
   ps aux | grep "cave.js monitor"
   # Should show a running node process
   ```

2. **Test alerts manually**:
   ```bash
   osascript -e 'display alert "🪨 Test Alert" message "Can you see this?" buttons {"Yes"} default button "Yes"'
   # Should show a popup dialog
   ```

3. **Restart timer to spawn fresh monitor**:
   ```bash
   cave stop
   cave start 1
   # Try visiting twitter.com or youtube.com
   ```

4. **Browser compatibility**:
   - ✅ **Supported**: Chrome, Safari
   - ❌ **Not supported**: Firefox, Edge, Arc
   - Switch to Chrome or Safari for distraction blocking

### 🔧 Wrong package installed

**Problem**: You have the old broken version.

**Check your version**:
```bash
npm list -g | grep cave
```

**If you see `@acstener/cave-timer`**:
```bash
# Remove old broken package
npm uninstall -g @acstener/cave-timer

# Install correct package
npm install -g claude-cave-timer
```

**Latest version should be `claude-cave-timer@1.1.4+`**

### 🍎 macOS Permissions

**Problem**: Alerts not working due to macOS security.

**Solutions**:
1. **Grant Terminal accessibility permissions**:
   - System Preferences > Security & Privacy > Accessibility
   - Add Terminal (or your terminal app) to the list

2. **Allow notifications/alerts**:
   - System Preferences > Notifications & Focus
   - Ensure Terminal can display alerts

---

## 🤖 Get Help from Claude Code

**If you're still having issues, ask Claude Code directly!**

Just chat with Claude Code and say:

> "I'm having trouble with Cave Timer installation. The status bar isn't showing / alerts aren't working / [describe your issue]. Can you help debug this?"

Claude Code can:
- ✅ Check your installation
- ✅ Test your setup
- ✅ Fix permissions issues
- ✅ Restart processes
- ✅ Update to latest version
- ✅ Debug specific problems

**Example conversation**:
```
You: "cave timer status bar not working"

Claude: Let me check your installation...
[Claude runs diagnostic commands and fixes the issue]
```

---

## 🔬 Advanced Debugging

### Full diagnostic check:
```bash
# Check version
npm list -g claude-cave-timer

# Check cave command
which cave

# Check status script
ls -la ~/.claude/cave-status.sh

# Test status script
cave start 1 && bash ~/.claude/cave-status.sh

# Check monitor process
ps aux | grep "cave.js monitor"

# Test manual alert
osascript -e 'display alert "Test" message "Working?" buttons {"Yes"}'

# Check settings
cat ~/.claude/settings.json | grep statusLine
```

### Reset everything:
```bash
# Complete reset
npm uninstall -g claude-cave-timer
rm ~/.claude/cave-status.sh
rm -rf ~/.claude-cave

# Fresh install
npm install -g claude-cave-timer

# Test
cave start 1
```

---

## 📋 System Requirements

- ✅ **macOS** (uses AppleScript for browser monitoring)
- ✅ **Node.js 14+** (usually pre-installed)
- ✅ **Chrome or Safari** (for distraction blocking)
- ✅ **Claude Code** (for status bar integration)

---

## 📞 Still Need Help?

1. **Ask Claude Code directly** (recommended!)
2. **Check**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. **Report bugs**: [GitHub Issues](https://github.com/acstener/claude-code-cave/issues)

---

**Cave Timer should "just work" after npm install. If it doesn't, Claude Code can help fix it! 🪨**