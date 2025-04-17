// Word-finding functionality for Scrabble Slots
// This module loads valid words from words.txt and checks for them in the reels

// Set to store valid words for fast lookup
let validWordSet = new Set();

// Load words from the words.txt file
export async function loadValidWords() {
    try {
        const response = await fetch('words/words.txt');
        if (!response.ok) {
            throw new Error(`Failed to load words.txt: ${response.status}`);
        }

        const text = await response.text();
        const words = text.trim().split(/\r?\n/);

        // Add all words to the set
        validWordSet = new Set(words.map(word => word.toLowerCase().trim()));
        console.log(`Loaded ${validWordSet.size} valid words for Scrabble Slots`);

        return validWordSet.size;
    } catch (error) {
        console.error('Error loading valid words:', error);
        return 0;
    }
}

// Check if a word exists in our valid word set
export function isValidWord(word) {
    if (!word || word.length < 3) return false;
    return validWordSet.has(word.toLowerCase());
}

// Convert symbol numbers to letters using the symbolNumberMultipliers mapping
export function symbolNumberToLetter(symbolNumber, symbolMapping) {
    if (symbolMapping && symbolMapping[symbolNumber] && symbolMapping[symbolNumber].letter) {
        return symbolMapping[symbolNumber].letter;
    }
    // Fallback to direct mapping (0=A, 1=B, etc.)
    return String.fromCharCode(65 + symbolNumber); // ASCII 'A' is 65
}

// Find all valid words in the reels grid
export function findWords(reelResults, symbolMapping) {
    const words = [];

    if (!reelResults || !reelResults.length) {
        console.error('No reel results provided to findWords function');
        return words;
    }

    const rowCount = reelResults[0].length; // Number of rows (should be 5)
    const colCount = reelResults.length;    // Number of columns/reels (should be 5)

    // Check horizontal words (rows)
    for (let row = 0; row < rowCount; row++) {
        let horizontalWord = "";
        let horizontalPositions = [];

        for (let col = 0; col < colCount; col++) {
            const symbolNumber = reelResults[col][row];
            const letter = symbolNumberToLetter(symbolNumber, symbolMapping);
            horizontalWord += letter;
            horizontalPositions.push({ reel: col, row: row });
        }

        // Check all possible subwords in this row (minimum 3 letters)
        findValidSubwords(horizontalWord, horizontalPositions, words, symbolMapping, reelResults);
    }

    // Check vertical words (columns)
    for (let col = 0; col < colCount; col++) {
        let verticalWord = "";
        let verticalPositions = [];

        for (let row = 0; row < rowCount; row++) {
            const symbolNumber = reelResults[col][row];
            const letter = symbolNumberToLetter(symbolNumber, symbolMapping);
            verticalWord += letter;
            verticalPositions.push({ reel: col, row: row });
        }

        // Check all possible subwords in this column (minimum 3 letters)
        findValidSubwords(verticalWord, verticalPositions, words, symbolMapping, reelResults);
    }

    return words;
}

// Helper function to find all valid subwords in a string
function findValidSubwords(word, positions, results, symbolMapping, reelResults) {
    // Try all possible subwords of length 3 or more
    for (let start = 0; start <= word.length - 3; start++) {
        for (let len = 3; len <= word.length - start; len++) {
            const subword = word.substring(start, start + len);

            // Check if this is a valid word
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

// Get the highest scoring words from a list of found words
export function getHighestScoringWords(words) {
    if (!words || words.length === 0) return [];

    // Sort by value (highest first)
    return [...words].sort((a, b) => b.value - a.value);
}

// Convert found words to paylines format for the slot machine
export function wordsToPaylines(words) {
    return words.map((word, index) => {
        return {
            paylineId: index,
            symbolName: word.word,
            symbolIndex: -1, // Not used in the same way as normal slot paylines
            positions: word.positions,
            count: word.length,
            multiplier: word.value, // Use the word value as multiplier
            amount: word.value      // Will be multiplied by bet later
        };
    });
}
