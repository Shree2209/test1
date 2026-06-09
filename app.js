// ============================================
// OVERSIZED - Main Application
// Three.js Scenes, GSAP Animations, Lenis Scroll
// ============================================

// Initialize Lenis smooth scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

if (window.matchMedia('(pointer: fine)').matches && cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.left = cursorX - 4 + 'px';
        cursor.style.top = cursorY - 4 + 'px';
        cursorFollower.style.left = followerX - 20 + 'px';
        cursorFollower.style.top = followerY - 20 + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .product-card, .color-option, .size-option');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
}

// ============================================
// NAVIGATION
// ============================================
const nav = document.getElementById('mainNav');
let lastScroll = 0;

lenis.on('scroll', ({ scroll }) => {
    if (scroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    lastScroll = scroll;
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, { offset: -80 });
        }
    });
});

// ============================================
// THREE.JS HERO SCENE - Particle Sphere
// ============================================
function initHeroScene() {
    const container = document.getElementById('heroCanvas');
    if (!container) return;

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0); // Transparent background
        container.appendChild(renderer.domElement);

        // Create particle sphere
        const particleCount = 300;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color1 = new THREE.Color(0xff6b35);
        const color2 = new THREE.Color(0x00d4ff);

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const radius = 8 + Math.random() * 4;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            const mixRatio = Math.random();
            const mixedColor = color1.clone().lerp(color2, mixRatio);
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;

            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Add connecting lines
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dist = Math.sqrt(
                    Math.pow(positions[i * 3] - positions[j * 3], 2) +
                    Math.pow(positions[i * 3 + 1] - positions[j * 3 + 1], 2) +
                    Math.pow(positions[i * 3 + 2] - positions[j * 3 + 2], 2)
                );
                if (dist < 3) {
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                }
            }
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xff6b35,
            transparent: true,
            opacity: 0.1
        });
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        camera.position.z = 20;

        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // Animation
        function animate() {
            requestAnimationFrame(animate);

            particles.rotation.y += 0.001;
            particles.rotation.x += 0.0005;
            lines.rotation.y += 0.001;
            lines.rotation.x += 0.0005;

            // Mouse influence
            particles.rotation.y += mouseX * 0.002;
            particles.rotation.x += mouseY * 0.002;

            renderer.render(scene, camera);
        }
        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            if (container.offsetWidth > 0 && container.offsetHeight > 0) {
                camera.aspect = container.offsetWidth / container.offsetHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.offsetWidth, container.offsetHeight);
            }
        });
    } catch (e) {
        console.error('Hero scene error:', e);
    }
}

// ============================================
// THREE.JS SHOWCASE SCENE - Rotating T-Shirt
// ============================================
function initShowcaseScene() {
    const container = document.getElementById('showcaseCanvas');
    if (!container) return;

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0); // Transparent background
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(5, 10, 7);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        scene.add(mainLight);

        const rimLight = new THREE.SpotLight(0xff6b35, 2);
        rimLight.position.set(-5, 5, -5);
        rimLight.lookAt(0, 0, 0);
        scene.add(rimLight);

        const fillLight = new THREE.PointLight(0x00d4ff, 0.5);
        fillLight.position.set(5, 0, -5);
        scene.add(fillLight);

        // Create abstract t-shirt shape using multiple geometries
        const shirtGroup = new THREE.Group();

        // Main body
        const bodyGeometry = new THREE.BoxGeometry(3.5, 4.5, 0.3, 10, 10, 2);
        // Modify vertices to create rounded shape
        const bodyPositions = bodyGeometry.attributes.position;
        for (let i = 0; i < bodyPositions.count; i++) {
            const x = bodyPositions.getX(i);
            const y = bodyPositions.getY(i);
            const z = bodyPositions.getZ(i);

            // Round the bottom corners
            if (y < -1.5) {
                const dist = Math.sqrt(x * x);
                if (dist > 1.2) {
                    bodyPositions.setY(i, y + (dist - 1.2) * 0.3);
                }
            }

            // Add slight curve to front
            if (z > 0) {
                bodyPositions.setZ(i, z + Math.sin(x * 0.5) * 0.1);
            }
        }
        bodyGeometry.computeVertexNormals();

        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.7,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        shirtGroup.add(body);

        // Sleeves
        const sleeveGeometry = new THREE.CylinderGeometry(0.8, 1, 2, 16);
        sleeveGeometry.rotateZ(Math.PI / 2);

        const leftSleeve = new THREE.Mesh(sleeveGeometry, bodyMaterial);
        leftSleeve.position.set(-2.2, 1.5, 0);
        leftSleeve.rotation.z = -0.3;
        leftSleeve.castShadow = true;
        shirtGroup.add(leftSleeve);

        const rightSleeve = new THREE.Mesh(sleeveGeometry, bodyMaterial);
        rightSleeve.position.set(2.2, 1.5, 0);
        rightSleeve.rotation.z = 0.3;
        rightSleeve.castShadow = true;
        shirtGroup.add(rightSleeve);

        // Collar
        const collarGeometry = new THREE.TorusGeometry(0.6, 0.15, 8, 24, Math.PI);
        const collarMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.5,
            metalness: 0.2
        });
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.position.set(0, 2.3, 0);
        collar.rotation.x = Math.PI / 2;
        shirtGroup.add(collar);

        // Add subtle logo
        const logoGeometry = new THREE.PlaneGeometry(0.8, 0.3);
        const logoMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6b35,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.set(0, 0.5, 0.16);
        shirtGroup.add(logo);

        scene.add(shirtGroup);

        // Ground plane for shadow
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -3;
        ground.receiveShadow = true;
        scene.add(ground);

        camera.position.set(0, 0, 8);

        // Mouse drag rotation
        let isDragging = false;
        let previousMouseX = 0;
        let targetRotationY = 0;
        let targetRotationX = 0;

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMouseX = e.clientX;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMouseX;
                targetRotationY += deltaX * 0.01;
                previousMouseX = e.clientX;
            }
        });

        // Touch support
        container.addEventListener('touchstart', (e) => {
            isDragging = true;
            previousMouseX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', () => {
            isDragging = false;
        });

        container.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const deltaX = e.touches[0].clientX - previousMouseX;
                targetRotationY += deltaX * 0.01;
                previousMouseX = e.touches[0].clientX;
            }
        });

        // Animation
        function animate() {
            requestAnimationFrame(animate);

            // Auto-rotate when not dragging
            if (!isDragging) {
                targetRotationY += 0.003;
            }

            // Smooth rotation
            shirtGroup.rotation.y += (targetRotationY - shirtGroup.rotation.y) * 0.05;
            shirtGroup.rotation.x += (targetRotationX - shirtGroup.rotation.x) * 0.05;

            // Subtle floating animation
            shirtGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;

            renderer.render(scene, camera);
        }
        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            if (container.offsetWidth > 0 && container.offsetHeight > 0) {
                camera.aspect = container.offsetWidth / container.offsetHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.offsetWidth, container.offsetHeight);
            }
        });
    } catch (e) {
        console.error('Showcase scene error:', e);
    }
}

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    // Hero parallax
    gsap.utils.toArray('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax);
        gsap.to(el, {
            yPercent: speed * 100,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // Collection section reveal
    gsap.from('.collection .section-header', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.collection',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Product cards stagger
    gsap.utils.toArray('.product-card').forEach((card, i) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: 'power3.out'
                });
            }
        });
    });

    // Feature blocks
    gsap.utils.toArray('.feature-block').forEach(block => {
        gsap.to(block, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: block,
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });
    });

    // About section
    gsap.from('.about-text', {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });

    gsap.from('.about-image-stack', {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });

    // Newsletter
    gsap.from('.newsletter-content', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.newsletter',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Showcase section
    gsap.from('.showcase-content', {
        x: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.showcase',
            start: 'top 60%',
            toggleActions: 'play none none none'
        }
    });

    // Size guide
    gsap.from('.size-chart', {
        x: -40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.size-guide',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });

    gsap.from('.size-model', {
        x: 40,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.size-guide',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });
}

// ============================================
// PRODUCT GRID RENDERING
// ============================================
function renderProducts(filter) {
    filter = filter || 'all';
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    grid.innerHTML = filtered.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : ''}
                <button class="product-quick-view" data-id="${product.id}">Quick View</button>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${Array(5).fill(0).map((_, i) => `
                        <svg viewBox="0 0 24 24" fill="${i < Math.floor(product.rating) ? '#ffd700' : 'none'}" stroke="${i < Math.floor(product.rating) ? 'none' : '#ffd700'}" stroke-width="1.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    `).join('')}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">
                        $${product.price}
                        ${product.originalPrice ? `<span class="original">$${product.originalPrice}</span>` : ''}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-trigger animations for new cards
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 100);
        });
    }, 50);

    // Bind events
    bindProductEvents();
}

function bindProductEvents() {
    // Quick view
    document.querySelectorAll('.product-quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const product = products.find(p => p.id === parseInt(btn.dataset.id));
            if (product) openQuickView(product);
        });
    });

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const product = products.find(p => p.id === parseInt(btn.dataset.id));
            if (product && typeof cart !== 'undefined') {
                cart.addItem(product, product.colors[0], product.sizes[2], 1);
            }
        });
    });
}

// ============================================
// QUICK VIEW MODAL
// ============================================
let selectedColor = null;
let selectedSize = null;
let currentProduct = null;

function openQuickView(product) {
    currentProduct = product;
    selectedColor = product.colors[0];
    selectedSize = product.sizes[2];

    const modal = document.getElementById('quickViewModal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div class="modal-gallery">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-details">
            <div class="modal-category">${product.category}</div>
            <h2 class="modal-title">${product.name}</h2>
            <div class="modal-price">$${product.price}</div>
            <p class="modal-description">${product.description}</p>

            <div class="modal-options">
                <label class="option-label">Color</label>
                <div class="color-options">
                    ${product.colors.map((color, i) => `
                        <button class="color-option ${i === 0 ? 'active' : ''}" 
                                style="background: ${color};" 
                                data-color="${color}"></button>
                    `).join('')}
                </div>
            </div>

            <div class="modal-options">
                <label class="option-label">Size</label>
                <div class="size-options">
                    ${product.sizes.map((size, i) => `
                        <button class="size-option ${i === 2 ? 'active' : ''}" data-size="${size}">${size}</button>
                    `).join('')}
                </div>
            </div>

            <div class="modal-actions">
                <div class="modal-qty">
                    <button class="qty-btn modal-qty-decrease">-</button>
                    <span class="modal-qty-value">1</span>
                    <button class="qty-btn modal-qty-increase">+</button>
                </div>
                <button class="modal-add-cart">Add to Cart - $${product.price}</button>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Bind modal events
    bindModalEvents(product);
}

function bindModalEvents(product) {
    let qty = 1;

    // Color selection
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedColor = btn.dataset.color;
        });
    });

    // Size selection
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
        });
    });

    // Quantity
    const decreaseBtn = document.querySelector('.modal-qty-decrease');
    const increaseBtn = document.querySelector('.modal-qty-increase');
    const qtyValue = document.querySelector('.modal-qty-value');
    const addCartBtn = document.querySelector('.modal-add-cart');

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (qty > 1) {
                qty--;
                if (qtyValue) qtyValue.textContent = qty;
                if (addCartBtn) addCartBtn.textContent = `Add to Cart - $${(product.price * qty).toFixed(2)}`;
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            if (qty < 10) {
                qty++;
                if (qtyValue) qtyValue.textContent = qty;
                if (addCartBtn) addCartBtn.textContent = `Add to Cart - $${(product.price * qty).toFixed(2)}`;
            }
        });
    }

    // Add to cart
    if (addCartBtn) {
        addCartBtn.addEventListener('click', () => {
            if (typeof cart !== 'undefined') {
                cart.addItem(product, selectedColor, selectedSize, qty);
            }
            closeQuickView();
        });
    }
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');
if (modalClose) modalClose.addEventListener('click', closeQuickView);
if (modalOverlay) modalOverlay.addEventListener('click', closeQuickView);

// ============================================
// FILTER BUTTONS
// ============================================
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// ============================================
// REVIEWS RENDERING
// ============================================
function renderReviews() {
    const carousel = document.getElementById('reviewsCarousel');
    if (!carousel) return;

    carousel.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <img src="${review.avatar}" alt="${review.name}" class="review-avatar">
                <div class="review-meta">
                    <div class="review-name">${review.name}</div>
                    ${review.verified ? `
                        <div class="review-verified">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            Verified Buyer
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="review-rating">
                ${Array(5).fill(0).map((_, i) => `
                    <svg viewBox="0 0 24 24" fill="${i < review.rating ? '#ffd700' : 'none'}" stroke="${i < review.rating ? 'none' : '#ffd700'}" stroke-width="1.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                `).join('')}
            </div>
            <p class="review-text">"${review.text}"</p>
            <div class="review-product">
                <img src="${review.productImage}" alt="${review.product}">
                <span>${review.product}</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// SIZE GUIDE INTERACTION
// ============================================
document.querySelectorAll('.size-row:not(.header)').forEach(row => {
    row.addEventListener('click', () => {
        document.querySelectorAll('.size-row').forEach(r => r.classList.remove('active'));
        row.classList.add('active');
    });
});

// ============================================
// NEWSLETTER FORM
// ============================================
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = e.target.querySelector('input');
        if (input && input.value && typeof cart !== 'undefined') {
            cart.showToast('Welcome to the movement! Check your inbox.');
            input.value = '';
        }
    });
}

// ============================================
// MARQUEE SPEED ON SCROLL
// ============================================
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
    lenis.on('scroll', ({ velocity }) => {
        const newSpeed = Math.max(5, 20 - Math.abs(velocity) * 0.5);
        marqueeTrack.style.animationDuration = newSpeed + 's';
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initHeroScene();
    initShowcaseScene();
    initScrollAnimations();
    renderProducts();
    renderReviews();

    // Make product cards visible with stagger
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 100);
        });
    }, 500);
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeQuickView();
        if (typeof cart !== 'undefined') cart.closeCart();
        if (typeof closeCheckout === 'function') closeCheckout();
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
