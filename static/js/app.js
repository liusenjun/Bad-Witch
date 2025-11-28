/**
 * Main Entry Point - Application initialization
 * 
 * This file imports all modules and initializes the application.
 * It serves as the single entry point that coordinates all functionality.
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧙‍♀️ Witch\'s Familiar Workshop initializing...');
    
    // Initialize all modules
    initializeModules();
    
    // Show initial page
    Navigation.showPage('upload');
    
    console.log('✨ Application ready!');
});

/**
 * Initialize all application modules
 */
function initializeModules() {
    // Core modules
    Navigation.init();
    
    // Upload flow modules
    Upload.init();
    Summon.init();
    Reveal.init();
    
    // Page modules
    Forest.init();
    Cabin.init();
    Leaderboard.init();
}

// ============ Global Error Handler ============
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Application error:', { message, source, lineno, colno, error });
    return false;
};

// ============ Expose modules globally for debugging ============
window.App = {
    State: AppState,
    API: API,
    Navigation: Navigation,
    Upload: Upload,
    Summon: Summon,
    Reveal: Reveal,
    Forest: Forest,
    Cabin: Cabin,
    Leaderboard: Leaderboard,
    ImageGenerator: ImageGenerator
};
