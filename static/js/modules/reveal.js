/**
 * Reveal Module - Familiar reveal and release functionality
 * 
 * Handles:
 * - Displaying the generated familiar
 * - Polling for image completion
 * - Releasing familiar to forest
 */

const Reveal = {
    // DOM elements
    elements: {
        revealLoading: null,
        revealImage: null,
        revealName: null,
        revealSpecies: null,
        revealOrigin: null,
        revealActions: null,
        downloadLink: null
    },

    /**
     * Initialize reveal module
     */
    init() {
        this.cacheElements();
        console.log('Reveal module initialized');
    },

    /**
     * Cache DOM element references
     */
    cacheElements() {
        this.elements = {
            revealLoading: document.getElementById('reveal-loading'),
            revealImage: document.getElementById('reveal-image'),
            revealName: document.getElementById('reveal-name'),
            revealSpecies: document.getElementById('reveal-species'),
            revealOrigin: document.getElementById('reveal-origin'),
            revealActions: document.getElementById('reveal-actions'),
            downloadLink: document.getElementById('download-link')
        };
    },

    /**
     * Show the reveal page with familiar details
     */
    show() {
        Navigation.showPage('reveal');

        const { 
            revealLoading, revealImage, revealName, 
            revealSpecies, revealOrigin, revealActions, downloadLink 
        } = this.elements;

        // Check if familiar is ready
        if (AppState.generatedImageUrl && AppState.tempFamiliar) {
            // Hide loading, show content
            revealLoading?.classList.add('hidden');
            
            if (revealImage) {
                revealImage.src = AppState.generatedImageUrl;
                revealImage.classList.remove('hidden');
            }
            
            if (revealName) revealName.textContent = AppState.tempFamiliar.animal_name;
            if (revealSpecies) revealSpecies.textContent = AppState.tempFamiliar.animal_species;
            if (revealOrigin) revealOrigin.textContent = 'Formed from: ' + AppState.tempFamiliar.original_item_name;
            if (downloadLink) downloadLink.href = AppState.generatedImageUrl;
            
            revealActions?.classList.remove('hidden');
        } else {
            // Show loading, hide content
            revealLoading?.classList.remove('hidden');
            revealImage?.classList.add('hidden');
            revealActions?.classList.add('hidden');
            
            // Poll until image is ready
            setTimeout(() => this.show(), 500);
        }
    },

    /**
     * Release the familiar to the forest
     */
    async releaseToForest() {
        if (!AppState.tempFamiliar) {
            alert('No familiar ready');
            return;
        }

        try {
            await API.saveFamiliar(AppState.tempFamiliar);

            // Reset state and navigate to forest
            AppState.reset();
            Navigation.showPage('forest');

        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to release familiar');
        }
    }
};

// Global function for inline onclick handlers
function releaseToForest() {
    Reveal.releaseToForest();
}

// Export for use in other modules
window.Reveal = Reveal;
window.releaseToForest = releaseToForest;
