/**
 * Cabin Module - Personal familiar collection management
 * 
 * Handles:
 * - Loading user's familiars
 * - Displaying familiars in cabin positions
 * - Familiar management (rename, delete, set main)
 */

const Cabin = {
    // DOM elements
    elements: {
        cabinFamiliars: null,
        cabinEmpty: null
    },

    // Predefined positions for familiars in the cabin
    positions: [
        { top: '60%', left: '20%' },
        { top: '65%', left: '50%' },
        { top: '55%', left: '80%' },
        { top: '35%', left: '15%' },
        { top: '30%', left: '85%' },
        { top: '45%', left: '10%' },
        { top: '80%', left: '40%' }
    ],

    /**
     * Initialize cabin module
     */
    init() {
        this.cacheElements();
        console.log('Cabin module initialized');
    },

    /**
     * Cache DOM element references
     */
    cacheElements() {
        this.elements = {
            cabinFamiliars: document.getElementById('cabin-familiars'),
            cabinEmpty: document.getElementById('cabin-empty')
        };
    },

    /**
     * Load and display user's familiars
     */
    async load() {
        try {
            const familiars = await API.getUserFamiliars();
            this.render(familiars);
        } catch (error) {
            console.error('Load cabin error:', error);
        }
    },

    /**
     * Render familiars in the cabin
     * @param {Array} familiars - Array of user's familiars
     */
    render(familiars) {
        const { cabinFamiliars, cabinEmpty } = this.elements;
        if (!cabinFamiliars) return;

        cabinFamiliars.innerHTML = '';

        // Show empty message if no familiars
        if (!familiars || familiars.length === 0) {
            cabinEmpty?.classList.remove('hidden');
            return;
        }
        cabinEmpty?.classList.add('hidden');

        // Render each familiar
        familiars.forEach((f, i) => {
            const element = this.createFamiliarElement(f, i);
            cabinFamiliars.appendChild(element);
        });
    },

    /**
     * Create a familiar element for the cabin
     * @param {object} f - Familiar data
     * @param {number} index - Position index
     * @returns {HTMLElement}
     */
    createFamiliarElement(f, index) {
        const pos = this.positions[index % this.positions.length];
        const div = document.createElement('div');
        div.className = 'absolute transition-all duration-500 ease-in-out cursor-pointer z-10';
        div.style.top = pos.top;
        div.style.left = pos.left;

        // Extract data with fallbacks
        const generatedImg = f.generated_image || f.imageUrl || '';
        const animalName = f.animal_name || f.name || 'Unknown';
        const isMain = f.is_main || f.isMain || false;

        div.innerHTML = `
            <div class="relative ${isMain ? 'ring-4 ring-yellow-400 rounded-full shadow-[0_0_20px_gold]' : ''}">
                <img src="${generatedImg}" class="w-24 h-24 object-contain drop-shadow-2xl hover:scale-110 transition-transform" alt="${animalName}" />
                ${isMain ? '<i class="fas fa-crown absolute -top-6 -right-2 text-yellow-400 text-2xl animate-bounce"></i>' : ''}
            </div>
        `;
        
        div.onclick = () => this.showMenu(f);
        return div;
    },

    /**
     * Show management menu for a familiar
     * @param {object} familiar - Familiar data
     */
    showMenu(familiar) {
        const animalName = familiar.animal_name || familiar.name || 'Unknown';
        const magicPower = familiar.magic_power ?? familiar.magicPoints ?? 0;
        
        const action = prompt(
            `${animalName} (${magicPower} MP)\n\nOptions:\n1. Type new name to rename\n2. Type "DELETE" to release\n3. Type "MAIN" to set as main\n4. Cancel to close`,
            animalName
        );

        if (action === null) return;

        if (action.toUpperCase() === 'DELETE') {
            this.deleteFamiliar(familiar.id);
        } else if (action.toUpperCase() === 'MAIN') {
            this.setMainFamiliar(familiar.id);
        } else if (action && action !== animalName) {
            this.renameFamiliar(familiar.id, action);
        }
    },

    /**
     * Delete a familiar
     * @param {string} id - Familiar ID
     */
    async deleteFamiliar(id) {
        if (confirm('Release back to the wild? (Delete)')) {
            try {
                await API.deleteFamiliar(id);
                this.load();
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    },

    /**
     * Set a familiar as main
     * @param {string} id - Familiar ID
     */
    async setMainFamiliar(id) {
        try {
            await API.setMainFamiliar(id);
            this.load();
        } catch (error) {
            console.error('Set main error:', error);
        }
    },

    /**
     * Rename a familiar
     * @param {string} id - Familiar ID
     * @param {string} newName - New name
     */
    async renameFamiliar(id, newName) {
        try {
            await API.updateFamiliar(id, { animal_name: newName });
            this.load();
        } catch (error) {
            console.error('Rename error:', error);
        }
    }
};

// Global function for backward compatibility
function showCabinMenu(familiar) {
    Cabin.showMenu(familiar);
}

// Export for use in other modules
window.Cabin = Cabin;
window.showCabinMenu = showCabinMenu;
