// filepath: c:\projects\copilot-agent\scrabble-game\utils\layout.js
/**
 * Utility functions for layout calculations
 * Centralizes common grid and positioning logic used throughout the game
 */

// Calculate reel positioning based on canvas and theme layout
export function calculateReelLayout(canvas, symbolSize, reelCount, themeLayout) {
    // Get the desired spacing from theme, or use a default value
    const desiredSpacing = themeLayout?.reelSpacing || 10; // Default to 10px if not specified
    const reelWidth = symbolSize;

    // Calculate total space needed for all reels
    const totalReelWidth = reelWidth * reelCount;

    // Calculate total space available for spacing (between and on edges)
    const totalAvailableForSpacing = canvas.width - totalReelWidth;

    // Ensure we have at least minimal spacing between reels
    const minSpacingNeeded = reelCount - 1; // Spacing only needed between reels

    let actualSpacing;
    if (totalAvailableForSpacing >= desiredSpacing * minSpacingNeeded) {
        // We can use the desired spacing
        actualSpacing = desiredSpacing;
    } else {
        // Not enough space for desired spacing, calculate maximum possible
        actualSpacing = totalAvailableForSpacing / minSpacingNeeded;
    }

    // Center the entire reel area
    const startX = (canvas.width - (totalReelWidth + actualSpacing * (reelCount - 1))) / 2;
    const startY = 100; // This seems to be fixed in the original code

    return {
        reelWidth,
        actualSpacing,
        startX,
        startY,
        totalWidth: totalReelWidth + actualSpacing * (reelCount - 1)
    };
}

// Calculate symbol position based on reel, row, and layout info
export function calculateSymbolPosition(reelIndex, rowIndex, layout) {
    const { startX, startY, reelWidth, actualSpacing } = layout;

    const x = startX + reelIndex * (reelWidth + actualSpacing);
    const y = startY + rowIndex * reelWidth; // Assuming symbol height = width

    return { x, y };
}

// Calculate center of a symbol
export function calculateSymbolCenter(symbolX, symbolY, symbolSize) {
    return {
        x: symbolX + symbolSize / 2,
        y: symbolY + symbolSize / 2
    };
}

// Draw a rounded rectangle - a common operation in the UI
export function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle, lineWidth) {
    ctx.beginPath();

    // Ensure radius is not too large for the rectangle dimensions
    const maxRadius = Math.min(width / 2, height / 2);
    const actualRadius = Math.min(radius, maxRadius);

    if (ctx.roundRect) {
        // Use native roundRect if available
        ctx.roundRect(x, y, width, height, actualRadius);
    } else {
        // Fallback for older browsers
        ctx.moveTo(x + actualRadius, y);
        ctx.lineTo(x + width - actualRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + actualRadius);
        ctx.lineTo(x + width, y + height - actualRadius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - actualRadius, y + height);
        ctx.lineTo(x + actualRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - actualRadius);
        ctx.lineTo(x, y + actualRadius);
        ctx.quadraticCurveTo(x, y, x + actualRadius, y);
    }
    ctx.closePath();

    if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    if (strokeStyle && lineWidth > 0) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
}

// Draw text with common styling options
export function drawText(ctx, text, x, y, font, color, align = 'left', baseline = 'top') {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
}
