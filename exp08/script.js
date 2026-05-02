let web3Terms = []; 
// State variables to track unused words
let unusedSlang = [];
let unusedSlop = [];

const daisy = document.getElementById('daisy');[cite: 2]
const playBtn = document.getElementById('play-btn');[cite: 2]
const wordLeft = document.getElementById('word-left');[cite: 2]
const wordRight = document.getElementById('word-right');[cite: 2]
const wordBoxes = document.querySelectorAll('.word-box');[cite: 2]
const defBox = document.getElementById('definition-box');[cite: 2]
const feedbackText = document.getElementById('feedback-text');[cite: 2]

// Fetch the data and initialize the pools
async function loadTerms() {[cite: 2]
    try {[cite: 2]
        const response = await fetch('terms.json');[cite: 2]
        web3Terms = await response.json();[cite: 2]
        
        // Prepare the first deck of words
        resetPools();
        console.log("Terms loaded and pools initialized");[cite: 2]
    } catch (error) {[cite: 2]
        console.error("Error loading terms:", error);[cite: 2]
    }
}

// Helper to shuffle and refill pools to ensure no repeats
function resetPools() {
    // Filter by the isSlop property and shuffle using a random sort
    unusedSlang = web3Terms.filter(t => t.isSlop === false).sort(() => Math.random() - 0.5);
    unusedSlop = web3Terms.filter(t => t.isSlop === true).sort(() => Math.random() - 0.5);
}

async function init() {[cite: 2]
    await loadTerms();[cite: 2]
    growDaisy();[cite: 2]
    resetUI();[cite: 2]
}

init();[cite: 2]

function growDaisy() {[cite: 2]
    daisy.innerHTML = '<div class="daisy-center"></div>';[cite: 2]
    for (let i = 0; i < 15; i++) {[cite: 2]
        const wrapper = document.createElement('div');[cite: 2]
        wrapper.className = 'petal-wrapper';[cite: 2]
        const rotation = i * (360 / 15);[cite: 2]
        wrapper.style.transform = `rotate(${rotation}deg)`;[cite: 2]
        
        const petal = document.createElement('div');[cite: 2]
        petal.className = 'petal';[cite: 2]
        
        wrapper.appendChild(petal);[cite: 2]
        daisy.appendChild(wrapper);[cite: 2]
    }
}

function resetUI() {
    wordLeft.innerText = "";
    wordRight.innerText = "";
    defBox.classList.add('hidden');
    // Added 'is-slop' and 'is-not-slop' to the removal list
    wordBoxes.forEach(box => box.classList.remove('selected', 'active', 'is-slop', 'is-not-slop'));
}

function startNewRound() {[cite: 2]
    resetUI();[cite: 2]
    growDaisy();[cite: 2]
    daisy.classList.add('twirl');[cite: 2]
    setTimeout(() => daisy.classList.remove('twirl'), 2250);[cite: 2]
    
    // If we've run out of words in either category, refill the deck
    if (unusedSlang.length === 0 || unusedSlop.length === 0) {
        resetPools();
    }

    setTimeout(() => {
        // Pop ensures the word is removed from the current "deck"
        const correctTerm = unusedSlang.pop();
        const incorrectTerm = unusedSlop.pop();

        // Randomize which side the "slop" (incorrect) word appears on
        if (Math.random() > 0.5) {
            wordLeft.innerText = correctTerm.word;
            wordRight.innerText = incorrectTerm.word;
        } else {
            wordLeft.innerText = incorrectTerm.word;
            wordRight.innerText = correctTerm.word;
        }

        wordBoxes.forEach(box => box.classList.add('active'));[cite: 2]
    }, 600);[cite: 2]
}

playBtn.addEventListener('click', startNewRound);[cite: 2]

wordBoxes.forEach(box => {
    box.addEventListener('click', () => {
        if (box.innerText === "" || box.classList.contains('selected')) return;

        // 1. Clear previous selection and color classes from all boxes
        wordBoxes.forEach(b => {
            b.classList.remove('selected', 'is-slop', 'is-not-slop');
        });

        // 2. Add the base selection class
        box.classList.add('selected');

        // 3. Find the data to determine the outline color
        const termData = web3Terms.find(t => t.word === box.innerText);
        
        if (termData) {
            // Apply green if isSlop is true, red if false
            if (termData.isSlop) {
                box.classList.add('is-slop'); 
            } else {
                box.classList.add('is-not-slop');
            }
            feedbackText.innerHTML = `<strong>${termData.word}</strong>: ${termData.definition}`;
        }

        // --- Petal Animation Logic (Kept from original) ---
        const wrappers = document.querySelectorAll('.petal-wrapper:not(.fall)');
        if (wrappers.length > 0) {
            const randomIdx = Math.floor(Math.random() * wrappers.length);
            const toFall = wrappers[randomIdx];
            toFall.classList.add('fall');
            setTimeout(() => toFall.remove(), 2000);
        }

        defBox.classList.remove('hidden');
    });
});