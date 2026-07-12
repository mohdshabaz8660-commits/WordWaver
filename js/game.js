const gameLevels = [
    { letters: ['A', 'T', 'E'], words: ['ATE', 'EAT', 'TEA'] },
    { letters: ['O', 'W', 'L'], words: ['OWL', 'LOW'] },
    { letters: ['P', 'O', 'S', 'T'], words: ['POST', 'POTS', 'SPOT', 'STOP', 'TOP', 'POT'] },
    { letters: ['R', 'A', 'T', 'E'], words: ['RATE', 'TEAR', 'ART', 'TAR', 'RAT', 'EAR', 'ARE'] },
    { letters: ['B', 'L', 'E', 'N', 'D'], words: ['BLEND', 'LEND', 'BEND', 'BED', 'LED', 'DEN', 'END'] },
    { letters: ['S', 'P', 'A', 'R', 'K'], words: ['SPARK', 'PARK', 'SPAR', 'RAP', 'PAR', 'SAP', 'SPA'] },
    { letters: ['C', 'H', 'A', 'R', 'M'], words: ['CHARM', 'MARCH', 'HARM', 'RAM', 'ARM', 'MAC', 'ARC', 'CAR'] },
    { letters: ['M', 'A', 'S', 'T', 'E', 'R'], words: ['MASTER', 'STREAM', 'SMART', 'TEAM', 'MEAT', 'STAR', 'ARTS', 'REST', 'EARS'] }
];

let currentLevelIndex = 0;
let score = 0;
let currentLevelData = null;
let foundWords = [];
let currentInput = []; // Array of objects {char, id}
let currentLetters = []; // Array of available letter objects
let justFoundWord = null;
let toastTimeout;

let hintsRemaining = 3;
let isFetchingHint = false;

function initLevel() {
    currentLevelData = gameLevels[currentLevelIndex];
    
    // Sort words primarily by length (descending), then alphabetically for a neat board
    currentLevelData.words.sort((a, b) => {
        if (a.length === b.length) return a.localeCompare(b);
        return b.length - a.length;
    });
    
    foundWords = [];
    currentInput = [];
    justFoundWord = null;
    
    // Create unique IDs for letters to track them individually (important for duplicate letters)
    currentLetters = currentLevelData.letters.map((char, index) => ({ char, id: index }));
    shuffleArray(currentLetters);
    
    hintsRemaining = 3;
    updateHintButton();
    
    document.getElementById('level-display').textContent = currentLevelIndex + 1;
    
    renderBoard();
    renderInput();
    renderLetters();
    updateProgress();
}

function renderBoard() {
    const boardContainer = document.getElementById('board-container');
    boardContainer.innerHTML = '';
    
    currentLevelData.words.forEach(word => {
        const isFound = foundWords.includes(word);
        const wordDiv = document.createElement('div');
        wordDiv.className = 'flex gap-1.5';
        
        for (let i = 0; i < word.length; i++) {
            const letterBox = document.createElement('div');
            letterBox.className = 'w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-base sm:text-lg transition-all duration-300';
            
            if (isFound) {
                letterBox.classList.add('bg-emerald-500', 'text-white', 'shadow-md');
                letterBox.textContent = word[i];
                if (word === justFoundWord) {
                    // Staggered pop animation for each letter in the found word
                    letterBox.style.animationDelay = `${i * 0.05}s`;
                    letterBox.classList.add('animate-pop');
                }
            } else {
                letterBox.classList.add('bg-slate-700', 'text-transparent', 'shadow-inner');
                letterBox.textContent = word[i]; // Hidden text, helps maintain structural sizing
            }
            wordDiv.appendChild(letterBox);
        }
        boardContainer.appendChild(wordDiv);
    });
}

function renderInput() {
    const inputDisplay = document.getElementById('input-display');
    inputDisplay.innerHTML = '';
    
    if (currentInput.length === 0) {
        inputDisplay.innerHTML = `<div class="text-slate-600 font-bold text-3xl tracking-widest animate-pulse pb-2">...</div>`;
        return;
    }

    currentInput.forEach((item, index) => {
        const box = document.createElement('div');
        box.className = 'w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 border-2 border-blue-500 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-extrabold text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]';
        box.textContent = item.char;
        
        // Only animate the newly added letter
        if (index === currentInput.length - 1) {
            box.classList.add('animate-pop');
        }
        inputDisplay.appendChild(box);
    });
}

function renderLetters() {
    const tray = document.getElementById('letter-tray');
    tray.innerHTML = '';
    
    currentLetters.forEach(item => {
        const isUsed = currentInput.some(input => input.id === item.id);
        const btn = document.createElement('button');
        
        // Base styling for game buttons
        btn.className = `w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl font-extrabold transition-all select-none focus:outline-none touch-manipulation `;
        
        if (isUsed) {
            // Depressed state
            btn.className += `bg-slate-700 text-slate-500 opacity-50 pointer-events-none translate-y-[4px]`;
        } else {
            // Active state
            btn.className += `bg-blue-600 text-white shadow-[0_4px_0_0_#1e3a8a] cursor-pointer hover:bg-blue-500 active:shadow-none active:translate-y-[4px]`;
        }
        
        btn.textContent = item.char;
        btn.onclick = () => handleLetterClick(item.char, item.id);
        
        tray.appendChild(btn);
    });
}

function handleLetterClick(char, id) {
    currentInput.push({ char, id });
    renderInput();
    renderLetters();
}

function handleBackspace() {
    if (currentInput.length > 0) {
        currentInput.pop();
        renderInput();
        renderLetters();
    }
}

function submitWord() {
    if (currentInput.length === 0) return;
    
    const word = currentInput.map(item => item.char).join('');
    
    if (foundWords.includes(word)) {
        showToast("Already Found!", "error");
        shakeInput();
    } else if (currentLevelData.words.includes(word)) {
        foundWords.push(word);
        score += (word.length * 10);
        justFoundWord = word;
        showToast("Awesome!", "success");
        
        updateProgress();
        renderBoard();
        
        setTimeout(() => {
            justFoundWord = null; // Clear state after animation
            checkLevelComplete();
        }, 500);
    } else {
        showToast("Not in word list", "error");
        shakeInput();
    }
    
    // Reset input after submission attempt
    currentInput = [];
    renderLetters();
    renderInput();
}

function updateProgress() {
    const total = currentLevelData.words.length;
    const found = foundWords.length;
    document.getElementById('progress-text').textContent = `${found} / ${total}`;
    
    const percentage = (found / total) * 100;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    document.getElementById('score-display').textContent = score;
}

function checkLevelComplete() {
    if (foundWords.length === currentLevelData.words.length) {
        burstConfetti();
        setTimeout(() => {
            if (currentLevelIndex >= gameLevels.length - 1) {
                showModal("You Win!", `Incredible! Total Score: ${score}`, "PLAY AGAIN", resetGame);
            } else {
                showModal("Level Complete!", "You found all the words!", "NEXT LEVEL", nextLevel);
            }
        }, 800);
    }
}

function nextLevel() {
    currentLevelIndex++;
    initLevel();
}

function resetGame() {
    currentLevelIndex = 0;
    score = 0;
    initLevel();
}

// Utilities
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shakeInput() {
    const inputDisplay = document.getElementById('input-display');
    inputDisplay.classList.remove('animate-shake');
    // Trigger reflow to restart animation
    void inputDisplay.offsetWidth; 
    inputDisplay.classList.add('animate-shake');
}

function showToast(msg, type = "error") {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    
    // Reset classes
    toast.className = 'absolute bottom-32 left-1/2 transform -translate-x-1/2 px-6 py-2.5 rounded-full shadow-lg pointer-events-none transition-opacity duration-300 z-50 text-white font-bold text-sm tracking-wide whitespace-nowrap opacity-100';
    
    if (type === "success") {
        toast.classList.add('bg-emerald-500');
    } else {
        toast.classList.add('bg-red-500');
    }
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.replace('opacity-100', 'opacity-0');
    }, 1500);
}

function showModal(title, msg, btnText, callback) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    modal.querySelector('h2').textContent = title;
    document.getElementById('modal-msg').textContent = msg;
    
    const btn = document.getElementById('btn-next-level');
    btn.textContent = btnText;
    btn.onclick = () => {
        hideModal();
        callback();
    };
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    content.classList.remove('scale-95');
}

function hideModal() {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    modal.classList.add('opacity-0', 'pointer-events-none');
    content.classList.add('scale-95');
    
    // Stop confetti if running
    if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles = [];
    }
}

function updateHintButton() {
    const btn = document.getElementById('btn-hint');
    const badge = document.getElementById('hint-badge');
    badge.textContent = hintsRemaining;
    
    if (hintsRemaining <= 0 || isFetchingHint) {
        btn.classList.add('opacity-50', 'pointer-events-none');
    } else {
        btn.classList.remove('opacity-50', 'pointer-events-none');
    }
}

async function handleAIHint() {
    if (hintsRemaining <= 0 || isFetchingHint) return;
    
    const unfoundWords = currentLevelData.words.filter(w => !foundWords.includes(w));
    if (unfoundWords.length === 0) {
        showToast("You've found all words!", "success");
        return;
    }

    // Pick a random unfound word
    const targetWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
    
    isFetchingHint = true;
    updateHintButton();
    
    // Show loading spinner
    const btnIcon = document.querySelector('#btn-hint > svg:not(#hint-spinner)');
    const spinner = document.getElementById('hint-spinner');
    btnIcon.classList.add('hidden');
    spinner.classList.remove('hidden');

    try {
        const hint = await fetchGeminiHint(targetWord);
        showHintModal(hint);
        hintsRemaining--;
    } catch (error) {
        console.error(error);
        showToast("Failed to connect to AI Weaver.", "error");
    } finally {
        // Restore button state
        isFetchingHint = false;
        btnIcon.classList.remove('hidden');
        spinner.classList.add('hidden');
        updateHintButton();
    }
}

async function fetchGeminiHint(word) {
    const apiKey = ""; // Canvas provides this automatically
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    const prompt = `You are the "AI Weaver", a mystical guide in an anagram word game. 
    The player is trying to guess the hidden word: "${word}". 
    Provide a short, clever, and poetic riddle (maximum 2 sentences) to help them guess it. 
    CRITICAL RULE: DO NOT use the word "${word}" or any of its obvious root words in your response.`;
    
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
            parts: [{ text: "You are a helpful and creative AI assistant for a word puzzle game." }]
        }
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) throw new Error("API Network error");
    
    const result = await response.json();
    if (result.candidates && result.candidates.length > 0) {
        return result.candidates[0].content.parts[0].text;
    } else {
        throw new Error("Invalid response structure");
    }
}

function showHintModal(hintText) {
    const modal = document.getElementById('hint-modal');
    const textEl = document.getElementById('hint-text');
    textEl.textContent = hintText;
    
    modal.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
    modal.classList.add('translate-y-0');
}

function closeHintModal() {
    const modal = document.getElementById('hint-modal');
    modal.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
    modal.classList.remove('translate-y-0');
}

// Button Bindings
document.getElementById('btn-submit').onclick = submitWord;
document.getElementById('btn-clear').onclick = handleBackspace;

document.getElementById('btn-hint').onclick = handleAIHint;
document.getElementById('btn-close-hint').onclick = closeHintModal;

document.getElementById('btn-shuffle').onclick = () => {
    shuffleArray(currentLetters);
    renderLetters();
};

// Keyboard Support
window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('modal');
    if (!modal.classList.contains('opacity-0')) {
        if (e.key === 'Enter') document.getElementById('btn-next-level').click();
        return;
    }

    if (e.key === 'Enter') {
        submitWord();
    } else if (e.key === 'Backspace') {
        handleBackspace();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        const char = e.key.toUpperCase();
        // Find an available letter that matches the pressed key
        const availableLetter = currentLetters.find(l => l.char === char && !currentInput.some(input => input.id === l.id));
        if (availableLetter) {
            handleLetterClick(availableLetter.char, availableLetter.id);
        }
    }
});

let confettiParticles = [];
let confettiCtx;
let confettiCanvas;
let animId = null;

function initConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    confettiCtx = confettiCanvas.getContext('2d');
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);
}

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function burstConfetti() {
    confettiParticles = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: confettiCanvas.width / 2,
            y: confettiCanvas.height / 2 + 50, // Start slightly below center
            r: Math.random() * 6 + 4, // size
            dx: Math.random() * 24 - 12, // x velocity
            dy: Math.random() * -20 - 10, // y velocity (initial burst up)
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleInc: (Math.random() * 0.07) + 0.05,
            tiltAngle: 0
        });
    }
    if (!animId) renderConfetti();
}

function renderConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    let activeParticles = 0;
    
    confettiParticles.forEach((p) => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle) * 2;
        p.dy += 0.4; // gravity
        p.y += p.dy;
        p.x += p.dx;
        
        // Draw particle
        confettiCtx.beginPath();
        confettiCtx.lineWidth = p.r;
        confettiCtx.strokeStyle = p.color;
        confettiCtx.moveTo(p.x + p.tilt + p.r, p.y);
        confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        confettiCtx.stroke();
        
        if (p.y <= confettiCanvas.height) {
            activeParticles++;
        }
    });

    if (activeParticles > 0) {
        animId = requestAnimationFrame(renderConfetti);
    } else {
        animId = null;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

// Boot up game
window.onload = () => {
    initConfetti();
    initLevel();
};