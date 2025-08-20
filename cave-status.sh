#!/bin/bash
# Shows Cave Timer in Claude Code's status bar

# Read Claude's input (contains model info, etc)
input=$(cat)

# Check if cave timer is active
CAVE_STATUS_FILE="$HOME/.claude-cave/status.json"

if [ -f "$CAVE_STATUS_FILE" ]; then
    # Read the status file
    ACTIVE=$(grep '"active"' "$CAVE_STATUS_FILE" | sed 's/.*: *\([^,}]*\).*/\1/')
    
    if [ "$ACTIVE" = "true" ]; then
        # Extract end_time (handle both numeric and string formats)
        END_TIME=$(grep '"end_time"' "$CAVE_STATUS_FILE" | sed 's/.*: *\([0-9]*\).*/\1/')
        
        if [ -n "$END_TIME" ] && [ "$END_TIME" -gt 0 ]; then
            # Convert from milliseconds to seconds
            END_EPOCH=$((END_TIME / 1000))
            NOW_EPOCH=$(date +%s)
            REMAINING=$((END_EPOCH - NOW_EPOCH))
            
            if [ $REMAINING -gt 0 ]; then
                MINS=$((REMAINING / 60))
                SECS=$((REMAINING % 60))
                echo "🔒 CAVE MODE [$MINS:$(printf %02d $SECS)] | Type 'cave stop' to end"
            else
                echo "✅ CAVE COMPLETE! | Run 'cave stop' to end session"
            fi
        else
            echo "🔒 CAVE MODE ACTIVE | Check timer with 'cave status'"
        fi
    else
        # No output when not running - clean status bar
        echo ""
    fi
else
    # No output when Cave Timer doesn't exist - clean status bar
    echo ""
fi