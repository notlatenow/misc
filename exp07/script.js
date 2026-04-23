/**
 * FIBONACCI FABRIC FRAMES - INTERACTIVE LOGIC
 */

// 1. SELECT ELEMENTS
const carouselTrack = document.getElementById('carouselTrack');
const carouselImages = document.querySelectorAll('.carousel-img');
const toolSpans = document.querySelectorAll('.tools-grid span');
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("fullImg");
const modalCaption = document.getElementById("modalCaption");

// Detect touch capability
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// 2. MODAL FUNCTIONS
function openModal(imageSrc, index) {
    modal.style.display = "flex";
    modalImg.src = imageSrc;
    if (toolSpans[index]) {
        modalCaption.innerText = toolSpans[index].innerText;
    } else {
        modalCaption.innerText = "";
    }
}

function closeModal() {
    modal.style.display = "none";
}

// 3. HELPER FUNCTIONS

function clearAllHighlights() {
    toolSpans.forEach(span => span.classList.remove('active-highlight'));
    carouselImages.forEach(img => img.classList.remove('force-color'));
}

function highlightSelection(index) {
    const matchingImages = document.querySelectorAll(`.carousel-img[data-index="${index}"]`);
    
    matchingImages.forEach((img, i) => {
        img.classList.add('force-color');
        
        // Center the first occurrence of the image in the scroll container
        if (i === 0) {
            img.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    });
}

// 4. INTERACTION LOGIC

// A. Carousel Image Interactions
carouselImages.forEach(img => {
    img.addEventListener('mouseenter', () => {
        if (isTouchDevice) return; 
        carouselTrack.style.animationPlayState = 'paused';
        const index = img.getAttribute('data-index');
        if (toolSpans[index]) toolSpans[index].classList.add('active-highlight');
    });

    img.addEventListener('mouseleave', () => {
        if (isTouchDevice) return;
        carouselTrack.style.animationPlayState = 'running';
        const index = img.getAttribute('data-index');
        if (toolSpans[index]) toolSpans[index].classList.remove('active-highlight');
    });
});

// B. Tool Span Interactions
toolSpans.forEach((span, index) => {
    // Desktop Hover
    span.addEventListener('mouseenter', () => {
        if (isTouchDevice) return;
        carouselTrack.style.animationPlayState = 'paused';
        highlightSelection(index);
    });

    span.addEventListener('mouseleave', () => {
        if (isTouchDevice) return;
        carouselTrack.style.animationPlayState = 'running';
        clearAllHighlights();
    });

    // Mobile & Desktop Click Support
    span.addEventListener('click', () => {
        // Clear previous state
        clearAllHighlights();
        
        // Ensure animation stops if it was running (e.g., clicking on desktop)
        carouselTrack.style.animationPlayState = 'paused';
        
        // Apply new highlight
        span.classList.add('active-highlight');
        highlightSelection(index);
    });
});

// 5. GLOBAL EVENT LISTENERS
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});