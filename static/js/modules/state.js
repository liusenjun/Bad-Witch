/**
 * State Module - Global application state management
 * 
 * Manages all shared state across the application including:
 * - Analysis results from AI
 * - User selections (chosen name)
 * - Generated images
 * - Temporary familiar data before saving
 */

const AppState = {
    // AI analysis results
    analysis: null,
    
    // User's chosen name for the familiar
    chosenName: null,
    
    // Generated familiar image URL (with background removed)
    generatedImageUrl: null,
    
    // Original uploaded image URL
    originalImageUrl: null,
    
    // Temporary familiar object before releasing to forest
    tempFamiliar: null,
    
    /**
     * Reset all state to initial values
     */
    reset() {
        this.analysis = null;
        this.chosenName = null;
        this.generatedImageUrl = null;
        this.originalImageUrl = null;
        this.tempFamiliar = null;
    },
    
    /**
     * Check if familiar is ready to be released
     * @returns {boolean}
     */
    isFamiliarReady() {
        return this.generatedImageUrl !== null && this.tempFamiliar !== null;
    }
};

// Export for use in other modules
window.AppState = AppState;
