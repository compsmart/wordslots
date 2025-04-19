// filepath: c:\projects\copilot-agent\scrabble-game\themes\symbols.js
/**
 * Centralized symbol definitions for the Scrabble Slots game
 * This file serves as the single source of truth for letter properties
 */

// Define basic letter properties (value, frequency, etc.)
export const LETTER_PROPERTIES = {
    "A": { value: 1, frequency: 9 },
    "B": { value: 3, frequency: 2 },
    "C": { value: 3, frequency: 2 },
    "D": { value: 2, frequency: 4 },
    "E": { value: 1, frequency: 12 },
    "F": { value: 4, frequency: 2 },
    "G": { value: 2, frequency: 3 },
    "H": { value: 4, frequency: 2 },
    "I": { value: 1, frequency: 9 },
    "J": { value: 8, frequency: 1 },
    "K": { value: 5, frequency: 1 },
    "L": { value: 1, frequency: 4 },
    "M": { value: 3, frequency: 2 },
    "N": { value: 1, frequency: 6 },
    "O": { value: 1, frequency: 8 },
    "P": { value: 3, frequency: 2 },
    "Q": { value: 10, frequency: 1 },
    "R": { value: 1, frequency: 6 },
    "S": { value: 1, frequency: 4 },
    "T": { value: 1, frequency: 6 },
    "U": { value: 1, frequency: 4 },
    "V": { value: 4, frequency: 2 },
    "W": { value: 4, frequency: 2 },
    "X": { value: 8, frequency: 1 },
    "Y": { value: 4, frequency: 2 },
    "Z": { value: 10, frequency: 1 }
};

// Generate symbolNumberMultipliers with extended special symbols
export const generateSymbolNumberMultipliers = () => {
    const result = {};
    // Regular letters (0-25 for A-Z)
    Object.entries(LETTER_PROPERTIES).forEach(([letter, props], index) => {
        result[index] = {
            letter,
            value: props.value,
            // Don't include type for regular letters to prevent rendering issues
            pointValue: props.value // Use pointValue instead of type for regular letters
        };

        // DL - Double Letter (26-51)
        result[index + 26] = {
            letter,
            value: props.value,
            type: "dl"
        };

        // TL - Triple Letter (52-77)
        result[index + 52] = {
            letter,
            value: props.value,
            type: "tl"
        };

        // DW - Double Word (78-103)
        result[index + 78] = {
            letter,
            value: props.value,
            type: "dw"
        };

        // TW - Triple Word (104-129)
        result[index + 104] = {
            letter,
            value: props.value,
            type: "tw"
        };
    });

    return result;
};

// Generate symbol arrays for the theme with extended symbol support
export const generateThemeSymbols = (baseTilePath = "images/scrabble/tile.svg") => {
    const symbols = [];
    const letters = Object.entries(LETTER_PROPERTIES);

    // Generate symbols in the correct order by type first:
    // Group 1: Regular letters (0-25)
    letters.forEach(([letter, props], index) => {
        symbols.push({
            name: letter,
            path: baseTilePath,
            imagePath: baseTilePath,
            letter: letter,
            value: props.value,
            pointValue: props.value,
            // Don't include type for regular letters
            symbolIndex: index,
            tileBackground: baseTilePath,
            backgroundColor: "#e8d0aa" // Default Scrabble tile color
        });
    });

    // Group 2: DL - Double Letter (26-51)
    letters.forEach(([letter, props], index) => {
        symbols.push({
            name: `${letter} DL`,
            path: baseTilePath,
            imagePath: baseTilePath,
            letter: letter,
            value: props.value,
            type: "dl",
            symbolIndex: index + 26,
            tileBackground: baseTilePath,
            backgroundColor: "#e8d0aa",
            fontColor: "#0073cf",
            specialText: "DL"
        });
    });

    // Group 3: TL - Triple Letter (52-77)
    letters.forEach(([letter, props], index) => {
        symbols.push({
            name: `${letter} TL`,
            path: baseTilePath,
            imagePath: baseTilePath,
            letter: letter,
            value: props.value,
            type: "tl",
            symbolIndex: index + 52,
            tileBackground: baseTilePath,
            backgroundColor: "#e8d0aa",
            fontColor: "#ff0000",
            specialText: "TL"
        });
    });

    // Group 4: DW - Double Word (78-103)
    letters.forEach(([letter, props], index) => {
        symbols.push({
            name: `${letter} DW`,
            path: baseTilePath,
            imagePath: baseTilePath,
            letter: letter,
            value: props.value,
            type: "dw",
            symbolIndex: index + 78,
            tileBackground: baseTilePath,
            backgroundColor: "#0073cf",
            fontColor: "#ffffff",
            specialText: "DW"
        });
    });

    // Group 5: TW - Triple Word (104-129)
    letters.forEach(([letter, props], index) => {
        symbols.push({
            name: `${letter} TW`,
            path: baseTilePath,
            imagePath: baseTilePath,
            letter: letter,
            value: props.value,
            type: "tw",
            symbolIndex: index + 104,
            tileBackground: baseTilePath,
            backgroundColor: "#ff0000",
            fontColor: "#ffffff",
            specialText: "TW"
        });
    });

    // Return the generated symbols
    return { symbols, specialSymbols: [] }; // We don't need separate special symbols anymore
};
