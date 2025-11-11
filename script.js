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
  // High‑quality animal photos from Pexels (dog, cat, horse) and public domain wildlife from Wikimedia Commons. Adding more entries reduces repetition.
  animals: [
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg', // golden retriever puppies
    'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg',   // brown dog portrait
    'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg', // shiba inu puppy
    'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg', // cat lying down
    'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg', // black pug
    'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg',     // corgi by the lake
    // Additional animal photos from Wikimedia Commons (public domain/CC‑BY)
    'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg',                   // cat portrait
    'https://upload.wikimedia.org/wikipedia/commons/5/50/Vulpes_vulpes_laying_in_snow.jpg', // fox in snow
    'https://upload.wikimedia.org/wikipedia/commons/9/9a/Giraffa_camelopardalis_reticulata.jpg', // giraffe in savanna
    'https://upload.wikimedia.org/wikipedia/commons/5/56/African_Bush_Elephant.jpg',     // elephant
    'https://upload.wikimedia.org/wikipedia/commons/a/a6/Toco_toucan_Ramphastos_toco.jpg', // toucan with colourful beak
    'https://upload.wikimedia.org/wikipedia/commons/8/86/Ruby-throated_Hummingbird_2.jpg', // hummingbird mid‑flight
    'https://upload.wikimedia.org/wikipedia/commons/2/2d/Siberian_Tiger_Panthera_tigris_altaica.jpg', // Siberian tiger
    'https://upload.wikimedia.org/wikipedia/commons/9/9e/Red_fox_kit_crop.jpg',         // fox kit
    'https://upload.wikimedia.org/wikipedia/commons/1/18/Brown_horse_on_field.jpg'       // brown horse
  ],
  // Musical instruments: a mix of open‑clipart icons and photos. All CC0/public domain or royalty free【829353405505433†L126-L138】【808690557062601†L160-L187】
  musical: [
    'https://upload.wikimedia.org/wikipedia/commons/4/4d/Acoustic_guitar.svg',   // acoustic guitar icon
    'https://upload.wikimedia.org/wikipedia/commons/3/39/Drums.svg',             // drum kit icon
    'https://upload.wikimedia.org/wikipedia/commons/f/f5/Violin_01.svg',         // violin icon
    'https://upload.wikimedia.org/wikipedia/commons/8/8d/Trumpet.svg',           // trumpet icon
    'https://upload.wikimedia.org/wikipedia/commons/6/6e/Accordion.svg',         // accordion icon
    'https://upload.wikimedia.org/wikipedia/commons/2/22/Piano_keyboard.svg',    // piano keyboard icon
    // Photos from Pexels for variety
    'https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg',          // saxophone on dark background
    'https://images.pexels.com/photos/210854/pexels-photo-210854.jpeg',          // glittery drum set
    'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg',          // violin on wooden table
    'https://images.pexels.com/photos/207962/pexels-photo-207962.jpeg'           // piano keys close‑up
  ],
  // Household appliances: combine photos from Pexels and CC0 icons from the Open Clip Art Library【997224420272340†L141-L177】【415890213151120†L141-L179】
  appliances: [
    'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg', // modern dishwasher/oven
    'https://images.pexels.com/photos/3735481/pexels-photo-3735481.jpeg', // coffee maker and kettle
    'https://images.pexels.com/photos/2181471/pexels-photo-2181471.jpeg', // vacuum cleaner (water filtration)
    'https://images.pexels.com/photos/162793/pexels-photo-162793.jpeg',   // black‑and‑white kitchen
    // Icons from Open Clip Art Library (public domain)
    'https://upload.wikimedia.org/wikipedia/commons/5/5c/Toaster.svg',            // toaster
    'https://upload.wikimedia.org/wikipedia/commons/9/90/Microwave_oven.svg',     // microwave oven
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Blue_vacuum_cleaner.svg',// vacuum cleaner icon
    'https://upload.wikimedia.org/wikipedia/commons/f/ff/Kettle_icon.svg',        // kettle icon
    'https://upload.wikimedia.org/wikipedia/commons/0/09/Hand-mixer.svg',         // hand mixer icon
    'https://upload.wikimedia.org/wikipedia/commons/a/a7/Coffe_maker.svg',        // drip coffee maker
    'https://upload.wikimedia.org/wikipedia/commons/6/60/Italian-coffee-maker.svg',// Italian espresso maker
    'https://upload.wikimedia.org/wikipedia/commons/5/53/Washing-machine.svg'      // washing machine icon
  ],
  // Fruits and vegetables: high‑quality photos and public domain illustrations
  fruits: [
    'https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg',    // assorted fruit platter
    'https://images.pexels.com/photos/13308395/pexels-photo-13308395.jpeg',// tropical fruit assortment
    'https://images.pexels.com/photos/33083467/pexels-photo-33083467.jpeg',// citrus and pomegranates
    // Wikimedia Commons photos (public domain/CC0)
    'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',         // banana
    'https://upload.wikimedia.org/wikipedia/commons/a/ae/Citrus_sinensis_orange.jpg',// orange
    'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg',             // apple
    'https://upload.wikimedia.org/wikipedia/commons/7/74/Carrot.jpg',                // carrot
    'https://upload.wikimedia.org/wikipedia/commons/2/29/Sweet_cherry.jpg',          // cherries
    'https://upload.wikimedia.org/wikipedia/commons/2/2c/Mango.jpg',                 // mango
    'https://upload.wikimedia.org/wikipedia/commons/1/11/Vitis_vinifera_Riesling_grapes.jpg',// grapes
    'https://upload.wikimedia.org/wikipedia/commons/7/70/Avocado.jpg',               // avocado
    'https://upload.wikimedia.org/wikipedia/commons/c/cd/Pineapple_and_cross_section.jpg',// pineapple
    'https://upload.wikimedia.org/wikipedia/commons/2/29/PerfectStrawberry.jpg',     // strawberry
    'https://upload.wikimedia.org/wikipedia/commons/3/35/Watermelon_cross_BNC.jpg'   // watermelon
  ],
  // Vehicles: combination of Pexels photos and simple transport icons from the Open Clip Art Library
  vehicles: [
    'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg', // red sports car
    'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg', // yellow vintage car
    'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg', // blue car in snow
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',// airplane cockpit
    'https://images.pexels.com/photos/70912/pexels-photo-70912.jpeg',   // bus on road
    // Icons for additional vehicle types (public domain)
    'https://upload.wikimedia.org/wikipedia/commons/b/bf/Sedan-car.svg',       // car icon
    'https://upload.wikimedia.org/wikipedia/commons/9/9b/Bicycle_icon.svg',    // bicycle icon
    'https://upload.wikimedia.org/wikipedia/commons/2/2c/Bus_grey.svg',        // bus icon
    'https://upload.wikimedia.org/wikipedia/commons/3/3e/Airplane_silhouette.svg',// airplane icon
    'https://upload.wikimedia.org/wikipedia/commons/4/41/Train_icon.svg',      // train icon
    'https://upload.wikimedia.org/wikipedia/commons/4/49/Sailboat_icon.svg'    // sailboat icon
  ],
  // Scenic nature photos and landscape illustrations from Pexels/Wikimedia
  nature: [
    'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg', // sunset over lake
    'https://images.pexels.com/photos/462149/pexels-photo-462149.jpeg', // mountain valley
    'https://images.pexels.com/photos/349758/pexels-photo-349758.jpeg', // forest pathway
    'https://images.pexels.com/photos/414144/pexels-photo-414144.jpeg', // waterfall
    'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg', // snowy mountains
    // Additional landscapes from Wikimedia Commons
    'https://upload.wikimedia.org/wikipedia/commons/5/5c/Clouds_over_lake.jpg',    // lake with clouds
    'https://upload.wikimedia.org/wikipedia/commons/2/2b/Mushrooms_in_forest.jpg', // forest mushrooms
    'https://upload.wikimedia.org/wikipedia/commons/8/86/Waterfall_Blossom.jpg',   // waterfall in jungle
    'https://upload.wikimedia.org/wikipedia/commons/7/7f/Mountain_lake_scenery.jpg',// mountain lake
    'https://upload.wikimedia.org/wikipedia/commons/5/50/Flower_field.jpg'          // flower field
  ],
  // Sports & games: icons representing various sports and games
  sports: [
    'https://upload.wikimedia.org/wikipedia/commons/c/c6/WP20Symbols_BASKETBALL.svg', // basketball icon
    'https://upload.wikimedia.org/wikipedia/commons/6/6a/Basketball.svg',             // basketball vector
    'https://upload.wikimedia.org/wikipedia/commons/5/5c/Soccerball.svg',             // soccer ball
    'https://upload.wikimedia.org/wikipedia/commons/1/1e/Tennis_ball.svg',            // tennis ball
    'https://upload.wikimedia.org/wikipedia/commons/3/36/Baseball.svg',               // baseball
    'https://upload.wikimedia.org/wikipedia/commons/3/3f/Football_american.svg',      // American football
    'https://upload.wikimedia.org/wikipedia/commons/e/e4/Cricket_ball.svg'            // cricket ball
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
  // Create a shuffled copy of the list to avoid immediate repetition
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Determine which images to display. Use a unique set first; if more are
  // requested than available, randomly repeat from the shuffled list.
  const imagesToShow = [];
  if (count <= shuffled.length) {
    imagesToShow.push(...shuffled.slice(0, count));
  } else {
    imagesToShow.push(...shuffled);
    while (imagesToShow.length < count) {
      const randIndex = Math.floor(Math.random() * shuffled.length);
      imagesToShow.push(shuffled[randIndex]);
    }
  }
  // Render images
  imagesToShow.forEach((src, idx) => {
    const img = document.createElement('img');
    img.src = src || 'https://via.placeholder.com/400x300?text=No+Image';
    img.alt = `${catId} image ${idx + 1}`;
    grid.appendChild(img);
  });
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