/**
 * Image Generator Module - AI image generation and processing
 * 
 * Handles:
 * - Generating familiar images via API
 * - Background removal
 * - Preparing temporary familiar data
 */

const ImageGenerator = {
    /**
     * Generate familiar image
     * @param {string} species - Species of the familiar
     * @param {string} description - Description for generation
     */
    async generate(species, description) {
        try {
            // Call API to generate image
            const data = await API.generateImage(species, description);
            
            // Remove white background from generated image
            const processedUrl = await this.removeBackground(data.imageUrl);
            AppState.generatedImageUrl = processedUrl;

            // Prepare temporary familiar object
            AppState.tempFamiliar = {
                animal_name: AppState.chosenName,
                original_item_name: AppState.analysis?.originalItem || 'Unknown',
                animal_species: AppState.analysis?.species || 'Unknown',
                original_image: AppState.originalImageUrl || '',
                generated_image: processedUrl
            };

        } catch (error) {
            console.error('Image generation error:', error);
            
            // Fallback to placeholder image
            const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(species)}/512/512`;
            AppState.generatedImageUrl = fallbackUrl;
            
            AppState.tempFamiliar = {
                animal_name: AppState.chosenName,
                original_item_name: AppState.analysis?.originalItem || 'Unknown',
                animal_species: AppState.analysis?.species || 'Unknown',
                original_image: AppState.originalImageUrl || '',
                generated_image: fallbackUrl
            };
        }
    },

    /**
     * Remove white background from image
     * @param {string} imageUrl - URL of image to process
     * @returns {Promise<string>} Processed image URL
     */
    async removeBackground(imageUrl) {
        try {
            const data = await API.removeBackground(imageUrl, 235, 35);
            return data.imageUrl || imageUrl;
        } catch (error) {
            console.error('Background removal error:', error);
            return imageUrl; // Return original if processing fails
        }
    }
};

// Export for use in other modules
window.ImageGenerator = ImageGenerator;
