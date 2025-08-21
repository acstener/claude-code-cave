#!/bin/bash

# Cave Timer Status Script for Claude Code Status Line
# This script displays the current cave timer status

# Consume JSON input from stdin (required by Claude Code status line API)
input=$(cat)

# Check if cave command is available
if ! command -v cave >/dev/null 2>&1; then
    # Try common installation locations
    if [ -x "$HOME/.claude-cave/cave" ]; then
        CAVE_CMD="$HOME/.claude-cave/cave"
    elif [ -x "$HOME/.claude-cave/bin/cave" ]; then
        CAVE_CMD="$HOME/.claude-cave/bin/cave"
    else
        echo "Cave Timer not found"
        exit 0
    fi
else
    CAVE_CMD="cave"
fi

# Get cave timer status
status_output=$($CAVE_CMD status 2>/dev/null)
exit_code=$?

# If cave status command failed or no timer running, show nothing
if [ $exit_code -ne 0 ] || [[ "$status_output" == *"No active session"* ]] || [[ "$status_output" == *"not running"* ]]; then
    exit 0
fi

# Extract time remaining and format as cave-themed status
if [[ "$status_output" == *"Time remaining:"* ]]; then
    time_remaining=$(echo "$status_output" | grep -o "Time remaining: [0-9]* minutes" | sed 's/Time remaining: //')
    echo "🪨 In the cave: ${time_remaining} remaining"
fi