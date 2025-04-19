// filepath: c:\projects\copilot-agent\scrabble-game\themes\config.js
// Configuration for Scrabble Slots
// Now uses centralized symbol definitions from symbols.js

import { generateSymbolNumberMultipliers } from './symbols.js';

// Get symbol multipliers from the centralized definition
export const symbolNumberMultipliers = generateSymbolNumberMultipliers();

// Use optimized reel strips with special symbols
// Each symbol number corresponds to:
// 0-25: Regular letters A-Z (0=A, 1=B, 2=C, etc.)
// 26-51: DL (Double Letter) versions of A-Z VOWELS: 26,30,34,46,40
// 52-77: TL (Triple Letter) versions of A-Z VOWELS: 52,56,60,72,66
// 78-103: DW (Double Word) versions of A-Z VOWELS: 78,82,86,98,92
// 104-129: TW (Triple Word) versions of A-Z VOWELS: 104,108,112,124,118
const regularLetters = [
    0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
]
const specialLetters = [
    27, 28, 29, 31, 32, 33, 35, 36, 37, 38, 39, 41, 42, 43, 44, 45, 47, 48, 49, 50, 51,
    53, 54, 55, 57, 58, 59, 61, 62, 63, 64, 65, 67, 68, 69, 70, 71, 73, 74, 75, 76, 77,
    79, 80, 81, 83, 84, 85, 87, 88, 89, 90, 91, 93, 94, 95, 96, 97, 99,
    100, 101, 102, 103, 105, 106, 107, 109, 110, 111, 113, 114, 115, 116, 117,
    119, 120, 121, 122, 123, 125, 126, 127, 128, 129
]

export const reelStrips = [
    // Reel 1 - Consonant heavy with some DL special tiles
    [
        // Regular consonants (appear multiple times)
        ...regularLetters,
        //26-130 - special tiles (vowels removed)
        ...specialLetters
    ],
    // Reel 2 - Balanced with some TL special tiles
    [
        // Regular consonants (appear multiple times)
        ...regularLetters,
        //26-130 - special tiles
        ...specialLetters
    ],

    // Reel 3 - Mix with some DW special tiles
    [
        // Regular consonants (appear multiple times)
        ...regularLetters,
        //26-130 - special tiles
        ...specialLetters

    ],

    // Reel 4 - Balanced with mixed specials
    [
        // Regular consonants (appear multiple times)
        ...regularLetters,
        //26-130 - special tiles
        ...specialLetters

    ],

    // Reel 5 - Consonant heavy with some TW special tiles
    [
        // Regular consonants (appear multiple times)
        ...regularLetters,
        //26-130 - special tiles
        ...specialLetters
    ]
];

// --- Word Length Multiplier Rules ---
// Adjusts the base multiplier based on word length
export const PAYOUT_RULES = {
    3: 0.1, // 3-letter word multiplier
    4: 0.1, // 4-letter word multiplier
    5: 10,  // 5-letter word multiplierer
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

// Theme-specific configuration
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
