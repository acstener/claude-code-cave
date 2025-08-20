# Cave Timer Troubleshooting Guide

## Package Mismatch Issues

### Problem: Status bar not showing / Notifications not working after `npm install`

**Root Cause**: There are two different packages on npm:
- ❌ `@acstener/cave-timer` (old, broken package with critical bugs)
- ✅ `claude-cave-timer` (current, working package)

### Symptoms:
- Cave timer commands work but no status bar display
- Session completion crashes with "notifier is not defined" 
- Distraction blocking notifications don't appear
- Status script exists but isn't executable

### How to Fix:

1. **Check which package you have installed:**
   ```bash
   npm list -g | grep cave
   ```

2. **If you see `@acstener/cave-timer`, remove it:**
   ```bash
   npm uninstall -g @acstener/cave-timer
   ```

3. **Install the correct package:**
   ```bash
   npm install -g claude-cave-timer
   ```

4. **Fix status script permissions (if needed):**
   ```bash
   chmod +x ~/.claude/cave-status.sh
   ```

5. **Test everything works:**
   ```bash
   cave start 1
   bash ~/.claude/cave-status.sh  # Should show: 🪨 In the cave: 1 minutes remaining
   ```

### Prevention:
Always install using:
```bash
npm install -g claude-cave-timer
```

**NOT** `@acstener/cave-timer` (this is the old broken version).

### Version History:
- `@acstener/cave-timer@1.0.0` - Initial broken release
- `claude-cave-timer@1.0.4+` - Fixed releases with working notifications and status bar

---

## Other Common Issues

### Status Bar Not Showing
1. Check if script is executable: `ls -la ~/.claude/cave-status.sh`
2. If not executable: `chmod +x ~/.claude/cave-status.sh`
3. Test manually: `bash ~/.claude/cave-status.sh`

### Notifications Not Working
- Modern versions use macOS alerts (popup dialogs) instead of notifications
- If alerts don't appear, check System Preferences > Security & Privacy > Privacy > Accessibility

### Monitor Process Not Running
- Check: `ps aux | grep "cave.js monitor"`
- If missing, restart timer: `cave stop && cave start`