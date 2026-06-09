// ============================================
// OVERSIZED - Product Data & 3D Configurations
// ============================================

const products = [
    {
        id: 1,
        name: "Heavyweight Classic Black",
        category: "classic",
        price: 45,
        originalPrice: 55,
        badge: "bestseller",
        rating: 4.9,
        reviews: 847,
        colors: ["#0a0a0a", "#e8e8e8", "#8B4513"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
        description: "The OG. Our signature 280gsm heavyweight tee in classic black. Drop shoulder, extended body, reinforced collar. The tee that started it all."
    },
    {
        id: 2,
        name: "Iron Pump Graphic Tee",
        category: "graphic",
        price: 55,
        originalPrice: null,
        badge: "new",
        rating: 4.8,
        reviews: 234,
        colors: ["#0a0a0a", "#1a1a2e"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
        description: "Bold graphic print on our heavyweight base. Premium screen-printed design that won't crack or fade. For those who lift loud."
    },
    {
        id: 3,
        name: "Limited Edition Gold",
        category: "limited",
        price: 75,
        originalPrice: null,
        badge: "limited",
        rating: 5.0,
        reviews: 89,
        colors: ["#1a1a1a", "#0a0a0a"],
        sizes: ["M", "L", "XL"],
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
        description: "Limited drop of 500 pieces. Gold foil logo, custom woven label, numbered certificate. For the collectors."
    },
    {
        id: 4,
        name: "Oversized Whiteout",
        category: "classic",
        price: 45,
        originalPrice: null,
        badge: null,
        rating: 4.7,
        reviews: 412,
        colors: ["#f5f5f5", "#0a0a0a"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
        description: "Clean, crisp white on our heavyweight cotton. The perfect blank canvas. Pairs with anything, works for everything."
    },
    {
        id: 5,
        name: "Beast Mode Camo",
        category: "graphic",
        price: 60,
        originalPrice: null,
        badge: null,
        rating: 4.8,
        reviews: 567,
        colors: ["#3d3d3d", "#0a0a0a"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
        description: "Tonal camo pattern with subtle OVERSIZED branding. Military-grade construction meets gym aesthetics."
    },
    {
        id: 6,
        name: "Midnight Navy Drop",
        category: "classic",
        price: 45,
        originalPrice: 50,
        badge: null,
        rating: 4.9,
        reviews: 321,
        colors: ["#1a1a2e", "#0a0a0a", "#f5f5f5"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
        description: "Deep navy with our signature drop-shoulder cut. A sophisticated take on gym wear that transitions seamlessly to street."
    }
];

const reviews = [
    {
        id: 1,
        name: "Marcus T.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        rating: 5,
        text: "Finally a tee that doesn't shrink after one wash. The 280gsm weight is perfect - heavy enough to drape well, light enough to train in. Already bought 3 more.",
        product: "Heavyweight Classic Black",
        productImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80",
        verified: true
    },
    {
        id: 2,
        name: "Sarah K.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        rating: 5,
        text: "The oversized fit is chef's kiss. Not too baggy, not too fitted. The drop shoulder detail makes my shoulders look amazing. 10/10 would recommend.",
        product: "Oversized Whiteout",
        productImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100&q=80",
        verified: true
    },
    {
        id: 3,
        name: "James R.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        rating: 5,
        text: "Been through 50+ washes and it still looks brand new. The collar hasn't stretched, the color hasn't faded. This is the only gym tee I'll buy from now on.",
        product: "Heavyweight Classic Black",
        productImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80",
        verified: true
    },
    {
        id: 4,
        name: "Alex M.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        rating: 4,
        text: "Great quality fabric and the graphic print is really well done. Sizing runs slightly large so I'd recommend going true to size for the oversized look.",
        product: "Iron Pump Graphic Tee",
        productImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&q=80",
        verified: true
    },
    {
        id: 5,
        name: "Jordan L.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
        rating: 5,
        text: "The limited edition packaging alone is worth it. The gold foil detail is stunning in person. Wearing this feels like wearing a piece of art.",
        product: "Limited Edition Gold",
        productImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&q=80",
        verified: true
    },
    {
        id: 6,
        name: "Chris P.",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
        rating: 5,
        text: "Best gym tee I've ever owned. The fabric weight is perfect for deadlifts - no riding up, no bunching. The extended length covers everything it needs to.",
        product: "Beast Mode Camo",
        productImage: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=100&q=80",
        verified: true
    }
];

// 3D Scene Configurations
const heroSceneConfig = {
    particleCount: 200,
    particleColor: 0xff6b35,
    particleSize: 0.5,
    sphereRadius: 15,
    rotationSpeed: 0.001,
    mouseInfluence: 0.5
};

const showcaseSceneConfig = {
    shirtColor: 0x1a1a1a,
    shirtRoughness: 0.8,
    shirtMetalness: 0.1,
    lightIntensity: 1.5,
    ambientIntensity: 0.4,
    rotationSpeed: 0.005
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, reviews, heroSceneConfig, showcaseSceneConfig };
}
