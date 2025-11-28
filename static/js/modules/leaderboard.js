/**
 * Leaderboard Module - Rankings display
 * 
 * Handles:
 * - Loading leaderboard data
 * - Rendering rankings table
 */

const Leaderboard = {
    // DOM elements
    elements: {
        leaderboardBody: null
    },

    /**
     * Initialize leaderboard module
     */
    init() {
        this.cacheElements();
        console.log('Leaderboard module initialized');
    },

    /**
     * Cache DOM element references
     */
    cacheElements() {
        this.elements = {
            leaderboardBody: document.getElementById('leaderboard-body')
        };
    },

    /**
     * Load and display leaderboard
     */
    async load() {
        try {
            const familiars = await API.getLeaderboard();
            this.render(familiars);
        } catch (error) {
            console.error('Load leaderboard error:', error);
        }
    },

    /**
     * Render leaderboard table
     * @param {Array} familiars - Sorted array of familiars
     */
    render(familiars) {
        const { leaderboardBody } = this.elements;
        if (!leaderboardBody) return;

        leaderboardBody.innerHTML = '';

        familiars.forEach((f, idx) => {
            const row = this.createRow(f, idx);
            leaderboardBody.appendChild(row);
        });
    },

    /**
     * Create a leaderboard row
     * @param {object} f - Familiar data
     * @param {number} idx - Ranking index (0-based)
     * @returns {HTMLElement}
     */
    createRow(f, idx) {
        // Extract data with fallbacks
        const generatedImg = f.generated_image || f.imageUrl || '';
        const animalName = f.animal_name || f.name || 'Unknown';
        const animalSpecies = f.animal_species || f.animalSpecies || 'Unknown';
        const userId = f.user_id || f.ownerId || '';
        const magicPower = f.magic_power ?? f.magicPoints ?? 0;
        const likes = f.likes || 0;
        const dislikes = f.dislikes || 0;

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-purple-800/30 transition-colors';
        
        tr.innerHTML = `
            <td class="p-4 font-bold text-2xl text-purple-400 opacity-50">#${idx + 1}</td>
            <td class="p-4">
                <img src="${generatedImg}" class="w-12 h-12 rounded-full bg-black/20 object-contain" alt="${animalName}" />
            </td>
            <td class="p-4 font-bold text-white">
                ${animalName}
                <span class="text-xs font-normal text-gray-400 block">${animalSpecies}</span>
            </td>
            <td class="p-4 text-purple-300 text-sm">
                ${userId === 'local_user' ? '(You)' : 'Witch Circle'}
            </td>
            <td class="p-4 text-center">
                <span class="text-green-400">👍${likes}</span> / <span class="text-red-400">👎${dislikes}</span>
            </td>
            <td class="p-4 text-right font-mono text-yellow-400">${magicPower}</td>
        `;

        return tr;
    }
};

// Export for use in other modules
window.Leaderboard = Leaderboard;
