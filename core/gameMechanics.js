// filepath: c:\projects\copilot-agent\scrabble-game\core\gameMechanics.js
/**
 * Core game mechanics for Scrabble Slots
 * Handles spin mechanics, win checking, and related functionality
 */

import { MIN_WIN_LENGTH, PAYOUT_RULES } from '../themes/config.js';

// Core spin logic - handles animation parameters and timing
export function setupReelAnimation(reel, targetPosition, startTime, duration, staggerTime = 0) {
    reel.spinning = true;
    reel.targetPosition = targetPosition;
    reel.startTime = startTime + staggerTime;
    reel.duration = duration + staggerTime;
    reel.startPosition = reel.position;

    // Calculate distance needed to land at target position
    const reelLength = reel.symbols.length;
    const currentPositionMod = reel.startPosition % reelLength;
    let difference = (reel.targetPosition - currentPositionMod + reelLength) % reelLength;

    // Ensure at least one full rotation if not already there
    if (difference < 1 && reel.duration > 0) {
        difference += reelLength;
    }

    // Add rotations for visual effect
    const rotations = 3 + Math.floor(staggerTime / 200); // More rotations for later reels
    reel.distance = (rotations * reelLength) + difference;

    return reel;
}

// Handle reel position updates during animation
export function updateReelPosition(reel, currentTime) {
    const elapsed = currentTime - reel.startTime;

    if (elapsed < 0) return; // Not started yet (due to stagger)

    // Store the previous position before updating
    const lastPosition = reel.position || reel.startPosition;

    if (elapsed >= reel.duration) {
        // --- Animation End ---
        reel.position = reel.targetPosition; // Snap precisely
        reel.spinning = false;
        reel.velocity = 0; // Explicitly set velocity to 0 when stopped
        return;
    }

    // --- Animation In Progress ---
    const progress = elapsed / reel.duration; // Overall progress (0 to 1)
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4); // Easing function
    const easedProgress = easeOutQuart(progress);

    // Calculate the new position
    let newPosition = reel.startPosition + reel.distance * easedProgress;

    // Calculate velocity for visual effects (symbols per second)
    const deltaTime = (currentTime - (reel.lastUpdateTime || reel.startTime)) || 16.67;
    reel.velocity = Math.abs(newPosition - lastPosition) / (deltaTime / 1000);
    reel.lastUpdateTime = currentTime;

    reel.position = newPosition;
}

// Read the visible symbols from the reels after spin
export function readVisibleSymbols(reels, visibleRows) {
    const results = [];

    for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];
        const reelLength = reel.symbols.length;
        const resultColumn = [];

        // Calculate the index of the top visible symbol
        const finalTopIndex = Math.round(reel.targetPosition) % reelLength;

        // Read all visible symbols in this reel
        for (let j = 0; j < visibleRows; j++) {
            const symbolIndex = (finalTopIndex + j) % reelLength;
            const symbolId = reel.symbols[symbolIndex];
            resultColumn.push(symbolId);
        }

        results.push(resultColumn);
    }

    return results;
}

// Check for winning words in the results grid
export function checkWin(reelResults, symbolNumberMultipliers, findWords, wordsToPaylines) {
    if (!reelResults || reelResults.length === 0) {
        return null; // No results to check
    }

    let winningLines = [];
    let totalWinAmount = 0;
    let bestMatchDetails = null;

    try {
        // Find all valid words in the grid
        const foundWords = findWords(reelResults, symbolNumberMultipliers);

        if (foundWords.length === 0) {
            return null; // No valid words found
        }

        // Convert found words to paylines format
        const wordPaylines = wordsToPaylines(foundWords);

        // Process each word payline
        wordPaylines.forEach(wordLine => {
            const wordLength = wordLine.count;
            const baseValue = wordLine.multiplier;

            // Skip words shorter than minimum length
            if (wordLength < MIN_WIN_LENGTH) return;

            // Get the length multiplier from PAYOUT_RULES (or 1 if not found)
            const lengthMultiplier = PAYOUT_RULES[wordLength] || 1;

            // Apply letter-specific multipliers for dl (double letter) and tl (triple letter)
            let adjustedBaseValue = baseValue;
            wordLine.positions.forEach(pos => {
                const symbol = symbolNumberMultipliers[reelResults[pos.reel][pos.row]];
                if (symbol && symbol.type === "dl") {
                    adjustedBaseValue += symbol.value; // Double the letter value
                } else if (symbol && symbol.type === "tl") {
                    adjustedBaseValue += symbol.value * 2; // Triple the letter value
                }
            });

            // Calculate the final win amount (word value × length multiplier × bet)
            let winAmount = adjustedBaseValue * lengthMultiplier * wordLine.betAmount;

            // Apply word-specific multipliers for dw (double word) and tw (triple word)
            wordLine.positions.forEach(pos => {
                const symbol = symbolNumberMultipliers[reelResults[pos.reel][pos.row]];
                if (symbol && symbol.type === "dw") {
                    winAmount *= 2; // Double the word value
                } else if (symbol && symbol.type === "tw") {
                    winAmount *= 3; // Triple the word value
                }
            });

            // Update the win line data
            wordLine.multiplier = adjustedBaseValue * lengthMultiplier; // Store the final multiplier
            wordLine.amount = winAmount; // Store the final win amount

            // Add to total win amount
            totalWinAmount += winAmount;

            // Add to winning lines
            winningLines.push(wordLine);

            // Update best match details if this is the highest win
            if (!bestMatchDetails || winAmount > bestMatchDetails.amount) {
                bestMatchDetails = {
                    paylineId: wordLine.paylineId,
                    symbolName: wordLine.symbolName, // This is the word
                    multiplier: wordLine.multiplier,
                    count: wordLine.count, // This is the word length
                    amount: winAmount
                };
            }
        });

    } catch (error) {
        console.error('Error in finding words:', error);
        return null;
    }

    if (totalWinAmount > 0) {
        return {
            totalAmount: totalWinAmount,
            bestMatch: bestMatchDetails,
            allLines: winningLines
        };
    } else {
        return null; // No valid words found or no win
    }
}

// Get special tiles configuration directly from the reel strips
// No randomness - all special tiles are determined by config.js
export function createSpecialTiles(symbolNumberMultipliers) {
    // Simply return the original multipliers without modification
    // All special tile types are already configured in the symbolNumberMultipliers
    // based on the symbol indices in the reelStrips array
    return symbolNumberMultipliers;
}
