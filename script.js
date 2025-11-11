/*
 * This app displays random pictures for various categories. To avoid relying on
 * external APIs that may not be accessible in this environment, each category
 * (except "shapes") is backed by a list of publicly available image URLs
 * hosted on services like Pexels and Wikimedia Commons. These sources offer
 * royalty‑free photos and CC0 clip art that can be used freely【512814185937555†L18-L26】【512814185937555†L52-L58】.
 *
 * For the "shapes" category we dynamically generate colour blocks using the
 * placeholder service via.placeholder.com. This produces coloured rectangles
 * labelled with their hex codes, which serve as abstract shape images.
 */
const categories = [
  { id: 'animals' },
  { id: 'musical' },
  { id: 'appliances' },
  { id: 'fruits' },
  { id: 'vehicles' },
  { id: 'nature' },
  { id: 'shapes' },
  { id: 'sports' }
];

// Predefined image lists for each category. When additional images are needed
// (e.g. user requests 20 or 30 images), the selection wraps around and
// duplicates may appear. Most images come from Pexels (free for use) or
// Wikimedia Commons (public domain/CC0). See the licensing details on the
// respective pages【512814185937555†L18-L26】【808690557062601†L160-L187】.
const imagesMap = {
  animals: [
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg',
    'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
    'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
    'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg'
  ],
  musical: [
    // Instruments from the Open Clip Art library – public domain【829353405505433†L126-L138】【808690557062601†L160-L187】
    'https://upload.wikimedia.org/wikipedia/commons/4/4d/Acoustic_guitar.svg',
    'https://upload.wikimedia.org/wikipedia/commons/3/39/Drums.svg',
    'https://upload.wikimedia.org/wikipedia/commons/f/f5/Violin_01.svg',
    // Additional instrument photos from Pexels (e.g. saxophone/piano)
    'https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg',
    'https://images.pexels.com/photos/210854/pexels-photo-210854.jpeg'
  ],
  appliances: [
    // Kitchen and household appliance images from Pexels
    'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg',
    'https://images.pexels.com/photos/3735481/pexels-photo-3735481.jpeg',
    'https://images.pexels.com/photos/2181471/pexels-photo-2181471.jpeg',
    'https://images.pexels.com/photos/162793/pexels-photo-162793.jpeg',
    // Washing machine icon from Open Clip Art – public domain【42289505422897†L140-L176】
    'https://upload.wikimedia.org/wikipedia/commons/5/53/Washing-machine.svg'
  ],
  fruits: [
    // Fruits and vegetables photos from Pexels
    'https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg',
    'https://images.pexels.com/photos/13308395/pexels-photo-13308395.jpeg',
    'https://images.pexels.com/photos/33083467/pexels-photo-33083467.jpeg'
  ],
  vehicles: [
    // Vehicle photos from Pexels
    'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg',
    'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg',
    'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg',
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    'https://images.pexels.com/photos/70912/pexels-photo-70912.jpeg'
  ],
  nature: [
    // Scenic nature photos from Pexels
    'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg',
    'https://images.pexels.com/photos/462149/pexels-photo-462149.jpeg',
    'https://images.pexels.com/photos/349758/pexels-photo-349758.jpeg',
    'https://images.pexels.com/photos/414144/pexels-photo-414144.jpeg',
    'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg'
  ],
  // shapes: handled dynamically
  sports: [
    // Sports icons from the Open Clip Art library (basketball and soccer balls)
    'https://upload.wikimedia.org/wikipedia/commons/c/c6/WP20Symbols_BASKETBALL.svg',
    'https://upload.wikimedia.org/wikipedia/commons/6/6a/Basketball.svg',
    'https://upload.wikimedia.org/wikipedia/commons/5/5c/Soccerball.svg'
  ]
};

const container = document.getElementById('categoriesContainer');
const imgCountSelect = document.getElementById('imgCount');
const refreshBtn = document.getElementById('refreshBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Elements for the lightbox overlay
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImage');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxClose = document.getElementById('lightboxClose');

// Variables to track the current list of images and the index for the lightbox
let currentImgList = [];
let currentImgIndex = 0;

let currentIndex = 0;

/**
 * Show only the section corresponding to the given index. All other
 * sections are hidden. This replaces reliance on CSS scroll-snap for
 * improved compatibility on devices like iPad.
 * @param {number} index - The index of the section to display.
 */
function showSection(index) {
  const sections = container.querySelectorAll('.category-section');
  sections.forEach((section, i) => {
    if (i === index) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });
}

/**
 * Create a section element for a given category. Each section contains a title
 * and a grid container for images.
 * @param {Object} category - The category definition with id and query.
 * @returns {HTMLElement}
 */
function createSection(category) {
  const section = document.createElement('section');
  section.className = 'category-section';
  section.dataset.category = category.id;

  const title = document.createElement('h2');
  title.className = 'category-title';
  // Display a more readable title by replacing hyphens with spaces
  title.textContent = category.id.replace(/-/g, ' ');
  section.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'images-grid';
  section.appendChild(grid);

  return section;
}

/**
 * Load random images into a category section. This uses Unsplash Source to
 * retrieve images matching the category's query. A unique signature is
 * appended to each URL to prevent caching the same image repeatedly.
 * @param {HTMLElement} section - The section to populate with images.
 * @param {number} count - Number of images to load.
 */
async function loadImagesForSection(section, count) {
  const catId = section.dataset.category;
  const grid = section.querySelector('.images-grid');
  grid.innerHTML = '';

  // Handle "shapes" separately: generate coloured placeholders
  if (catId === 'shapes') {
    for (let i = 0; i < count; i++) {
      const img = document.createElement('img');
      // Generate a random hex colour (e.g. FFA07A) for the background and white for text
      const randomColour = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0');
      // Use via.placeholder.com to create a coloured rectangle. Text is the colour code.
      img.src = `https://via.placeholder.com/400x300/${randomColour}/ffffff.png?text=%23${randomColour}`;
      img.alt = `colour block #${randomColour}`;
      grid.appendChild(img);
    }
    return;
  }

  // For other categories, select from the predefined images list
  const list = imagesMap[catId] || [];
  for (let i = 0; i < count; i++) {
    const img = document.createElement('img');
    if (list.length > 0) {
      const randIndex = Math.floor(Math.random() * list.length);
      img.src = list[randIndex];
    } else {
      // Fallback placeholder if no images defined
      img.src = 'https://via.placeholder.com/400x300?text=No+Image';
    }
    img.alt = `${catId} image ${i + 1}`;
    grid.appendChild(img);
  }
}

/**
 * Load images for all category sections based on the selected count.
 * @param {number} count - The number of images to load per category.
 */
function loadAllSections(count) {
  const sections = container.querySelectorAll('.category-section');
  sections.forEach(section => {
    loadImagesForSection(section, count);
  });
}

/**
 * Initialize the application. This builds all category sections and loads
 * initial images according to the default selection.
 */
function init() {
  // Create and append a section for each category
  categories.forEach(cat => {
    const section = createSection(cat);
    container.appendChild(section);
  });
  // Load initial images
  loadAllSections(parseInt(imgCountSelect.value, 10));

  // Show the first section by default
  showSection(currentIndex);

  // Add a click listener to the container for image clicks (event delegation)
  container.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      // Determine which section this image belongs to
      const section = e.target.closest('.category-section');
      if (!section) return;
      // Build a list of all image src attributes for this section
      const imgs = Array.from(section.querySelectorAll('img'));
      currentImgList = imgs.map(img => img.src);
      currentImgIndex = imgs.indexOf(e.target);
      // Show the clicked image in the lightbox
      openLightbox();
    }
  });

  // Navigation and close handlers for the lightbox
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));
  lightboxClose.addEventListener('click', closeLightbox);

  // Swipe support on the lightbox
  let lbStartX = null;
  lightbox.addEventListener('touchstart', (e) => {
    lbStartX = e.touches[0].clientX;
  });
  lightbox.addEventListener('touchend', (e) => {
    if (lbStartX === null) return;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - lbStartX;
    const threshold = 50;
    if (Math.abs(delta) > threshold) {
      navigateLightbox(delta > 0 ? -1 : 1);
    }
    lbStartX = null;
  });
}


// Event listeners
imgCountSelect.addEventListener('change', () => {
  loadAllSections(parseInt(imgCountSelect.value, 10));
});

refreshBtn.addEventListener('click', () => {
  loadAllSections(parseInt(imgCountSelect.value, 10));
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showSection(currentIndex);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < categories.length - 1) {
    currentIndex++;
    showSection(currentIndex);
  }
});

// Optionally add swipe support for touch devices
let startX = null;
container.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});
container.addEventListener('touchend', (e) => {
  if (startX === null) return;
  const endX = e.changedTouches[0].clientX;
  const delta = endX - startX;
  const threshold = 50; // Minimum swipe distance in pixels
    if (Math.abs(delta) > threshold) {
      if (delta > 0 && currentIndex > 0) {
        currentIndex--;
      } else if (delta < 0 && currentIndex < categories.length - 1) {
        currentIndex++;
      }
      showSection(currentIndex);
    }
  startX = null;
});

// Initialize on page load
init();

/**
 * Display the lightbox overlay and the current image.
 */
function openLightbox() {
  updateLightboxImage();
  lightbox.classList.remove('hidden');
}

/**
 * Close the lightbox overlay.
 */
function closeLightbox() {
  lightbox.classList.add('hidden');
}

/**
 * Navigate through the images in the lightbox.
 * @param {number} direction - -1 for previous image, 1 for next image.
 */
function navigateLightbox(direction) {
  if (!currentImgList || currentImgList.length === 0) return;
  currentImgIndex = (currentImgIndex + direction + currentImgList.length) % currentImgList.length;
  updateLightboxImage();
}

/**
 * Update the lightbox image source based on the current index.
 */
function updateLightboxImage() {
  const src = currentImgList[currentImgIndex];
  lightboxImg.src = src;
}