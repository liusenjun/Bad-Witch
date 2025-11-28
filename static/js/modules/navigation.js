/**
 * Navigation Module - Page switching and navigation management
 * 
 * Handles routing between different pages/views in the application.
 * Also manages the active state of navigation buttons.
 */

const Navigation = {
    /**
     * Show a specific page and hide others
     * @param {string} pageId - The page identifier (upload, naming, summon, reveal, forest, cabin, leaderboard)
     */
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Show target page
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }

        // Update navigation button active state
        this.updateNavActiveState(pageId);

        // Load data for specific pages
        this.loadPageData(pageId);
    },

    /**
     * Update navigation button highlight
     * @param {string} activePageId - Current active page ID
     */
    updateNavActiveState(activePageId) {
        // Remove active class from all nav buttons
        document.querySelectorAll('[id^="nav-"]').forEach(btn => {
            btn.classList.remove('text-yellow-400');
        });
        
        // Add active class to current nav button
        const activeNavBtn = document.getElementById(`nav-${activePageId}`);
        if (activeNavBtn) {
            activeNavBtn.classList.add('text-yellow-400');
        }
    },

    /**
     * Load data for pages that need it
     * @param {string} pageId - Page identifier
     */
    loadPageData(pageId) {
        switch (pageId) {
            case 'forest':
                if (typeof Forest !== 'undefined') Forest.load();
                break;
            case 'cabin':
                if (typeof Cabin !== 'undefined') Cabin.load();
                break;
            case 'leaderboard':
                if (typeof Leaderboard !== 'undefined') Leaderboard.load();
                break;
        }
    },

    /**
     * Initialize navigation event listeners
     */
    init() {
        // Navigation buttons are handled inline in HTML with onclick
        // This method can be extended for additional setup
        console.log('Navigation module initialized');
    }
};

// Global function for inline onclick handlers
function showPage(pageId) {
    Navigation.showPage(pageId);
}

// Export for use in other modules
window.Navigation = Navigation;
window.showPage = showPage;
