// filepath: c:\projects\copilot-agent\scrabble-game\themes\renderer.js
/**
 * Centralized rendering functions for Scrabble tiles
 * Handles all the different tile types with minimal duplication
 */

import { drawRoundedRect, drawText } from '../utils/layout.js';

// Main tile rendering function that handles all tile types
export function renderTile(ctx, symbol, x, y, width, height, options = {}) {
    // Determine if this is a special tile (dw, tw, dl, tl) or regular letter tile
    // Check both the type property and the symbol index range
    const symbolIndex = symbol.symbolIndex || 0;
    //console.log(symbol);
    // Check for special tiles - don't match "regular" type
    if (symbol.type && ["dl", "tl", "dw", "tw"].includes(symbol.type)) {
        return renderSpecialTile(ctx, symbol, x, y, width, height, options);
    } else if (symbolIndex >= 26) { // Extended symbol range
        // Determine type from symbol index range
        let type = "regular";
        if (symbolIndex >= 26 && symbolIndex <= 51) type = "dl";
        else if (symbolIndex >= 52 && symbolIndex <= 77) type = "tl";
        else if (symbolIndex >= 78 && symbolIndex <= 103) type = "dw";
        else if (symbolIndex >= 104 && symbolIndex <= 129) type = "tw";

        // Create a modified symbol object with the correct type
        const modifiedSymbol = { ...symbol, type: type };
        return renderSpecialTile(ctx, modifiedSymbol, x, y, width, height, options);
    } else {
        return renderLetterTile(ctx, symbol, x, y, width, height, options);
    }
}

// Render a regular letter tile
function renderLetterTile(ctx, symbol, x, y, width, height, options = {}) {
    const backgroundColor = symbol.backgroundColor || "#e8d0aa"; // Default Scrabble tile color
    const borderColor = options.highlighted ? "#ffcc00" : "#9e7e4f"; // Highlight or default border
    const borderWidth = options.highlighted ? 3 : 2;
    const letterColor = symbol.fontColor || "#333333";

    // Draw the tile background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, width, height);

    // Add border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x, y, width, height);

    // Draw the letter
    const letter = symbol.letter || symbol.name;
    ctx.fillStyle = letterColor;
    ctx.font = `bold ${Math.floor(height * 0.6)}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, x + width / 2, y + height / 2);    // Draw the score value
    ctx.fillStyle = letterColor;
    ctx.font = `bold ${Math.floor(height * 0.25)}px Arial, sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";

    // Just display the numeric point value for regular letter tiles
    // This is used for the small number in the corner showing the letter's value
    if (typeof symbol.value === 'number') {
        ctx.fillText(symbol.value.toString(), x + width - 6, y + height - 4);
    } else {
        // Fallback to using a standard Scrabble letter value based on letter
        const letterValues = {
            'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2,
            'H': 4, 'I': 1, 'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1,
            'O': 1, 'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1,
            'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10
        };

        const letter = symbol.letter ? symbol.letter.toUpperCase() : '';
        const pointValue = letterValues[letter] || 1;
        ctx.fillText(pointValue.toString(), x + width - 6, y + height - 4);
    }

    return true; // Successfully rendered
}

// Render a special tile (double/triple word/letter)
function renderSpecialTile(ctx, symbol, x, y, width, height, options = {}) {
    // Set background color for special tiles
    const bgColor = symbol.type === "dw" ? "#0073cf" :
        symbol.type === "tw" ? "#ff0000" :
            "#e8d0aa"; // Default background for dl/tl

    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height);

    // Add border - highlight if needed
    const borderColor = options.highlighted ? "#ffcc00" : "#9e7e4f";
    const borderWidth = options.highlighted ? 3 : 2;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x, y, width, height);

    // Set font color for special tiles
    const fontColor = symbol.type === "dl" ? "#0073cf" :
        symbol.type === "tl" ? "#ff0000" :
            "#ffffff"; // Default white font for dw/tw

    // Draw the letter
    ctx.fillStyle = fontColor;
    ctx.font = `bold ${Math.floor(height * 0.6)}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(symbol.letter, x + width / 2, y + height / 2);

    // Draw the type (dw, tw, dl, tl) in the corner
    ctx.font = `bold ${Math.floor(height * 0.25)}px Arial, sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(symbol.type.toUpperCase(), x + width - 6, y + height - 4);

    return true; // Successfully rendered
}

// Draw the scrabble board background pattern
export function drawScrabbleBoardPattern(ctx, canvas, config = {}) {
    // Default config values
    const gridSpacing = config.gridSpacing || 40;
    const gridColor = config.gridColor || "#255c28";

    // Draw vertical grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = gridSpacing; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw bonus squares if enabled
    if (config.drawBonusSquares !== false) {
        drawBonusSquares(ctx, gridSpacing, config.bonusSquares);
    }
}

// Helper function to draw Scrabble board bonus squares
function drawBonusSquares(ctx, gridSpacing, customBonusSquares) {
    // Default bonus squares if not provided - using standard Scrabble board layout
    const bonusSquares = customBonusSquares || [
        // Triple Word Score (red squares)
        { x: 0, y: 0, color: "#ff0000", text: "TW" },
        { x: 7, y: 0, color: "#ff0000", text: "TW" },
        { x: 14, y: 0, color: "#ff0000", text: "TW" },
        { x: 0, y: 7, color: "#ff0000", text: "TW" },
        { x: 14, y: 7, color: "#ff0000", text: "TW" },
        { x: 0, y: 14, color: "#ff0000", text: "TW" },
        { x: 7, y: 14, color: "#ff0000", text: "TW" },
        { x: 14, y: 14, color: "#ff0000", text: "TW" },

        // Double Word Score (pink squares)
        { x: 1, y: 1, color: "#ffb6c1", text: "DW" },
        { x: 2, y: 2, color: "#ffb6c1", text: "DW" },
        { x: 3, y: 3, color: "#ffb6c1", text: "DW" },
        { x: 4, y: 4, color: "#ffb6c1", text: "DW" },
        { x: 10, y: 4, color: "#ffb6c1", text: "DW" },
        { x: 11, y: 3, color: "#ffb6c1", text: "DW" },
        { x: 12, y: 2, color: "#ffb6c1", text: "DW" },
        { x: 13, y: 1, color: "#ffb6c1", text: "DW" },
        { x: 4, y: 10, color: "#ffb6c1", text: "DW" },
        { x: 3, y: 11, color: "#ffb6c1", text: "DW" },
        { x: 2, y: 12, color: "#ffb6c1", text: "DW" },
        { x: 1, y: 13, color: "#ffb6c1", text: "DW" },
        { x: 10, y: 10, color: "#ffb6c1", text: "DW" },
        { x: 11, y: 11, color: "#ffb6c1", text: "DW" },
        { x: 12, y: 12, color: "#ffb6c1", text: "DW" },
        { x: 13, y: 13, color: "#ffb6c1", text: "DW" },
        { x: 7, y: 7, color: "#ffb6c1", text: "DW" }, // Center square

        // Triple Letter Score (dark blue squares)
        { x: 5, y: 1, color: "#0073cf", text: "TL" },
        { x: 9, y: 1, color: "#0073cf", text: "TL" },
        { x: 1, y: 5, color: "#0073cf", text: "TL" },
        { x: 5, y: 5, color: "#0073cf", text: "TL" },
        { x: 9, y: 5, color: "#0073cf", text: "TL" },
        { x: 13, y: 5, color: "#0073cf", text: "TL" },
        { x: 1, y: 9, color: "#0073cf", text: "TL" },
        { x: 5, y: 9, color: "#0073cf", text: "TL" },
        { x: 9, y: 9, color: "#0073cf", text: "TL" },
        { x: 13, y: 9, color: "#0073cf", text: "TL" },
        { x: 5, y: 13, color: "#0073cf", text: "TL" },
        { x: 9, y: 13, color: "#0073cf", text: "TL" },

        // Double Letter Score (light blue squares)
        { x: 3, y: 0, color: "#87ceeb", text: "DL" },
        { x: 11, y: 0, color: "#87ceeb", text: "DL" },
        { x: 6, y: 2, color: "#87ceeb", text: "DL" },
        { x: 8, y: 2, color: "#87ceeb", text: "DL" },
        { x: 0, y: 3, color: "#87ceeb", text: "DL" },
        { x: 7, y: 3, color: "#87ceeb", text: "DL" },
        { x: 14, y: 3, color: "#87ceeb", text: "DL" },
        { x: 2, y: 6, color: "#87ceeb", text: "DL" },
        { x: 6, y: 6, color: "#87ceeb", text: "DL" },
        { x: 8, y: 6, color: "#87ceeb", text: "DL" },
        { x: 12, y: 6, color: "#87ceeb", text: "DL" },
        { x: 3, y: 7, color: "#87ceeb", text: "DL" },
        { x: 11, y: 7, color: "#87ceeb", text: "DL" },
        { x: 2, y: 8, color: "#87ceeb", text: "DL" },
        { x: 6, y: 8, color: "#87ceeb", text: "DL" },
        { x: 8, y: 8, color: "#87ceeb", text: "DL" },
        { x: 12, y: 8, color: "#87ceeb", text: "DL" },
        { x: 0, y: 11, color: "#87ceeb", text: "DL" },
        { x: 7, y: 11, color: "#87ceeb", text: "DL" },
        { x: 14, y: 11, color: "#87ceeb", text: "DL" },
        { x: 6, y: 12, color: "#87ceeb", text: "DL" },
        { x: 8, y: 12, color: "#87ceeb", text: "DL" },
        { x: 3, y: 14, color: "#87ceeb", text: "DL" },
        { x: 11, y: 14, color: "#87ceeb", text: "DL" }
    ];

    // Draw each bonus square
    bonusSquares.forEach(square => {
        const x = square.x * gridSpacing;
        const y = square.y * gridSpacing;

        ctx.fillStyle = square.color;
        ctx.globalAlpha = 0.4; // Semi-transparent
        ctx.fillRect(x, y, gridSpacing, gridSpacing);
        ctx.globalAlpha = 1.0;

        // Draw the bonus text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(square.text, x + gridSpacing / 2, y + gridSpacing / 2);
    });
}
