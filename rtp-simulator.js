/**
 * RTP Simulator for Scrabble Slots Game
 * 
 * This tool simulates a large number of spins to calculate the average Return to Player (RTP)
 * percentage for the Scrabble Slots game. It helps with balancing the game's payout rate.
 */

// Import necessary game configuration
import { reelStrips, symbolNumberMultipliers, PAYOUT_RULES, PAYLINES, MIN_WIN_LENGTH } from './themes/config.js';
import { isValidWord, symbolNumberToLetter, findWords as gameFinderWords, loadValidWords } from './wordFinder.js';

// Configuration for simulation
const DEFAULT_SIMULATION_SETTINGS = {
    spins: 100000,        // Number of spins to simulate
    betAmount: 10,        // Bet amount per spin
    logFrequency: 10000,  // How often to log progress
    detailedResults: true // Whether to show detailed breakdown
};

// Main simulation function
async function simulateRTP(settings = {}) {
    // Merge default settings with provided settings
    const config = { ...DEFAULT_SIMULATION_SETTINGS, ...settings };

    console.log(`Loading valid words dictionary...`);
    await loadValidWords();
    console.log(`Dictionary loaded, starting RTP simulation with ${config.spins.toLocaleString()} spins...`);
    console.time('Simulation completed in');// Variables to track results
    let totalBet = 0;
    let totalWin = 0;
    let spinResults = [];
    let symbolWinCounts = {};
    let wordLengthStats = {}; // Track wins by word length instead of symbol
    let winDistribution = {
        '0x': 0,        // No win
        '0-1x': 0,      // 0-1x bet
        '1-2x': 0,      // 1-2x bet
        '2-5x': 0,      // 2-5x bet
        '5-10x': 0,     // 5-10x bet
        '10-20x': 0,    // 10-20x bet
        '20-50x': 0,    // 20-50x bet
        '50-100x': 0,   // 50-100x bet
        '100x+': 0      // Over 100x bet
    };    // Initialize symbol win tracking (for regular letters A-Z and their special versions)
    for (let i = 0; i < 26; i++) {
        // Regular letters (0-25)
        symbolWinCounts[i] = {
            name: `${String.fromCharCode(65 + i)}`,  // A-Z
            count: 0,
            totalWin: 0
        };

        // DL - Double Letter (26-51)
        symbolWinCounts[i + 26] = {
            name: `${String.fromCharCode(65 + i)}(DL)`,  // A(DL), B(DL), etc.
            count: 0,
            totalWin: 0
        };

        // TL - Triple Letter (52-77)
        symbolWinCounts[i + 52] = {
            name: `${String.fromCharCode(65 + i)}(TL)`,  // A(TL), B(TL), etc.
            count: 0,
            totalWin: 0
        };

        // DW - Double Word (78-103)
        symbolWinCounts[i + 78] = {
            name: `${String.fromCharCode(65 + i)}(DW)`,  // A(DW), B(DW), etc.
            count: 0,
            totalWin: 0
        };

        // TW - Triple Word (104-129)
        symbolWinCounts[i + 104] = {
            name: `${String.fromCharCode(65 + i)}(TW)`,  // A(TW), B(TW), etc.
            count: 0,
            totalWin: 0
        };
    }

    // Initialize word length tracking (for words of length 3-10)
    for (let i = 3; i <= 10; i++) {
        wordLengthStats[i] = {
            count: 0,
            totalWin: 0
        };
    }    // Initialize word tracking (we'll track found words instead of paylines)
    let wordWinCounts = {};

    // Run the simulation
    for (let spin = 1; spin <= config.spins; spin++) {
        // Track bet amount
        totalBet += config.betAmount;

        // Generate random reel positions
        const reelPositions = [];
        for (let reel = 0; reel < reelStrips.length; reel++) {
            reelPositions.push(Math.floor(Math.random() * reelStrips[reel].length));
        }

        // Get visible symbols grid (3x5)
        const visibleSymbols = [];
        for (let reel = 0; reel < reelStrips.length; reel++) {
            const reelSymbols = [];
            const strip = reelStrips[reel];

            for (let row = 0; row < 3; row++) {
                const position = (reelPositions[reel] + row) % strip.length;
                reelSymbols.push(strip[position]);
            }

            visibleSymbols.push(reelSymbols);
        }

        // Calculate wins
        const spinWins = calculateWins(visibleSymbols, config.betAmount);
        const totalSpinWin = spinWins.totalWin;

        // Update stats
        totalWin += totalSpinWin;        // Track individual spin results if detailed tracking is enabled
        if (config.detailedResults) {
            // Find best word in this spin
            let bestWord = "";
            let bestWordWin = 0;

            spinWins.winningLines.forEach(line => {
                if (line.win > bestWordWin) {
                    bestWordWin = line.win;
                    bestWord = line.word || "";
                }
            });

            spinResults.push({
                spin,
                win: totalSpinWin,
                multiplier: totalSpinWin / config.betAmount,
                bestWord: bestWord,
                bestWordWin: bestWordWin
            });

            // Update win distribution
            const winMultiplier = totalSpinWin / config.betAmount;
            if (winMultiplier === 0) winDistribution['0x']++;
            else if (winMultiplier <= 1) winDistribution['0-1x']++;
            else if (winMultiplier <= 2) winDistribution['1-2x']++;
            else if (winMultiplier <= 5) winDistribution['2-5x']++;
            else if (winMultiplier <= 10) winDistribution['5-10x']++;
            else if (winMultiplier <= 20) winDistribution['10-20x']++;
            else if (winMultiplier <= 50) winDistribution['20-50x']++;
            else if (winMultiplier <= 100) winDistribution['50-100x']++;
            else winDistribution['100x+']++;            // Update word stats
            spinWins.winningLines.forEach(line => {
                // Track word occurrences
                const word = line.word || "unknown";
                if (!wordWinCounts[word]) {
                    wordWinCounts[word] = {
                        count: 0,
                        totalWin: 0
                    };
                }
                wordWinCounts[word].count++;
                wordWinCounts[word].totalWin += line.win;

                // Track by word length
                const wordLength = line.count || 0;
                if (wordLengthStats[wordLength]) {
                    wordLengthStats[wordLength].count++;
                    wordLengthStats[wordLength].totalWin += line.win;
                }

                // Track letter contributions (distribute win among all letters in the word)
                if (line.positions && line.positions.length > 0) {
                    const winPerLetter = line.win / line.positions.length;
                    line.positions.forEach(pos => {
                        if (pos.reel !== undefined && pos.row !== undefined) {
                            const symbolNumber = visibleSymbols[pos.reel][pos.row];
                            if (symbolWinCounts[symbolNumber]) {
                                symbolWinCounts[symbolNumber].count++;
                                symbolWinCounts[symbolNumber].totalWin += winPerLetter;
                            }
                        }
                    });
                }
            });
        }

        // Log progress
        if (spin % config.logFrequency === 0 || spin === config.spins) {
            const currentRTP = (totalWin / totalBet) * 100;
            console.log(`Processed ${spin.toLocaleString()}/${config.spins.toLocaleString()} spins (${(spin / config.spins * 100).toFixed(1)}%), Current RTP: ${currentRTP.toFixed(2)}%`);
        }
    }

    // Calculate final RTP
    const finalRTP = (totalWin / totalBet) * 100;

    // Display results
    console.log('\n=== RTP SIMULATION RESULTS ===');
    console.log(`Total Spins: ${config.spins.toLocaleString()}`);
    console.log(`Total Bet: ${totalBet.toLocaleString()}`);
    console.log(`Total Win: ${totalWin.toLocaleString()}`);
    console.log(`Final RTP: ${finalRTP.toFixed(2)}%`);

    // Show detailed results if enabled
    if (config.detailedResults) {
        console.log('\n=== WIN DISTRIBUTION ===');
        for (const [range, count] of Object.entries(winDistribution)) {
            const percentage = (count / config.spins) * 100;
            console.log(`${range}: ${count.toLocaleString()} spins (${percentage.toFixed(2)}%)`);
        } console.log('\n=== LETTER VALUE STATS ===');
        for (const [symbolNumber, stats] of Object.entries(symbolWinCounts)) {
            if (stats.count > 0) {
                const symbolRTP = (stats.totalWin / totalBet) * 100;
                console.log(`Letter ${stats.name}: ${stats.count.toLocaleString()} occurrences, Total Win: ${stats.totalWin.toLocaleString()}, Letter RTP: ${symbolRTP.toFixed(2)}%`);
            }
        }

        console.log('\n=== WORD LENGTH STATS ===');
        for (const [length, stats] of Object.entries(wordLengthStats)) {
            if (stats.count > 0) {
                const lengthRTP = (stats.totalWin / totalBet) * 100;
                console.log(`${length}-letter words: ${stats.count.toLocaleString()} occurrences, Total Win: ${stats.totalWin.toLocaleString()}, RTP: ${lengthRTP.toFixed(2)}%`);
            }
        }

        console.log('\n=== TOP WINNING WORDS ===');
        // Sort words by total win amount
        const sortedWords = Object.entries(wordWinCounts)
            .sort((a, b) => b[1].totalWin - a[1].totalWin)
            .slice(0, 10); // Show top 10 words

        for (const [word, stats] of sortedWords) {
            if (stats.count > 0) {
                const wordRTP = (stats.totalWin / totalBet) * 100;
                console.log(`"${word}": ${stats.count.toLocaleString()} occurrences, Total Win: ${stats.totalWin.toLocaleString()}, Word RTP: ${wordRTP.toFixed(2)}%`);
            }
        }

        // Find highest win and its frequency
        let highestWin = 0;
        let highestWinMultiplier = 0;
        let highestWinWord = "";
        let highestWinSpinNumber = 0;

        spinResults.forEach(result => {
            if (result.win > highestWin) {
                highestWin = result.win;
                highestWinMultiplier = result.multiplier;
                highestWinWord = result.bestWord || "";
                highestWinSpinNumber = result.spin;
            }
        });

        console.log('\n=== HIGHEST WIN ===');
        console.log(`Highest Win: ${highestWin.toLocaleString()} (${highestWinMultiplier.toFixed(1)}x bet)`);
        if (highestWinWord) {
            console.log(`Highest Scoring Word: "${highestWinWord}" on spin #${highestWinSpinNumber.toLocaleString()}`);
        }
    }

    console.timeEnd('Simulation completed in');
    return finalRTP;
}

// Function to calculate wins for the Scrabble Slots game
function calculateWins(visibleSymbols, betAmount) {
    const result = {
        winningLines: [],
        totalWin: 0
    };

    // Find words in the grid using the real word finder (not the mock)
    const foundWords = findWordsInGrid(visibleSymbols, symbolNumberMultipliers);
    // Convert found words to payline format and calculate wins
    if (foundWords.length > 0) {
        const wordPaylines = wordsToPaylines(foundWords);

        // Calculate win amount for each word
        wordPaylines.forEach(wordLine => {
            const wordLength = wordLine.count;
            const baseValue = wordLine.multiplier;

            // Get the length multiplier from PAYOUT_RULES
            const lengthMultiplier = PAYOUT_RULES[wordLength] || 1;

            // Apply letter-specific multipliers for dl (double letter) and tl (triple letter)
            let adjustedBaseValue = baseValue;
            let winAmount = 0;

            // Check each position for special tiles
            wordLine.positions.forEach(pos => {
                // Get the symbol number from the reel results
                const symbolNumber = visibleSymbols[pos.reel][pos.row];
                // Get the symbol data including special tile type directly from symbolNumberMultipliers
                const symbol = symbolNumberMultipliers[symbolNumber];

                if (symbol && symbol.type) {
                    // Check for double letter (dl) or triple letter (tl) special tiles
                    if (symbol.type === "dl") {
                        adjustedBaseValue += symbol.value; // Double letter - add value again
                    } else if (symbol.type === "tl") {
                        adjustedBaseValue += symbol.value * 2; // Triple letter - add value twice more
                    }
                }
            });

            // Calculate initial win amount (word value × length multiplier × bet)
            winAmount = adjustedBaseValue * lengthMultiplier * betAmount;

            // Apply word-specific multipliers for dw (double word) and tw (triple word)
            wordLine.positions.forEach(pos => {
                // Get the symbol number from the reel results
                const symbolNumber = visibleSymbols[pos.reel][pos.row];
                // Get the symbol data including special tile type
                const symbol = symbolNumberMultipliers[symbolNumber];

                if (symbol && symbol.type) {
                    // Check for word multipliers
                    if (symbol.type === "dw") {
                        winAmount *= 2; // Double the word value
                    } else if (symbol.type === "tw") {
                        winAmount *= 3; // Triple the word value
                    }
                }
            });

            // Store win info
            if (winAmount > 0) {
                result.winningLines.push({
                    word: wordLine.symbolName,
                    symbolNumber: wordLine.symbolIndex,
                    positions: wordLine.positions,
                    paylineIndex: wordLine.paylineId || 0,
                    count: wordLength,
                    win: winAmount
                });

                result.totalWin += winAmount;
            }
        });
    }

    return result;
}

// Use the game's actual findWords function to ensure consistent behavior
function findWordsInGrid(reelResults, symbolMapping) {
    if (!reelResults || !reelResults.length) {
        console.error('No reel results provided to findWordsInGrid function');
        return [];
    }

    // Use the game's actual findWords function from wordFinder.js
    return gameFinderWords(reelResults, symbolMapping);
}

// Helper function to find all valid subwords in a string
function findValidSubwords(word, positions, results, symbolMapping, reelResults) {
    // Try all possible subwords of length MIN_WIN_LENGTH or more
    for (let start = 0; start <= word.length - MIN_WIN_LENGTH; start++) {
        for (let len = MIN_WIN_LENGTH; len <= word.length - start; len++) {
            const subword = word.substring(start, start + len);

            // Skip words with a length that has a multiplier of 0
            if (PAYOUT_RULES[len] === 0) {
                continue;
            }

            // Check if this is a valid word using the REAL isValidWord function from the game
            if (isValidWord(subword)) {
                // Calculate the value of the word
                let wordValue = 0;
                let wordPositions = [];

                for (let i = 0; i < len; i++) {
                    const posIndex = start + i;
                    const position = positions[posIndex];
                    wordPositions.push(position);

                    // Get symbol number from the position
                    const symbolNumber = position.reel !== undefined && position.row !== undefined ?
                        // If we're working with an array of positions with reel and row
                        reelResults[position.reel][position.row] :
                        // If we're working with symbol numbers directly (in letter sequence)
                        Number(word.charCodeAt(posIndex) - 65); // Convert letter back to symbol number

                    // Add the value of this symbol
                    if (symbolMapping && symbolMapping[symbolNumber]) {
                        wordValue += symbolMapping[symbolNumber].value || 0;
                    }
                }

                results.push({
                    word: subword,
                    positions: wordPositions,
                    value: wordValue,
                    length: subword.length
                });
            }
        }
    }
}

// Convert found words to paylines format for win calculation
function wordsToPaylines(words) {
    return words.map((wordInfo, index) => {
        return {
            paylineId: index,
            symbolName: wordInfo.word,
            symbolIndex: -1, // Not applicable for words
            positions: wordInfo.positions,
            count: wordInfo.length,
            multiplier: wordInfo.value
        };
    });
}

// Use the findWordsInGrid as a wrapper around the game's real findWords function
// This ensures we're using the exact same word validation as the actual game

// Export the simulator function
export { simulateRTP };