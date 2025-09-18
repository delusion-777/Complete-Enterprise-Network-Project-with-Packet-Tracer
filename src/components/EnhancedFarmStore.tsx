import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ShoppingCart, Coins, IndianRupee, Shield, Leaf, Truck, Sprout, Wrench } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  realPrice: number;
  coinPrice: number;
  discountPercent?: number;
  category: 'government' | 'bio' | 'tools' | 'seeds' | 'other';
  isSubsidized?: boolean;
  icon: string;
  inStock: boolean;
  tags: string[];
}

interface EnhancedFarmStoreProps {
  coins: number;
  onPurchase: (itemId: string, cost: number) => void;
  language?: string;
}

// Multi-language store translations
const storeTranslations = {
  en: {
    storeTitle: "Kisan-Go Pro Marketplace",
    storeDesc: "Professional farming supplies with government subsidies and sustainable rewards",
    government: "Government / Subsidized",
    bioOrganic: "Bio / Organic Inputs",
    tools: "Traditional Tools",
    seeds: "Seeds & Saplings",
    others: "Other Supplies",
    realPrice: "Market Price",
    coinPrice: "Coin Price",
    discount: "Discount",
    subsidized: "Govt. Subsidized",
    organic: "Organic",
    traditional: "Traditional",
    certified: "Certified",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    outOfStock: "Out of Stock",
    insufficient: "Insufficient Coins"
  },
  hi: {
    storeTitle: "किसान-गो प्रो बाज़ार",
    storeDesc: "सरकारी सब्सिडी और स्थायी पुरस्कारों के साथ पेशेवर कृषि आपूर्ति",
    government: "सरकारी / सब्सिडी",
    bioOrganic: "जैविक / जैविक इनपुट",
    tools: "पारंपरिक औजार",
    seeds: "बीज और पौधे",
    others: "अन्य आपूर्ति",
    realPrice: "बाजार मूल्य",
    coinPrice: "सिक्का मूल्य",
    discount: "छूट",
    subsidized: "सरकारी सब्सिडी",
    organic: "जैविक",
    traditional: "पारंपरिक",
    certified: "प्रमाणित",
    addToCart: "कार्ट में जोड़ें",
    buyNow: "अभी खरीदें",
    outOfStock: "स्टॉक में नहीं",
    insufficient: "अपर्याप्त सिक्के"
  },
  ta: {
    storeTitle: "கிசான்-கோ ப்ரோ சந்தை",
    storeDesc: "அரசு மானியங்கள் மற்றும் நிலையான வெகுமதிகளுடன் தொழில்முறை விவசாய பொருட்கள்",
    government: "அரசு / மானியம்",
    bioOrganic: "உயிரியல் / இயற்கை உள்ளீடுகள்",
    tools: "பாரம்பரிய கருவிகள்",
    seeds: "விதைகள் & நாற்றுகள்",
    others: "மற்ற பொருட்கள்",
    realPrice: "சந்தை விலை",
    coinPrice: "நாணய விலை",
    discount: "தள்ளுபடி",
    subsidized: "அரசு மானியம்",
    organic: "இயற்கை",
    traditional: "பாரம்பரிய",
    certified: "சான்றிதழ்",
    addToCart: "கார்ட்டில் சேர்",
    buyNow: "இப்போது வாங்கு",
    outOfStock: "கையிருப்பில் இல்லை",
    insufficient: "போதுமான நாணயங்கள் இல்லை"
  },
  te: {
    storeTitle: "కిసాన్-గో ప్రో మార్కెట్‌ప్లేస్",
    storeDesc: "ప్రభుత్వ సబ్సిడీలు మరియు స్థిరమైన రివార్డులతో వృత్తిపరమైన వ్యవసాయ సామాగ్రి",
    government: "ప్రభుత్వ / సబ్సిడీ",
    bioOrganic: "బయో / సేంద్రీయ ఇన్‌పుట్‌లు",
    tools: "సాంప్రదాయ పరికరాలు",
    seeds: "విత్తనాలు & మొక్కలు",
    others: "ఇతర సామాగ్రి",
    realPrice: "మార్కెట్ ధర",
    coinPrice: "నాణేల ధర",
    discount: "తగ్గింపు",
    subsidized: "ప్రభుత్వ సబ్సిడీ",
    organic: "సేంద్రీయ",
    traditional: "సాంప్రదాయ",
    certified: "ధృవీకరించబడిన",
    addToCart: "కార్ట్‌కు జోడించు",
    buyNow: "ఇప్పుడు కొనండి",
    outOfStock: "స్టాక్‌లో లేదు",
    insufficient: "తగినంత నాణేలు లేవు"
  },
  kn: {
    storeTitle: "ಕಿಸಾನ್-ಗೋ ಪ್ರೋ ಮಾರುಕಟ್ಟೆ",
    storeDesc: "ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಗಳು ಮತ್ತು ಸಮರ್ಥನೀಯ ಪುರಸ್ಕಾರಗಳೊಂದಿಗೆ ವೃತ್ತಿಪರ ಕೃಷಿ ಸರಬರಾಜುಗಳು",
    government: "ಸರ್ಕಾರಿ / ಸಬ್ಸಿಡಿ",
    bioOrganic: "ಜೈವಿಕ / ಸಾವಯವ ಒಳಹರಿವುಗಳು",
    tools: "ಸಾಂಪ್ರದಾಯಿಕ ಉಪಕರಣಗಳು",
    seeds: "ಬೀಜಗಳು & ಸಸಿಗಳು",
    others: "ಇತರ ಸರಬರಾಜುಗಳು",
    realPrice: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",
    coinPrice: "ನಾಣ್ಯ ಬೆಲೆ",
    discount: "ರಿಯಾಯಿತಿ",
    subsidized: "ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ",
    organic: "ಸಾವಯವ",
    traditional: "ಸಾಂಪ್ರದಾಯಿಕ",
    certified: "ಪ್ರಮಾಣೀಕೃತ",
    addToCart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    buyNow: "ಈಗ ಖರೀದಿಸಿ",
    outOfStock: "ಸ್ಟಾಕ್‌ನಲ್ಲಿ ಇಲ್ಲ",
    insufficient: "ಸಾಕಷ್ಟು ನಾಣ್ಯಗಳಿಲ್ಲ"
  },
  ml: {
    storeTitle: "കിസാൻ-ഗോ പ്രോ മാർക്കറ്റ്‌പ്ലേസ്",
    storeDesc: "സർക്കാർ സബ്‌സിഡികളും സുസ്ഥിര റിവാർഡുകളും സഹിതം പ്രൊഫഷണൽ കാർഷിക സപ്ലൈകൾ",
    government: "സർക്കാർ / സബ്‌സിഡി",
    bioOrganic: "ബയോ / ഓർഗാനിക് ഇൻപുട്ടുകൾ",
    tools: "പരമ്പരാഗത ഉപകരണങ്ങൾ",
    seeds: "വിത്തുകൾ & തൈകൾ",
    others: "മറ്റ് സപ്ലൈകൾ",
    realPrice: "മാർക്കറ്റ് വില",
    coinPrice: "കോയിൻ വില",
    discount: "കിഴിവ്",
    subsidized: "സർക്കാർ സബ്‌സിഡി",
    organic: "ഓർഗാനിക്",
    traditional: "പരമ്പരാഗത",
    certified: "സർട്ടിഫൈഡ്",
    addToCart: "കാർട്ടിൽ ചേർക്കുക",
    buyNow: "ഇപ്പോൾ വാങ്ങുക",
    outOfStock: "സ്റ്റോക്കില്ല",
    insufficient: "മതിയായ കോയിനുകളില്ല"
  }
};

function st(key: string, language: string): string {
  return (storeTranslations as any)[language]?.[key] || (storeTranslations as any)['en'][key] || key;
}

const storeItems: StoreItem[] = [
  // Government / Subsidized Items
  {
    id: 'govt-paddy-seeds',
    name: 'Government Paddy Seeds',
    description: 'Certified HYV paddy seeds under government scheme',
    realPrice: 800,
    coinPrice: 50,
    discountPercent: 60,
    category: 'government',
    isSubsidized: true,
    icon: '🌾',
    inStock: true,
    tags: ['subsidized', 'certified', 'HYV']
  },
  {
    id: 'bio-fertilizer-pack',
    name: 'Bio-fertilizer Pack (Govt)',
    description: 'Government supplied bio-fertilizer and vermicompost',
    realPrice: 1200,
    coinPrice: 75,
    discountPercent: 70,
    category: 'government',
    isSubsidized: true,
    icon: '🧪',
    inStock: true,
    tags: ['subsidized', 'bio', 'vermicompost']
  },
  {
    id: 'subsidized-sickle',
    name: 'Subsidized Sickle',
    description: 'Traditional hand sickle with government subsidy',
    realPrice: 450,
    coinPrice: 30,
    discountPercent: 50,
    category: 'government',
    isSubsidized: true,
    icon: '🔪',
    inStock: true,
    tags: ['subsidized', 'traditional', 'tool']
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card Kit',
    description: 'Government soil testing kit with analysis',
    realPrice: 600,
    coinPrice: 25,
    discountPercent: 80,
    category: 'government',
    isSubsidized: true,
    icon: '📋',
    inStock: true,
    tags: ['subsidized', 'testing', 'analysis']
  },
  {
    id: 'drip-irrigation-kit',
    name: 'Drip Irrigation Kit (Subsidized)',
    description: 'Water-efficient drip irrigation system with 60% subsidy',
    realPrice: 5000,
    coinPrice: 150,
    discountPercent: 60,
    category: 'government',
    isSubsidized: true,
    icon: '💧',
    inStock: true,
    tags: ['subsidized', 'water-saving', 'irrigation']
  },

  // Bio / Organic Inputs
  {
    id: 'neem-oil',
    name: 'Pure Neem Oil',
    description: 'Organic neem oil for natural pest control',
    realPrice: 320,
    coinPrice: 45,
    category: 'bio',
    icon: '🌿',
    inStock: true,
    tags: ['organic', 'pest-control', 'natural']
  },
  {
    id: 'neem-cake',
    name: 'Neem Cake Fertilizer',
    description: 'Organic neem cake for soil health improvement',
    realPrice: 280,
    coinPrice: 40,
    category: 'bio',
    icon: '🍃',
    inStock: true,
    tags: ['organic', 'fertilizer', 'soil-health']
  },
  {
    id: 'panchagavya',
    name: 'Panchagavya',
    description: 'Traditional bio growth promoter from cow products',
    realPrice: 150,
    coinPrice: 25,
    category: 'bio',
    icon: '🐄',
    inStock: true,
    tags: ['traditional', 'bio', 'growth-promoter']
  },
  {
    id: 'jeevamrutham',
    name: 'Jeevamrutham',
    description: 'Liquid organic fertilizer for enhanced crop growth',
    realPrice: 180,
    coinPrice: 30,
    category: 'bio',
    icon: '🧴',
    inStock: true,
    tags: ['organic', 'liquid', 'fertilizer']
  },
  {
    id: 'trichoderma',
    name: 'Trichoderma Bio-pesticide',
    description: 'Biological pesticide for disease control',
    realPrice: 400,
    coinPrice: 55,
    category: 'bio',
    icon: '🔬',
    inStock: true,
    tags: ['bio-pesticide', 'disease-control', 'biological']
  },
  {
    id: 'vermicompost',
    name: 'Premium Vermicompost',
    description: 'High-quality earthworm compost for organic farming',
    realPrice: 250,
    coinPrice: 35,
    category: 'bio',
    icon: '🪱',
    inStock: true,
    tags: ['organic', 'compost', 'premium']
  },
  {
    id: 'cow-dung-cakes',
    name: 'Cow Dung Cakes',
    description: 'Traditional cow dung cakes for soil nutrition',
    realPrice: 120,
    coinPrice: 20,
    category: 'bio',
    icon: '🥞',
    inStock: true,
    tags: ['traditional', 'organic', 'soil-nutrition']
  },

  // Traditional Farming Tools
  {
    id: 'wooden-plough',
    name: 'Wooden Plough with Yoke',
    description: 'Traditional wooden plough for sustainable farming',
    realPrice: 2500,
    coinPrice: 120,
    category: 'tools',
    icon: '🪓',
    inStock: true,
    tags: ['traditional', 'wooden', 'ploughing']
  },
  {
    id: 'hand-sickle',
    name: 'Hand Sickle',
    description: 'Sharp hand sickle for crop harvesting',
    realPrice: 350,
    coinPrice: 25,
    category: 'tools',
    icon: '🔪',
    inStock: true,
    tags: ['traditional', 'harvesting', 'hand-tool']
  },
  {
    id: 'spade-hoe',
    name: 'Spade & Hoe Set',
    description: 'Traditional spade and hoe for land preparation',
    realPrice: 800,
    coinPrice: 50,
    category: 'tools',
    icon: '⛏️',
    inStock: true,
    tags: ['traditional', 'land-preparation', 'set']
  },
  {
    id: 'hand-sprayer',
    name: 'Manual Hand Sprayer',
    description: 'Hand-operated sprayer for organic pesticides',
    realPrice: 1200,
    coinPrice: 70,
    category: 'tools',
    icon: '💨',
    inStock: true,
    tags: ['manual', 'spraying', 'pesticide']
  },
  {
    id: 'seed-broadcaster',
    name: 'Manual Seed Broadcaster',
    description: 'Traditional seed broadcasting equipment',
    realPrice: 900,
    coinPrice: 60,
    category: 'tools',
    icon: '🌱',
    inStock: true,
    tags: ['manual', 'seeding', 'traditional']
  },
  {
    id: 'grain-storage-bin',
    name: 'Metal Grain Storage Bin',
    description: 'Pest-proof storage for harvested grains',
    realPrice: 3500,
    coinPrice: 180,
    category: 'tools',
    icon: '🏺',
    inStock: true,
    tags: ['storage', 'pest-proof', 'metal']
  },

  // Seeds
  {
    id: 'paddy-seeds',
    name: 'Traditional Paddy Seeds',
    description: 'Local variety paddy seeds for regional farming',
    realPrice: 600,
    coinPrice: 40,
    category: 'seeds',
    icon: '🌾',
    inStock: true,
    tags: ['traditional', 'local-variety', 'paddy']
  },
  {
    id: 'millet-seeds',
    name: 'Mixed Millet Seeds',
    description: 'Nutritious millet varieties for sustainable farming',
    realPrice: 400,
    coinPrice: 30,
    category: 'seeds',
    icon: '🌾',
    inStock: true,
    tags: ['millet', 'nutritious', 'sustainable']
  },
  {
    id: 'pulse-seeds',
    name: 'Pulse Seed Variety Pack',
    description: 'Mixed pulses including lentils and chickpeas',
    realPrice: 500,
    coinPrice: 35,
    category: 'seeds',
    icon: '🫘',
    inStock: true,
    tags: ['pulses', 'protein-rich', 'variety']
  },
  {
    id: 'oilseed-pack',
    name: 'Oilseed Variety Pack',
    description: 'Sunflower, sesame, and groundnut seeds',
    realPrice: 700,
    coinPrice: 50,
    category: 'seeds',
    icon: '🌻',
    inStock: true,
    tags: ['oilseeds', 'variety', 'commercial']
  },
  {
    id: 'vegetable-kit',
    name: 'Kitchen Garden Vegetable Kit',
    description: 'Comprehensive vegetable seeds for home gardening',
    realPrice: 450,
    coinPrice: 35,
    category: 'seeds',
    icon: '🥬',
    inStock: true,
    tags: ['vegetables', 'kitchen-garden', 'comprehensive']
  },
  {
    id: 'green-manure-seeds',
    name: 'Green Manure Seeds',
    description: 'Sunhemp and dhaincha for soil improvement',
    realPrice: 300,
    coinPrice: 25,
    category: 'seeds',
    icon: '🌱',
    inStock: true,
    tags: ['green-manure', 'soil-improvement', 'organic']
  },

  // Other Farmer Needs
  {
    id: 'irrigation-pipes',
    name: 'PVC Irrigation Pipes',
    description: 'Durable pipes for farm irrigation systems',
    realPrice: 1800,
    coinPrice: 100,
    category: 'other',
    icon: '🚰',
    inStock: true,
    tags: ['irrigation', 'pvc', 'durable']
  },
  {
    id: 'soil-testing-kit',
    name: 'Digital Soil Testing Kit',
    description: 'Modern soil pH and nutrient testing equipment',
    realPrice: 2200,
    coinPrice: 120,
    category: 'other',
    icon: '🔬',
    inStock: true,
    tags: ['testing', 'digital', 'pH-nutrient']
  },
  {
    id: 'protective-gear',
    name: 'Farm Protective Gear Set',
    description: 'Gloves, masks, and safety equipment for farming',
    realPrice: 800,
    coinPrice: 45,
    category: 'other',
    icon: '🧤',
    inStock: true,
    tags: ['safety', 'protective', 'gear-set']
  },
  {
    id: 'shade-net',
    name: 'Agricultural Shade Net',
    description: 'UV-resistant shade net for crop protection',
    realPrice: 1500,
    coinPrice: 85,
    category: 'other',
    icon: '🕸️',
    inStock: true,
    tags: ['shade', 'uv-resistant', 'protection']
  },
  {
    id: 'mulching-sheets',
    name: 'Biodegradable Mulching Sheets',
    description: 'Eco-friendly mulching for water conservation',
    realPrice: 600,
    coinPrice: 40,
    category: 'other',
    icon: '📄',
    inStock: true,
    tags: ['biodegradable', 'mulching', 'water-conservation']
  }
];

export function EnhancedFarmStore({ coins, onPurchase, language = 'en' }: EnhancedFarmStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('government');
  const [cart, setCart] = useState<string[]>([]);

  const filteredItems = storeItems.filter(item => item.category === selectedCategory);

  const handlePurchase = (item: StoreItem) => {
    if (coins < item.coinPrice) {
      toast.error(st('insufficient', language));
      return;
    }

    if (!item.inStock) {
      toast.error(st('outOfStock', language));
      return;
    }

    onPurchase(item.id, item.coinPrice);
    toast.success(`Purchased ${item.name}! ${item.isSubsidized ? `(${item.discountPercent}% govt. subsidy applied)` : ''}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'government': return <Shield className="h-4 w-4" />;
      case 'bio': return <Leaf className="h-4 w-4" />;
      case 'tools': return <Wrench className="h-4 w-4" />;
      case 'seeds': return <Sprout className="h-4 w-4" />;
      default: return <Truck className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-semibold bg-gradient-to-r from-orange-dark to-green-600 bg-clip-text text-transparent">
          {st('storeTitle', language)}
        </h2>
        <p className="text-muted-foreground mt-2">
          {st('storeDesc', language)}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Coins className="h-5 w-5 text-orange-medium" />
          <span className="font-semibold text-lg">{coins} coins available</span>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="government" className="flex items-center gap-2">
            {getCategoryIcon('government')}
            <span className="hidden sm:inline">{st('government', language)}</span>
          </TabsTrigger>
          <TabsTrigger value="bio" className="flex items-center gap-2">
            {getCategoryIcon('bio')}
            <span className="hidden sm:inline">{st('bioOrganic', language)}</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            {getCategoryIcon('tools')}
            <span className="hidden sm:inline">{st('tools', language)}</span>
          </TabsTrigger>
          <TabsTrigger value="seeds" className="flex items-center gap-2">
            {getCategoryIcon('seeds')}
            <span className="hidden sm:inline">{st('seeds', language)}</span>
          </TabsTrigger>
          <TabsTrigger value="other" className="flex items-center gap-2">
            {getCategoryIcon('other')}
            <span className="hidden sm:inline">{st('others', language)}</span>
          </TabsTrigger>
        </TabsList>

        {['government', 'bio', 'tools', 'seeds', 'other'].map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className={`overflow-hidden transition-all hover:shadow-lg ${
                  item.isSubsidized ? 'border-green-200 bg-gradient-to-br from-green-50 to-blue-50' : ''
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{item.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className={`text-xs ${
                                  tag === 'subsidized' ? 'bg-green-100 text-green-700' :
                                  tag === 'organic' ? 'bg-blue-100 text-blue-700' :
                                  tag === 'traditional' ? 'bg-orange-100 text-orange-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      {item.isSubsidized && (
                        <Badge className="bg-green-500 text-white">
                          -{item.discountPercent}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{item.description}</CardDescription>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{st('realPrice', language)}:</span>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          <span className={item.isSubsidized ? 'line-through text-gray-500' : 'font-semibold'}>
                            {item.realPrice}
                          </span>
                        </div>
                      </div>
                      
                      {item.isSubsidized && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-600">{st('subsidized', language)}:</span>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-600">
                              {Math.round(item.realPrice * (1 - (item.discountPercent || 0) / 100))}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{st('coinPrice', language)}:</span>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-orange-medium" />
                          <span className="font-semibold text-orange-dark">{item.coinPrice}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handlePurchase(item)}
                      disabled={coins < item.coinPrice || !item.inStock}
                      className="w-full"
                      variant={item.isSubsidized ? "default" : "outline"}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {!item.inStock ? st('outOfStock', language) :
                       coins < item.coinPrice ? st('insufficient', language) :
                       st('buyNow', language)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}