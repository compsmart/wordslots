// Scrabble Slots Theme Definition
// This theme transforms the slot machine into a word game with letter tiles

export const SCRABBLE_THEME = {
    name: "Scrabble",
    description: "A word game with letter tiles that form winning words",

    // Define the letter tiles as symbols
    symbols: [
        { name: "A", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "A", value: 1, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "B", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "B", value: 3, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "C", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "C", value: 3, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "D", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "D", value: 2, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "E", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "E", value: 1, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "F", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "F", value: 4, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "G", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "G", value: 2, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "H", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "H", value: 4, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "I", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "I", value: 1, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "J", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "J", value: 8, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "K", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "K", value: 5, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "L", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "L", value: 1, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "M", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "M", value: 3, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "N", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "N", value: 1, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "O", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "O", value: 1, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "P", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "P", value: 3, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "Q", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "Q", value: 10, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "R", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "R", value: 1, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "S", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "S", value: 1, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "T", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "T", value: 1, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "U", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "U", value: 1, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "V", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "V", value: 4, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "W", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "W", value: 4, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "X", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "X", value: 8, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "Y", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "Y", value: 4, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" },
        { name: "Z", path: "images/scrabble/tile.svg", imagePath: "images/scrabble/tile.svg", letter: "Z", value: 10, tileBackground: "images/scrabble/tile.svg", backgroundColor: "#e8d0aa" }
    ],

    // Visual theme layout
    layout: {
        themeColor: "#2e7d32", // Scrabble board green
        reelSpacing: 5,        // Tight spacing for tiles
        reelsContainer: {
            backgroundColor: "#1e5722", // Darker green for the board
            opacity: 0.9
        }
    },

    // Visual effects for the theme
    visualEffects: {
        enabled: true,
        intensity: 0.8,
        backgroundEffects: {
            pulse: {
                enabled: true,
                color: "#2e7d32", // Scrabble green
                color2: "#1b4a1c", // Darker green
                speed: 5000,      // Slow pulse
                intensity: 0.2    // Subtle
            },
            particles: {
                enabled: true,
                count: 30,
                color: "#ffffff",
                size: { min: 1, max: 3 },
                sparkle: false
            }
        },
        reelEffects: {
            enabled: true,
            blurAmount: 6,         // More blur for rotating tiles
            spinningGlow: true,
            spinColor: "#ffcc00",  // Golden glow on spinning
            //lightTrails: true
        },
        winEffects: {
            enabled: true,
            rotateEffect: {
                enabled: true,
                rotations: 1,
                duration: 1200,
                easing: "easeOutElastic",
                direction: "clockwise"
            },
            explosions: true,
            flashingSymbols: true,
            shockwave: true
        },
        reelMask: {
            enabled: true,
            borderWidth: 3,
            separatorWidth: 1,
            glowEffect: {
                enabled: true,
                color: "#ffcc00",
                intensity: 0.5,
                size: 8
            }
        },
        themeSpecific: {
            enabled: true,
            epicWinAnimation: {
                duration: 6000
            }
        }
    },    // Render symbol function - custom tile rendering for Scrabble letters
    renderSymbol: function(ctx, symbol, x, y, width, height, options) {
        //console.log(`Rendering symbol: ${symbol.letter} at (${x},${y}) with dimensions ${width}x${height}`);
        
        // Draw plain colored background
        ctx.fillStyle = "#e8d0aa";  // Scrabble tile color
        ctx.fillRect(x, y, width, height);
        
        // Add border
        ctx.strokeStyle = "#9e7e4f"; // Darker border
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Draw the letter
        ctx.fillStyle = "#333333";
        ctx.font = `bold ${Math.floor(height * 0.6)}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(symbol.letter, x + width / 2, y + height / 2);
        
        // Draw the score value
        ctx.fillStyle = "#333333";
        ctx.font = `bold ${Math.floor(height * 0.25)}px Arial, sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(symbol.value.toString(), x + width - 6, y + height - 4);
        
        return true; // Signal that we're handling the rendering
    },

    // Custom render function for theme-specific background
    renderThemeEffects: function (ctx, canvas, timestamp, config) {
        // Draw the Scrabble board background
        const gridSpacing = 40;
        const gridColor = "#255c28";

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

        // Draw some "bonus" squares like a Scrabble board
        const bonusSquares = [
            { x: 2, y: 2, color: "#ff0000", text: "TW" },  // Triple Word
            { x: 2, y: 12, color: "#ff0000", text: "TW" },
            { x: 12, y: 2, color: "#ff0000", text: "TW" },
            { x: 12, y: 12, color: "#ff0000", text: "TW" },

            { x: 0, y: 3, color: "#0073cf", text: "TL" },  // Triple Letter
            { x: 3, y: 0, color: "#0073cf", text: "TL" },
            { x: 12, y: 3, color: "#0073cf", text: "TL" },
            { x: 3, y: 12, color: "#0073cf", text: "TL" },

            { x: 6, y: 6, color: "#ffb6c1", text: "DW" },  // Double Word
            { x: 8, y: 8, color: "#ffb6c1", text: "DW" },
            { x: 6, y: 8, color: "#ffb6c1", text: "DW" },
            { x: 8, y: 6, color: "#ffb6c1", text: "DW" }
        ];

        // Draw the bonus squares
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
    },

    // Custom render function for epic win animation
    renderEpicWinAnimation: function (ctx, canvas, elapsed, deltaTime, winAmount) {
        // Calculate animation progress
        const duration = 6000;
        const progress = Math.min(elapsed / duration, 1.0);

        // Fill background with Scrabble green
        ctx.fillStyle = "#2e7d32";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw flying letter tiles
        const numTiles = 50;
        for (let i = 0; i < numTiles; i++) {
            const tileSize = 40 + Math.sin(elapsed / 500 + i) * 10;
            const x = (canvas.width / 2) + Math.sin((elapsed + i * 100) / 1000) * (canvas.width * 0.4);
            const y = (canvas.height / 2) + Math.cos((elapsed + i * 100) / 1000) * (canvas.height * 0.4);
            const rotation = (elapsed / 2000 + i * 0.1) * Math.PI * 2;
            const letter = String.fromCharCode(65 + (i % 26)); // A-Z

            // Draw tile background
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillStyle = "#e8d0aa"; // Tile color
            ctx.strokeStyle = "#9e7e4f"; // Tile border
            ctx.lineWidth = 2;
            ctx.fillRect(-tileSize / 2, -tileSize / 2, tileSize, tileSize);
            ctx.strokeRect(-tileSize / 2, -tileSize / 2, tileSize, tileSize);

            // Draw letter
            ctx.fillStyle = "#333";
            ctx.font = `bold ${Math.round(tileSize * 0.6)}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(letter, 0, 0);
            ctx.restore();
        }

        // Flash the whole screen white at the start
        if (progress < 0.2) {
            const flashOpacity = (0.2 - progress) / 0.2;
            ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw word "WORD JACKPOT" with scaling and pulsing
        const pulse = 1 + Math.sin(elapsed / 200) * 0.1;
        const titleSize = 80 * pulse;

        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffcc00";
        ctx.shadowBlur = 20 + Math.sin(elapsed / 300) * 10;
        ctx.font = `bold ${titleSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("WORD JACKPOT!", canvas.width / 2, canvas.height * 0.3);
        ctx.restore();

        // Draw win amount with growing effect
        const amountSize = Math.min(60 + progress * 40, 100) * pulse;

        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffcc00";
        ctx.shadowBlur = 20;
        ctx.font = `bold ${amountSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${winAmount} CREDITS`, canvas.width / 2, canvas.height * 0.7);
        ctx.restore();
    }
};
