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
                echo "$input | 🔒 CAVE [$MINS:$(printf %02d $SECS)]"
            else
                echo "$input | ✅ CAVE COMPLETE!"
            fi
        else
            echo "$input | 🔒 CAVE MODE ACTIVE"
        fi
    else
        # Show original status when not running
        echo "$input"
    fi
else
    # Show original status when Cave Timer doesn't exist
    echo "$input"
fi
