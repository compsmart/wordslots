// filepath: c:\projects\copilot-agent\slot-game\themes\effects.js
/**
 * Advanced visual effects definitions for the slot machine
 * These effects can be enabled or disabled per theme
 */

// Base effect configuration with defaults that can be overridden
export const EffectDefaults = {
    enabled: false,       // Master switch for all effects
    intensity: 0.7,       // Overall intensity multiplier (0.0-1.0)
    framerate: 60,        // Target framerate for animations

    // Individual effects
    neonGlow: {
        enabled: false,    // Enable neon glow around symbols
        color: '#00ffff', // Default color for glow
        size: 10,         // Glow size in pixels
        pulseSpeed: 1000, // Pulse cycle in milliseconds
        intensity: 0.8    // Specific effect intensity
    },

    electricEdges: {
        enabled: false,    // Enable electric effect on symbol edges
        color: '#ffffff', // Color of the electric effect
        arcs: 5,          // Number of electric arcs
        speed: 800,       // Speed of movement in ms
        intensity: 0.7    // Specific effect intensity
    },

    // New reelMask effects configuration
    reelMask: {
        enabled: true,             // Enable special effects for reel mask
        borderWidth: 5,            // Width of the border in pixels
        separatorWidth: 2,         // Width of separator lines
        glowEffect: {
            enabled: true,         // Enable glow around borders
            color: '#ffcc00',      // Base glow color
            intensity: 0.8,        // Glow intensity
            size: 10              // Glow size in pixels
        },
        pulseEffect: {
            enabled: true,         // Enable pulsing effect
            speed: 1500,           // Pulse cycle in milliseconds
            minOpacity: 0.6,       // Minimum opacity during pulse
            maxOpacity: 1.0        // Maximum opacity during pulse
        },
        colorTransition: {
            enabled: true,         // Enable color transition effect
            colors: ['#ffcc00', '#ff5500', '#ff00ff', '#00ffff', '#ffcc00'], // Colors to cycle through
            speed: 5000,           // Full color cycle duration in milliseconds
            mode: 'gradient'       // 'gradient' or 'solid'
        }
    },

    backgroundEffects: {
        enabled: true,               // Master switch for background
        particles: {
            enabled: true,           // Floating particles
            count: 50,               // Number of particles
            color: '#ffffff',        // Particle color
            size: { min: 2, max: 6 } // Size range
        },
        pulse: {
            enabled: true,           // Pulsing background
            color: '#0a0a2a',        // Base color
            speed: 2000,             // Pulse cycle in ms
            intensity: 0.3           // How strong the pulse is
        }
    },
    winEffects: {
        enabled: false,           // Special effects for wins
        explosions: false,        // Explosive particle effects on wins
        shockwave: false,         // Shockwave effect
        flashingSymbols: false,   // Make winning symbols flash
        spinEffect3d: {
            enabled: false,       // 3D rotation effect on win
            rotations: 1,        // Number of full rotations
            duration: 1000,      // Duration in ms
            easing: 'easeOutBack'// Easing function
        }
    },
    reelEffects: {
        enabled: false,           // Effects during reel spin
        blurAmount: 5,           // Motion blur intensity
        lightTrails: false,       // Light trails behind symbols
        spinningGlow: true,      // Glow during spinning
        spinColor: '#3498db'     // Color during spin
    },
    themeSpecific: {            // Theme-specific effect configurations
        // Can be extended by each theme
    }
};

// Common helper functions for visual effects
export const EffectsHelper = {
    imageCache: {},

    // Load image with caching
    async loadImage(src) {
        if (this.imageCache[src]) {
            if (this.imageCache[src] instanceof Promise) {
                // If loading is in progress, wait for it
                return this.imageCache[src];
            }
            // If already loaded (or failed), return the result
            return this.imageCache[src];
        }

        // Start loading
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.imageCache[src] = img; // Cache the loaded image object
                resolve(img);
            };
            img.onerror = (err) => {
                console.error(`Failed to load image: ${src}`, err);
                this.imageCache[src] = null; // Cache the failure
                resolve(null); // Resolve with null on error
            };
            img.src = src;
        });

        this.imageCache[src] = promise; // Cache the promise while loading
        return promise;
    },

    // Convert hex color to RGB object
    hexToRgb(hex) {
        // Remove '#' if present
        hex = hex.replace(/^#/, '');

        // Parse hex values to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return { r, g, b };
    },    // Helper function (add to EffectsHelper or place globally if needed)
    hexToHsl(hex) {
        // Remove '#' if present
        hex = hex.replace(/^#/, '');
        // Convert hex to RGB
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    },

    // Render golden rain/coins falling effect
    renderGoldenRain(ctx, canvas, timestamp, options = {}) {
        const {
            count = 100,
            coinSize = 5,
            coinColor = '#ffd700',
            outlineColor = '#b7950b',
            speed = 3,
            swayAmount = 30,
            swaySpeed = 1000,
            detailsEnabled = true
        } = options;

        ctx.save();

        // Draw falling gold coins
        for (let i = 0; i < count; i++) {
            const x = (i / count) * canvas.width + (Math.sin(timestamp / swaySpeed + i) * swayAmount);
            const baseSpeed = speed + (i % 5) * 2;
            const y = ((timestamp / baseSpeed + i * 30) % canvas.height);

            // Draw gold coin body
            ctx.fillStyle = coinColor;
            ctx.beginPath();
            ctx.arc(x, y, coinSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = outlineColor;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Add coin details if enabled
            if (detailsEnabled) {
                ctx.beginPath();
                ctx.arc(x, y, coinSize * 0.6, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        ctx.restore();
    },
    // Get a pulsing value based on timestamp
    getPulseValue(timestamp, speed = 1000, min = 0, max = 1) {
        return min + (Math.sin(timestamp / speed) * 0.5 + 0.5) * (max - min);
    },

    // Draw an electric arc between two points
    drawElectricArc(ctx, x1, y1, x2, y2, segments = 8, jitter = 5, color = '#ffffff', thickness = 2) {
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        // Create segments with random jitter for electric look
        const segmentLength = 1 / segments;
        for (let i = 1; i < segments; i++) {
            const t = i * segmentLength;
            // Interpolate position along the line
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            // Add random jitter perpendicular to the line
            const angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
            const jitterAmount = (Math.random() - 0.5) * jitter * 2;
            const jitterX = Math.cos(angle) * jitterAmount;
            const jitterY = Math.sin(angle) * jitterAmount;

            ctx.lineTo(x + jitterX, y + jitterY);
        }

        ctx.lineTo(x2, y2);
        ctx.stroke();
    },

    // Draw a leaf shape (used by themes like Aztec and Fantasy Forest)
    drawLeaf(ctx, x, y, color, timestamp) {
        ctx.save();

        // Rotate the leaf slightly based on time
        ctx.translate(x, y);
        ctx.rotate(Math.sin(timestamp / 3000) * 0.2);

        // Draw a simple leaf shape
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(5, -10, 15, -5, 0, 15);
        ctx.bezierCurveTo(-15, -5, -5, -10, 0, 0);
        ctx.fill();

        // Add vein to leaf
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 10);
        ctx.stroke();

        ctx.restore();
    }
};

// Reusable effect configurations that themes can import
export const EffectPresets = {
    // Modern neon look with bright colors
    neon: {
        enabled: true,
        intensity: 0.8,
        neonGlow: {
            enabled: true,
            color: '#00ffff',
            size: 12,
            pulseSpeed: 800,
            intensity: 0.9
        },
        electricEdges: {
            enabled: true,
            color: '#ffffff',
            arcs: 3,
            speed: 600,
            intensity: 0.7
        },
        reelMask: {
            enabled: true,
            borderWidth: 5,
            separatorWidth: 2,
            glowEffect: {
                enabled: true,
                color: '#00ffff',
                intensity: 0.9,
                size: 15
            },
            pulseEffect: {
                enabled: false,
                speed: 15000,
                minOpacity: 0.7,
                maxOpacity: 1.0
            },
            colorTransition: {
                enabled: false,
                colors: ['#FFD700', '#228B22', '#DAA520', '#006400', '#FFD700'],
                speed: 30000,
                mode: 'gradient'
            }
        },
        backgroundEffects: {
            enabled: true,
            particles: {
                enabled: true,
                count: 70,
                color: '#80ffff',
                size: { min: 1, max: 5 }
            },
            pulse: {
                enabled: true,
                color: '#001a3a',
                speed: 1500,
                intensity: 0.4
            }
        },
        reelEffects: {
            enabled: true,
            blurAmount: 6,
            lightTrails: false,
            spinningGlow: true,
            spinColor: '#00ccff'
        }
    },

    // Retro arcade style
    retro: {
        ...EffectDefaults,
        enabled: true,
        intensity: 0.7,
        neonGlow: {
            enabled: true,
            color: '#ff00ff',
            size: 8,
            pulseSpeed: 1200,
            intensity: 0.7
        },
        electricEdges: {
            enabled: false
        },
        reelMask: {
            enabled: true,
            borderWidth: 6,
            separatorWidth: 3,
            glowEffect: {
                enabled: true,
                color: '#ff00ff',
                intensity: 0.8,
                size: 12
            },
            pulseEffect: {
                enabled: true,
                speed: 1200,
                minOpacity: 0.5,
                maxOpacity: 1.0
            },
            colorTransition: {
                enabled: true,
                colors: ['#ff00ff', '#ff44aa', '#ff0044', '#aa00ff', '#ff00ff'],
                speed: 6000,
                mode: 'solid'
            }
        },
        backgroundEffects: {
            enabled: true,
            particles: {
                enabled: true,
                count: 30,
                color: '#ff44ff',
                size: { min: 2, max: 4 }
            },
            pulse: {
                enabled: true,
                color: '#1a0038',
                speed: 2000,
                intensity: 0.3
            }
        },
        reelEffects: {
            enabled: true,
            blurAmount: 4,
            lightTrails: false,
            spinningGlow: true,
            spinColor: '#ff00ff'
        }
    },

    // Electric energetic style
    electric: {
        ...EffectDefaults,
        enabled: true,
        intensity: 0.85,
        neonGlow: {
            enabled: true,
            color: '#ffff00',
            size: 10,
            pulseSpeed: 500,
            intensity: 0.8
        },
        electricEdges: {
            enabled: false,
            color: '#ffffff',
            arcs: 8,
            speed: 400,
            intensity: 0.9
        },
        reelMask: {
            enabled: true,
            borderWidth: 5,
            separatorWidth: 2,
            glowEffect: {
                enabled: true,
                color: '#ffff00',
                intensity: 0.9,
                size: 14
            },
            pulseEffect: {
                enabled: true,
                speed: 800,
                minOpacity: 0.6,
                maxOpacity: 1.0
            },
            colorTransition: {
                enabled: true,
                colors: ['#ffff00', '#ffaa00', '#ff5500', '#ffdd00', '#ffff00'],
                speed: 3000,
                mode: 'gradient'
            }
        },
        backgroundEffects: {
            enabled: true,
            particles: {
                enabled: true,
                count: 60,
                color: '#ffff80',
                size: { min: 1, max: 6 }
            },
            pulse: {
                enabled: true,
                color: '#1a1a00',
                speed: 1000,
                intensity: 0.5
            }
        },
        reelEffects: {
            enabled: true,
            blurAmount: 7,
            lightTrails: true,
            spinningGlow: true,
            spinColor: '#ffdd00'
        }
    },

    // Subtle professional style
    subtle: {
        ...EffectDefaults,
        enabled: true,
        intensity: 0.4,
        neonGlow: {
            enabled: true,
            color: '#4488ff',
            size: 6,
            pulseSpeed: 1500,
            intensity: 0.5
        },
        electricEdges: {
            enabled: false
        },
        reelMask: {
            enabled: true,
            borderWidth: 3,
            separatorWidth: 1,
            glowEffect: {
                enabled: true,
                color: '#4488ff',
                intensity: 0.6,
                size: 10
            },
            pulseEffect: {
                enabled: true,
                speed: 2000,
                minOpacity: 0.5,
                maxOpacity: 1.0
            },
            colorTransition: {
                enabled: true,
                colors: ['#4488ff', '#44aaff', '#44ccff', '#4488ff'],
                speed: 6000,
                mode: 'gradient'
            }
        },
        backgroundEffects: {
            enabled: true,
            particles: {
                enabled: true,
                count: 25,
                color: '#ffffff',
                size: { min: 1, max: 3 }
            },
            pulse: {
                enabled: true,
                color: '#101020',
                speed: 3000,
                intensity: 0.2
            }
        },
        reelEffects: {
            enabled: true,
            blurAmount: 3,
            lightTrails: false,
            spinningGlow: true,
            spinColor: '#4488ff'
        }
    },

    // No effects - classic clean look
    none: {
        ...EffectDefaults,
        enabled: false
    }
};
