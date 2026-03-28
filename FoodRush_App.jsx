import { useState, useEffect, useReducer, createContext, useContext, useCallback, useRef } from "react";

// ============================================================
// THEME & DESIGN TOKENS
// ============================================================
const COLORS = {
  primary: "#FF4500",
  primaryLight: "#FF6B35",
  primaryDark: "#CC3700",
  secondary: "#1A1A2E",
  accent: "#FFD700",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  bg: "#FAFAF8",
  bgDark: "#0F0F1A",
  card: "#FFFFFF",
  cardDark: "#1E1E2E",
  text: "#1A1A2E",
  textMuted: "#6B7280",
  textDark: "#F1F5F9",
  border: "#E5E7EB",
  borderDark: "#2D2D3F",
};

// ============================================================
// DATA
// ============================================================
const CATEGORIES = [
  { id: 1, name: "Pizza", emoji: "🍕", color: "#FF6B6B" },
  { id: 2, name: "Burger", emoji: "🍔", color: "#FFA07A" },
  { id: 3, name: "Indian", emoji: "🍛", color: "#FFD700" },
  { id: 4, name: "Chinese", emoji: "🍜", color: "#98FB98" },
  { id: 5, name: "Sushi", emoji: "🍣", color: "#87CEEB" },
  { id: 6, name: "Desserts", emoji: "🍰", color: "#FFB6C1" },
  { id: 7, name: "Biryani", emoji: "🍚", color: "#DEB887" },
  { id: 8, name: "Rolls", emoji: "🌯", color: "#90EE90" },
];

// Reliable image helper using picsum for restaurant covers + foodish for food items
const IMG = {
  // Restaurant banners - using reliable picsum seeds mapped to food themes
  indianRest: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&h=360&q=80",
  burgerRest: "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=600&h=360&q=80",
  chineseRest: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&h=360&q=80",
  pizzaRest: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&h=360&q=80",
  sushiRest: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&w=600&h=360&q=80",
  bakeryRest: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&h=360&q=80",
  // Menu food images
  butterChicken: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&h=300&q=80",
  dalMakhani: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=400&h=300&q=80",
  naan: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&h=300&q=80",
  biryani: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&h=300&q=80",
  paneerTikka: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&h=300&q=80",
  lassi: "https://images.unsplash.com/photo-1571006682735-bcd7d2f4aad7?auto=format&fit=crop&w=400&h=300&q=80",
  smashBurger: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=400&h=300&q=80",
  chickenBurger: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=400&h=300&q=80",
  veggieBurger: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=400&h=300&q=80",
  fries: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=400&h=300&q=80",
  shake: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=300&q=80",
  kungPao: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&h=300&q=80",
  friedRice: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=400&h=300&q=80",
  dimsum: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&h=300&q=80",
  noodles: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&h=300&q=80",
  margherita: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&h=300&q=80",
  bbqPizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&h=300&q=80",
  farmhouse: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=400&h=300&q=80",
  garlicBread: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=400&h=300&q=80",
  nigiri: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&w=400&h=300&q=80",
  dragonRoll: "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?auto=format&fit=crop&w=400&h=300&q=80",
  maki: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&h=300&q=80",
  lavaCake: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=400&h=300&q=80",
  tiramisu: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&h=300&q=80",
  cheesecake: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&h=300&q=80",
  croissant: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&h=300&q=80",
};

const RESTAURANTS = [
  {
    id: 1,
    name: "Flame & Fork",
    image: IMG.indianRest,
    rating: 4.7,
    deliveryTime: "20-30 min",
    cuisine: ["North Indian", "Mughlai"],
    priceForTwo: 600,
    isVeg: false,
    discount: "40% OFF up to ₹80",
    category: "Indian",
    reviews: 2841,
    featured: true,
    menu: [
      { id: 101, name: "Butter Chicken", price: 320, category: "Main Course", isVeg: false, description: "Tender chicken in rich tomato-butter sauce", rating: 4.8, image: IMG.butterChicken },
      { id: 102, name: "Dal Makhani", price: 250, category: "Main Course", isVeg: true, description: "Slow-cooked black lentils with cream", rating: 4.6, image: IMG.dalMakhani },
      { id: 103, name: "Garlic Naan", price: 60, category: "Breads", isVeg: true, description: "Soft leavened bread with garlic", rating: 4.5, image: IMG.naan },
      { id: 104, name: "Chicken Biryani", price: 380, category: "Rice", isVeg: false, description: "Aromatic basmati rice with spiced chicken", rating: 4.9, image: IMG.biryani },
      { id: 105, name: "Paneer Tikka", price: 280, category: "Starters", isVeg: true, description: "Grilled cottage cheese with spices", rating: 4.7, image: IMG.paneerTikka },
      { id: 106, name: "Mango Lassi", price: 120, category: "Beverages", isVeg: true, description: "Chilled yogurt drink with alphonso mango", rating: 4.4, image: IMG.lassi },
    ]
  },
  {
    id: 2,
    name: "Burger Republic",
    image: IMG.burgerRest,
    rating: 4.5,
    deliveryTime: "15-25 min",
    cuisine: ["American", "Fast Food"],
    priceForTwo: 400,
    isVeg: false,
    discount: "Free delivery",
    category: "Burger",
    reviews: 1932,
    featured: true,
    menu: [
      { id: 201, name: "Classic Smash Burger", price: 249, category: "Burgers", isVeg: false, description: "Double smash patty with American cheese", rating: 4.8, image: IMG.smashBurger },
      { id: 202, name: "Crispy Chicken Burger", price: 219, category: "Burgers", isVeg: false, description: "Crispy fried chicken with coleslaw", rating: 4.6, image: IMG.chickenBurger },
      { id: 203, name: "Veggie Crunch", price: 179, category: "Burgers", isVeg: true, description: "Crispy veggie patty with fresh veggies", rating: 4.3, image: IMG.veggieBurger },
      { id: 204, name: "Loaded Fries", price: 149, category: "Sides", isVeg: true, description: "Fries loaded with cheese sauce and jalapeños", rating: 4.5, image: IMG.fries },
      { id: 205, name: "Chocolate Shake", price: 129, category: "Beverages", isVeg: true, description: "Thick creamy chocolate milkshake", rating: 4.7, image: IMG.shake },
    ]
  },
  {
    id: 3,
    name: "Dragon Palace",
    image: IMG.chineseRest,
    rating: 4.3,
    deliveryTime: "25-35 min",
    cuisine: ["Chinese", "Pan Asian"],
    priceForTwo: 500,
    isVeg: false,
    discount: "20% OFF",
    category: "Chinese",
    reviews: 1456,
    featured: false,
    menu: [
      { id: 301, name: "Kung Pao Chicken", price: 320, category: "Main Course", isVeg: false, description: "Spicy stir-fried chicken with peanuts", rating: 4.5, image: IMG.kungPao },
      { id: 302, name: "Veg Fried Rice", price: 220, category: "Rice & Noodles", isVeg: true, description: "Wok-tossed rice with vegetables", rating: 4.2, image: IMG.friedRice },
      { id: 303, name: "Dimsums (6 pcs)", price: 240, category: "Dim Sum", isVeg: false, description: "Steamed dumplings with sesame dip", rating: 4.7, image: IMG.dimsum },
      { id: 304, name: "Hakka Noodles", price: 200, category: "Rice & Noodles", isVeg: true, description: "Tossed noodles with soy and vegetables", rating: 4.4, image: IMG.noodles },
    ]
  },
  {
    id: 4,
    name: "Pizza Paradise",
    image: IMG.pizzaRest,
    rating: 4.6,
    deliveryTime: "20-30 min",
    cuisine: ["Italian", "Pizza"],
    priceForTwo: 700,
    isVeg: false,
    discount: "Buy 1 Get 1",
    category: "Pizza",
    reviews: 3210,
    featured: true,
    menu: [
      { id: 401, name: "Margherita", price: 299, category: "Pizzas", isVeg: true, description: "Classic tomato sauce with fresh mozzarella", rating: 4.5, image: IMG.margherita },
      { id: 402, name: "BBQ Chicken", price: 399, category: "Pizzas", isVeg: false, description: "Smoky BBQ chicken with caramelized onions", rating: 4.8, image: IMG.bbqPizza },
      { id: 403, name: "Farmhouse", price: 349, category: "Pizzas", isVeg: true, description: "Bell peppers, mushrooms, corn, olives", rating: 4.4, image: IMG.farmhouse },
      { id: 404, name: "Garlic Bread", price: 129, category: "Sides", isVeg: true, description: "Crispy garlic bread with herb butter", rating: 4.3, image: IMG.garlicBread },
    ]
  },
  {
    id: 5,
    name: "Sushi Zen",
    image: IMG.sushiRest,
    rating: 4.8,
    deliveryTime: "30-45 min",
    cuisine: ["Japanese", "Sushi"],
    priceForTwo: 1200,
    isVeg: false,
    discount: "15% OFF",
    category: "Sushi",
    reviews: 892,
    featured: false,
    menu: [
      { id: 501, name: "Salmon Nigiri (4 pcs)", price: 480, category: "Nigiri", isVeg: false, description: "Fresh Atlantic salmon over seasoned rice", rating: 4.9, image: IMG.nigiri },
      { id: 502, name: "Dragon Roll (8 pcs)", price: 560, category: "Rolls", isVeg: false, description: "Shrimp tempura topped with avocado", rating: 4.8, image: IMG.dragonRoll },
      { id: 503, name: "Veggie Maki (6 pcs)", price: 320, category: "Maki", isVeg: true, description: "Cucumber, avocado, and pickled radish", rating: 4.5, image: IMG.maki },
    ]
  },
  {
    id: 6,
    name: "Sweet Tooth Bakery",
    image: IMG.bakeryRest,
    rating: 4.4,
    deliveryTime: "15-20 min",
    cuisine: ["Desserts", "Bakery"],
    priceForTwo: 300,
    isVeg: true,
    discount: "Free dessert on ₹500+",
    category: "Desserts",
    reviews: 1678,
    featured: false,
    menu: [
      { id: 601, name: "Chocolate Lava Cake", price: 189, category: "Cakes", isVeg: true, description: "Warm chocolate cake with molten center", rating: 4.9, image: IMG.lavaCake },
      { id: 602, name: "Tiramisu", price: 220, category: "Desserts", isVeg: true, description: "Classic Italian coffee dessert", rating: 4.7, image: IMG.tiramisu },
      { id: 603, name: "Cheesecake Slice", price: 179, category: "Cakes", isVeg: true, description: "New York style with berry compote", rating: 4.6, image: IMG.cheesecake },
      { id: 604, name: "Croissant", price: 89, category: "Bakery", isVeg: true, description: "Buttery flaky French croissant", rating: 4.4, image: IMG.croissant },
    ]
  },
];

const COUPONS = {
  "FIRST50": { discount: 50, type: "percent", minOrder: 200, description: "50% off on first order" },
  "RUSH20": { discount: 20, type: "percent", minOrder: 300, description: "20% off on orders above ₹300" },
  "FLAT100": { discount: 100, type: "flat", minOrder: 500, description: "₹100 off on orders above ₹500" },
};

// ============================================================
// CONTEXTS
// ============================================================
const AppContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return { ...state, items: state.items.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }], restaurantId: action.restaurantId };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(i => i.id !== action.id), restaurantId: state.items.length <= 1 ? null : state.restaurantId };
    case "INC_ITEM":
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i) };
    case "DEC_ITEM": {
      const item = state.items.find(i => i.id === action.id);
      if (item.qty === 1) return { ...state, items: state.items.filter(i => i.id !== action.id), restaurantId: state.items.length <= 1 ? null : state.restaurantId };
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i) };
    }
    case "CLEAR_CART":
      return { items: [], restaurantId: null };
    case "SET_COUPON":
      return { ...state, coupon: action.coupon };
    case "REMOVE_COUPON":
      return { ...state, coupon: null };
    default:
      return state;
  }
};

// ============================================================
// UTILITIES
// ============================================================
const formatPrice = (p) => `₹${p}`;
const getCartTotal = (items) => items.reduce((s, i) => s + i.price * i.qty, 0);
const getCartCount = (items) => items.reduce((s, i) => s + i.qty, 0);
const stars = (r) => "★".repeat(Math.floor(r)) + (r % 1 >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.ceil(r));

// ============================================================
// GLOBAL STYLES
// ============================================================
const GlobalStyle = ({ dark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --primary: #FF4500;
      --primary-light: #FF6B35;
      --accent: #FFD700;
      --bg: ${dark ? "#0F0F1A" : "#FAFAF8"};
      --bg2: ${dark ? "#1A1A2E" : "#F3F4F6"};
      --card: ${dark ? "#1E1E2E" : "#FFFFFF"};
      --card2: ${dark ? "#252535" : "#F9FAFB"};
      --text: ${dark ? "#F1F5F9" : "#1A1A2E"};
      --text2: ${dark ? "#94A3B8" : "#6B7280"};
      --border: ${dark ? "#2D2D3F" : "#E5E7EB"};
      --shadow: ${dark ? "0 4px 24px rgba(0,0,0,0.5)" : "0 4px 24px rgba(0,0,0,0.08)"};
    }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); transition: background 0.3s, color 0.3s; }
    h1,h2,h3,h4,h5,h6 { font-family: 'Syne', sans-serif; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--primary); }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }
    input, textarea, select { font-family: inherit; }
    a { text-decoration: none; color: inherit; }
    .hide-scroll::-webkit-scrollbar { display: none; }
    .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes pop { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
    @keyframes toastIn { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes toastOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(110%); opacity: 0; } }
    .fade-in { animation: fadeIn 0.4s ease both; }
    .pop { animation: pop 0.3s ease; }
    .shimmer-bg {
      background: linear-gradient(90deg, var(--border) 25%, var(--card2) 50%, var(--border) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
  `}</style>
);

// ============================================================
// TOAST
// ============================================================
const ToastContext = createContext(null);
let toastId = 0;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = ++toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div style={{ position: "fixed", top: 80, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === "error" ? "#EF4444" : t.type === "warning" ? "#F59E0B" : "#22C55E",
            color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 600, fontSize: 14,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 8,
            animation: "toastIn 0.3s ease both", minWidth: 220, maxWidth: 320,
          }}>
            <span>{t.type === "error" ? "✕" : t.type === "warning" ? "⚠" : "✓"}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => useContext(ToastContext);

// ============================================================
// SKELETON
// ============================================================
const Skeleton = ({ w = "100%", h = 20, r = 8, style = {} }) => (
  <div className="shimmer-bg" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

const RestaurantCardSkeleton = () => (
  <div style={{ background: "var(--card)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow)" }}>
    <Skeleton h={180} r={0} />
    <div style={{ padding: 16 }}>
      <Skeleton h={20} w="70%" style={{ marginBottom: 8 }} />
      <Skeleton h={14} w="50%" style={{ marginBottom: 8 }} />
      <Skeleton h={14} w="40%" />
    </div>
  </div>
);

// ============================================================
// NAVBAR
// ============================================================
const Navbar = ({ page, setPage, cartCount, user, setUser, dark, setDark }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "var(--card)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      boxShadow: scrolled ? "var(--shadow)" : "none",
      transition: "all 0.3s ease",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🍔</div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, color: "var(--primary)" }}>FoodRush</span>
        </button>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[
            { label: "Home", key: "home" },
            { label: "Restaurants", key: "restaurants" },
            { label: "Orders", key: "orders" },
          ].map(item => (
            <button key={item.key} onClick={() => setPage(item.key)} style={{
              padding: "8px 16px", borderRadius: 10, fontWeight: 500, fontSize: 14,
              color: page === item.key ? "var(--primary)" : "var(--text2)",
              background: page === item.key ? "rgba(255,69,0,0.1)" : "transparent",
              transition: "all 0.2s",
            }}>{item.label}</button>
          ))}

          {/* Cart */}
          <button onClick={() => setPage("cart")} style={{
            padding: "8px 16px", borderRadius: 10, fontWeight: 600, fontSize: 14,
            background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", gap: 8,
            position: "relative", transition: "all 0.2s",
          }}>
            🛒 Cart
            {cartCount > 0 && (
              <span style={{
                background: "var(--accent)", color: "#1A1A2E", borderRadius: "50%",
                width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, position: "absolute", top: -6, right: -6,
                animation: "pop 0.3s ease",
              }}>{cartCount}</span>
            )}
          </button>

          {/* Dark mode */}
          <button onClick={() => setDark(!dark)} style={{
            width: 36, height: 36, borderRadius: 10, background: "var(--bg2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>{dark ? "☀️" : "🌙"}</button>

          {/* Auth */}
          {user ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                width: 36, height: 36, borderRadius: "50%", background: "var(--primary)",
                color: "#fff", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
              }}>{user.name[0].toUpperCase()}</button>
              {menuOpen && (
                <div style={{
                  position: "absolute", right: 0, top: 44, background: "var(--card)",
                  borderRadius: 12, boxShadow: "var(--shadow)", border: "1px solid var(--border)",
                  padding: 8, minWidth: 160, zIndex: 10,
                }}>
                  <button onClick={() => { setPage("profile"); setMenuOpen(false); }} style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", borderRadius: 8, fontSize: 14, color: "var(--text)", fontWeight: 500 }}>👤 Profile</button>
                  <button onClick={() => { setPage("orders"); setMenuOpen(false); }} style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", borderRadius: 8, fontSize: 14, color: "var(--text)", fontWeight: 500 }}>📦 Orders</button>
                  <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
                  <button onClick={() => { setUser(null); setMenuOpen(false); }} style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", borderRadius: 8, fontSize: 14, color: "#EF4444", fontWeight: 500 }}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setPage("auth")} style={{
              padding: "8px 16px", borderRadius: 10, fontWeight: 600, fontSize: 14,
              border: "2px solid var(--primary)", color: "var(--primary)", transition: "all 0.2s",
            }}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
};

// ============================================================
// HOME PAGE
// ============================================================
const HomePage = ({ setPage, setSelectedRestaurant }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (search.length > 1) {
      const s = RESTAURANTS.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.some(c => c.toLowerCase().includes(search.toLowerCase()))
      );
      setSuggestions(s.slice(0, 4));
    } else {
      setSuggestions([]);
    }
  }, [search]);

  const featured = RESTAURANTS.filter(r => r.featured);

  return (
    <div>
      {/* HERO */}
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, #FF4500 0%, #FF6B35 40%, #FF8C42 70%, #FFB347 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", padding: "80px 24px 60px",
        position: "relative", overflow: "hidden",
      }}>
        {/* BG decorations */}
        {["🍕","🍔","🍜","🍣","🌮","🍰","🍗","🥗"].map((e, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${5 + (i * 13) % 90}%`,
            top: `${10 + (i * 17) % 80}%`,
            fontSize: `${24 + (i * 7) % 20}px`,
            opacity: 0.12,
            animation: `pulse ${2 + i * 0.4}s ease-in-out infinite`,
            transform: `rotate(${i * 45}deg)`,
            userSelect: "none",
          }}>{e}</div>
        ))}

        <div style={{ textAlign: "center", maxWidth: 700, animation: "fadeIn 0.6s ease both" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: 20, color: "#fff", fontSize: 13, fontWeight: 600, backdropFilter: "blur(4px)" }}>
            🚀 30-minute delivery guarantee
          </div>
          <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
            Cravings delivered,<br /><span style={{ color: "#FFD700" }}>lightning fast.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 18, marginBottom: 40, lineHeight: 1.6 }}>
            Order from 500+ restaurants near you. Fresh food, fast delivery.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
            <div style={{
              background: "#fff", borderRadius: 16, padding: "6px 6px 6px 20px",
              display: "flex", alignItems: "center", gap: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}>
              <span style={{ fontSize: 20 }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search restaurants, cuisines..."
                style={{ flex: 1, border: "none", outline: "none", fontSize: 16, background: "transparent", color: "#1A1A2E" }}
              />
              <button onClick={() => { setPage("restaurants"); setSearch(""); }} style={{
                background: "var(--primary)", color: "#fff", borderRadius: 12, padding: "12px 24px",
                fontWeight: 700, fontSize: 15, fontFamily: "Syne",
              }}>Search</button>
            </div>

            {/* Autocomplete */}
            {suggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
                background: "#fff", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                overflow: "hidden", zIndex: 100,
              }}>
                {suggestions.map(r => (
                  <button key={r.id} onClick={() => { setSelectedRestaurant(r); setPage("restaurant"); setSearch(""); }} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 20px",
                    width: "100%", textAlign: "left", borderBottom: "1px solid #f0f0f0",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FFF7F5"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    <img src={r.image} alt={r.name} onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/f3f4f6/999?text=R`; }} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", display: "block", background: "#f3f4f6" }} />
                    <div>
                      <div style={{ fontWeight: 600, color: "#1A1A2E", fontSize: 14 }}>{r.name}</div>
                      <div style={{ color: "#6B7280", fontSize: 12 }}>{r.cuisine.join(", ")}</div>
                    </div>
                    <div style={{ marginLeft: "auto", color: "#6B7280", fontSize: 12 }}>⭐ {r.rating}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
            {[["500+", "Restaurants"], ["50K+", "Happy customers"], ["30 min", "Avg delivery"]].map(([v, l]) => (
              <div key={l} style={{ color: "#fff", textAlign: "center" }}>
                <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 28 }}>{v}</div>
                <div style={{ opacity: 0.8, fontSize: 13 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px 0" }}>
        <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 28, marginBottom: 24 }}>What's on your mind?</h2>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }} className="hide-scroll">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { setActiveCategory(activeCategory === cat.name ? null : cat.name); setPage("restaurants"); }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                minWidth: 90, padding: "16px 12px", borderRadius: 16,
                background: activeCategory === cat.name ? "var(--primary)" : "var(--card)",
                boxShadow: "var(--shadow)", border: "1px solid var(--border)",
                transition: "all 0.2s", animation: "fadeIn 0.4s ease both",
              }}>
              <div style={{ fontSize: 32, background: cat.color + "22", borderRadius: 12, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>{cat.emoji}</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: activeCategory === cat.name ? "#fff" : "var(--text)", whiteSpace: "nowrap" }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* OFFERS BANNER */}
      <div style={{ maxWidth: 1280, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { bg: "linear-gradient(135deg, #FF4500, #FF8C42)", emoji: "🔥", title: "50% OFF", sub: "Use code FIRST50 on first order", code: "FIRST50" },
            { bg: "linear-gradient(135deg, #6366F1, #8B5CF6)", emoji: "⚡", title: "Free Delivery", sub: "On all orders above ₹299", code: null },
            { bg: "linear-gradient(135deg, #0EA5E9, #06B6D4)", emoji: "🎉", title: "New Arrivals", sub: "10 new restaurants this week", code: null },
          ].map((b, i) => (
            <div key={i} style={{ background: b.bg, borderRadius: 20, padding: "24px 28px", color: "#fff", display: "flex", alignItems: "center", gap: 20, animation: `fadeIn ${0.3 + i * 0.1}s ease both` }}>
              <div style={{ fontSize: 48 }}>{b.emoji}</div>
              <div>
                <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 24 }}>{b.title}</div>
                <div style={{ opacity: 0.9, fontSize: 14, marginBottom: b.code ? 8 : 0 }}>{b.sub}</div>
                {b.code && <span style={{ background: "rgba(255,255,255,0.25)", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{b.code}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED RESTAURANTS */}
      <div style={{ maxWidth: 1280, margin: "60px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 28 }}>Featured Restaurants</h2>
          <button onClick={() => setPage("restaurants")} style={{ color: "var(--primary)", fontWeight: 600, fontSize: 14 }}>See all →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {loading ? [1, 2, 3].map(k => <RestaurantCardSkeleton key={k} />) :
            featured.map((r, i) => <RestaurantCard key={r.id} r={r} i={i} setPage={setPage} setSelectedRestaurant={setSelectedRestaurant} />)
          }
        </div>
      </div>

      {/* ALL RESTAURANTS */}
      <div style={{ maxWidth: 1280, margin: "60px auto 80px", padding: "0 24px" }}>
        <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 28, marginBottom: 24 }}>All Restaurants</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {loading ? [1, 2, 3, 4, 5, 6].map(k => <RestaurantCardSkeleton key={k} />) :
            RESTAURANTS.map((r, i) => <RestaurantCard key={r.id} r={r} i={i} setPage={setPage} setSelectedRestaurant={setSelectedRestaurant} />)
          }
        </div>
      </div>
    </div>
  );
};

// ============================================================
// RESTAURANT CARD
// ============================================================
const RestaurantCard = ({ r, i, setPage, setSelectedRestaurant }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => { setSelectedRestaurant(r); setPage("restaurant"); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--card)", borderRadius: 16, overflow: "hidden", cursor: "pointer",
        boxShadow: hovered ? "0 12px 40px rgba(255,69,0,0.15)" : "var(--shadow)",
        border: "1px solid var(--border)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
        animation: `fadeIn ${0.2 + i * 0.1}s ease both`,
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={r.image} alt={r.name} loading="lazy" onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/600x360/FF4500/FFFFFF?text=${encodeURIComponent(r.name)}`; }} style={{ width: "100%", height: 180, objectFit: "cover", transition: "transform 0.4s", transform: hovered ? "scale(1.05)" : "scale(1)", display: "block", background: "#f3f4f6" }} />
        {r.discount && (
          <div style={{ position: "absolute", bottom: 12, left: 12, background: "var(--primary)", color: "#fff", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>
            {r.discount}
          </div>
        )}
        {r.isVeg ? (
          <div style={{ position: "absolute", top: 12, right: 12, background: "#22C55E", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 10, height: 10, background: "#fff", borderRadius: "50%" }} />
          </div>
        ) : (
          <div style={{ position: "absolute", top: 12, right: 12, background: "#EF4444", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 10, height: 10, background: "#fff", borderRadius: "50%" }} />
          </div>
        )}
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{r.name}</h3>
          <span style={{ background: "#22C55E", color: "#fff", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>⭐ {r.rating}</span>
        </div>
        <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 8 }}>{r.cuisine.join(", ")}</p>
        <div style={{ display: "flex", gap: 16, color: "var(--text2)", fontSize: 13 }}>
          <span>⏱ {r.deliveryTime}</span>
          <span>👥 {formatPrice(r.priceForTwo)} for two</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// RESTAURANTS LIST PAGE
// ============================================================
const RestaurantsPage = ({ setPage, setSelectedRestaurant }) => {
  const [filter, setFilter] = useState({ veg: false, rating: 0, maxPrice: 2000, sort: "rating" });
  const [search, setSearch] = useState("");

  const filtered = RESTAURANTS
    .filter(r => {
      if (filter.veg && !r.isVeg) return false;
      if (r.rating < filter.rating) return false;
      if (r.priceForTwo > filter.maxPrice) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.cuisine.some(c => c.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    })
    .sort((a, b) => {
      if (filter.sort === "rating") return b.rating - a.rating;
      if (filter.sort === "delivery") return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      if (filter.sort === "price") return a.priceForTwo - b.priceForTwo;
      return 0;
    });

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "90px 24px 80px" }}>
      <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 32, marginBottom: 8 }}>All Restaurants</h1>
      <p style={{ color: "var(--text2)", marginBottom: 32 }}>{filtered.length} restaurants available near you</p>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search restaurants..." style={{ border: "none", outline: "none", background: "transparent", color: "var(--text)", width: "100%", fontSize: 14 }} />
        </div>

        <select value={filter.sort} onChange={e => setFilter(f => ({ ...f, sort: e.target.value }))} style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 14, cursor: "pointer" }}>
          <option value="rating">Sort: Rating</option>
          <option value="delivery">Sort: Delivery Time</option>
          <option value="price">Sort: Price</option>
        </select>

        <button onClick={() => setFilter(f => ({ ...f, veg: !f.veg }))} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${filter.veg ? "#22C55E" : "var(--border)"}`, background: filter.veg ? "#22C55E22" : "var(--card)", color: filter.veg ? "#22C55E" : "var(--text2)", fontWeight: 600, fontSize: 14 }}>
          🥦 Veg Only
        </button>

        {[4.0, 4.5].map(v => (
          <button key={v} onClick={() => setFilter(f => ({ ...f, rating: f.rating === v ? 0 : v }))} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${filter.rating === v ? "var(--primary)" : "var(--border)"}`, background: filter.rating === v ? "rgba(255,69,0,0.1)" : "var(--card)", color: filter.rating === v ? "var(--primary)" : "var(--text2)", fontWeight: 600, fontSize: 14 }}>
            ⭐ {v}+
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {filtered.map((r, i) => <RestaurantCard key={r.id} r={r} i={i} setPage={setPage} setSelectedRestaurant={setSelectedRestaurant} />)}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "var(--text2)" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "Syne", fontSize: 20 }}>No restaurants found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// RESTAURANT DETAIL PAGE
// ============================================================
const RestaurantDetailPage = ({ restaurant, setPage }) => {
  const { cartDispatch, cartState } = useContext(AppContext);
  const toast = useToast();
  const [activeMenuCat, setActiveMenuCat] = useState(null);
  const [wishlist, setWishlist] = useState(false);

  if (!restaurant) { setPage("restaurants"); return null; }

  const menuCategories = [...new Set(restaurant.menu.map(i => i.category))];
  const filteredMenu = activeMenuCat ? restaurant.menu.filter(i => i.category === activeMenuCat) : restaurant.menu;

  const getQty = (itemId) => {
    const item = cartState.items.find(i => i.id === itemId);
    return item ? item.qty : 0;
  };

  const handleAdd = (item) => {
    if (cartState.restaurantId && cartState.restaurantId !== restaurant.id && cartState.items.length > 0) {
      toast("Clear current cart to order from a new restaurant", "warning");
      return;
    }
    cartDispatch({ type: "ADD_ITEM", item, restaurantId: restaurant.id });
    toast(`${item.name} added to cart! 🛒`);
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 80px" }}>
      {/* Back */}
      <button onClick={() => setPage("restaurants")} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text2)", fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
        ← Back to Restaurants
      </button>

      {/* Header */}
      <div style={{ borderRadius: 24, overflow: "hidden", marginBottom: 32, position: "relative" }}>
        <img src={restaurant.image} alt={restaurant.name} loading="lazy" onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/1200x400/FF4500/FFFFFF?text=${encodeURIComponent(restaurant.name)}`; }} style={{ width: "100%", height: 300, objectFit: "cover", display: "block", background: "#f3f4f6" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 24, left: 32, right: 32, color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(24px, 4vw, 40px)", marginBottom: 8 }}>{restaurant.name}</h1>
              <p style={{ opacity: 0.9, fontSize: 16, marginBottom: 8 }}>{restaurant.cuisine.join(", ")}</p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span style={{ background: "#22C55E", padding: "4px 12px", borderRadius: 8, fontSize: 14, fontWeight: 700 }}>⭐ {restaurant.rating} ({restaurant.reviews} reviews)</span>
                <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 8, fontSize: 14, backdropFilter: "blur(4px)" }}>⏱ {restaurant.deliveryTime}</span>
                <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 8, fontSize: 14, backdropFilter: "blur(4px)" }}>💰 {formatPrice(restaurant.priceForTwo)} for two</span>
              </div>
            </div>
            <button onClick={() => setWishlist(!wishlist)} style={{ fontSize: 32, transition: "transform 0.2s", transform: wishlist ? "scale(1.2)" : "scale(1)" }}>
              {wishlist ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
        {restaurant.discount && (
          <div style={{ position: "absolute", top: 24, left: 24, background: "var(--primary)", color: "#fff", borderRadius: 10, padding: "6px 14px", fontWeight: 700 }}>
            🎉 {restaurant.discount}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
        {/* MENU */}
        <div>
          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }} className="hide-scroll">
            <button onClick={() => setActiveMenuCat(null)} style={{ padding: "8px 16px", borderRadius: 20, fontWeight: 600, fontSize: 13, background: !activeMenuCat ? "var(--primary)" : "var(--card)", color: !activeMenuCat ? "#fff" : "var(--text2)", border: "1px solid var(--border)", whiteSpace: "nowrap", flexShrink: 0 }}>
              All Items
            </button>
            {menuCategories.map(cat => (
              <button key={cat} onClick={() => setActiveMenuCat(activeMenuCat === cat ? null : cat)} style={{ padding: "8px 16px", borderRadius: 20, fontWeight: 600, fontSize: 13, background: activeMenuCat === cat ? "var(--primary)" : "var(--card)", color: activeMenuCat === cat ? "#fff" : "var(--text2)", border: "1px solid var(--border)", whiteSpace: "nowrap", flexShrink: 0 }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filteredMenu.map((item, i) => {
              const qty = getQty(item.id);
              return (
                <div key={item.id} style={{ background: "var(--card)", borderRadius: 16, padding: 20, display: "flex", gap: 16, border: "1px solid var(--border)", animation: `fadeIn ${0.1 + i * 0.05}s ease both` }}>
                  <img src={item.image} alt={item.name} loading="lazy" onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/f3f4f6/999?text=${encodeURIComponent(item.name)}`; }} style={{ width: 100, height: 90, borderRadius: 12, objectFit: "cover", flexShrink: 0, display: "block", background: "#f3f4f6" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 16, height: 16, border: `2px solid ${item.isVeg ? "#22C55E" : "#EF4444"}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.isVeg ? "#22C55E" : "#EF4444" }} />
                      </div>
                      <h4 style={{ fontFamily: "Syne", fontWeight: 600, fontSize: 15 }}>{item.name}</h4>
                    </div>
                    <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 8, lineHeight: 1.4 }}>{item.description}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, color: "var(--primary)" }}>{formatPrice(item.price)}</span>
                      {qty === 0 ? (
                        <button onClick={() => handleAdd(item)} style={{ background: "var(--primary)", color: "#fff", borderRadius: 10, padding: "8px 20px", fontWeight: 700, fontSize: 14, transition: "all 0.2s" }}>
                          + Add
                        </button>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--primary)", borderRadius: 10, padding: "6px 14px" }}>
                          <button onClick={() => cartDispatch({ type: "DEC_ITEM", id: item.id })} style={{ color: "#fff", fontWeight: 700, fontSize: 18, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: "center" }}>{qty}</span>
                          <button onClick={() => { cartDispatch({ type: "INC_ITEM", id: item.id }); toast(`${item.name} qty updated`); }} style={{ color: "#fff", fontWeight: 700, fontSize: 18, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CART MINI */}
        <div style={{ position: "sticky", top: 90 }}>
          <CartMini setPage={setPage} restaurant={restaurant} />
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CART MINI
// ============================================================
const CartMini = ({ setPage, restaurant }) => {
  const { cartState, cartDispatch } = useContext(AppContext);
  const total = getCartTotal(cartState.items);
  const count = getCartCount(cartState.items);

  if (cartState.items.length === 0) {
    return (
      <div style={{ background: "var(--card)", borderRadius: 16, padding: 32, textAlign: "center", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
        <h3 style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 8 }}>Your cart is empty</h3>
        <p style={{ color: "var(--text2)", fontSize: 13 }}>Add items from the menu to get started</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "rgba(255,69,0,0.05)" }}>
        <h3 style={{ fontFamily: "Syne", fontWeight: 700 }}>🛒 Your Cart ({count} items)</h3>
        {restaurant && <p style={{ color: "var(--text2)", fontSize: 12, marginTop: 4 }}>{restaurant.name}</p>}
      </div>
      <div style={{ padding: "12px 20px", maxHeight: 320, overflowY: "auto" }} className="hide-scroll">
        {cartState.items.map(item => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
              <div style={{ color: "var(--primary)", fontSize: 13, fontWeight: 700 }}>{formatPrice(item.price)}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg2)", borderRadius: 8, padding: "4px 10px" }}>
              <button onClick={() => cartDispatch({ type: "DEC_ITEM", id: item.id })} style={{ fontWeight: 700, color: "var(--primary)", fontSize: 16 }}>−</button>
              <span style={{ fontWeight: 700, fontSize: 14, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
              <button onClick={() => cartDispatch({ type: "INC_ITEM", id: item.id })} style={{ fontWeight: 700, color: "var(--primary)", fontSize: 16 }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ color: "var(--text2)" }}>Subtotal</span>
          <span style={{ fontWeight: 700 }}>{formatPrice(total)}</span>
        </div>
        <button onClick={() => setPage("cart")} style={{ width: "100%", background: "var(--primary)", color: "#fff", borderRadius: 12, padding: 14, fontWeight: 700, fontSize: 15, fontFamily: "Syne" }}>
          View Cart & Checkout →
        </button>
      </div>
    </div>
  );
};

// ============================================================
// CART PAGE
// ============================================================
const CartPage = ({ setPage, user }) => {
  const { cartState, cartDispatch } = useContext(AppContext);
  const toast = useToast();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const subtotal = getCartTotal(cartState.items);
  const deliveryFee = subtotal > 299 ? 0 : 40;
  const discount = cartState.coupon
    ? cartState.coupon.type === "percent"
      ? Math.min(Math.floor(subtotal * cartState.coupon.discount / 100), 200)
      : cartState.coupon.discount
    : 0;
  const total = subtotal + deliveryFee - discount;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const c = COUPONS[code];
    if (!c) { setCouponError("Invalid coupon code"); return; }
    if (subtotal < c.minOrder) { setCouponError(`Min order ₹${c.minOrder} required`); return; }
    cartDispatch({ type: "SET_COUPON", coupon: { ...c, code } });
    setCouponError("");
    toast(`Coupon "${code}" applied! 🎉`);
  };

  if (cartState.items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>🛒</div>
        <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 28, marginBottom: 12 }}>Your cart is empty</h2>
        <p style={{ color: "var(--text2)", marginBottom: 32 }}>Looks like you haven't added anything yet</p>
        <button onClick={() => setPage("restaurants")} style={{ background: "var(--primary)", color: "#fff", borderRadius: 14, padding: "14px 32px", fontWeight: 700, fontSize: 16, fontFamily: "Syne" }}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  const restaurant = RESTAURANTS.find(r => r.id === cartState.restaurantId);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "90px 24px 80px" }}>
      <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 32, marginBottom: 8 }}>Your Cart</h1>
      {restaurant && <p style={{ color: "var(--text2)", marginBottom: 32 }}>Ordering from: <strong style={{ color: "var(--text)" }}>{restaurant.name}</strong></p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
        {/* Items */}
        <div>
          <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
            {cartState.items.map((item, i) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", borderBottom: i < cartState.items.length - 1 ? "1px solid var(--border)" : "none", animation: "fadeIn 0.3s ease both" }}>
                <img src={item.image} alt={item.name} loading="lazy" onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/200x180/f3f4f6/999?text=Food`; }} style={{ width: 70, height: 65, borderRadius: 10, objectFit: "cover", flexShrink: 0, display: "block", background: "#f3f4f6" }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 4 }}>{item.name}</h4>
                  <p style={{ color: "var(--primary)", fontWeight: 700 }}>{formatPrice(item.price)} × {item.qty} = {formatPrice(item.price * item.qty)}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--primary)", borderRadius: 10, padding: "8px 14px" }}>
                    <button onClick={() => cartDispatch({ type: "DEC_ITEM", id: item.id })} style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>−</button>
                    <span style={{ color: "#fff", fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => cartDispatch({ type: "INC_ITEM", id: item.id })} style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>+</button>
                  </div>
                  <button onClick={() => { cartDispatch({ type: "REMOVE_ITEM", id: item.id }); toast("Item removed", "warning"); }} style={{ color: "#EF4444", fontSize: 18, padding: 8 }}>🗑</button>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, marginTop: 24, border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 16 }}>🎟 Apply Coupon</h3>
            {cartState.coupon ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#22C55E22", borderRadius: 12, padding: "12px 16px", border: "1px dashed #22C55E" }}>
                <div>
                  <span style={{ fontWeight: 700, color: "#22C55E" }}>{cartState.coupon.code}</span>
                  <span style={{ color: "var(--text2)", fontSize: 13, marginLeft: 8 }}>— {cartState.coupon.description}</span>
                </div>
                <button onClick={() => { cartDispatch({ type: "REMOVE_COUPON" }); toast("Coupon removed", "warning"); }} style={{ color: "#EF4444", fontWeight: 700 }}>✕</button>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input value={couponInput} onChange={e => { setCouponInput(e.target.value); setCouponError(""); }} placeholder="Enter coupon code" style={{ flex: 1, padding: "12px 16px", borderRadius: 10, border: `1px solid ${couponError ? "#EF4444" : "var(--border)"}`, background: "var(--bg2)", color: "var(--text)", fontSize: 14 }} />
                  <button onClick={applyCoupon} style={{ background: "var(--primary)", color: "#fff", borderRadius: 10, padding: "12px 20px", fontWeight: 700 }}>Apply</button>
                </div>
                {couponError && <p style={{ color: "#EF4444", fontSize: 12 }}>{couponError}</p>}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                  {Object.keys(COUPONS).map(code => (
                    <button key={code} onClick={() => { setCouponInput(code); setCouponError(""); }} style={{ padding: "4px 12px", borderRadius: 20, border: "1px dashed var(--primary)", color: "var(--primary)", fontSize: 12, fontWeight: 600 }}>{code}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div style={{ position: "sticky", top: 90 }}>
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Order Summary</h3>
            {[
              ["Subtotal", formatPrice(subtotal)],
              ["Delivery Fee", deliveryFee === 0 ? <span style={{ color: "#22C55E" }}>FREE</span> : formatPrice(deliveryFee)],
              ...(discount > 0 ? [["Discount", <span style={{ color: "#22C55E" }}>−{formatPrice(discount)}</span>]] : []),
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 15 }}>
                <span style={{ color: "var(--text2)" }}>{l}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18 }}>Total</span>
              <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 22, color: "var(--primary)" }}>{formatPrice(total)}</span>
            </div>
            {deliveryFee > 0 && (
              <div style={{ background: "rgba(255,69,0,0.08)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--primary)" }}>
                🎉 Add {formatPrice(299 - subtotal)} more for free delivery!
              </div>
            )}
            <button onClick={() => { if (!user) { toast("Please login to checkout", "warning"); return; } setPage("checkout"); }} style={{ width: "100%", background: "var(--primary)", color: "#fff", borderRadius: 14, padding: 16, fontWeight: 800, fontSize: 16, fontFamily: "Syne", transition: "all 0.2s" }}>
              {user ? "Proceed to Checkout →" : "Login to Checkout"}
            </button>
            <button onClick={() => cartDispatch({ type: "CLEAR_CART" })} style={{ width: "100%", color: "var(--text2)", fontSize: 13, marginTop: 12, padding: 8 }}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CHECKOUT PAGE
// ============================================================
const CheckoutPage = ({ setPage, user, setOrders, orders }) => {
  const { cartState, cartDispatch } = useContext(AppContext);
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: user?.name || "", phone: user?.phone || "", street: "", city: "", pincode: "" });
  const [payment, setPayment] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });

  const subtotal = getCartTotal(cartState.items);
  const deliveryFee = subtotal > 299 ? 0 : 40;
  const discount = cartState.coupon
    ? cartState.coupon.type === "percent"
      ? Math.min(Math.floor(subtotal * cartState.coupon.discount / 100), 200)
      : cartState.coupon.discount
    : 0;
  const total = subtotal + deliveryFee - discount;

  const restaurant = RESTAURANTS.find(r => r.id === cartState.restaurantId);

  const placeOrder = async () => {
    if (!address.street || !address.city || !address.pincode) { toast("Please fill address details", "error"); return; }
    setPlacing(true);
    await new Promise(r => setTimeout(r, 2000));
    const order = {
      id: `ORD${Date.now()}`,
      restaurant: restaurant?.name || "Restaurant",
      items: [...cartState.items],
      total,
      address: `${address.street}, ${address.city} - ${address.pincode}`,
      payment: payment === "cod" ? "Cash on Delivery" : "Online Payment",
      status: "confirmed",
      statusHistory: [
        { status: "confirmed", time: new Date().toLocaleString() },
      ],
      placedAt: new Date().toLocaleString(),
    };
    setOrders([...orders, order]);
    cartDispatch({ type: "CLEAR_CART" });
    setPlacing(false);
    setPage("orderSuccess");
    toast("Order placed successfully! 🎉");
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "90px 24px 80px" }}>
      <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 32, marginBottom: 32 }}>Checkout</h1>

      {/* Steps */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 40 }}>
        {[["1", "Delivery"], ["2", "Payment"], ["3", "Review"]].map(([n, l], i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: parseInt(n) <= step ? "var(--primary)" : "var(--border)", color: parseInt(n) <= step ? "#fff" : "var(--text2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>{n}</div>
              <span style={{ fontWeight: 600, color: parseInt(n) <= step ? "var(--text)" : "var(--text2)", fontSize: 14 }}>{l}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: parseInt(n) < step ? "var(--primary)" : "var(--border)", margin: "0 12px" }} />}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
        <div>
          {step === 1 && (
            <div style={{ background: "var(--card)", borderRadius: 16, padding: 28, border: "1px solid var(--border)", animation: "fadeIn 0.3s ease" }}>
              <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, marginBottom: 24 }}>📍 Delivery Address</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { key: "name", label: "Full Name", placeholder: "Your name", type: "text" },
                  { key: "phone", label: "Phone Number", placeholder: "+91 9999999999", type: "tel" },
                  { key: "street", label: "Street Address", placeholder: "House no, street, area", type: "text", col: 2 },
                  { key: "city", label: "City", placeholder: "Mumbai", type: "text" },
                  { key: "pincode", label: "PIN Code", placeholder: "400001", type: "text" },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: f.col === 2 ? "1/-1" : "auto" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>{f.label}</label>
                    <input type={f.type} value={address[f.key]} onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))} placeholder={f.placeholder} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: 14 }} />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} style={{ marginTop: 24, background: "var(--primary)", color: "#fff", borderRadius: 12, padding: "14px 32px", fontWeight: 700, fontFamily: "Syne", fontSize: 15 }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: "var(--card)", borderRadius: 16, padding: 28, border: "1px solid var(--border)", animation: "fadeIn 0.3s ease" }}>
              <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, marginBottom: 24 }}>💳 Payment Method</h2>
              {[
                { key: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", emoji: "💵" },
                { key: "card", label: "Credit / Debit Card", desc: "Secure online payment", emoji: "💳" },
                { key: "upi", label: "UPI / Net Banking", desc: "Pay using UPI apps", emoji: "📱" },
              ].map(opt => (
                <div key={opt.key} onClick={() => setPayment(opt.key)} style={{ padding: 20, borderRadius: 12, border: `2px solid ${payment === opt.key ? "var(--primary)" : "var(--border)"}`, background: payment === opt.key ? "rgba(255,69,0,0.05)" : "var(--card)", marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s" }}>
                  <span style={{ fontSize: 28 }}>{opt.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{opt.label}</div>
                    <div style={{ color: "var(--text2)", fontSize: 13 }}>{opt.desc}</div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${payment === opt.key ? "var(--primary)" : "var(--border)"}`, background: payment === opt.key ? "var(--primary)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {payment === opt.key && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                </div>
              ))}

              {payment === "card" && (
                <div style={{ marginTop: 16, padding: 20, background: "var(--bg2)", borderRadius: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 6 }}>Card Number</label>
                    <input placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={e => setCardDetails(c => ({ ...c, number: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 6 }}>Expiry</label>
                    <input placeholder="MM / YY" value={cardDetails.expiry} onChange={e => setCardDetails(c => ({ ...c, expiry: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 6 }}>CVV</label>
                    <input placeholder="123" type="password" value={cardDetails.cvv} onChange={e => setCardDetails(c => ({ ...c, cvv: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 14 }} />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={() => setStep(1)} style={{ padding: "14px 24px", borderRadius: 12, border: "1px solid var(--border)", color: "var(--text2)", fontWeight: 600 }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ background: "var(--primary)", color: "#fff", borderRadius: 12, padding: "14px 32px", fontWeight: 700, fontFamily: "Syne", fontSize: 15 }}>Review Order →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ background: "var(--card)", borderRadius: 16, padding: 28, border: "1px solid var(--border)", animation: "fadeIn 0.3s ease" }}>
              <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, marginBottom: 24 }}>✅ Review Your Order</h2>
              <div style={{ background: "var(--bg2)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>📍 Delivering to</div>
                <div style={{ fontWeight: 600 }}>{address.street}, {address.city} - {address.pincode}</div>
              </div>
              <div style={{ background: "var(--bg2)", borderRadius: 12, padding: 16, marginBottom: 24 }}>
                <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>💳 Payment via</div>
                <div style={{ fontWeight: 600 }}>{payment === "cod" ? "Cash on Delivery" : payment === "card" ? "Credit / Debit Card" : "UPI / Net Banking"}</div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(2)} style={{ padding: "14px 24px", borderRadius: 12, border: "1px solid var(--border)", color: "var(--text2)", fontWeight: 600 }}>← Back</button>
                <button onClick={placeOrder} disabled={placing} style={{ flex: 1, background: placing ? "#ccc" : "var(--primary)", color: "#fff", borderRadius: 12, padding: "14px 32px", fontWeight: 800, fontFamily: "Syne", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {placing ? (<><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⌛</span> Placing Order...</>) : "Place Order 🎉"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)", position: "sticky", top: 90 }}>
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          {cartState.items.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: "var(--text)" }}>{item.name} × {item.qty}</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
          <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Syne", fontWeight: 800, fontSize: 20 }}>
            <span>Total</span>
            <span style={{ color: "var(--primary)" }}>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ORDER SUCCESS
// ============================================================
const OrderSuccessPage = ({ setPage, orders }) => {
  const lastOrder = orders[orders.length - 1];
  useEffect(() => {
    const t = setTimeout(() => {}, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "120px 24px 80px", textAlign: "center", animation: "fadeIn 0.5s ease" }}>
      <div style={{ fontSize: 80, marginBottom: 24, animation: "pop 0.5s ease" }}>🎉</div>
      <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 36, marginBottom: 12 }}>Order Placed!</h1>
      <p style={{ color: "var(--text2)", fontSize: 18, marginBottom: 32 }}>Your delicious food is being prepared</p>
      {lastOrder && (
        <div style={{ background: "var(--card)", borderRadius: 20, padding: 28, marginBottom: 32, border: "1px solid var(--border)", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: "var(--text2)", fontSize: 14 }}>Order ID</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{lastOrder.id}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: "var(--text2)", fontSize: 14 }}>Restaurant</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{lastOrder.restaurant}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: "var(--text2)", fontSize: 14 }}>Total</span>
            <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: 16 }}>{formatPrice(lastOrder.total)}</span>
          </div>
          {/* Tracking */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Order Status</div>
            {["Order Confirmed", "Being Prepared", "Out for Delivery", "Delivered"].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "var(--primary)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i === 0 ? <span style={{ color: "#fff", fontSize: 12 }}>✓</span> : <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--card)" }} />}
                </div>
                <span style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "var(--text)" : "var(--text2)" }}>{s}</span>
                {i === 0 && <span style={{ marginLeft: "auto", background: "#22C55E22", color: "#22C55E", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>Active</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <button onClick={() => setPage("orders")} style={{ padding: "14px 24px", borderRadius: 12, border: "1px solid var(--border)", fontWeight: 600, color: "var(--text)" }}>View Orders</button>
        <button onClick={() => setPage("home")} style={{ background: "var(--primary)", color: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 700, fontFamily: "Syne" }}>Back to Home</button>
      </div>
    </div>
  );
};

// ============================================================
// ORDERS PAGE
// ============================================================
const OrdersPage = ({ orders, setPage }) => {
  const statusColor = { confirmed: "#22C55E", preparing: "#F59E0B", out_for_delivery: "#3B82F6", delivered: "#6B7280" };

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>📦</div>
        <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 28, marginBottom: 12 }}>No orders yet</h2>
        <p style={{ color: "var(--text2)", marginBottom: 32 }}>Your order history will appear here</p>
        <button onClick={() => setPage("restaurants")} style={{ background: "var(--primary)", color: "#fff", borderRadius: 14, padding: "14px 32px", fontWeight: 700, fontFamily: "Syne" }}>Order Now</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "90px 24px 80px" }}>
      <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 32, marginBottom: 32 }}>Your Orders</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {[...orders].reverse().map((order, i) => (
          <div key={order.id} style={{ background: "var(--card)", borderRadius: 20, padding: 24, border: "1px solid var(--border)", animation: `fadeIn ${0.1 + i * 0.1}s ease both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{order.restaurant}</h3>
                <p style={{ color: "var(--text2)", fontSize: 13 }}>{order.placedAt} · {order.payment}</p>
              </div>
              <span style={{ background: statusColor[order.status] + "22", color: statusColor[order.status], padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                {order.status === "confirmed" ? "✓ Order Confirmed" : order.status.replace(/_/g, " ")}
              </span>
            </div>

            <div style={{ background: "var(--bg2)", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
                  <span>{item.name} × {item.qty}</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ color: "var(--text2)", fontSize: 13 }}>Total paid: </span>
                <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, color: "var(--primary)" }}>{formatPrice(order.total)}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text2)", background: "var(--bg2)", padding: "4px 10px", borderRadius: 8 }}>{order.id}</span>
                <button style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border)", color: "var(--primary)", fontSize: 13, fontWeight: 600 }}>Reorder</button>
              </div>
            </div>

            {/* Tracking */}
            <div style={{ marginTop: 16, display: "flex", gap: 0, alignItems: "center" }}>
              {["Confirmed", "Preparing", "On the way", "Delivered"].map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: i === 0 ? "var(--primary)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                      {i === 0 ? <span style={{ color: "#fff" }}>✓</span> : null}
                    </div>
                    <span style={{ fontSize: 10, color: i === 0 ? "var(--primary)" : "var(--text2)", fontWeight: i === 0 ? 700 : 400, textAlign: "center" }}>{s}</span>
                  </div>
                  {i < 3 && <div style={{ flex: 1, height: 2, background: i === 0 ? "var(--primary)" : "var(--border)", marginBottom: 16, marginLeft: 2, marginRight: 2 }} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// AUTH PAGE
// ============================================================
const AuthPage = ({ setUser, setPage }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validate = () => {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    const user = { name: form.name || form.email.split("@")[0], email: form.email, phone: form.phone || "+91 9000000000", address: "123, Example Street, Mumbai - 400001" };
    setUser(user);
    toast(`Welcome ${user.name}! 👋`);
    setPage("home");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍔</div>
          <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 32, marginBottom: 8 }}>{mode === "login" ? "Welcome back!" : "Create account"}</h1>
          <p style={{ color: "var(--text2)" }}>{mode === "login" ? "Sign in to continue ordering" : "Join FoodRush and start ordering"}</p>
        </div>

        <div style={{ background: "var(--card)", borderRadius: 20, padding: 36, border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "var(--bg2)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setErrors({}); }} style={{ flex: 1, padding: "10px", borderRadius: 10, fontWeight: 700, fontSize: 14, background: mode === m ? "var(--card)" : "transparent", color: mode === m ? "var(--primary)" : "var(--text2)", boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "signup" && (
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: `1px solid ${errors.name ? "#EF4444" : "var(--border)"}`, background: "var(--bg2)", color: "var(--text)", fontSize: 15 }} />
                {errors.name && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: `1px solid ${errors.email ? "#EF4444" : "var(--border)"}`, background: "var(--bg2)", color: "var(--text)", fontSize: 15 }} />
              {errors.email && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: `1px solid ${errors.password ? "#EF4444" : "var(--border)"}`, background: "var(--bg2)", color: "var(--text)", fontSize: 15 }} />
              {errors.password && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
            </div>
            {mode === "signup" && (
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Phone (optional)</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 9000000000" style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: 15 }} />
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{ background: loading ? "#ccc" : "var(--primary)", color: "#fff", borderRadius: 12, padding: "15px", fontWeight: 800, fontSize: 16, fontFamily: "Syne", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⌛</span> Please wait...</> : (mode === "login" ? "Sign In →" : "Create Account →")}
            </button>

            {mode === "login" && (
              <button onClick={() => { setForm(f => ({ ...f, email: "demo@foodrush.in", password: "demo123" })); }} style={{ color: "var(--primary)", fontSize: 13, fontWeight: 600, textAlign: "center" }}>
                Use demo credentials
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PROFILE PAGE
// ============================================================
const ProfilePage = ({ user, setUser }) => {
  const toast = useToast();
  const [form, setForm] = useState({ ...user });
  const [editing, setEditing] = useState(false);

  const save = () => {
    setUser({ ...form });
    setEditing(false);
    toast("Profile updated! ✅");
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "90px 24px 80px" }}>
      <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 32, marginBottom: 32 }}>My Profile</h1>
      <div style={{ background: "var(--card)", borderRadius: 20, padding: 36, border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", fontFamily: "Syne", fontWeight: 700 }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 22 }}>{user.name}</h2>
            <p style={{ color: "var(--text2)" }}>{user.email}</p>
          </div>
          <button onClick={() => setEditing(!editing)} style={{ marginLeft: "auto", padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border)", fontWeight: 600, color: editing ? "var(--primary)" : "var(--text2)", fontSize: 14 }}>
            {editing ? "Cancel" : "✏ Edit"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { key: "name", label: "Full Name", type: "text" },
            { key: "phone", label: "Phone", type: "tel" },
            { key: "email", label: "Email", type: "email" },
            { key: "address", label: "Default Address", type: "text" },
          ].map(f => (
            <div key={f.key} style={{ gridColumn: f.key === "address" ? "1/-1" : "auto" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>{f.label}</label>
              {editing ? (
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--primary)", background: "var(--bg2)", color: "var(--text)", fontSize: 15 }} />
              ) : (
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg2)", fontSize: 15, color: form[f.key] ? "var(--text)" : "var(--text2)" }}>
                  {form[f.key] || "Not set"}
                </div>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <button onClick={save} style={{ marginTop: 24, background: "var(--primary)", color: "#fff", borderRadius: 12, padding: "14px 32px", fontWeight: 700, fontFamily: "Syne" }}>
            Save Changes ✓
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================
// ADMIN PANEL
// ============================================================
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const toast = useToast();

  const stats = [
    { label: "Total Orders", value: "1,284", icon: "📦", change: "+12%", color: "#22C55E" },
    { label: "Revenue", value: "₹2,84,300", icon: "💰", change: "+8%", color: "#3B82F6" },
    { label: "Restaurants", value: "6", icon: "🍽", change: "+2 new", color: "#F59E0B" },
    { label: "Active Users", value: "892", icon: "👤", change: "+5%", color: "#8B5CF6" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "90px 24px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 32 }}>Admin Panel</h1>
          <p style={{ color: "var(--text2)" }}>Manage your FoodRush platform</p>
        </div>
        <span style={{ background: "#22C55E22", color: "#22C55E", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>● Live</span>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <span style={{ background: s.color + "22", color: s.color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{s.change}</span>
            </div>
            <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 24 }}>{s.value}</div>
            <div style={{ color: "var(--text2)", fontSize: 13, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "var(--bg2)", borderRadius: 12, padding: 4, marginBottom: 28, width: "fit-content" }}>
        {["overview", "restaurants", "orders"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14, background: activeTab === t ? "var(--card)" : "transparent", color: activeTab === t ? "var(--primary)" : "var(--text2)", textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "restaurants" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20 }}>Restaurants ({RESTAURANTS.length})</h2>
            <button onClick={() => toast("Feature in full version", "warning")} style={{ background: "var(--primary)", color: "#fff", borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 14 }}>+ Add Restaurant</button>
          </div>
          <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
            {RESTAURANTS.map((r, i) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: i < RESTAURANTS.length - 1 ? "1px solid var(--border)" : "none" }}>
                <img src={r.image} alt={r.name} loading="lazy" onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/f3f4f6/999?text=R`; }} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", display: "block", background: "#f3f4f6" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ color: "var(--text2)", fontSize: 13 }}>{r.cuisine.join(", ")} · ⭐ {r.rating}</div>
                </div>
                <span style={{ background: "#22C55E22", color: "#22C55E", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Active</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => toast("Edit opened!", "success")} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, fontWeight: 600 }}>Edit</button>
                  <button onClick={() => toast("Delete restricted in demo", "warning")} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #EF444444", color: "#EF4444", fontSize: 13, fontWeight: 600 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "overview" && (
        <div style={{ background: "var(--card)", borderRadius: 16, padding: 28, border: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Quick Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              { icon: "📊", label: "View Analytics", action: "analytics" },
              { icon: "🍽", label: "Add Restaurant", action: "add-rest" },
              { icon: "🎟", label: "Manage Coupons", action: "coupons" },
              { icon: "📬", label: "Push Notifications", action: "notif" },
            ].map(a => (
              <button key={a.label} onClick={() => toast(`${a.label} — coming in full version`, "warning")} style={{ padding: "20px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--bg2)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, fontWeight: 600, fontSize: 14 }}>
                <span style={{ fontSize: 32 }}>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18 }}>Recent Orders</h3>
            <span style={{ color: "var(--text2)", fontSize: 14 }}>Showing mock data</span>
          </div>
          {[
            { id: "ORD001", customer: "Rahul M.", restaurant: "Flame & Fork", amount: "₹720", status: "Delivered", time: "2h ago" },
            { id: "ORD002", customer: "Priya K.", restaurant: "Burger Republic", amount: "₹468", status: "Out for Delivery", time: "45m ago" },
            { id: "ORD003", customer: "Anand S.", restaurant: "Pizza Paradise", amount: "₹928", status: "Preparing", time: "10m ago" },
          ].map((o, i) => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{o.customer} · <span style={{ color: "var(--text2)", fontWeight: 400 }}>{o.restaurant}</span></div>
                <div style={{ color: "var(--text2)", fontSize: 13 }}>{o.id} · {o.time}</div>
              </div>
              <span style={{ fontWeight: 700 }}>{o.amount}</span>
              <span style={{ background: o.status === "Delivered" ? "#22C55E22" : o.status === "Preparing" ? "#F59E0B22" : "#3B82F622", color: o.status === "Delivered" ? "#22C55E" : o.status === "Preparing" ? "#F59E0B" : "#3B82F6", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{o.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// FOOTER
// ============================================================
const Footer = ({ setPage }) => (
  <footer style={{ background: "var(--secondary)", color: "#fff", padding: "60px 24px 32px" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🍔</div>
            <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, color: "var(--primary)" }}>FoodRush</span>
          </div>
          <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>Your favorite food, delivered fast. Order from 500+ restaurants with guaranteed 30-minute delivery.</p>
        </div>
        {[
          { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
          { title: "For You", links: ["Restaurants", "Cuisines", "Offers", "Gift Cards"] },
          { title: "Support", links: ["Help Center", "Safety", "Contact", "Privacy"] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#F1F5F9" }}>{col.title}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map(l => (
                <button key={l} style={{ color: "#94A3B8", fontSize: 14, textAlign: "left", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#94A3B8"}>{l}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #2D2D3F", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <p style={{ color: "#94A3B8", fontSize: 13 }}>© 2026 FoodRush. All rights reserved.</p>
        <div style={{ display: "flex", gap: 16 }}>
          {["🐦", "📘", "📸", "▶️"].map(s => (
            <button key={s} style={{ fontSize: 18, opacity: 0.7, transition: "opacity 0.2s" }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.7}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dark, setDark] = useState(false);
  const [cartState, cartDispatch] = useReducer(cartReducer, { items: [], restaurantId: null, coupon: null });

  const cartCount = getCartCount(cartState.items);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <AppContext.Provider value={{ cartState, cartDispatch, user }}>
      <ToastProvider>
        <GlobalStyle dark={dark} />
        <Navbar page={page} setPage={setPage} cartCount={cartCount} user={user} setUser={setUser} dark={dark} setDark={setDark} />

        <main>
          {page === "home" && <HomePage setPage={setPage} setSelectedRestaurant={setSelectedRestaurant} />}
          {page === "restaurants" && <RestaurantsPage setPage={setPage} setSelectedRestaurant={setSelectedRestaurant} />}
          {page === "restaurant" && <RestaurantDetailPage restaurant={selectedRestaurant} setPage={setPage} />}
          {page === "cart" && <CartPage setPage={setPage} user={user} />}
          {page === "checkout" && <CheckoutPage setPage={setPage} user={user} setOrders={setOrders} orders={orders} />}
          {page === "orderSuccess" && <OrderSuccessPage setPage={setPage} orders={orders} />}
          {page === "orders" && <OrdersPage orders={orders} setPage={setPage} />}
          {page === "auth" && <AuthPage setUser={setUser} setPage={setPage} />}
          {page === "profile" && user && <ProfilePage user={user} setUser={setUser} />}
          {page === "admin" && <AdminPage />}
        </main>

        {page !== "home" && <Footer setPage={setPage} />}

        {/* Floating Cart Button (mobile) */}
        {cartCount > 0 && page !== "cart" && page !== "checkout" && (
          <button onClick={() => setPage("cart")} style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: "var(--primary)", color: "#fff", borderRadius: 50, padding: "14px 28px",
            fontWeight: 700, fontSize: 15, fontFamily: "Syne", boxShadow: "0 8px 32px rgba(255,69,0,0.4)",
            display: "flex", alignItems: "center", gap: 10, zIndex: 999, animation: "fadeIn 0.3s ease",
          }}>
            🛒 {cartCount} item{cartCount > 1 ? "s" : ""} · View Cart
          </button>
        )}

        {/* Admin access hint */}
        <button onClick={() => setPage("admin")} style={{ position: "fixed", bottom: 24, right: 24, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 14px", fontSize: 12, color: "var(--text2)", zIndex: 998, boxShadow: "var(--shadow)" }}>
          🔧 Admin
        </button>
      </ToastProvider>
    </AppContext.Provider>
  );
}
