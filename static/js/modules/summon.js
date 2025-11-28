/**
 * Summon Module - Voice summoning functionality
 * 
 * Handles:
 * - Microphone access
 * - Audio level visualization
 * - Voice detection trigger
 */

const Summon = {
    // Audio context and related objects
    audioCtx: null,
    analyser: null,
    rafId: null,

    // DOM elements
    elements: {
        summonStart: null,
        summonListening: null,
        volumeBar: null
    },

    /**
     * Initialize summon module
     */
    init() {
        this.cacheElements();
        console.log('Summon module initialized');
    },

    /**
     * Cache DOM element references
     */
    cacheElements() {
        this.elements = {
            summonStart: document.getElementById('summon-start'),
            summonListening: document.getElementById('summon-listening'),
            volumeBar: document.getElementById('volume-bar')
        };
    },

    /**
     * Start listening for voice input
     */
    async startListening() {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Set up audio context
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioCtx.createAnalyser();
            const source = this.audioCtx.createMediaStreamSource(stream);
            source.connect(this.analyser);
            this.analyser.fftSize = 256;

            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            // Update UI
            const { summonStart, summonListening } = this.elements;
            summonStart?.classList.add('hidden');
            summonListening?.classList.remove('hidden');

            // Start volume monitoring
            const checkVolume = () => {
                this.analyser.getByteFrequencyData(dataArray);
                
                // Calculate average volume
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const avg = sum / bufferLength;
                const normalized = Math.min(avg * 2, 100);
                
                // Update volume bar
                if (this.elements.volumeBar) {
                    this.elements.volumeBar.style.width = normalized + '%';
                }

                // Trigger summon if volume threshold reached
                if (normalized > 80) {
                    this.stopListening();
                    this.completeSummon();
                } else {
                    this.rafId = requestAnimationFrame(checkVolume);
                }
            };
            
            this.rafId = requestAnimationFrame(checkVolume);

        } catch (error) {
            console.error('Microphone error:', error);
            alert('Microphone access denied. You can skip the ritual.');
        }
    },

    /**
     * Stop listening and clean up audio resources
     */
    stopListening() {
        if (this.audioCtx) {
            this.audioCtx.close();
            this.audioCtx = null;
        }
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        // Reset UI
        const { summonStart, summonListening } = this.elements;
        summonStart?.classList.remove('hidden');
        summonListening?.classList.add('hidden');
    },

    /**
     * Skip the voice summon ritual
     */
    skip() {
        this.stopListening();
        this.completeSummon();
    },

    /**
     * Complete the summon and proceed to reveal
     */
    completeSummon() {
        Reveal.show();
    }
};

// Global functions for inline onclick handlers
function startListening() {
    Summon.startListening();
}

function skipSummon() {
    Summon.skip();
}

// Export for use in other modules
window.Summon = Summon;
window.startListening = startListening;
window.skipSummon = skipSummon;
