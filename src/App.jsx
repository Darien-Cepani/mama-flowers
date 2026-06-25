import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  X,
  ArrowRight,
  MapPin,
  Phone,
  Instagram,
  Search,
  Heart,
  ShieldCheck,
  Sparkles,
  Clock,
  Check,
  MessageCircle,
  Mail,
  Flower2,
  Truck,
  Menu
} from 'lucide-react';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// --- BRAND CONSTANTS --------------------------------------------------------
// Single source of truth for identity + the few colours referenced from JS
// (custom cursor, Leaflet marker). All other colour comes from Tailwind tokens.
const BRAND = {
  name: "MAMA",
  wordmark: "Mama Flowers",
  handle: "mamaflowers__",
  instagram: "https://instagram.com/mamaflowers__",
  phone: "+355 69 386 9769",
  phoneHref: "+355693869769",
  email: "orders@mamaflowers.al",
  accent: "#C4286E",
  accentDeep: "#9C1E55",
  ink: "#2A0E1C",
  coords: [41.3219375, 19.8099375],
  mapsUrl: "https://maps.app.goo.gl/XoBsiWnox1uS868Y6"
};

// Graceful fallback when a remote (Unsplash) image fails to load, so cards never
// degrade into raw alt text. Falls back to a known-stable floral image.
const IMAGE_FALLBACK = "ig/ig01.jpg";
const handleImageError = (e) => {
  if (e.currentTarget.src !== IMAGE_FALLBACK) {
    e.currentTarget.src = IMAGE_FALLBACK;
  }
};

// --- BILINGUAL DICTIONARY (English / Albanian) -----------------------------
// Every visible UI string lives here keyed by language so the whole site can be
// toggled between English ("en") and Albanian ("sq") at runtime.
const LANG = {
  en: {
    tagline: "FLOWERS & DECOR",
    categories: { all: "All", bouquets: "Bouquets", roses: "Roses", arrangements: "Arrangements", weddings: "Weddings" },
    marquee: ["Fresh Daily", "Hand-Tied", "Roses", "Peonies", "Weddings", "Bespoke", "Same-Day Delivery", "Tirana"],
    nav: { browse: "Browse Flowers", book: "Order Flowers" },
    hero: {
      eyebrow: "Fresh Blooms, Hand-Tied Daily in Tirana",
      titleA: "Flowers That Say", titleEm: "Everything",
      body: "Romantic hand-tied bouquets, signature roses, and bespoke arrangements — composed fresh for every celebration, gesture, and ordinary day worth marking.",
      ctaPrimary: "Shop Bouquets",
      ctaSecondary: "Weddings & Events",
      scroll: "Scroll"
    },
    editorial: {
      eyebrow: "Our Philosophy",
      quote: "“Every stem is chosen by hand and every bouquet tied with intention. We believe flowers are a quiet language — and our little shop exists to help you say the things that matter most.”"
    },
    collections: {
      eyebrow: "Explore the Shop",
      title: "Our Floral Collections",
      intro: "From a single rose to a room full of blooms — explore the arrangements we craft fresh each morning for Tirana.",
      cards: [
        { num: "01 / Hand-Tied", title: "Signature Bouquets", discover: "Discover Bouquets" },
        { num: "02 / Timeless", title: "Roses & Romance", discover: "Discover Roses" },
        { num: "03 / Sculptural", title: "Box Arrangements", discover: "Discover Arrangements" },
        { num: "04 / Celebrations", title: "Weddings & Events", discover: "Discover Events" }
      ]
    },
    shop: {
      eyebrow: "Fresh This Season",
      title: "The Flower Collection",
      inquire: "Order / Inquire"
    },
    consult: {
      eyebrow: "Weddings & Events",
      title: "Let Us Style Your Celebration",
      body: "From intimate bridal bouquets to full venue installations, our florists design bespoke floral concepts for weddings, events, and special moments across Tirana.",
      cta: "Request a Consultation"
    },
    visit: {
      eyebrow: "Visit Our Shop",
      title: "Find Us in Tirana",
      body: "Step into Mama Flowers to choose your blooms in person, or order for same-day delivery across the city. Our florists are always happy to help you craft the perfect gift.",
      addressLabel: "Our Shop",
      addressNote: "Fresh flowers & same-day delivery",
      hoursLabel: "Opening Hours",
      days: ["Monday — Saturday", "Sunday", "Holidays"],
      hoursNote: "Same-day delivery for orders before 16:00",
      contactLabel: "Orders & Delivery",
      inquiriesWord: "Call:",
      emailWord: "Email:",
      loading: "Loading Map…"
    },
    social: {
      eyebrow: "Follow Along",
      followCta: "Follow",
      viewPost: "View Post",
      tiles: ["Hand-Tied Bouquets", "Fresh Roses", "Box Arrangements", "Wedding Florals"]
    },
    footer: {
      about: "A Tirana flower shop crafting hand-tied bouquets, signature roses, and bespoke arrangements for weddings, events, and every day worth celebrating.",
      collections: "Collections",
      salon: "Shop Hours",
      salonDays: ["Mon — Sat", "Sunday", "Holidays"],
      salonNote: "Same-day delivery available across Tirana.",
      circle: "Bloom Club",
      circleBody: "Join our list for seasonal blooms, floral inspiration, and first access to limited arrangements.",
      emailPlaceholder: "Your Email Address",
      requestEntry: "Subscribe",
      rights: "All rights reserved.",
      privacy: "Privacy",
      terms: "Terms"
    },
    modal: {
      selected: "Selected Bloom",
      exclusive: "Crafted Fresh to Order",
      details: "Details & Composition",
      guarantee: "Fresh-Flower Quality Guarantee",
      inquire: "Order This Arrangement",
      wishlisted: "Saved",
      add: "Save to Favourites"
    },
    drawer: {
      searchTitle: "Search Flowers",
      searchPlaceholder: "Search bouquets, roses, arrangements…",
      searchHint: "Begin typing to explore the collection — by name, type, or occasion.",
      noResults: "No flowers match your search.",
      wishlistTitle: "Your Favourites",
      wishlistSubtitle: "A curated edit of the blooms you've saved.",
      wishlistEmpty: "Your favourites list is empty.",
      wishlistEmptyHint: "Tap the heart on any bloom to save it here.",
      remove: "Remove",
      close: "Close"
    },
    toast: {
      search: "Search is currently offline for this showcase.",
      wishlist: (n) => `Your favourites list has ${n} item(s).`,
      inquiry: (n) => `Order request sent for "${n}". Our florists will contact you shortly.`,
      removed: (n) => `Removed "${n}" from your favourites.`,
      added: (n) => `Added "${n}" to your favourites.`,
      newsletter: "Welcome to Mama Flowers! 🌺",
      booking: "To place an order, please call +355 69 386 9769."
    }
  },
  sq: {
    tagline: "LULE & DEKOR",
    categories: { all: "Të Gjitha", bouquets: "Buqeta", roses: "Trëndafila", arrangements: "Kompozime", weddings: "Dasma" },
    marquee: ["Të Freskëta Çdo Ditë", "Punuar me Dorë", "Trëndafila", "Bozhure", "Dasma", "Sipas Porosisë", "Dërgesë Brenda Ditës", "Tiranë"],
    nav: { browse: "Shfleto Lulet", book: "Porosit Lule" },
    hero: {
      eyebrow: "Lule të Freskëta, të Punuara me Dorë çdo Ditë në Tiranë",
      titleA: "Lule Që Thonë", titleEm: "Gjithçka",
      body: "Buqeta romantike të punuara me dorë, trëndafila ekskluzivë dhe kompozime sipas porosisë — të përgatitura të freskëta për çdo festë, gjest dhe ditë të zakonshme që meriton të shënohet.",
      ctaPrimary: "Shiko Buqetat",
      ctaSecondary: "Dasma & Evente",
      scroll: "Zbrit"
    },
    editorial: {
      eyebrow: "Filozofia Jonë",
      quote: "“Çdo kërcell zgjidhet me dorë dhe çdo buqetë lidhet me qëllim. Ne besojmë se lulet janë një gjuhë e qetë — dhe dyqani ynë i vogël ekziston për t'ju ndihmuar të thoni gjërat që kanë më shumë rëndësi.”"
    },
    collections: {
      eyebrow: "Eksploro Dyqanin",
      title: "Koleksionet Tona Floreale",
      intro: "Nga një trëndafil i vetëm te një sallë plot lule — eksploroni kompozimet që përgatisim të freskëta çdo mëngjes për Tiranën.",
      cards: [
        { num: "01 / Punuar me Dorë", title: "Buqeta Ekskluzive", discover: "Shiko Buqetat" },
        { num: "02 / Të Përjetshme", title: "Trëndafila & Romancë", discover: "Shiko Trëndafilat" },
        { num: "03 / Skulpturore", title: "Kompozime në Kuti", discover: "Shiko Kompozimet" },
        { num: "04 / Festa", title: "Dasma & Evente", discover: "Shiko Eventet" }
      ]
    },
    shop: {
      eyebrow: "Të Freskëta Këtë Sezon",
      title: "Koleksioni i Luleve",
      inquire: "Porosit / Pyet"
    },
    consult: {
      eyebrow: "Dasma & Evente",
      title: "Le Të Stilizojmë Festën Tuaj",
      body: "Nga buqetat intime të nuses te dekorimet e plota të ambienteve, floristët tanë krijojnë koncepte floreale sipas porosisë për dasma, evente dhe momente të veçanta në Tiranë.",
      cta: "Kërko një Konsultë"
    },
    visit: {
      eyebrow: "Vizitoni Dyqanin",
      title: "Na Gjeni në Tiranë",
      body: "Hyni në Mama Flowers për të zgjedhur lulet personalisht, ose porosisni për dërgesë brenda ditës në të gjithë qytetin. Floristët tanë janë gjithmonë të gatshëm t'ju ndihmojnë të krijoni dhuratën perfekte.",
      addressLabel: "Dyqani Ynë",
      addressNote: "Lule të freskëta & dërgesë brenda ditës",
      hoursLabel: "Orari",
      days: ["E hënë — E shtunë", "E diel", "Festat"],
      hoursNote: "Dërgesë brenda ditës për porositë para orës 16:00",
      contactLabel: "Porosi & Dërgesa",
      inquiriesWord: "Telefono:",
      emailWord: "Email:",
      loading: "Duke ngarkuar hartën…"
    },
    social: {
      eyebrow: "Na Ndiqni",
      followCta: "Ndiqni",
      viewPost: "Shiko Postimin",
      tiles: ["Buqeta me Dorë", "Trëndafila të Freskët", "Kompozime në Kuti", "Lule Dasmash"]
    },
    footer: {
      about: "Një atelie lulesh në Tiranë që krijon buqeta me dorë, trëndafila ekskluzivë dhe kompozime sipas porosisë për dasma, evente dhe çdo ditë që meriton festë.",
      collections: "Koleksionet",
      salon: "Orari",
      salonDays: ["Hën — Sht", "E diel", "Festat"],
      salonNote: "Dërgesë brenda ditës në të gjithë Tiranën.",
      circle: "Klubi i Luleve",
      circleBody: "Bashkohuni me listën tonë për lule sezonale, frymëzim floreal dhe akses të parë te kompozimet e limituara.",
      emailPlaceholder: "Adresa juaj e email-it",
      requestEntry: "Abonohu",
      rights: "Të gjitha të drejtat e rezervuara.",
      privacy: "Privatësia",
      terms: "Kushtet"
    },
    modal: {
      selected: "Lulja e Zgjedhur",
      exclusive: "Përgatitet e Freskët me Porosi",
      details: "Detaje & Përbërje",
      guarantee: "Garanci Freskie",
      inquire: "Porosit Këtë Kompozim",
      wishlisted: "E Ruajtur",
      add: "Ruaj te të Preferuarat"
    },
    drawer: {
      searchTitle: "Kërko Lule",
      searchPlaceholder: "Kërko buqeta, trëndafila, kompozime…",
      searchHint: "Filloni të shkruani për të eksploruar koleksionin — sipas emrit, llojit ose rastit.",
      noResults: "Asnjë lule nuk përputhet me kërkimin.",
      wishlistTitle: "Të Preferuarat Tuaja",
      wishlistSubtitle: "Një përzgjedhje e luleve që keni ruajtur.",
      wishlistEmpty: "Lista juaj është bosh.",
      wishlistEmptyHint: "Prekni zemrën te çdo lule për ta ruajtur këtu.",
      remove: "Hiq",
      close: "Mbyll"
    },
    toast: {
      search: "Kërkimi është aktualisht jashtë funksionit.",
      wishlist: (n) => `Lista juaj ka ${n} artikull(a).`,
      inquiry: (n) => `Kërkesa për "${n}" u dërgua. Floristët tanë do t'ju kontaktojnë së shpejti.`,
      removed: (n) => `"${n}" u hoq nga të preferuarat.`,
      added: (n) => `"${n}" u shtua te të preferuarat.`,
      newsletter: "Mirë se vini te Mama Flowers! 🌺",
      booking: "Për të porositur, ju lutemi telefononi +355 69 386 9769."
    }
  }
};

// Curated flower catalogue. Names are kept identical across languages;
// descriptions and detail bullets are bilingual.
const PRODUCTS = [
  {
    id: 1,
    name: { en: "Lilac Bowl Luxe Arrangement", sq: "Aranzhim Luksoz në Vazo Ngjyrë Lilac" },
    category: "arrangements",
    image: "ig/ig01.jpg",
    description: {
      en: "An opulent lilac fishbowl filled with coral peonies, pink garden roses, snowy hydrangea and tulips, draped with trailing pink amaranthus.",
      sq: "Një vazo e harlisur ngjyrë lilac mbushur me bozhure korale, trëndafila kopshti rozë, hortensie të bardha e tulipanë, e zbukuruar me amarant rozë që varet."
    },
    details: {
      en: ["Blush, coral & ivory palette", "Statement ceramic bowl", "Same-day delivery in Tirana"],
      sq: ["Paletë rozë, korale & fildishtë", "Vazo qeramike mbresëlënëse", "Dorëzim brenda ditës në Tiranë"]
    }
  },
  {
    id: 2,
    name: { en: "Crimson & Magenta Statement Box", sq: "Kuti Elegante Kërmëzi & Magenta" },
    category: "bouquets",
    image: "ig/ig02.jpg",
    description: {
      en: "A tall, dramatic hatbox bursting with velvet red roses, magenta spray roses and soft pink peonies, framed by wild eucalyptus.",
      sq: "Një kuti e lartë e dramatike që shpërthen me trëndafila të kuq kadife, trëndafila spray ngjyrë magenta dhe bozhure rozë, e kornizuar me eukalipt."
    },
    details: {
      en: ["Red, magenta & blush palette", "Grand luxury size", "Ideal for love & big moments"],
      sq: ["Paletë e kuqe, magenta & rozë", "Madhësi e madhe luksoze", "Ideale për dashuri & momente të mëdha"]
    }
  },
  {
    id: 3,
    name: { en: "Mixed Rose Round Bouquet", sq: "Buqetë e Rrumbullakët me Trëndafila të Përzier" },
    category: "roses",
    image: "ig/ig03.jpg",
    description: {
      en: "A lavish round hand-tied bouquet of red, blush pink and ivory roses, gathered in soft kraft paper for a timeless gift.",
      sq: "Një buqetë e rrumbullakët e harlisur, e punuar me dorë me trëndafila të kuq, rozë e fildishtë, e mbledhur në letër kraft për një dhuratë të përjetshme."
    },
    details: {
      en: ["Red, pink & ivory roses", "Generous round dome", "Same-day delivery in Tirana"],
      sq: ["Trëndafila të kuq, rozë & fildishtë", "Kube e madhe e rrumbullakët", "Dorëzim brenda ditës në Tiranë"]
    }
  },
  {
    id: 4,
    name: { en: "Pink Peony Basket", sq: "Shportë me Bozhure Rozë" },
    category: "arrangements",
    image: "ig/ig04.jpg",
    description: {
      en: "A woven basket overflowing with lush pink and cream peonies in full bloom, finished with soft satin ribbons.",
      sq: "Një shportë e thurur që derdhet me bozhure të harlisura rozë e krem në lulëzim të plotë, e përfunduar me fjongo satini."
    },
    details: {
      en: ["Soft pink & cream peonies", "Natural woven basket", "Seasonal — late spring & summer"],
      sq: ["Bozhure rozë të buta & krem", "Shportë natyrale e thurur", "Sezonale — fund pranvere & verë"]
    }
  },
  {
    id: 5,
    name: { en: "Spring Tulip Bouquet", sq: "Buqetë Pranverore me Tulipanë" },
    category: "bouquets",
    image: "ig/ig05.jpg",
    description: {
      en: "A fresh hand-tied bouquet of pink and white tulips with airy pink statice and eucalyptus, wrapped in romantic kraft and mauve paper.",
      sq: "Një buqetë e freskët e punuar me dorë me tulipanë rozë e të bardhë, statice rozë dhe eukalipt, e mbështjellë me letër kraft dhe ngjyrë lejla."
    },
    details: {
      en: ["Pink & white tulips", "Hand-tied garden style", "Same-day delivery in Tirana"],
      sq: ["Tulipanë rozë & të bardhë", "Stil kopshti i punuar me dorë", "Dorëzim brenda ditës në Tiranë"]
    }
  },
  {
    id: 6,
    name: { en: "All-White Bridal Arrangement", sq: "Aranzhim Nusërie Krejt i Bardhë" },
    category: "weddings",
    image: "ig/ig06.jpg",
    description: {
      en: "A pure all-white masterpiece of hydrangea, ranunculus and peonies softened by cascading ivory amaranthus — made for weddings and grand events.",
      sq: "Një kryevepër krejt e bardhë me hortensie, ranunkulus e bozhure, e zbutur nga amaranti fildishtë që varet — e bërë për dasma e evente të mëdha."
    },
    details: {
      en: ["Pure white & ivory palette", "Bridal & event centerpiece", "Booked by consultation"],
      sq: ["Paletë krejt e bardhë & fildishtë", "Qendër për nuse & evente", "Rezervohet me konsultë"]
    }
  },
  {
    id: 7,
    name: { en: "Red Rose Hatbox", sq: "Kuti me Trëndafila të Kuq" },
    category: "roses",
    image: "ig/ig07.jpg",
    description: {
      en: "Dozens of classic red roses arranged in a cream signature hatbox and tied with a deep red satin ribbon — pure romance.",
      sq: "Dhjetëra trëndafila klasikë të kuq të rregulluar në një kuti elegante krem dhe të lidhur me fjongo satini të kuqe — romancë e pastër."
    },
    details: {
      en: ["Classic red roses", "Cream signature hatbox", "Perfect for anniversaries"],
      sq: ["Trëndafila klasikë të kuq", "Kuti elegante krem", "Ideale për përvjetorë"]
    }
  },
  {
    id: 8,
    name: { en: "Grand Red Rose Bouquet", sq: "Buqetë Madhështore me Trëndafila të Kuq" },
    category: "roses",
    image: "ig/ig08.jpg",
    description: {
      en: "A breathtaking oversized bouquet of deep red roses gathered into a perfect dome and wrapped in sleek black signature paper.",
      sq: "Një buqetë mahnitëse me përmasa të mëdha me trëndafila të kuq të errët, e mbledhur në një kube perfekte dhe e mbështjellë me letër të zezë elegante."
    },
    details: {
      en: ["Deep red roses, 101+ stems", "Bold black wrap", "Perfect for grand gestures"],
      sq: ["Trëndafila të kuq të errët, 101+ kërcej", "Mbështjellje e zezë e guximshme", "Ideale për gjeste të mëdha"]
    }
  }
];

// Brand mark — Mama's bold four-petal bloom. Uses
// currentColor so it adapts to whatever text colour wraps it, and carries the
// `splash-mark` / `brand-petal` hooks the preloader animates.
function BrandMark({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <g fill="currentColor">
        {[0, 90, 180, 270].map((deg) => (
          <ellipse key={deg} className="brand-petal" cx="32" cy="19" rx="10" ry="13" transform={`rotate(${deg} 32 32)`} />
        ))}
      </g>
      <circle cx="32" cy="32" r="6" fill="currentColor" />
      <circle cx="32" cy="32" r="2.6" fill="#190711" />
    </svg>
  );
}

// Reusable right-hand slide-in drawer (search & wishlist). Defined at module
// scope so it keeps a stable component identity across re-renders — otherwise
// the search input inside would remount on every keystroke and lose focus.
function SideDrawer({ open, onClose, title, subtitle, closeLabel, children }) {
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[160] bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed top-0 right-0 z-[170] h-full w-full max-w-md bg-white shadow-2xl border-l border-brand-champagne flex flex-col transition-transform duration-500 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 py-6 border-b border-brand-champagne">
          <div>
            <h3 className="text-lg font-display text-brand-dark tracking-wide">{title}</h3>
            {subtitle && <p className="text-xs text-brand-dark/55 font-sans font-light mt-1 tracking-wide leading-relaxed">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label={closeLabel}
            className="p-2 -mr-2 text-brand-dark hover:text-brand-deep transition-colors shrink-0"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          {children}
        </div>
      </aside>
    </>
  );
}

export default function App() {
  // State variables
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);
  const [cursorText, setCursorText] = useState("");
  const [cursorHovering, setCursorHovering] = useState(false);
  const [lang, setLang] = useState("sq");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active-language string bundle + small helpers
  const t = LANG[lang];
  const catLabel = (c) => t.categories[c] || c;
  const productName = (pr) => (pr.name && typeof pr.name === 'object') ? (pr.name[lang] || pr.name.en) : pr.name;

  // Open native maps navigation to the store (Apple Maps on Apple devices, Google Maps elsewhere)
  const openDirections = () => {
    window.open(BRAND.mapsUrl, '_blank', 'noopener');
  };
  const CATEGORIES = ["all", "bouquets", "roses", "arrangements", "weddings"];
  const NAV_CATEGORIES = ["bouquets", "roses", "arrangements", "weddings"];

  // Refs for GSAP
  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const headerRef = useRef(null);
  const bookBtnRef = useRef(null);
  const searchInputRef = useRef(null);

  // Map reference to safely prevent Leaflet initialization collision
  const mapRef = useRef(null);

  // Keep the document language + title in sync for accessibility / SEO.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "sq"
      ? "Mama Flowers — Buqeta Luksoze, Kompozime & Dekor Eventesh në Tiranë"
      : "Mama Flowers — Luxury Bouquets, Arrangements & Event Decor in Tirana";
  }, [lang]);

  // Lock body scroll while any overlay (search / wishlist / modal) is open.
  useEffect(() => {
    const anyOpen = searchOpen || wishlistOpen || selectedProduct || mobileMenuOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, wishlistOpen, selectedProduct, mobileMenuOpen]);

  // Focus the search field once the drawer has slid in.
  useEffect(() => {
    if (searchOpen) {
      setSearchQuery("");
      const id = setTimeout(() => searchInputRef.current?.focus(), 320);
      return () => clearTimeout(id);
    }
  }, [searchOpen]);

  // Escape closes any open overlay.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setWishlistOpen(false);
        setSelectedProduct(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // --- MOUSE CURSOR HIGH-FIDELITY TRACKING (desktop only) ---
  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    const onMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      gsap.to(ring, { left: x, top: y, duration: 0.1, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Custom cursor hover states with organic scaling
  const triggerCursor = (text = "", isHovering = true) => {
    setCursorText(text);
    setCursorHovering(isHovering);

    gsap.to(cursorRingRef.current, { scale: isHovering ? 1.3 : 1, duration: 0.3, ease: "power2.out" });
    gsap.to(cursorDotRef.current, {
      scale: isHovering ? 0.6 : 1,
      backgroundColor: isHovering ? BRAND.accent : '#ffffff',
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // --- PRELOADER & REVEAL TIMELINE ---
  useGSAP(() => {
    const tl = gsap.timeline({ onComplete: () => setLoading(false) });

    // Refined splash â€” the mark resolves from a soft blur, then the wordmark rises beneath it.
    tl.fromTo(".splash-mark", { scale: 0.86, opacity: 0, filter: 'blur(14px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' });
    tl.fromTo(".loader-letter", { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.65, ease: 'power4.out' }, "-=0.6");
    tl.fromTo(".loader-line", { width: 0, opacity: 0 }, { width: 180, opacity: 1, duration: 0.6, ease: 'power3.inOut' }, "-=0.4");
    tl.to(".loader-sub", { opacity: 1, duration: 0.5, ease: 'power2.out' }, "-=0.45");
    tl.to(".loader-letter-group", { letterSpacing: '0.32em', duration: 0.7, ease: 'power2.out' }, "-=0.7");

    tl.to(".splash-inner", { y: -26, opacity: 0, duration: 0.45, ease: 'power2.in' }, "+=0.2");
    tl.to(loaderRef.current, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, "-=0.25")
      .set(loaderRef.current, { pointerEvents: 'none' });

    tl.fromTo(".hero-animate",
      { yPercent: 100, opacity: 0, skewY: 3 },
      { yPercent: 0, opacity: 1, skewY: 0, stagger: 0.05, duration: 0.85, ease: 'power3.out' },
      "-=0.6"
    );

    tl.fromTo(headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
      "-=1.1"
    );
  }, { scope: containerRef });

  // --- SCROLL ANIMATIONS ---
  useGSAP(() => {
    if (loading) return;

    gsap.fromTo(".editorial-text",
      { opacity: 0.25, y: 15 },
      {
        opacity: 1, y: 0, stagger: 0.02, duration: 1, ease: 'power1.out',
        scrollTrigger: { trigger: ".editorial-section", start: "top 80%", end: "center 65%", scrub: true }
      }
    );

    gsap.utils.toArray(".collection-card").forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" } }
      );
    });

    // Parallax on foreground imagery
    gsap.utils.toArray(".parallax-img").forEach((img) => {
      gsap.set(img, { scale: 1.16, transformOrigin: "center center" });
      gsap.fromTo(img,
        { yPercent: -7 },
        { yPercent: 7, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } }
      );
    });

    // Background-image panels parallax
    gsap.utils.toArray(".parallax-bg").forEach((bg) => {
      gsap.fromTo(bg,
        { backgroundPosition: "50% 30%" },
        { backgroundPosition: "50% 70%", ease: "none", scrollTrigger: { trigger: bg, start: "top bottom", end: "bottom top", scrub: true } }
      );
    });

    ScrollTrigger.refresh();

    // Sticky navbar morphs from transparent (over hero) to solid white on scroll.
    ScrollTrigger.create({
      start: "top -30",
      onEnter: () => {
        headerRef.current.classList.add("bg-white/95", "backdrop-blur-md", "shadow-sm", "border-b", "border-brand-champagne", "text-brand-dark", "py-3", "md:py-4");
        headerRef.current.classList.remove("text-white", "bg-gradient-to-b", "from-black/60", "via-black/20", "to-transparent", "py-5", "md:py-6");
        bookBtnRef.current?.classList.add("bg-brand-dark", "text-white");
        bookBtnRef.current?.classList.remove("bg-white", "text-brand-dark");
      },
      onLeaveBack: () => {
        headerRef.current.classList.remove("bg-white/95", "backdrop-blur-md", "shadow-sm", "border-b", "border-brand-champagne", "text-brand-dark", "py-3", "md:py-4");
        headerRef.current.classList.add("text-white", "bg-gradient-to-b", "from-black/60", "via-black/20", "to-transparent", "py-5", "md:py-6");
        bookBtnRef.current?.classList.remove("bg-brand-dark", "text-white");
        bookBtnRef.current?.classList.add("bg-white", "text-brand-dark");
      }
    });

    gsap.to(".cursor-svg-text", { rotation: 360, repeat: -1, duration: 22, ease: "none" });

    gsap.fromTo(".workshops-banner-bg",
      { scale: 1 },
      { scale: 1.15, ease: "none", scrollTrigger: { trigger: "#showroom-consultations", start: "top bottom", end: "bottom top", scrub: true } }
    );

    gsap.fromTo(".workshops-sparkle",
      { y: 0, rotation: 0, opacity: 0.3 },
      { y: -25, rotation: 180, opacity: 0.9, duration: 4, stagger: 0.8, yoyo: true, repeat: -1, ease: "sine.inOut" }
    );
  }, [loading]);

  // --- HOVER HANDLERS ---
  const handleCardMouseEnter = (e) => {
    const card = e.currentTarget;
    const img = card.querySelector('.specimen-img');
    const label = card.querySelector('.inquire-label');
    gsap.to(card, { y: -6, duration: 0.4, ease: "power2.out" });
    if (img) gsap.to(img, { scale: 1.21, duration: 0.6, ease: "power2.out" });
    if (label) gsap.to(label, { color: BRAND.ink, duration: 0.3 });
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    const img = card.querySelector('.specimen-img');
    const label = card.querySelector('.inquire-label');
    gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" });
    if (img) gsap.to(img, { scale: 1.16, duration: 0.6, ease: "power2.out" });
    if (label) gsap.to(label, { color: BRAND.accentDeep, duration: 0.3 });
  };

  // --- CORE UTILITIES ---
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleInquiry = (productName) => showToast(t.toast.inquiry(productName));

  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        showToast(t.toast.removed(productName(product)));
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(t.toast.added(productName(product)));
        return [...prev, product];
      }
    });
  };

  const filteredProducts = activeCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  // Live search across name, description, and category
  const searchTerm = searchQuery.trim().toLowerCase();
  const searchResults = searchTerm === ""
    ? []
    : PRODUCTS.filter((p) =>
        productName(p).toLowerCase().includes(searchTerm) ||
        p.description[lang].toLowerCase().includes(searchTerm) ||
        p.description.en.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        catLabel(p.category).toLowerCase().includes(searchTerm)
      );

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    showToast(t.toast.newsletter);
    e.target.reset();
  };

  // Small inline language switcher used in both navbar and footer.
  const LangToggle = ({ className = "" }) => (
    <div className={`flex items-center gap-1.5 text-[10px] font-display tracking-[0.2em] font-semibold uppercase ${className}`}>
      <button onClick={() => setLang("en")} aria-pressed={lang === "en"} className={`transition-colors ${lang === "en" ? "text-brand-deep" : "opacity-60 hover:opacity-100"}`}>EN</button>
      <span className="opacity-40">/</span>
      <button onClick={() => setLang("sq")} aria-pressed={lang === "sq"} className={`transition-colors ${lang === "sq" ? "text-brand-deep" : "opacity-60 hover:opacity-100"}`}>AL</button>
    </div>
  );

  // --- DYNAMICALLY LOAD LEAFLET MAP ---
  useEffect(() => {
    if (loading) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.id = 'leaflet-js';

    script.onload = () => {
      const L = window.L;
      if (!L) return;
      if (mapRef.current) return;

      const map = L.map('map', { zoomControl: false, attributionControl: false, scrollWheelZoom: false, dragging: false, touchZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, tap: false }).setView(BRAND.coords, 16);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

      const markerIcon = L.divIcon({
        className: 'custom-brand-marker',
        html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-2xl relative flex items-center justify-center" style="background:${BRAND.accent}">
                 <div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background:${BRAND.accent}"></div>
               </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker(BRAND.coords, { icon: markerIcon })
        .addTo(map)
        .bindPopup(`<div style="font-family: 'Montserrat', sans-serif; text-align: center; padding: 4px; min-width: 120px;">
                     <h5 style="font-weight: 600; font-size: 11px; margin: 0 0 2px 0; color: ${BRAND.ink}; letter-spacing: 0.1em; text-transform: uppercase;">${BRAND.name}</h5>
                     <p style="font-size: 9px; color: ${BRAND.accentDeep}; margin: 0; font-weight: 400; text-transform: uppercase; letter-spacing: 0.05em;">Flower Shop · Tirana</p>
                   </div>`, { closeButton: false, offset: [0, -4] })
        .openPopup();

      const style = document.createElement('style');
      style.id = 'leaflet-popup-custom-styles';
      style.innerHTML = `
        .leaflet-popup-content-wrapper {
          background: #ffffff !important;
          border-radius: 0px !important;
          border: 1px solid ${BRAND.accentDeep} !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
          padding: 2px 6px !important;
        }
        .leaflet-popup-tip {
          background: #ffffff !important;
          border-left: 1px solid ${BRAND.accentDeep} !important;
          border-bottom: 1px solid ${BRAND.accentDeep} !important;
        }
      `;
      document.head.appendChild(style);
    };

    document.head.appendChild(script);

    return () => {
      const lLink = document.getElementById('leaflet-css');
      const lScript = document.getElementById('leaflet-js');
      const popupStyle = document.getElementById('leaflet-popup-custom-styles');
      if (lLink) lLink.remove();
      if (lScript) lScript.remove();
      if (popupStyle) popupStyle.remove();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [loading]);

  return (
    <div ref={containerRef} className="relative min-h-screen font-sans antialiased text-brand-dark selection:bg-brand-gold/25 selection:text-brand-dark md:select-none bg-white overflow-x-hidden">

      {/* CUSTOM CURSOR (desktop only) */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-brand-gold z-50 pointer-events-none hidden md:block mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-[110px] h-[110px] z-50 pointer-events-none hidden md:flex items-center justify-center select-none mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      >
        <svg className="absolute inset-0 w-full h-full cursor-svg-text" viewBox="0 0 120 120">
          <path id="cursor-text-path" d="M 60, 60 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="none" />
          <text className="text-[8px] font-display uppercase tracking-[0.25em] fill-white font-light">
            <textPath href="#cursor-text-path" startOffset="0%">
              {cursorHovering ? ` • ${cursorText} • ${cursorText}` : ` • ${BRAND.wordmark} • ${BRAND.wordmark}`}
            </textPath>
          </text>
        </svg>
      </div>

      {/* PRELOADER */}
      <div
        ref={loaderRef}
        className="fixed inset-0 z-[9999] bg-brand-night flex flex-col items-center justify-center pointer-events-auto overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 42%, rgba(196,40,110,0.16), transparent 58%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 50%, rgba(0,0,0,0.65))' }} />

        <div className="splash-inner relative text-center px-6">
          <BrandMark className="splash-mark w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-7 sm:mb-9 text-brand-gold" />
          <div className="loader-letter-group flex justify-center gap-1 sm:gap-3 md:gap-4 text-5xl sm:text-6xl md:text-7xl tracking-[0.18em] font-display font-semibold select-none">
            {BRAND.name.split("").map((letter, i) => (
              <span key={i} className="inline-block overflow-hidden pb-2 -mb-2">
                <span className="loader-letter loader-shimmer inline-block">{letter}</span>
              </span>
            ))}
          </div>
          <div className="loader-line h-px w-0 mx-auto mt-7 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
          <div className="loader-sub opacity-0 mt-6 text-[10px] sm:text-xs tracking-[0.5em] uppercase text-brand-gold/90 font-display font-semibold select-none">
            {t.tagline} · Tirana
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-8 sm:bottom-8 z-[2000] bg-brand-dark text-white border border-brand-gold/30 px-5 sm:px-6 py-4 flex items-center gap-3 shadow-2xl rounded-none animate-fade-in font-display tracking-wide text-sm">
          <Flower2 className="w-4 h-4 text-brand-gold shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* NAVBAR */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-40 transition-all duration-500 py-4 sm:py-5 md:py-6 px-5 sm:px-6 md:px-12 text-white bg-gradient-to-b from-black/60 via-black/20 to-transparent"
      >
        {/* MOBILE BAR — logo left, hamburger right */}
        <div className="lg:hidden flex items-center justify-between">
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 group leading-none">
            <BrandMark className="w-12 h-12 shrink-0 text-brand-gold" />
            <span className="flex flex-col items-start">
              <span className="text-xl font-display font-semibold tracking-[0.26em] pl-[0.26em]">{BRAND.name}</span>
              <span className="text-[6.5px] tracking-[0.36em] text-brand-gold uppercase mt-0.5 pl-[0.36em] font-semibold">{t.tagline}</span>
            </span>
          </a>
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="relative p-1 -mr-1"
          >
            <Menu className="w-7 h-7 stroke-[1.5]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 flex items-center justify-center bg-brand-gold text-white text-[8px] font-display font-bold rounded-full">{wishlist.length}</span>
            )}
          </button>
        </div>

        {/* DESKTOP BAR — links left, logo centre, actions right */}
        <div className="hidden lg:grid grid-cols-3 items-center">
          <div className="flex items-center justify-start">
            <nav className="flex items-center gap-9 text-[11px] tracking-[0.28em] uppercase font-display font-medium">
              {NAV_CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href="#shop-section"
                  onClick={() => setActiveCategory(cat)}
                  onMouseEnter={() => triggerCursor("EXPLORE")}
                  onMouseLeave={() => triggerCursor("", false)}
                  className="hover:text-brand-gold transition-colors relative group py-1"
                >
                  {catLabel(cat)}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-brand-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>
          </div>

          <a
            href="#"
            onMouseEnter={() => triggerCursor("HOME")}
            onMouseLeave={() => triggerCursor("", false)}
            className="flex flex-row items-center gap-3 justify-self-center group leading-none"
          >
            <BrandMark className="w-14 h-14 shrink-0 text-brand-gold group-hover:rotate-[72deg] transition-transform duration-700" />
            <span className="flex flex-col items-start">
              <span className="text-[28px] font-display font-semibold tracking-[0.3em] pl-[0.3em] group-hover:text-brand-gold transition-colors duration-500">
                {BRAND.name}
              </span>
              <span className="text-[7px] tracking-[0.4em] text-brand-gold uppercase block mt-1 pl-[0.4em] font-semibold">
                {t.tagline}
              </span>
            </span>
          </a>

          <div className="flex items-center justify-end gap-5">
            <LangToggle />
            <span className="w-px h-4 bg-current opacity-25" />
            <button
              onMouseEnter={() => triggerCursor("SEARCH")}
              onMouseLeave={() => triggerCursor("", false)}
              onClick={() => { setWishlistOpen(false); setSearchOpen(true); }}
              className="p-1 hover:text-brand-gold transition-colors"
              aria-label={t.drawer.searchTitle}
            >
              <Search className="w-[18px] h-[18px] stroke-[1.4]" />
            </button>
            <button
              onMouseEnter={() => triggerCursor("FAVOURITES")}
              onMouseLeave={() => triggerCursor("", false)}
              onClick={() => { setSearchOpen(false); setWishlistOpen(true); }}
              className="p-1 hover:text-brand-gold transition-colors relative"
              aria-label={t.drawer.wishlistTitle}
            >
              <Heart className={`w-[18px] h-[18px] stroke-[1.4] ${wishlist.length > 0 ? "fill-brand-red text-brand-red stroke-brand-red" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-brand-gold text-white text-[8px] font-display font-bold rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>
            <a
              ref={bookBtnRef}
              href="#showroom-consultations"
              onMouseEnter={() => triggerCursor("ORDER")}
              onMouseLeave={() => triggerCursor("", false)}
              className="flex items-center gap-1.5 bg-white text-brand-dark hover:bg-brand-deep hover:text-white transition-colors duration-300 px-5 py-2.5 text-[10px] font-display tracking-[0.2em] uppercase font-semibold"
            >
              <span className="whitespace-nowrap">{t.nav.book}</span>
            </a>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-IN MENU */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 z-[180] bg-brand-night/60 backdrop-blur-sm transition-opacity duration-500 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`lg:hidden fixed top-0 right-0 z-[190] h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-champagne">
          <div className="flex items-center gap-2.5">
            <BrandMark className="w-10 h-10 text-brand-gold" />
            <span className="flex flex-col items-start leading-none">
              <span className="text-lg font-display font-semibold tracking-[0.22em] text-brand-dark">{BRAND.name}</span>
              <span className="text-[6.5px] tracking-[0.34em] text-brand-deep uppercase mt-1 font-semibold">{t.tagline}</span>
            </span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} aria-label={t.drawer.close} className="p-2 -mr-2 text-brand-dark hover:text-brand-deep transition-colors">
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
          {NAV_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setMobileMenuOpen(false);
                setTimeout(() => document.getElementById("shop-section")?.scrollIntoView({ behavior: "smooth" }), 260);
              }}
              className="group flex items-center justify-between py-4 border-b border-brand-champagne text-2xl font-display text-brand-dark hover:text-brand-deep transition-colors"
            >
              {catLabel(cat)}
              <ArrowRight className="w-5 h-5 text-brand-deep opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </button>
          ))}

          <div className="mt-8 flex flex-col gap-5">
            <button onClick={() => { setMobileMenuOpen(false); setWishlistOpen(false); setSearchOpen(true); }} className="flex items-center gap-3 text-sm font-display uppercase tracking-[0.2em] text-brand-dark hover:text-brand-deep transition-colors">
              <Search className="w-5 h-5 stroke-[1.5]" /> {t.drawer.searchTitle}
            </button>
            <button onClick={() => { setMobileMenuOpen(false); setSearchOpen(false); setWishlistOpen(true); }} className="flex items-center gap-3 text-sm font-display uppercase tracking-[0.2em] text-brand-dark hover:text-brand-deep transition-colors">
              <Heart className={`w-5 h-5 stroke-[1.5] ${wishlist.length > 0 ? "fill-brand-red text-brand-red stroke-brand-red" : ""}`} />
              {t.drawer.wishlistTitle}
              {wishlist.length > 0 && <span className="ml-1 w-5 h-5 flex items-center justify-center bg-brand-gold text-white text-[10px] font-display font-bold rounded-full">{wishlist.length}</span>}
            </button>
          </div>
        </nav>

        <div className="px-6 py-6 border-t border-brand-champagne flex flex-col gap-5">
          <a
            href="#showroom-consultations"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center bg-brand-dark text-white hover:bg-brand-deep transition-colors py-4 text-[11px] font-display uppercase tracking-[0.22em] font-semibold"
          >
            {t.nav.book}
          </a>
          <div className="flex items-center justify-center">
            <LangToggle className="text-brand-dark" />
          </div>
        </div>
      </aside>

      {/* HERO — single full-screen flowers video */}
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden hero-section bg-brand-night text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          poster="ig/ig01.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="https://videos.pexels.com/video-files/1352801/1352801-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>

        {/* Legibility overlays */}
        <div className="absolute inset-0 bg-brand-night/55 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-night/70 via-brand-night/20 to-brand-night z-10" />

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 sm:px-8">
          <div className="overflow-hidden mb-3 sm:mb-4">
            <span className="inline-block text-[10px] sm:text-xs md:text-sm tracking-[0.35em] sm:tracking-[0.45em] uppercase text-brand-gold font-display font-bold hero-animate">
              {t.hero.eyebrow}
            </span>
          </div>
          <div className="overflow-hidden mb-4 sm:mb-6 pb-[0.12em]">
            <h1 className="text-[2.6rem] leading-[1.08] sm:text-6xl md:text-7xl lg:text-8xl font-display font-normal hero-animate text-white max-w-5xl pb-[0.1em] uppercase tracking-tight">
              {t.hero.titleA} <span className="text-brand-gold font-light not-italic">{t.hero.titleEm}</span>
            </h1>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm sm:text-base md:text-lg text-gray-200 font-light leading-relaxed max-w-md sm:max-w-xl mx-auto hero-animate">
              {t.hero.body}
            </p>
          </div>
          <div className="overflow-hidden mt-7 sm:mt-9 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 hero-animate">
              <a
                href="#shop-section"
                onClick={() => setActiveCategory("bouquets")}
                onMouseEnter={() => triggerCursor("VIEW")}
                onMouseLeave={() => triggerCursor("", false)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-xs tracking-[0.25em] uppercase font-display bg-brand-gold text-brand-night hover:bg-white px-7 py-4 transition-all duration-300 font-semibold"
              >
                {t.hero.ctaPrimary} <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#showroom-consultations"
                onMouseEnter={() => triggerCursor("EVENTS")}
                onMouseLeave={() => triggerCursor("", false)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-xs tracking-[0.25em] uppercase font-display border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white hover:text-brand-night px-7 py-4 transition-all duration-300 text-white"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none hero-animate">
          <span className="text-[8px] tracking-[0.3em] font-display uppercase opacity-60 text-white/70">{t.hero.scroll}</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-gold animate-bounce" />
          </div>
        </div>
      </section>

      {/* MARQUEE BANNER */}
      <section className="bg-brand-champagne/60 text-brand-dark py-7 sm:py-10 border-y border-brand-gold/20 overflow-hidden relative z-30">
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="flex animate-infinite-scroll gap-10 sm:gap-20 text-base sm:text-lg md:text-xl tracking-[0.4em] uppercase font-display font-light items-center">
            {[0, 1].map((dup) => (
              <React.Fragment key={dup}>
                <span className="font-display font-semibold tracking-[0.45em]">{t.marquee[0]}</span> <span className="text-brand-deep opacity-60">✦</span>
                <span className="font-display italic font-medium tracking-[0.3em]">{t.marquee[1]}</span> <span className="text-brand-deep opacity-60">✦</span>
                <span className="font-display font-bold tracking-[0.25em]">{t.marquee[2]}</span> <span className="text-brand-deep opacity-60">✦</span>
                <span className="font-display font-normal uppercase tracking-[0.4em]">{t.marquee[3]}</span> <span className="text-brand-deep opacity-60">✦</span>
                <span className="font-sans font-normal tracking-[0.5em] text-brand-dark/90">{t.marquee[4]}</span> <span className="text-brand-deep opacity-60">✦</span>
                <span className="font-display italic font-semibold tracking-[0.3em] text-brand-deep">{t.marquee[5]}</span> <span className="text-brand-deep opacity-60">✦</span>
                <span className="font-display font-black tracking-[0.15em]">{t.marquee[6]}</span> <span className="text-brand-deep opacity-60">✦</span>
                <span className="font-sans tracking-[0.45em] font-normal italic text-brand-dark/90">{t.marquee[7]}</span> <span className="text-brand-deep opacity-60">✦</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL PHILOSOPHY */}
      <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-4 max-w-5xl mx-auto text-center editorial-section relative overflow-hidden bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] sm:text-[14rem] md:text-[18rem] font-display font-black font-outline-gold pointer-events-none select-none z-0 whitespace-nowrap text-center">
          {BRAND.name}
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-xs md:text-sm tracking-[0.4em] uppercase text-brand-deep mb-6 inline-block font-display font-semibold">
            {t.editorial.eyebrow}
          </span>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-normal leading-relaxed text-brand-dark">
            {t.editorial.quote.split(" ").map((word, wIndex) => (
              <span key={wIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
                {word.split("").map((char, cIndex) => (
                  <span key={cIndex} className="editorial-text inline-block origin-bottom">{char}</span>
                ))}
              </span>
            ))}
          </p>
          <div className="w-12 h-[1px] bg-brand-deep mx-auto mt-8 sm:mt-12" />
        </div>
      </section>

      {/* CURATED CATEGORIES GRID */}
      <section className="pb-20 sm:pb-24 px-5 sm:px-4 md:px-12 max-w-7xl mx-auto bg-white">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-xs md:text-sm tracking-[0.4em] uppercase text-brand-deep font-display font-semibold block mb-2">
            {t.collections.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-normal text-brand-dark tracking-wide">
            {t.collections.title}
          </h2>
          <p className="text-center text-base text-brand-dark/65 font-light max-w-lg mx-auto mt-4 font-sans leading-relaxed">
            {t.collections.intro}
          </p>
          <div className="w-12 h-[1px] bg-brand-deep mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-8">
          {[
            { span: "md:col-span-7", cat: "bouquets", img: "ig/ig05.jpg", cursor: "BOUQUETS" },
            { span: "md:col-span-5", cat: "roses", img: "ig/ig08.jpg", cursor: "ROSES" },
            { span: "md:col-span-5", cat: "arrangements", img: "ig/ig01.jpg", cursor: "ARRANGEMENTS" },
            { span: "md:col-span-7", cat: "weddings", img: "ig/ig06.jpg", cursor: "WEDDINGS" }
          ].map((c, i) => (
            <div
              key={c.cat}
              className={`${c.span} relative h-[320px] sm:h-[380px] md:h-[500px] overflow-hidden collection-card bg-brand-champagne group cursor-pointer border border-brand-champagne shadow-sm animate-fade-in`}
              onClick={() => {
                setActiveCategory(c.cat);
                document.getElementById("shop-section")?.scrollIntoView({ behavior: 'smooth' });
              }}
              onMouseEnter={() => triggerCursor(c.cursor)}
              onMouseLeave={() => triggerCursor("", false)}
            >
              <div
                className="parallax-bg absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${c.img}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-night/80 via-brand-night/20 to-transparent transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10">
                <span className="text-xs tracking-[0.3em] text-brand-gold uppercase block mb-1 font-semibold">{t.collections.cards[i].num}</span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-normal tracking-wide">{t.collections.cards[i].title}</h3>
                <span className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase font-display text-brand-gold mt-2.5 opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 ease-out font-semibold">
                  {t.collections.cards[i].discover} <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP / PORTFOLIO GRID */}
      <section id="shop-section" className="py-20 sm:py-24 bg-white border-t border-brand-champagne">
        <div className="max-w-7xl mx-auto px-5 sm:px-4 md:px-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16">
            <div>
              <span className="text-xs md:text-sm tracking-[0.4em] uppercase text-brand-deep font-display font-semibold block mb-2">
                {t.shop.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-normal text-brand-dark tracking-wide">
                {t.shop.title}
              </h2>
            </div>

            {/* Category tabs — horizontally scrollable on mobile */}
            <div className="flex flex-nowrap md:flex-wrap overflow-x-auto no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 gap-x-5 sm:gap-x-6 gap-y-3 text-sm font-display tracking-widest uppercase border-b border-brand-champagne pb-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    gsap.fromTo(".product-grid-card",
                      { opacity: 0, scale: 0.98, y: 15 },
                      { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
                    );
                  }}
                  className={`py-2 text-sm font-display tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 relative ${
                    activeCategory === category ? "text-brand-deep font-bold" : "text-brand-dark/45 hover:text-brand-dark font-medium"
                  }`}
                >
                  {catLabel(category)}
                  {activeCategory === category && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-[1.5px] bg-brand-deep animate-fade-in" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-16">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                onMouseEnter={(e) => { handleCardMouseEnter(e); triggerCursor("VIEW"); }}
                onMouseLeave={(e) => { handleCardMouseLeave(e); triggerCursor("", false); }}
                className="product-grid-card bg-transparent group cursor-pointer flex flex-col pb-4"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-champagne border border-brand-champagne transition-all duration-500 shadow-sm group-hover:shadow-md">
                  <img
                    src={product.image}
                    alt={productName(product)}
                    onError={handleImageError}
                    className="specimen-img parallax-img absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-brand-night/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="category-badge absolute bottom-3 left-3 bg-brand-night/80 backdrop-blur-md text-white text-[8px] tracking-[0.25em] font-display uppercase px-2.5 py-1 rounded-none font-semibold z-20">
                    {catLabel(product.category)}
                  </span>
                </div>

                <div className="mt-4 flex-1 flex flex-col justify-between px-0.5 sm:px-1">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] font-display text-brand-deep font-bold uppercase mb-1.5 block">
                      {catLabel(product.category)}
                    </span>
                    <h4 className="text-base sm:text-lg font-display font-medium text-brand-dark tracking-wide line-clamp-1 group-hover:text-brand-deep transition-colors duration-300">
                      {productName(product)}
                    </h4>
                    <p className="mt-2 text-sm text-brand-dark/70 font-light line-clamp-2 leading-relaxed font-sans">
                      {product.description[lang]}
                    </p>
                  </div>
                  <div className="inquire-label text-xs tracking-[0.2em] font-display uppercase font-bold text-brand-deep mt-4 pt-3 border-t border-brand-champagne transition-colors duration-300 flex items-center gap-1.5">
                    <span>{t.shop.inquire}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WEDDINGS & EVENTS BANNER */}
      <section id="showroom-consultations" className="relative py-24 sm:py-28 overflow-hidden text-center bg-brand-night text-white border-y border-brand-gold/20">
        <div
          className="workshops-banner-bg absolute inset-0 bg-cover bg-center opacity-30 scale-105 pointer-events-none"
          style={{ backgroundImage: `url('ig/ig08.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-night via-transparent to-brand-night opacity-80" />

        <Sparkles className="workshops-sparkle absolute top-12 left-1/4 w-5 h-5 text-brand-gold opacity-50 z-0 hidden md:block" />
        <Sparkles className="workshops-sparkle absolute bottom-16 right-1/4 w-4 h-4 text-brand-gold opacity-40 z-0 hidden md:block" />
        <Sparkles className="workshops-sparkle absolute top-24 right-1/3 w-3.5 h-3.5 text-brand-gold opacity-60 z-0 hidden md:block" />

        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <span className="text-xs tracking-[0.4em] uppercase text-brand-gold font-display block mb-3 font-semibold">{t.consult.eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl font-display font-normal text-white leading-tight">{t.consult.title}</h2>
          <p className="mt-4 text-base md:text-lg text-gray-300 leading-relaxed font-light max-w-lg mx-auto">
            {t.consult.body}
          </p>
          <div className="mt-9 sm:mt-10 flex justify-center">
            <button
              onMouseEnter={() => triggerCursor("ENQUIRE")}
              onMouseLeave={() => triggerCursor("", false)}
              onClick={() => showToast(t.toast.booking)}
              className="w-full sm:w-auto px-8 py-4 bg-brand-gold hover:bg-white text-brand-night text-xs tracking-[0.25em] font-display uppercase transition-all duration-500 shadow-xl font-semibold"
            >
              {t.consult.cta}
            </button>
          </div>
        </div>
      </section>

      {/* MAP / VISIT */}
      <section className="py-20 sm:py-24 bg-white text-brand-dark border-t border-brand-champagne">
        <div className="max-w-7xl mx-auto px-5 sm:px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">

          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-xs tracking-[0.4em] uppercase text-brand-deep font-display font-semibold">{t.visit.eyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-display font-normal text-brand-dark leading-tight">{t.visit.title}</h2>
            <p className="text-base text-brand-dark/75 font-light leading-relaxed max-w-xl">
              {t.visit.body}
            </p>

            <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] bg-brand-champagne border border-brand-champagne shadow-md overflow-hidden mt-4">
              <div id="map" role="img" aria-label="Map showing Mama Flowers in Tirana" className="w-full h-full absolute inset-0 z-10 desaturate-map" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
                <span className="text-xs font-display tracking-widest text-brand-deep animate-pulse font-semibold">{t.visit.loading}</span>
              </div>
              <button onClick={openDirections} aria-label={lang === "sq" ? "Hap navigimin drejt dyqanit" : "Open directions to the store"} className="absolute inset-0 z-20 cursor-pointer group">
                <span className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-brand-night/90 text-white text-[10px] font-display uppercase tracking-[0.18em] px-3 py-2 shadow-lg group-hover:bg-brand-deep transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" /> {lang === "sq" ? "Hap Harten" : "Get Directions"}
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center h-full pt-2 lg:pt-0">
            <div className="space-y-8">

              <div className="flex gap-4 items-start pb-6 border-b border-brand-champagne">
                <div className="text-brand-deep shrink-0 mt-1"><MapPin className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-xs font-display font-semibold uppercase tracking-widest text-brand-deep">{t.visit.addressLabel}</h4>
                  <p className="text-base text-brand-dark mt-2.5 font-display font-light leading-relaxed">
                    Bulevardi Bajram Curri<br />
                    Ish Merkata, Tiranë 1019
                  </p>
                  <p className="text-sm text-brand-dark/50 mt-1 font-sans font-light">{t.visit.addressNote}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start pb-6 border-b border-brand-champagne">
                <div className="text-brand-deep shrink-0 mt-1"><Clock className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-xs font-display font-semibold uppercase tracking-widest text-brand-deep">{t.visit.hoursLabel}</h4>
                  <ul className="text-base text-brand-dark/80 font-sans font-light space-y-2.5 leading-relaxed">
                    <li className="flex justify-between gap-8 sm:gap-12"><span>{t.visit.days[0]}</span> <span className="font-semibold text-brand-dark">08:00 — 21:00</span></li>
                    <li className="flex justify-between gap-8 sm:gap-12"><span>{t.visit.days[1]}</span> <span className="font-semibold text-brand-dark">09:00 — 20:00</span></li>
                    <li className="flex justify-between gap-8 sm:gap-12"><span>{t.visit.days[2]}</span> <span className="font-semibold text-brand-dark">10:00 — 18:00</span></li>
                  </ul>
                  <div className="text-sm text-brand-deep italic mt-3 flex items-center gap-1.5 font-light">
                    <Truck className="w-3.5 h-3.5 text-brand-deep" /> {t.visit.hoursNote}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="text-brand-deep shrink-0 mt-1"><Phone className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-xs font-display font-semibold uppercase tracking-widest text-brand-deep">{t.visit.contactLabel}</h4>
                  <p className="text-base text-brand-dark/80 font-display font-light leading-relaxed">
                    {t.visit.inquiriesWord} <a href={`tel:${BRAND.phoneHref}`} className="font-sans font-medium text-brand-dark tracking-wide hover:text-brand-deep transition-colors">{BRAND.phone}</a>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM FEED */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-5 sm:px-4 md:px-12 bg-white">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs md:text-sm tracking-[0.4em] uppercase text-brand-deep block font-display mb-2 font-semibold">{t.social.eyebrow}</span>
          <h2 className="text-3xl font-display font-normal text-brand-dark">{t.social.followCta} @{BRAND.handle}</h2>
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => triggerCursor("INSTAGRAM")}
            onMouseLeave={() => triggerCursor("", false)}
            className="inline-flex items-center gap-1.5 text-xs text-brand-deep font-display tracking-wider mt-3 hover:text-brand-dark transition-colors font-semibold uppercase"
          >
            <Instagram className="w-4 h-4" /> {BRAND.wordmark}
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            "ig/ig02.jpg",
            "ig/ig05.jpg",
            "ig/ig07.jpg",
            "ig/ig11.jpg"
          ].map((url, i) => (
            <a key={i} href={BRAND.instagram} target="_blank" rel="noreferrer" className="block relative aspect-square overflow-hidden group bg-brand-champagne border border-brand-champagne">
              <img src={url} alt={t.social.tiles[i]} onError={handleImageError} className="parallax-img w-full h-full object-cover" />
              <div className="absolute inset-0 bg-brand-night/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center text-white">
                <Instagram className="w-5 h-5 mb-2 text-brand-gold" />
                <span className="text-xs tracking-widest uppercase font-display font-light">{t.social.viewPost}</span>
                <span className="text-xs text-gray-300 italic mt-1 font-display">{t.social.tiles[i]}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-night text-white relative overflow-hidden border-t border-brand-gold/20">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pt-16 sm:pt-20 md:pt-24 pb-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-12 sm:pb-16 border-b border-white/10">
            <div className="lg:col-span-7">
              <div className="flex flex-col">
                <BrandMark className="w-9 h-9 text-brand-gold mb-3" />
                <span className="text-3xl font-display font-bold tracking-[0.4em] text-white">{BRAND.name}</span>
                <span className="text-[8px] tracking-[0.5em] text-brand-gold uppercase block mt-1.5 font-bold">{t.tagline}</span>
              </div>
              <p className="mt-7 text-base text-gray-400 font-light leading-relaxed font-sans max-w-md">
                {t.footer.about}
              </p>
            </div>

            <div className="lg:col-span-5 lg:pl-10 lg:border-l lg:border-white/10">
              <h4 className="font-display uppercase tracking-[0.3em] text-brand-gold font-bold text-xs">{lang === "sq" ? "Na Kontaktoni" : "Get in Touch"}</h4>
              <p className="text-gray-400 font-light leading-relaxed mt-4 mb-6 text-base font-sans max-w-sm">{lang === "sq" ? "Na telefononi, na shkruani ne Instagram, ose na vizitoni ne dyqan." : "Call us, message us on Instagram, or visit us in store."}</p>
              <div className="space-y-4">
                <a href={`tel:${BRAND.phoneHref}`} className="flex items-center gap-3 text-base text-gray-300 hover:text-brand-gold transition-colors font-light font-sans">
                  <span className="flex items-center justify-center w-10 h-10 border border-white/15 shrink-0"><Phone className="w-4 h-4 text-brand-gold" /></span>
                  {BRAND.phone}
                </a>
                <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-base text-gray-300 hover:text-brand-gold transition-colors font-light font-sans">
                  <span className="flex items-center justify-center w-10 h-10 border border-white/15 shrink-0"><Instagram className="w-4 h-4 text-brand-gold" /></span>
                  @{BRAND.handle}
                </a>
                <span className="flex items-center gap-3 text-base text-gray-300 font-light font-sans">
                  <span className="flex items-center justify-center w-10 h-10 border border-white/15 shrink-0"><MapPin className="w-4 h-4 text-brand-gold" /></span>
                  Bulevardi Bajram Curri, Tiranë
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-10 md:gap-16 py-12 sm:py-14">
            <div>
              <h4 className="font-display uppercase tracking-[0.3em] text-brand-gold mb-6 font-bold text-xs">{t.footer.collections}</h4>
              <ul className="space-y-3.5 font-light text-gray-400 text-sm">
                {NAV_CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <a href="#shop-section" onClick={() => setActiveCategory(cat)} className="hover:text-white transition-colors duration-300 flex items-center gap-2 group font-sans">
                      <span className="w-1.5 h-1.5 bg-brand-deep rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                      {catLabel(cat)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display uppercase tracking-[0.3em] text-brand-gold mb-6 font-bold text-xs">{t.footer.salon}</h4>
              <ul className="space-y-3 font-light text-gray-400 text-xs font-display tracking-wider uppercase">
                <li className="flex justify-between gap-4 border-b border-white/5 pb-2"><span>{t.footer.salonDays[0]}</span> <span className="font-medium text-white">08:00 — 21:00</span></li>
                <li className="flex justify-between gap-4 border-b border-white/5 pb-2"><span>{t.footer.salonDays[1]}</span> <span className="font-medium text-white">09:00 — 20:00</span></li>
                <li className="flex justify-between gap-4 pb-1"><span>{t.footer.salonDays[2]}</span> <span className="font-medium text-white">10:00 — 18:00</span></li>
              </ul>
              <p className="text-[11px] text-brand-gold/90 italic mt-4 flex items-start gap-1.5 font-light leading-snug">
                <Truck className="w-3 h-3 text-brand-gold shrink-0 mt-0.5" />
                {t.footer.salonNote}
              </p>
            </div>

          </div>

          <span className="text-[8vw] sm:text-[9vw] lg:text-[11vw] font-display font-light text-white/[0.04] select-none tracking-[0.2em] uppercase leading-none block text-center mt-2 mb-6">
            {BRAND.name} FLOWERS
          </span>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent mb-8" />

          <div className="flex flex-col sm:flex-row justify-between gap-5 items-center text-[10px] text-gray-500 font-display font-medium tracking-[0.2em] uppercase text-center">
            <span>&copy; {new Date().getFullYear()} {BRAND.wordmark.toUpperCase()}. {t.footer.rights}</span>
            <div className="flex items-center gap-5 sm:gap-6">
              <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
              <span className="text-brand-deep/40">•</span>
              <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
              <span className="text-brand-deep/40">•</span>
              <LangToggle />
            </div>
          </div>
        </div>
      </footer>

      {/* SEARCH DRAWER */}
      <SideDrawer open={searchOpen} onClose={() => setSearchOpen(false)} title={t.drawer.searchTitle} closeLabel={t.drawer.close}>
        <div className="relative flex items-center gap-3 border-b border-brand-champagne focus-within:border-brand-deep transition-colors pb-3">
          <Search className="w-4 h-4 text-brand-deep shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.drawer.searchPlaceholder}
            aria-label={t.drawer.searchTitle}
            className="bg-transparent w-full text-sm text-brand-dark tracking-wide focus:outline-none placeholder:text-brand-dark/40 font-sans"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }} aria-label={t.drawer.close} className="text-brand-dark/40 hover:text-brand-dark transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {searchTerm === "" ? (
          <p className="mt-8 text-sm text-brand-dark/50 font-light leading-relaxed">{t.drawer.searchHint}</p>
        ) : searchResults.length === 0 ? (
          <p className="mt-8 text-sm text-brand-dark/50 font-light leading-relaxed">{t.drawer.noResults}</p>
        ) : (
          <ul className="mt-6 space-y-5">
            {searchResults.map((p) => (
              <li key={p.id}>
                <button onClick={() => { setSelectedProduct(p); setSearchOpen(false); }} className="w-full flex items-center gap-4 group text-left">
                  <div className="w-16 h-20 shrink-0 overflow-hidden bg-brand-champagne border border-brand-champagne">
                    <img src={p.image} alt={productName(p)} onError={handleImageError} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] tracking-[0.2em] uppercase text-brand-deep font-display font-bold mb-0.5">{catLabel(p.category)}</span>
                    <span className="block text-sm font-display text-brand-dark truncate group-hover:text-brand-deep transition-colors">{productName(p)}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-dark/30 group-hover:text-brand-deep group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </SideDrawer>

      {/* WISHLIST DRAWER */}
      <SideDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} title={t.drawer.wishlistTitle} subtitle={t.drawer.wishlistSubtitle} closeLabel={t.drawer.close}>
        {wishlist.length === 0 ? (
          <div className="mt-10 text-center">
            <Heart className="w-8 h-8 text-brand-champagne mx-auto mb-4" strokeWidth={1.2} />
            <p className="text-sm text-brand-dark/60 font-light">{t.drawer.wishlistEmpty}</p>
            <p className="text-xs text-brand-dark/40 font-light mt-2 leading-relaxed">{t.drawer.wishlistEmptyHint}</p>
          </div>
        ) : (
          <ul className="space-y-5">
            {wishlist.map((p) => (
              <li key={p.id} className="flex items-center gap-4">
                <button onClick={() => { setSelectedProduct(p); setWishlistOpen(false); }} className="flex items-center gap-4 flex-1 min-w-0 group text-left">
                  <div className="w-16 h-20 shrink-0 overflow-hidden bg-brand-champagne border border-brand-champagne">
                    <img src={p.image} alt={productName(p)} onError={handleImageError} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] tracking-[0.2em] uppercase text-brand-deep font-display font-bold mb-0.5">{catLabel(p.category)}</span>
                    <span className="block text-sm font-display text-brand-dark truncate group-hover:text-brand-deep transition-colors">{productName(p)}</span>
                  </div>
                </button>
                <button onClick={(e) => toggleWishlist(p, e)} aria-label={t.drawer.remove} className="p-2 text-brand-dark/35 hover:text-brand-red transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </SideDrawer>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4">
          <div onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

          <div className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border border-brand-champagne grid grid-cols-1 md:grid-cols-12 z-10 animate-scale-up">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white text-brand-dark hover:text-brand-deep shadow-md transition-colors" aria-label="Close">
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>

            <div className="md:col-span-5 relative aspect-[4/3] md:aspect-auto md:h-full bg-brand-champagne min-h-[240px] overflow-hidden">
              <img src={selectedProduct.image} alt={productName(selectedProduct)} onError={handleImageError} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] hover:scale-105" />
            </div>

            <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs tracking-[0.25em] font-display uppercase text-brand-deep font-semibold bg-brand-champagne px-3 py-1 rounded-none">
                    {catLabel(selectedProduct.category)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Flower2 className="w-4 h-4 text-brand-gold" />
                    <span className="text-sm font-display font-medium text-brand-dark uppercase tracking-widest">{t.modal.selected}</span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display text-brand-dark tracking-wide">{productName(selectedProduct)}</h3>
                <div className="text-sm font-display text-brand-deep uppercase tracking-[0.2em] font-semibold mt-2.5">{t.modal.exclusive}</div>
                <p className="text-base text-gray-600 font-light mt-4 leading-relaxed font-sans">{selectedProduct.description[lang]}</p>

                <div className="mt-6 space-y-2.5">
                  <h4 className="text-xs tracking-widest font-display uppercase font-semibold text-brand-dark mb-1">{t.modal.details}</h4>
                  {selectedProduct.details[lang].map((detail, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-brand-dark/70 font-light">
                      <Check className="w-4 h-4 text-brand-deep shrink-0 stroke-[2.5]" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-3 bg-brand-champagne border border-brand-champagne rounded-none flex items-center gap-2.5 text-xs text-gray-500 uppercase tracking-widest font-light">
                  <ShieldCheck className="w-4 h-4 text-brand-gold stroke-[1.5]" />
                  <span>{t.modal.guarantee}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-brand-champagne flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => { handleInquiry(productName(selectedProduct)); setSelectedProduct(null); }}
                  className="flex-grow py-4 bg-brand-dark hover:bg-brand-deep text-white text-xs tracking-widest font-display uppercase transition-colors duration-500 rounded-none shadow-md font-semibold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.modal.inquire}</span>
                </button>
                <button
                  onClick={(e) => toggleWishlist(selectedProduct, e)}
                  className="px-6 py-4 border border-brand-champagne hover:border-brand-dark text-brand-dark text-xs tracking-widest font-display uppercase transition-all duration-300 rounded-none flex items-center justify-center gap-2 font-semibold"
                >
                  <Heart className={`w-4 h-4 ${wishlist.find(item => item.id === selectedProduct.id) ? "fill-brand-red text-brand-red stroke-brand-red" : ""}`} />
                  <span>{wishlist.find(item => item.id === selectedProduct.id) ? t.modal.wishlisted : t.modal.add}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
