#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
// Removed node-notifier - using native macOS notifications

const CAVE_DIR = path.join(process.env.HOME, '.claude-cave');
const STATUS_FILE = path.join(CAVE_DIR, 'status.json');
const STATS_FILE = path.join(CAVE_DIR, 'stats.json');

class CaveTimer {
    constructor() {
        this.ensureDir();
        this.loadStats();
    }

    ensureDir() {
        if (!fs.existsSync(CAVE_DIR)) {
            fs.mkdirSync(CAVE_DIR, { recursive: true });
        }
    }

    loadStats() {
        try {
            this.stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
        } catch {
            this.stats = {
                total_sessions: 0,
                total_minutes: 0,
                avg_session_length: 0,
                total_distractions_blocked: 0,
                streak: 0,
                last_session: null
            };
        }
    }

    saveStats() {
        fs.writeFileSync(STATS_FILE, JSON.stringify(this.stats, null, 2));
    }

    getStatus() {
        try {
            return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
        } catch {
            return { active: false };
        }
    }

    saveStatus(status) {
        fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
    }

    parseTime(input) {
        if (!input) return 90; // default 90 minutes
        
        const num = parseInt(input);
        if (!isNaN(num)) return num;
        
        // Parse natural language
        const lower = input.toLowerCase();
        if (lower.includes('hour')) {
            const hours = parseFloat(input.match(/(\d+(?:\.\d+)?)/)?.[1] || '1');
            return Math.round(hours * 60);
        }
        if (lower.includes('min')) {
            return parseInt(input.match(/(\d+)/)?.[1] || '90');
        }
        
        return 90;
    }

    start(minutes = 90) {
        const status = this.getStatus();
        if (status.active) {
            const remaining = Math.max(0, Math.round((status.end_time - Date.now()) / 60000));
            console.log(`⏱️  Session already active: ${remaining} minutes remaining`);
            return;
        }

        const startTime = Date.now();
        const endTime = startTime + (minutes * 60000);
        
        this.saveStatus({
            active: true,
            start_time: startTime,
            end_time: endTime,
            duration: minutes,
            distractions_blocked: 0
        });

        console.log(`🎯 CAVE FOCUS SESSION STARTED`);
        console.log(`⏱️  Duration: ${minutes} minutes`);
        console.log(`🔒 Distraction blocking active`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        // Start background monitor
        this.startMonitor();
    }

    startMonitor() {
        const monitorPath = path.join(__dirname, 'cave.js');
        spawn('node', [monitorPath, 'monitor'], {
            detached: true,
            stdio: 'ignore'
        }).unref();
    }

    async monitor() {
        console.log('🔍 Starting distraction monitoring...');
        
        while (true) {
            const status = this.getStatus();
            if (!status.active) break;

            const now = Date.now();
            const remaining = Math.max(0, Math.round((status.end_time - now) / 60000));

            if (remaining <= 0) {
                this.complete();
                break;
            }

            try {
                // Check current browser URL
                const url = await this.getActiveUrl();
                const blockedSite = this.isBlockedSite(url);
                
                if (blockedSite) {
                    status.distractions_blocked++;
                    this.saveStatus(status);
                    
                    // System alert using native macOS (more reliable than notifications)
                    exec(`osascript -e 'display alert "🪨 You left the cave" message "${blockedSite} is not good for the vibes. Get back to it" buttons {"Back to the cave"} default button "Back to the cave" giving up after 5'`);
                    
                    // Play notification sound
                    exec(`osascript -e 'beep 2'`);
                    
                    // Wait 3 seconds before next check (shame mode)
                    await new Promise(resolve => setTimeout(resolve, 3000));
                } else {
                    // Check every 3 seconds when focused
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            } catch (error) {
                // Fallback if URL detection fails
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }

    async getActiveUrl() {
        return new Promise((resolve) => {
            // Try to get Chrome URL first
            exec(`osascript -e 'tell application "Google Chrome" to return URL of active tab of front window'`, (error, stdout) => {
                if (!error && stdout.trim()) {
                    resolve(stdout.trim());
                    return;
                }
                
                // Try Safari if Chrome fails
                exec(`osascript -e 'tell application "Safari" to return URL of current tab of front window'`, (error, stdout) => {
                    if (!error && stdout.trim()) {
                        resolve(stdout.trim());
                        return;
                    }
                    
                    // Return empty if both fail
                    resolve('');
                });
            });
        });
    }

    isBlockedSite(url) {
        if (!url) return null;
        
        const blockedSites = [
            'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 
            'reddit.com', 'youtube.com', 'tiktok.com', 'linkedin.com',
            'netflix.com', 'hulu.com', 'twitch.tv', 'discord.com',
            'slack.com', 'telegram.org', 'whatsapp.com'
        ];
        
        const lowerUrl = url.toLowerCase();
        for (const site of blockedSites) {
            if (lowerUrl.includes(site)) {
                return site;
            }
        }
        
        return null;
    }

    stop() {
        const status = this.getStatus();
        if (!status.active) {
            console.log('❌ No active session to stop');
            return;
        }

        const elapsed = Math.round((Date.now() - status.start_time) / 60000);
        this.saveStatus({ active: false });

        console.log(`🎉 CAVE SESSION COMPLETE`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`⏱️  Duration: ${elapsed} minutes`);
        console.log(`🚫 Distractions blocked: ${status.distractions_blocked || 0}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        // Update stats
        this.updateStats(elapsed, status.distractions_blocked || 0);
    }

    complete() {
        const status = this.getStatus();
        const elapsed = status.duration;
        
        this.saveStatus({ active: false });

        // System alert for session completion (more reliable than notifications)
        exec(`osascript -e 'display alert "🎉 CAVE SESSION COMPLETE!" message "Focused for ${elapsed} minutes. Great work!" buttons {"Awesome!"} default button "Awesome!" giving up after 10'`);
        
        // Play completion sound
        exec(`osascript -e 'beep 3'`);

        console.log(`🎉 CAVE SESSION COMPLETE`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`⏱️  Duration: ${elapsed} minutes`);
        console.log(`🚫 Distractions blocked: ${status.distractions_blocked || 0}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        this.updateStats(elapsed, status.distractions_blocked || 0);
    }

    status() {
        const status = this.getStatus();
        if (!status.active) {
            console.log('💤 No active session');
            console.log(`💡 Start focusing: cave start`);
            return;
        }

        const remaining = Math.max(0, Math.round((status.end_time - Date.now()) / 60000));
        const elapsed = Math.round((Date.now() - status.start_time) / 60000);
        
        console.log(`🔥 ACTIVE FOCUS SESSION`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`⏱️  Time remaining: ${remaining} minutes`);
        console.log(`⌛ Elapsed: ${elapsed} minutes`);
        console.log(`🚫 Distractions blocked: ${status.distractions_blocked || 0}`);
    }

    updateStats(minutes, distractions) {
        this.stats.total_sessions++;
        this.stats.total_minutes += minutes;
        this.stats.total_distractions_blocked += distractions;
        this.stats.avg_session_length = Math.round(this.stats.total_minutes / this.stats.total_sessions);
        this.stats.last_session = new Date().toISOString();
        
        // Update streak
        const now = new Date();
        const lastSession = this.stats.last_session ? new Date(this.stats.last_session) : null;
        if (lastSession && (now - lastSession) < 24 * 60 * 60 * 1000) {
            this.stats.streak++;
        } else {
            this.stats.streak = 1;
        }
        
        this.saveStats();
    }

    showStats() {
        console.log(`📊 CAVE TIMER STATS`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`🎯 Total sessions: ${this.stats.total_sessions}`);
        console.log(`⏱️  Total focus time: ${this.stats.total_minutes} minutes`);
        console.log(`📈 Average session: ${this.stats.avg_session_length} minutes`);
        console.log(`🚫 Distractions blocked: ${this.stats.total_distractions_blocked}`);
        console.log(`🔥 Current streak: ${this.stats.streak} days`);
    }

    processNaturalLanguage(input) {
        const lower = input.toLowerCase();
        
        if (lower.includes('focus') || lower.includes('start')) {
            const minutes = this.parseTime(input);
            this.start(minutes);
        } else if (lower.includes('stop') || lower.includes('end')) {
            this.stop();
        } else if (lower.includes('status') || lower.includes('time')) {
            this.status();
        } else {
            console.log(`❓ I didn't understand: "${input}"`);
            console.log(`Try: "focus for 2 hours", "stop timer", or "check status"`);
        }
    }
}

// Main CLI logic
function main() {
    const cave = new CaveTimer();
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command) {
        cave.status();
        return;
    }

    switch (command) {
        case 'start':
            const minutes = cave.parseTime(args[1]);
            cave.start(minutes);
            break;
        case 'stop':
            cave.stop();
            break;
        case 'status':
            cave.status();
            break;
        case 'stats':
            cave.showStats();
            break;
        case 'monitor':
            cave.monitor();
            break;
        default:
            // Try natural language processing
            cave.processNaturalLanguage(args.join(' '));
    }
}

if (require.main === module) {
    main();
}

module.exports = CaveTimer;