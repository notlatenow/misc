let web3Terms = [];
// State variables to track unused words
let unusedSlang = [];
let unusedSlop = [];

const daisy = document.getElementById('daisy');
const playBtn = document.getElementById('play-btn');
const wordLeft = document.getElementById('word-left');
const wordRight = document.getElementById('word-right');
const wordBoxes = document.querySelectorAll('.word-box');
const defBox = document.getElementById('definition-box');
const feedbackText = document.getElementById('feedback-text');

// Fetch the data and initialize the pools
async function loadTerms() {
    try {
        const response = await fetch('terms.json');
        web3Terms = await response.json();
        
        // Prepare the first deck of words
        resetPools();
        console.log("Terms loaded and pools initialized");
    } catch (error) {
        console.error("Error loading terms:", error);
    }
}

// Helper to shuffle and refill pools to ensure no repeats
function resetPools() {
    // Filter by the isSlop property and shuffle using a random sort
    unusedSlang = web3Terms.filter(t => t.isSlop === false).sort(() => Math.random() - 0.5);
    unusedSlop = web3Terms.filter(t => t.isSlop === true).sort(() => Math.random() - 0.5);
}

/**
 * UPDATED INIT FUNCTION
 * Ensures the daisy and UI only load if terms are successfully fetched.
 */
async function init() {
    await loadTerms();
    
    // Only initialize the visual components if the JSON data is available
    if (web3Terms && web3Terms.length > 0) {
        growDaisy();
        resetUI();
    } else {
        console.error("Initialization failed: web3Terms is empty. Check if terms.json exists and is valid JSON.");
    }
}

init();

function growDaisy() {
    daisy.innerHTML = '<div class="daisy-center"></div>';
    for (let i = 0; i < 15; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'petal-wrapper';
        const rotation = i * (360 / 15);
        wrapper.style.transform = `rotate(${rotation}deg)`;
        
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        wrapper.appendChild(petal);
        daisy.appendChild(wrapper);
    }
}

function resetUI() {
    wordLeft.innerText = "";
    wordRight.innerText = "";
    defBox.classList.add('hidden');
    // Added 'is-slop' and 'is-not-slop' to the removal list
    wordBoxes.forEach(box => box.classList.remove('selected', 'active', 'is-slop', 'is-not-slop'));
}

function startNewRound() {
    resetUI();
    growDaisy();
    daisy.classList.add('twirl');
    setTimeout(() => daisy.classList.remove('twirl'), 2250);
    
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

        wordBoxes.forEach(box => box.classList.add('active'));
    }, 600);
}

playBtn.addEventListener('click', startNewRound);

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