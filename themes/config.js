// Reels for Scrabble Slots - Each reel has 30 positions with letter symbols (0-25 for A-Z)
// Distribution based on Scrabble letter frequency
export const reelStrips = [
    // Reel 1 - Vowel heavy with common consonants
    [0, 4, 8, 14, 17, 0, 19, 14, 0, 11, 8, 19, 7, 4, 17, 0, 4, 12, 13, 14, 15, 18, 19, 0, 4, 8, 14, 20, 4, 5],
    // Reel 2 - Balanced with common letters
    [1, 0, 4, 8, 14, 17, 19, 4, 13, 14, 15, 18, 19, 1, 3, 4, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 0, 8, 14, 20],
    // Reel 3 - Mix of vowels and consonants
    [2, 0, 4, 8, 14, 17, 19, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 0, 5, 9, 14, 21, 25, 0, 5, 15, 20],
    // Reel 4 - Balanced with common letters
    [3, 0, 4, 8, 14, 17, 19, 4, 13, 14, 15, 18, 19, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 0, 8, 14, 20, 3],
    // Reel 5 - Consonant heavy with some vowels
    [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 0, 4, 8, 14, 17, 19, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
];

// --- Letter Symbol Configurations ---
// Maps symbol number (0-25) to its letter and value (based on Scrabble scoring)
export const symbolNumberMultipliers = {
    0: { letter: "A", value: 1 },
    1: { letter: "B", value: 3 },
    2: { letter: "C", value: 3 },
    3: { letter: "D", value: 2 },
    4: { letter: "E", value: 1 },
    5: { letter: "F", value: 4 },
    6: { letter: "G", value: 2 },
    7: { letter: "H", value: 4 },
    8: { letter: "I", value: 1 },
    9: { letter: "J", value: 8 },
    10: { letter: "K", value: 5 },
    11: { letter: "L", value: 1 },
    12: { letter: "M", value: 3 },
    13: { letter: "N", value: 1 },
    14: { letter: "O", value: 1 },
    15: { letter: "P", value: 3 },
    16: { letter: "Q", value: 10 },
    17: { letter: "R", value: 1 },
    18: { letter: "S", value: 1 },
    19: { letter: "T", value: 1 },
    20: { letter: "U", value: 1 },
    21: { letter: "V", value: 4 },
    22: { letter: "W", value: 4 },
    23: { letter: "X", value: 8 },
    24: { letter: "Y", value: 4 },
    25: { letter: "Z", value: 10 }
};

// --- Word Length Multiplier Rules ---
// Adjusts the base multiplier based on word length
export const PAYOUT_RULES = {
    3: 1,    // 3-letter words get base multiplier
    4: 1,  // 4-letter words get 1.5x multiplier
    5: 1   // 5-letter words get 2x multiplier
};

// For Scrabble Slots, instead of predefined paylines, we'll be looking for words
// in all possible horizontal rows and vertical columns of our 5x5 grid
export const PAYLINES = [
    // Horizontal Rows (5 rows)
    // Row 0 (top)
    [{ reel: 0, row: 0 }, { reel: 1, row: 0 }, { reel: 2, row: 0 }, { reel: 3, row: 0 }, { reel: 4, row: 0 }],
    // Row 1
    [{ reel: 0, row: 1 }, { reel: 1, row: 1 }, { reel: 2, row: 1 }, { reel: 3, row: 1 }, { reel: 4, row: 1 }],
    // Row 2
    [{ reel: 0, row: 2 }, { reel: 1, row: 2 }, { reel: 2, row: 2 }, { reel: 3, row: 2 }, { reel: 4, row: 2 }],
    // Row 3
    [{ reel: 0, row: 3 }, { reel: 1, row: 3 }, { reel: 2, row: 3 }, { reel: 3, row: 3 }, { reel: 4, row: 3 }],
    // Row 4 (bottom)
    [{ reel: 0, row: 4 }, { reel: 1, row: 4 }, { reel: 2, row: 4 }, { reel: 3, row: 4 }, { reel: 4, row: 4 }],

    // Vertical Columns (5 columns)
    // Column 0 (leftmost)
    [{ reel: 0, row: 0 }, { reel: 0, row: 1 }, { reel: 0, row: 2 }, { reel: 0, row: 3 }, { reel: 0, row: 4 }],
    // Column 1
    [{ reel: 1, row: 0 }, { reel: 1, row: 1 }, { reel: 1, row: 2 }, { reel: 1, row: 3 }, { reel: 1, row: 4 }],
    // Column 2
    [{ reel: 2, row: 0 }, { reel: 2, row: 1 }, { reel: 2, row: 2 }, { reel: 2, row: 3 }, { reel: 2, row: 4 }],
    // Column 3
    [{ reel: 3, row: 0 }, { reel: 3, row: 1 }, { reel: 3, row: 2 }, { reel: 3, row: 3 }, { reel: 3, row: 4 }],
    // Column 4 (rightmost)
    [{ reel: 4, row: 0 }, { reel: 4, row: 1 }, { reel: 4, row: 2 }, { reel: 4, row: 3 }, { reel: 4, row: 4 }],
];

// --- Minimum win length (minimum word length) ---
export const MIN_WIN_LENGTH = 3; // Words must be at least 3 letters long

export const themeSpecific = {
    epicWinAnimation: {
        enabled: true,
        name: "Scrabble Word Celebration",
        duration: 5000, // 5 seconds
        letterSparkle: true,
        wordGlow: true,
        dictionaryFlip: true
    },
    letterEffects: {
        enabled: true,
        tileColor: '#e8d0aa', // Light wooden color
        letterColor: '#333333', // Dark text
        borderColor: '#9e7e4f', // Darker wood border
        glowColor: '#f7e26b', // Golden glow for winning letters
        tileSize: 80 // Size of the letter tiles
    },
    boardStyle: {
        enabled: true,
        backgroundColor: '#2e7d32', // Classic Scrabble board green
        gridColor: '#255c28', // Darker green for grid lines
        bonusColors: {
            doubleLetter: '#87ceeb', // Light blue
            tripleLetter: '#0073cf', // Dark blue
            doubleWord: '#ffb6c1', // Light pink
            tripleWord: '#ff0000' // Red
        }
    },
    wordAnimation: {
        enabled: true,
        glowColor: '#ffdf00', // Gold
        intensity: 0.8,
        pulseSpeed: 1500,
        highlightDuration: 3000 // How long to highlight winning words
    }
};
