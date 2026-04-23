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

// 3. INTERACTION LOGIC

// A. Hovering over Carousel Images highlights the Text Spans
carouselImages.forEach(img => {
    img.addEventListener('mouseenter', () => {
        carouselTrack.style.animationPlayState = 'paused';
        const index = parseInt(img.getAttribute('data-index'), 10);
        if (toolSpans[index]) {
            toolSpans[index].classList.add('active-highlight');
        }
    });

    img.addEventListener('mouseleave', () => {
        carouselTrack.style.animationPlayState = 'running';
        const index = parseInt(img.getAttribute('data-index'), 10);
        if (toolSpans[index]) {
            toolSpans[index].classList.remove('active-highlight');
        }
    });
});

// B. Hovering over Text Spans pauses, centers, and colors the Images
toolSpans.forEach((span, index) => {
    span.addEventListener('mouseenter', () => {
        // Pause animation
        carouselTrack.style.animationPlayState = 'paused';

        // Find matching images
        const matchingImages = document.querySelectorAll(`.carousel-img[data-index="${index}"]`);
        
        matchingImages.forEach((img, i) => {
            img.classList.add('force-color');
            
            // Center the first occurrence of the matching image in the view
            if (i === 0) {
                img.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });
    });

    span.addEventListener('mouseleave', () => {
        // Resume animation
        carouselTrack.style.animationPlayState = 'running';

        // Remove highlights
        const matchingImages = document.querySelectorAll(`.carousel-img[data-index="${index}"]`);
        matchingImages.forEach(img => {
            img.classList.remove('force-color');
        });
    });
});

// 4. GLOBAL EVENT LISTENERS
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