// Witch's Familiar Workshop - Client-side JavaScript

// DOM Elements
const $ = id => document.getElementById(id);

const el = {
    fileInput: $('file-input'),
    uploadZone: $('upload-zone'),
    namingLoading: $('naming-loading'),
    namingResult: $('naming-result'),
    originalItem: $('original-item'),
    species: $('species'),
    nameOptions: $('name-options'),
    summonName: $('summon-name'),
    summonStart: $('summon-start'),
    summonListening: $('summon-listening'),
    volumeBar: $('volume-bar'),
    revealLoading: $('reveal-loading'),
    revealImage: $('reveal-image'),
    revealName: $('reveal-name'),
    revealSpecies: $('reveal-species'),
    revealOrigin: $('reveal-origin'),
    revealActions: $('reveal-actions'),
    downloadLink: $('download-link'),
    forestLanes: $('forest-lanes'),
    cabinFamiliars: $('cabin-familiars'),
    cabinEmpty: $('cabin-empty'),
    leaderboardBody: $('leaderboard-body')
};

// State
let state = {
    analysis: null,
    chosenName: null,
    generatedImageUrl: null,
    originalImageUrl: null,  // 原图片URL
    tempFamiliar: null
};

// Audio context for voice summon
let audioCtx = null, analyser = null, rafId = null;

// ============ Navigation ============
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const page = $(`page-${pageId}`);
    if (page) page.classList.remove('hidden');

    // Update nav active state
    document.querySelectorAll('[id^="nav-"]').forEach(btn => btn.classList.remove('text-yellow-400'));
    const navBtn = $(`nav-${pageId}`);
    if (navBtn) navBtn.classList.add('text-yellow-400');

    // Load data for specific pages
    if (pageId === 'forest') loadForest();
    if (pageId === 'cabin') loadCabin();
    if (pageId === 'leaderboard') loadLeaderboard();
}

// ============ File Upload ============
el.fileInput.addEventListener('change', e => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
});

el.uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    el.uploadZone.classList.add('border-purple-400', 'bg-purple-900/40');
});

el.uploadZone.addEventListener('dragleave', e => {
    el.uploadZone.classList.remove('border-purple-400', 'bg-purple-900/40');
});

el.uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    el.uploadZone.classList.remove('border-purple-400', 'bg-purple-900/40');
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
});

async function handleFile(file) {
    if (!file.type.match(/image\/(jpeg|png)/)) {
        alert('Please upload a JPG or PNG image');
        return;
    }

    // Show loading
    el.namingLoading.classList.remove('hidden');
    el.namingResult.classList.add('hidden');
    showPage('naming');

    try {
        // Save original image as base64
        const reader = new FileReader();
        reader.onload = (e) => {
            state.originalImageUrl = e.target.result;  // Save original image
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('/api/analyze', { method: 'POST', body: formData });
        const data = await res.json();

        state.analysis = data;
        el.originalItem.textContent = data.originalItem || 'Mystery Object';
        el.species.textContent = data.species || 'Unknown Creature';

        // Build name buttons
        el.nameOptions.innerHTML = '';
        (data.suggestedNames || ['Spirit', 'Shadow', 'Whisper']).forEach(name => {
            const btn = document.createElement('button');
            btn.className = 'p-6 bg-purple-900/50 border-2 border-purple-500/50 rounded-xl hover:bg-purple-800 hover:border-yellow-400 hover:scale-105 transition-all group';
            btn.innerHTML = `<span class="text-2xl font-magic text-white block mb-2">${name}</span><span class="text-xs text-purple-400 uppercase tracking-widest opacity-0 group-hover:opacity-100">Select</span>`;
            btn.onclick = () => selectName(name);
            el.nameOptions.appendChild(btn);
        });

        el.namingLoading.classList.add('hidden');
        el.namingResult.classList.remove('hidden');
    } catch (err) {
        console.error('Analysis error:', err);
        alert('The spirits are confused. Try another image.');
        showPage('upload');
    }
}

// ============ Name Selection ============
function selectName(name) {
    state.chosenName = name;
    el.summonName.textContent = name;
    showPage('summon');

    // Start generating image in background
    if (state.analysis) {
        generateImage(state.analysis.species, state.analysis.description);
    }
}

async function generateImage(species, description) {
    try {
        const res = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ species, description })
        });
        const data = await res.json();
        
        // Remove white background from generated image
        const processedUrl = await removeBackground(data.imageUrl);
        state.generatedImageUrl = processedUrl;

        // Prepare temp familiar with new data model
        state.tempFamiliar = {
            animal_name: state.chosenName,
            original_item_name: state.analysis?.originalItem || 'Unknown',
            animal_species: state.analysis?.species || 'Unknown',
            original_image: state.originalImageUrl || '',
            generated_image: processedUrl
        };
    } catch (err) {
        console.error('Image generation error:', err);
        state.generatedImageUrl = `https://picsum.photos/seed/${encodeURIComponent(species)}/512/512`;
        state.tempFamiliar = {
            animal_name: state.chosenName,
            original_item_name: state.analysis?.originalItem || 'Unknown',
            animal_species: state.analysis?.species || 'Unknown',
            original_image: state.originalImageUrl || '',
            generated_image: state.generatedImageUrl
        };
    }
}

// Remove white background from image
async function removeBackground(imageUrl) {
    try {
        const res = await fetch('/api/remove-background', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                imageUrl: imageUrl,
                threshold: 235,  // Brightness threshold (lower = more aggressive)
                tolerance: 35    // Color tolerance
            })
        });
        const data = await res.json();
        return data.imageUrl || imageUrl;
    } catch (err) {
        console.error('Background removal error:', err);
        return imageUrl; // Return original if processing fails
    }
}

// ============ Voice Summon ============
async function startListening() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        el.summonStart.classList.add('hidden');
        el.summonListening.classList.remove('hidden');

        const checkVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
            const avg = sum / bufferLength;
            const normalized = Math.min(avg * 2, 100);
            el.volumeBar.style.width = normalized + '%';

            if (normalized > 80) {
                stopListening();
                completeSummon();
            } else {
                rafId = requestAnimationFrame(checkVolume);
            }
        };
        rafId = requestAnimationFrame(checkVolume);
    } catch (err) {
        console.error('Mic error:', err);
        alert('Microphone access denied. You can skip the ritual.');
    }
}

function stopListening() {
    if (audioCtx) { audioCtx.close(); audioCtx = null; }
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    el.summonStart.classList.remove('hidden');
    el.summonListening.classList.add('hidden');
}

function skipSummon() {
    stopListening();
    completeSummon();
}

function completeSummon() {
    showReveal();
}

// ============ Reveal ============
function showReveal() {
    showPage('reveal');

    if (state.generatedImageUrl && state.tempFamiliar) {
        el.revealLoading.classList.add('hidden');
        el.revealImage.src = state.generatedImageUrl;
        el.revealImage.classList.remove('hidden');
        el.revealName.textContent = state.tempFamiliar.animal_name;
        el.revealSpecies.textContent = state.tempFamiliar.animal_species;
        el.revealOrigin.textContent = 'Formed from: ' + state.tempFamiliar.original_item_name;
        el.downloadLink.href = state.generatedImageUrl;
        el.revealActions.classList.remove('hidden');
    } else {
        el.revealLoading.classList.remove('hidden');
        el.revealImage.classList.add('hidden');
        el.revealActions.classList.add('hidden');
        // Poll until image is ready
        setTimeout(showReveal, 500);
    }
}

async function releaseToForest() {
    if (!state.tempFamiliar) {
        alert('No familiar ready');
        return;
    }

    try {
        await fetch('/api/familiars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.tempFamiliar)
        });

        // Reset state
        state = { analysis: null, chosenName: null, generatedImageUrl: null, originalImageUrl: null, tempFamiliar: null };
        showPage('forest');
    } catch (err) {
        console.error('Save error:', err);
        alert('Failed to release familiar');
    }
}

// ============ Forest ============
async function loadForest() {
    try {
        const res = await fetch('/api/familiars/forest');
        const familiars = await res.json();

        el.forestLanes.innerHTML = '';
        for (let lane = 0; lane < 5; lane++) {
            const laneDiv = document.createElement('div');
            laneDiv.className = 'w-full h-24 relative border-b border-white/5';

            familiars.filter(f => (f.lane || 0) === lane).forEach(f => {
                const container = document.createElement('div');
                container.className = 'absolute top-2 animate-fly group cursor-pointer';
                container.style.animationDuration = `${f.speed || 15}s`;
                container.style.animationDelay = `-${(f.id.charCodeAt(0) % 10) * 2}s`;

                // Use new field names
                const generatedImg = f.generated_image || f.imageUrl || '';
                const originalImg = f.original_image || f.generated_image || f.imageUrl || '';
                const animalName = f.animal_name || f.name || 'Unknown';
                const animalSpecies = f.animal_species || f.animalSpecies || 'Unknown Species';
                const originalItemName = f.original_item_name || f.originalItemName || 'Unknown';
                const magicPower = f.magic_power ?? f.magicPoints ?? 0;
                const likes = f.likes || 0;
                const dislikes = f.dislikes || 0;

                container.innerHTML = `
                    <div class="relative w-32 h-24">
                        <img src="/static/images/broom.png" class="absolute bottom-0 left-0 w-35 h-15 object-contain transform -rotate-6 translate-y-2 opacity-90" alt="broom" />
                        <img src="${generatedImg}" class="absolute top-0 left-4 w-20 h-20 object-contain drop-shadow-xl transform group-hover:scale-180 transition-transform" alt="${animalName}" />
                        <div class="absolute -top-48 left-1/2 -translate-x-1/2 w-60 bg-black/95 p-4 rounded-xl border-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto shadow-2xl">
                            <div class="flex gap-3 mb-3">
                                <img src="${originalImg}" class="w-16 h-16 object-cover rounded-lg border border-gray-600" alt="Item" />
                                <div class="flex-1">
                                    <h3 class="text-lg font-bold text-yellow-400">${animalName}</h3>
                                    <p class="text-xs text-purple-300">${animalSpecies}</p>
                                    <p class="text-xs text-gray-400 italic">Ex-${originalItemName}</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center bg-purple-900/50 p-2 rounded-lg mb-2">
                                <span class="text-sm font-mono text-yellow-300">✨ MP: ${magicPower}</span>
                                <div class="text-xs text-gray-400">
                                    <span class="text-green-400">👍 ${likes}</span> / <span class="text-red-400">👎 ${dislikes}</span>
                                </div>
                            </div>
                            <div class="flex gap-2 justify-center">
                                <button onclick="likeFamiliar('${f.id}', 1)" class="px-4 py-1.5 bg-green-600/50 hover:bg-green-500 rounded text-white text-sm transition-colors flex items-center gap-1">👍 Like</button>
                                <button onclick="likeFamiliar('${f.id}', -1)" class="px-4 py-1.5 bg-red-600/50 hover:bg-red-500 rounded text-white text-sm transition-colors flex items-center gap-1">👎 Dislike</button>
                            </div>
                        </div>
                    </div>
                `;
                laneDiv.appendChild(container);
            });

            el.forestLanes.appendChild(laneDiv);
        }
    } catch (err) {
        console.error('Load forest error:', err);
    }
}

async function likeFamiliar(id, value) {
    event.stopPropagation();
    try {
        await fetch(`/api/familiars/${id}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value })
        });
        loadForest();
    } catch (err) {
        console.error('Like error:', err);
    }
}

// ============ Cabin ============
async function loadCabin() {
    try {
        const res = await fetch('/api/familiars/user');
        const familiars = await res.json();

        el.cabinFamiliars.innerHTML = '';

        if (!familiars || familiars.length === 0) {
            el.cabinEmpty.classList.remove('hidden');
            return;
        }
        el.cabinEmpty.classList.add('hidden');

        const positions = [
            { top: '60%', left: '20%' }, { top: '65%', left: '50%' }, { top: '55%', left: '80%' },
            { top: '35%', left: '15%' }, { top: '30%', left: '85%' }, { top: '45%', left: '10%' }, { top: '80%', left: '40%' }
        ];

        familiars.forEach((f, i) => {
            const pos = positions[i % positions.length];
            const div = document.createElement('div');
            div.className = 'absolute transition-all duration-500 ease-in-out cursor-pointer z-10';
            div.style.top = pos.top;
            div.style.left = pos.left;

            // Use new field names with fallback
            const generatedImg = f.generated_image || f.imageUrl || '';
            const animalName = f.animal_name || f.name || 'Unknown';
            const isMain = f.is_main || f.isMain || false;

            div.innerHTML = `
                <div class="relative ${isMain ? 'ring-4 ring-yellow-400 rounded-full shadow-[0_0_20px_gold]' : ''}">
                    <img src="${generatedImg}" class="w-24 h-24 object-contain drop-shadow-2xl hover:scale-110 transition-transform" alt="${animalName}" />
                    ${isMain ? '<i class="fas fa-crown absolute -top-6 -right-2 text-yellow-400 text-2xl animate-bounce"></i>' : ''}
                </div>
            `;
            div.onclick = () => showCabinMenu(f);
            el.cabinFamiliars.appendChild(div);
        });
    } catch (err) {
        console.error('Load cabin error:', err);
    }
}

function showCabinMenu(familiar) {
    const animalName = familiar.animal_name || familiar.name || 'Unknown';
    const magicPower = familiar.magic_power ?? familiar.magicPoints ?? 0;
    
    const action = prompt(
        `${animalName} (${magicPower} MP)\n\nOptions:\n1. Type new name to rename\n2. Type "DELETE" to release\n3. Type "MAIN" to set as main\n4. Cancel to close`,
        animalName
    );

    if (action === null) return;

    if (action.toUpperCase() === 'DELETE') {
        if (confirm('Release back to the wild? (Delete)')) {
            fetch(`/api/familiars/${familiar.id}`, { method: 'DELETE' }).then(() => loadCabin());
        }
    } else if (action.toUpperCase() === 'MAIN') {
        fetch(`/api/familiars/${familiar.id}/set-main`, { method: 'POST' }).then(() => loadCabin());
    } else if (action && action !== animalName) {
        fetch(`/api/familiars/${familiar.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ animal_name: action })
        }).then(() => loadCabin());
    }
}

// ============ Leaderboard ============
async function loadLeaderboard() {
    try {
        const res = await fetch('/api/familiars/leaderboard');
        const familiars = await res.json();

        el.leaderboardBody.innerHTML = '';
        familiars.forEach((f, idx) => {
            // Use new field names with fallback
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
                <td class="p-4"><img src="${generatedImg}" class="w-12 h-12 rounded-full bg-black/20 object-contain" alt="${animalName}" /></td>
                <td class="p-4 font-bold text-white">${animalName}<span class="text-xs font-normal text-gray-400 block">${animalSpecies}</span></td>
                <td class="p-4 text-purple-300 text-sm">${userId === 'local_user' ? '(You)' : 'Witch Circle'}</td>
                <td class="p-4 text-center">
                    <span class="text-green-400">👍${likes}</span> / <span class="text-red-400">👎${dislikes}</span>
                </td>
                <td class="p-4 text-right font-mono text-yellow-400">${magicPower}</td>
            `;
            el.leaderboardBody.appendChild(tr);
        });
    } catch (err) {
        console.error('Load leaderboard error:', err);
    }
}

// Initialize
showPage('upload');
