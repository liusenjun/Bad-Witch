/**
 * Upload Module - File upload and image analysis
 * 
 * Handles:
 * - Drag and drop file upload
 * - File input change events
 * - Image analysis via API
 * - Name selection UI generation
 */

const Upload = {
    // DOM element references
    elements: {
        fileInput: null,
        uploadZone: null,
        namingLoading: null,
        namingResult: null,
        originalItem: null,
        species: null,
        nameOptions: null
    },

    /**
     * Initialize upload module
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        console.log('Upload module initialized');
    },

    /**
     * Cache DOM element references
     */
    cacheElements() {
        this.elements = {
            fileInput: document.getElementById('file-input'),
            uploadZone: document.getElementById('upload-zone'),
            namingLoading: document.getElementById('naming-loading'),
            namingResult: document.getElementById('naming-result'),
            originalItem: document.getElementById('original-item'),
            species: document.getElementById('species'),
            nameOptions: document.getElementById('name-options')
        };
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        const { fileInput, uploadZone } = this.elements;

        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files?.[0]) {
                    this.handleFile(e.target.files[0]);
                }
            });
        }

        // Drag and drop
        if (uploadZone) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('border-purple-400', 'bg-purple-900/40');
            });

            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('border-purple-400', 'bg-purple-900/40');
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('border-purple-400', 'bg-purple-900/40');
                if (e.dataTransfer.files?.[0]) {
                    this.handleFile(e.dataTransfer.files[0]);
                }
            });
        }
    },

    /**
     * Handle uploaded file
     * @param {File} file - The uploaded image file
     */
    async handleFile(file) {
        // Validate file type
        if (!file.type.match(/image\/(jpeg|png)/)) {
            alert('Please upload a JPG or PNG image');
            return;
        }

        const { namingLoading, namingResult } = this.elements;

        // Show loading state
        namingLoading?.classList.remove('hidden');
        namingResult?.classList.add('hidden');
        Navigation.showPage('naming');

        try {
            // Save original image as base64
            this.saveOriginalImage(file);

            // Analyze image via API
            const data = await API.analyzeImage(file);
            
            // Store analysis in state
            AppState.analysis = data;

            // Update UI with results
            this.displayAnalysisResults(data);

        } catch (error) {
            console.error('Analysis error:', error);
            alert('The spirits are confused. Try another image.');
            Navigation.showPage('upload');
        }
    },

    /**
     * Save original image to state as base64
     * @param {File} file - The uploaded file
     */
    saveOriginalImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            AppState.originalImageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    /**
     * Display analysis results in UI
     * @param {object} data - Analysis results from API
     */
    displayAnalysisResults(data) {
        const { namingLoading, namingResult, originalItem, species, nameOptions } = this.elements;

        // Update text content
        if (originalItem) originalItem.textContent = data.originalItem || 'Mystery Object';
        if (species) species.textContent = data.species || 'Unknown Creature';

        // Build name selection buttons
        if (nameOptions) {
            nameOptions.innerHTML = '';
            const names = data.suggestedNames || ['Spirit', 'Shadow', 'Whisper'];
            
            names.forEach(name => {
                const btn = document.createElement('button');
                btn.className = 'p-6 bg-purple-900/50 border-2 border-purple-500/50 rounded-xl hover:bg-purple-800 hover:border-yellow-400 hover:scale-105 transition-all group';
                btn.innerHTML = `
                    <span class="text-2xl font-magic text-white block mb-2">${name}</span>
                    <span class="text-xs text-purple-400 uppercase tracking-widest opacity-0 group-hover:opacity-100">Select</span>
                `;
                btn.onclick = () => this.selectName(name);
                nameOptions.appendChild(btn);
            });
        }

        // Show results, hide loading
        namingLoading?.classList.add('hidden');
        namingResult?.classList.remove('hidden');
    },

    /**
     * Handle name selection
     * @param {string} name - Selected name
     */
    selectName(name) {
        AppState.chosenName = name;
        
        // Update summon page with chosen name
        const summonName = document.getElementById('summon-name');
        if (summonName) summonName.textContent = name;
        
        Navigation.showPage('summon');

        // Start generating image in background
        if (AppState.analysis) {
            ImageGenerator.generate(AppState.analysis.species, AppState.analysis.description);
        }
    }
};

// Global function for external calls
function selectName(name) {
    Upload.selectName(name);
}

// Export for use in other modules
window.Upload = Upload;
window.selectName = selectName;
