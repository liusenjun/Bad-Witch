/**
 * Forest Module - Forest view with flying familiars
 * 
 * Handles:
 * - Loading and displaying familiars in forest lanes
 * - Hover information cards
 * - Like/dislike interactions
 */

const Forest = {
    // DOM elements
    elements: {
        forestLanes: null
    },

    /**
     * Initialize forest module
     */
    init() {
        this.cacheElements();
        console.log('Forest module initialized');
    },

    /**
     * Cache DOM element references
     */
    cacheElements() {
        this.elements = {
            forestLanes: document.getElementById('forest-lanes')
        };
    },

    /**
     * Load and display familiars in the forest
     */
    async load() {
        try {
            const familiars = await API.getForestFamiliars();
            this.render(familiars);
        } catch (error) {
            console.error('Load forest error:', error);
        }
    },

    /**
     * Render familiars in forest lanes
     * @param {Array} familiars - Array of familiar objects
     */
    render(familiars) {
        const { forestLanes } = this.elements;
        if (!forestLanes) return;

        forestLanes.innerHTML = '';

        // Create 5 lanes
        for (let lane = 0; lane < 5; lane++) {
            const laneDiv = document.createElement('div');
            laneDiv.className = 'w-full h-24 relative border-b border-white/5';

            // Filter familiars for this lane
            const laneFamiliars = familiars.filter(f => (f.lane || 0) === lane);

            laneFamiliars.forEach(f => {
                const container = this.createFamiliarElement(f);
                laneDiv.appendChild(container);
            });

            forestLanes.appendChild(laneDiv);
        }
    },

    /**
     * Create a familiar element for the forest
     * @param {object} f - Familiar data
     * @returns {HTMLElement}
     */
    createFamiliarElement(f) {
        const container = document.createElement('div');
        container.className = 'absolute top-2 animate-fly group cursor-pointer';
        container.style.animationDuration = `${f.speed || 15}s`;
        container.style.animationDelay = `-${(f.id.charCodeAt(0) % 10) * 2}s`;

        // Extract data with fallbacks for backward compatibility
        const data = this.extractFamiliarData(f);

        container.innerHTML = `
            <div class="relative w-32 h-24">
                <img src="/static/images/broom.png" class="absolute bottom-0 left-0 w-35 h-15 object-contain transform -rotate-6 translate-y-2 opacity-90" alt="broom" />
                <img src="${data.generatedImg}" class="absolute top-0 left-4 w-20 h-20 object-contain drop-shadow-xl transform group-hover:scale-180 transition-transform" alt="${data.animalName}" />
                ${this.createHoverCard(f, data)}
            </div>
        `;

        return container;
    },

    /**
     * Extract familiar data with fallbacks
     * @param {object} f - Familiar object
     * @returns {object} Normalized data
     */
    extractFamiliarData(f) {
        return {
            generatedImg: f.generated_image || f.imageUrl || '',
            originalImg: f.original_image || f.generated_image || f.imageUrl || '',
            animalName: f.animal_name || f.name || 'Unknown',
            animalSpecies: f.animal_species || f.animalSpecies || 'Unknown Species',
            originalItemName: f.original_item_name || f.originalItemName || 'Unknown',
            magicPower: f.magic_power ?? f.magicPoints ?? 0,
            likes: f.likes || 0,
            dislikes: f.dislikes || 0
        };
    },

    /**
     * Create hover information card HTML
     * @param {object} f - Familiar object
     * @param {object} data - Extracted data
     * @returns {string} HTML string
     */
    createHoverCard(f, data) {
        return `
            <div class="absolute -top-48 left-1/2 -translate-x-1/2 w-60 bg-black/95 p-4 rounded-xl border-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto shadow-2xl">
                <div class="flex gap-3 mb-3">
                    <img src="${data.originalImg}" class="w-16 h-16 object-cover rounded-lg border border-gray-600" alt="Item" />
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-yellow-400">${data.animalName}</h3>
                        <p class="text-xs text-purple-300">${data.animalSpecies}</p>
                        <p class="text-xs text-gray-400 italic">Ex-${data.originalItemName}</p>
                    </div>
                </div>
                <div class="flex justify-between items-center bg-purple-900/50 p-2 rounded-lg mb-2">
                    <span class="text-sm font-mono text-yellow-300">✨ MP: ${data.magicPower}</span>
                    <div class="text-xs text-gray-400">
                        <span class="text-green-400">👍 ${data.likes}</span> / <span class="text-red-400">👎 ${data.dislikes}</span>
                    </div>
                </div>
                <div class="flex gap-2 justify-center">
                    <button onclick="Forest.like('${f.id}', 1)" class="px-4 py-1.5 bg-green-600/50 hover:bg-green-500 rounded text-white text-sm transition-colors flex items-center gap-1">👍 Like</button>
                    <button onclick="Forest.like('${f.id}', -1)" class="px-4 py-1.5 bg-red-600/50 hover:bg-red-500 rounded text-white text-sm transition-colors flex items-center gap-1">👎 Dislike</button>
                </div>
            </div>
        `;
    },

    /**
     * Like or dislike a familiar
     * @param {string} id - Familiar ID
     * @param {number} value - 1 for like, -1 for dislike
     */
    async like(id, value) {
        event?.stopPropagation();
        try {
            await API.likeFamiliar(id, value);
            this.load(); // Reload forest
        } catch (error) {
            console.error('Like error:', error);
        }
    }
};

// Global function for backward compatibility
function likeFamiliar(id, value) {
    Forest.like(id, value);
}

// Export for use in other modules
window.Forest = Forest;
window.likeFamiliar = likeFamiliar;
