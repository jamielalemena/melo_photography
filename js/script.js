document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Dynamic Portfolio Gallery ---
    const portfolioGrid = document.getElementById('portfolio-grid');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Image Configuration
    // In a real backend scenario, this would be fetched from an API or file system scan.
    // For this static site, we define the counts found in the user's directory.
    const imageCounts = {
        graduation: 9, // grad1.jpg - grad9.jpg
        outdoor: 9,   // out1.jpg - out9.jpg (renamed out10 to out4)
        studio: 7     // studio1.jpg - studio7.jpg
    };

    /**
     * Generates the image objects based on the file naming convention
     */
    function generateImages() {
        let images = [];

        // Graduation
        for (let i = 1; i <= imageCounts.graduation; i++) {
            images.push({
                src: `images/grad${i}.jpg`,
                category: 'graduation',
                alt: `Graduation Shot ${i}`
            });
        }
        // Outdoor
        for (let i = 1; i <= imageCounts.outdoor; i++) {
            images.push({
                src: `images/out${i}.jpg`,
                category: 'outdoor',
                alt: `Outdoor Shot ${i}`
            });
        }
        // Studio
        for (let i = 1; i <= imageCounts.studio; i++) {
            images.push({
                src: `images/studio${i}.jpg`,
                category: 'studio',
                alt: `Studio Shot ${i}`
            });
        }

        return images;
    }

    const allImages = generateImages();

    /**
     * Renders images to the DOM
     * @param {string} category - 'all' or specific category
     */
    function renderGallery(category) {
        portfolioGrid.innerHTML = ''; // Clear current

        const filteredImages = category === 'all'
            ? allImages
            : allImages.filter(img => img.category === category);

        filteredImages.forEach(img => {
            const item = document.createElement('div');
            item.classList.add('portfolio-item');

            // Image element
            const imageElement = document.createElement('img');
            imageElement.src = img.src;
            imageElement.alt = img.alt;
            imageElement.loading = 'lazy'; // Performance optimization

            // Overlay
            const overlay = document.createElement('div');
            overlay.classList.add('portfolio-overlay');

            item.appendChild(imageElement);
            item.appendChild(overlay);

            // Lightbox click event
            item.addEventListener('click', () => openLightbox(img.src));

            portfolioGrid.appendChild(item);
        });
    }

    // Initial Render
    renderGallery('all');

    // Filter Click Handlers
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            renderGallery(category);
        });
    });


    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    function openLightbox(src) {
        lightbox.style.display = 'block';
        lightboxImg.src = src;
    }

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
});
