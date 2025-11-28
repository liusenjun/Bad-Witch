/**
 * API Module - Centralized API communication
 * 
 * Handles all HTTP requests to the backend server.
 * Provides a clean interface for CRUD operations on familiars
 * and AI-related endpoints.
 */

const API = {
    /**
     * Base fetch wrapper with error handling
     * @param {string} url - API endpoint
     * @param {object} options - Fetch options
     * @returns {Promise<any>}
     */
    async request(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error [${url}]:`, error);
            throw error;
        }
    },

    // ============ Analysis & Generation ============
    
    /**
     * Analyze an uploaded image
     * @param {File} imageFile - The image file to analyze
     * @returns {Promise<{originalItem: string, species: string, suggestedNames: string[], description: string}>}
     */
    async analyzeImage(imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        return this.request('/api/analyze', { method: 'POST', body: formData });
    },

    /**
     * Generate a familiar image
     * @param {string} species - The species of familiar
     * @param {string} description - Description for image generation
     * @returns {Promise<{imageUrl: string}>}
     */
    async generateImage(species, description) {
        return this.request('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ species, description })
        });
    },

    /**
     * Remove white background from image
     * @param {string} imageUrl - URL of image to process
     * @param {number} threshold - Brightness threshold (default: 235)
     * @param {number} tolerance - Color tolerance (default: 35)
     * @returns {Promise<{imageUrl: string}>}
     */
    async removeBackground(imageUrl, threshold = 235, tolerance = 35) {
        return this.request('/api/remove-background', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl, threshold, tolerance })
        });
    },

    // ============ Familiar CRUD ============
    
    /**
     * Get all familiars
     * @returns {Promise<Array>}
     */
    async getAllFamiliars() {
        return this.request('/api/familiars');
    },

    /**
     * Get familiars for forest view
     * @returns {Promise<Array>}
     */
    async getForestFamiliars() {
        return this.request('/api/familiars/forest');
    },

    /**
     * Get current user's familiars
     * @returns {Promise<Array>}
     */
    async getUserFamiliars() {
        return this.request('/api/familiars/user');
    },

    /**
     * Get leaderboard rankings
     * @returns {Promise<Array>}
     */
    async getLeaderboard() {
        return this.request('/api/familiars/leaderboard');
    },

    /**
     * Save a new familiar
     * @param {object} familiar - Familiar data to save
     * @returns {Promise<{success: boolean, familiar: object}>}
     */
    async saveFamiliar(familiar) {
        return this.request('/api/familiars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(familiar)
        });
    },

    /**
     * Update a familiar
     * @param {string} id - Familiar ID
     * @param {object} updates - Fields to update
     * @returns {Promise<{success: boolean}>}
     */
    async updateFamiliar(id, updates) {
        return this.request(`/api/familiars/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
    },

    /**
     * Delete a familiar
     * @param {string} id - Familiar ID
     * @returns {Promise<{success: boolean}>}
     */
    async deleteFamiliar(id) {
        return this.request(`/api/familiars/${id}`, { method: 'DELETE' });
    },

    /**
     * Like or dislike a familiar
     * @param {string} id - Familiar ID
     * @param {number} value - 1 for like, -1 for dislike
     * @returns {Promise<{success: boolean, likes: number, dislikes: number, magic_power: number}>}
     */
    async likeFamiliar(id, value) {
        return this.request(`/api/familiars/${id}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value })
        });
    },

    /**
     * Set a familiar as the main one
     * @param {string} id - Familiar ID
     * @returns {Promise<{success: boolean}>}
     */
    async setMainFamiliar(id) {
        return this.request(`/api/familiars/${id}/set-main`, { method: 'POST' });
    }
};

// Export for use in other modules
window.API = API;
