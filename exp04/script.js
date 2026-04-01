let currentCategory = ''; // Start empty

// Define the units for each category
const unitMap = {
    'weather': { left: '°F', right: '°C' },
    'measure': { left: 'in', right: 'mm' },
    'weight': { left: 'lb', right: 'kg' },
    'height': { left: 'ft\'in\"', right: 'cm' }
};

function setCategory(cat) {
    currentCategory = cat;
    
    // 1. Update the Labels
    document.getElementById('leftLabel').innerText = unitMap[cat]?.left || '💠';
    document.getElementById('rightLabel').innerText = unitMap[cat]?.right || '💠';

    // 2. Clear inputs
    document.getElementById('leftInput').value = '';
    document.getElementById('rightInput').value = '';
    
    // 3. Trigger Animation Automatically (Moved from handleConversion)
    const gifMap = {
        'measure': 'c-me-lan.gif',
        'weather': 'c-we-chr.gif', 
        'weight': 'c-wt-mkt.gif',   
        'height': 'c-ht-dao.gif'    
    };

    const selectedGif = gifMap[cat];
    const container = document.querySelector('.graphic-container');

    if (selectedGif && container) {
        container.innerHTML = `<img src="${selectedGif}" class="active-gif" alt="kaleidoscope animation">`;
    }
    
    console.log("Category set and animation updated to: " + cat);
}

// Left to Right Logic (including Feet/Inches parsing)
document.getElementById('leftInput').addEventListener('input', (e) => {
    if (!currentCategory) return;
    const inputVal = e.target.value.trim();
    const rightBox = document.getElementById('rightInput');
    
    if (!inputVal) { rightBox.value = ''; return; }

    if (currentCategory === 'height') {
        const match = inputVal.match(/(\d+)\s*'\s*(\d*)\s*"?/);
        if (match) {
            const feet = parseFloat(match[1]);
            const inches = parseFloat(match[2]) || 0;
            rightBox.value = ((feet * 30.48) + (inches * 2.54)).toFixed(1);
        }
    } else {
        const val = parseFloat(inputVal);
        if (isNaN(val)) return;
        if (currentCategory === 'weather') rightBox.value = ((val - 32) * 5 / 9).toFixed(1);
        if (currentCategory === 'measure') rightBox.value = (val * 25.4).toFixed(1);
        if (currentCategory === 'weight') rightBox.value = (val * 0.453592).toFixed(1);
    }
});

// Right to Left Logic
document.getElementById('rightInput').addEventListener('input', (e) => {
    if (!currentCategory) return;
    const val = parseFloat(e.target.value);
    const leftBox = document.getElementById('leftInput');

    if (isNaN(val)) { leftBox.value = ''; return; }

    if (currentCategory === 'measure') leftBox.value = (val / 25.4).toFixed(1);
    if (currentCategory === 'weather') leftBox.value = (val * 9 / 5 + 32).toFixed(1);
    if (currentCategory === 'weight') leftBox.value = (val / 0.453592).toFixed(1);
    if (currentCategory === 'height') {
        // Convert total cm back to feet and inches for the text box
        const totalInches = val / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        leftBox.value = `${feet}'${inches}"`;
    }
});