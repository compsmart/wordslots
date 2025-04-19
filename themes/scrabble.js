// filepath: c:\projects\copilot-agent\scrabble-game\themes\scrabble.js
// Scrabble Slots Theme Definition
// This theme transforms the slot machine into a word game with letter tiles

import { generateThemeSymbols } from './symbols.js';
import { renderTile, drawScrabbleBoardPattern } from './renderer.js';

// Generate symbols for the theme
const { symbols, specialSymbols } = generateThemeSymbols("images/scrabble/tile.svg");

export const SCRABBLE_THEME = {
    name: "Scrabble",
    description: "A word game with letter tiles that form winning words",

    // Use the generated symbols array
    symbols,

    specialSymbols,

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
    },

    // Use the simplified renderTile function from renderer.js
    renderSymbol: function (ctx, symbol, x, y, width, height, options) {
        return renderTile(ctx, symbol, x, y, width, height, options);
    },

    // Use the board pattern drawing function from renderer.js
    renderThemeEffects: function (ctx, canvas, timestamp, config) {
        // drawScrabbleBoardPattern(ctx, canvas, {
        //     gridSpacing: 60,
        //     gridColor: "#255c28"
        // });
    },

    // Custom render function for epic win animation
    // Store the epic background image so it only needs to be loaded once
    epicBackgroundImage: null,

    // Initialize the background image
    initEpicBackground: function () {
        if (!this.epicBackgroundImage) {
            this.epicBackgroundImage = new Image();
            this.epicBackgroundImage.src = "images/scrabble/epic_bg.jpg";
        }
        return this.epicBackgroundImage;
    },

    renderEpicWinAnimation: function (ctx, canvas, elapsed, deltaTime, winAmount) {
        // Make sure background image is initialized
        const backgroundImage = this.initEpicBackground();

        // Calculate animation progress
        const duration = 6000;
        const progress = Math.min(elapsed / duration, 1.0);

        // Clear everything first
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Add a solid black background first to ensure nothing shows through
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the background image if it's loaded
        if (backgroundImage.complete) {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        } else {
            // Fallback to green background if image isn't loaded yet
            ctx.fillStyle = "#2e7d32";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set up the onload to trigger a repaint when the image loads
            backgroundImage.onload = () => {
                // This will make sure the image appears as soon as it's loaded
                requestAnimationFrame(() => { });
            };
        }

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
        ctx.fillText("5 LETTER WORD!", canvas.width / 2, canvas.height * 0.3);
        ctx.restore();

        // Draw win amount with growing effect
        const amountSize = Math.min(60 + progress * 40, 100) * pulse;
        // Round the win amount to whole number
        const roundedWinAmount = Math.round(winAmount);

        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffcc00";
        ctx.shadowBlur = 20;
        ctx.font = `bold ${amountSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${roundedWinAmount} CREDITS`, canvas.width / 2, canvas.height * 0.7);
        ctx.restore();
    }
};

// Add symbols to the theme (no need for explicit initialization)
