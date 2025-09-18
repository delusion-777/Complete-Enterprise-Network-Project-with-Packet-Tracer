import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { User, Shirt, Home, Tractor, Award, Lock, Unlock, Wrench } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface CustomizationItem {
  id: string;
  name: string;
  description: string;
  category: 'appearance' | 'outfit' | 'farm' | 'equipment';
  cost: number;
  unlockLevel: number;
  isUnlocked: boolean;
  isEquipped: boolean;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AvatarCustomizationProps {
  playerLevel: number;
  coins: number;
  onPurchase: (itemId: string, cost: number) => void;
  language?: string;
}

const customizationTranslations = {
  en: {
    title: "Kisan-Go Pro Avatar & Farm Designer",
    subtitle: "Customize your professional farmer avatar and sustainable farm",
    appearance: "Appearance",
    outfit: "Farmer Outfit",
    farmDesign: "Farm Design",
    equipment: "Eco Equipment",
    unlock: "Unlock",
    equip: "Equip",
    equipped: "Equipped",
    locked: "Locked",
    levelRequired: "Level Required",
    ecoReward: "Eco Reward",
    sustainableChoice: "Sustainable Choice",
    preview: "Preview Your Farmer",
    farmPreview: "Farm Preview"
  },
  hi: {
    title: "किसान-गो प्रो अवतार और खेत डिजाइनर",
    subtitle: "अपने पेशेवर किसान अवतार और स्थायी खेत को अनुकूलित करें",
    appearance: "बाहरी रूप",
    outfit: "किसान पोशाक",
    farmDesign: "खेत डिज़ाइन",
    equipment: "पर्यावरण उपकरण",
    unlock: "अनलॉक करें",
    equip: "लैस करें",
    equipped: "लैस",
    locked: "बंद",
    levelRequired: "स्तर आवश्यक",
    ecoReward: "पर्यावरण पुरस्कार",
    sustainableChoice: "टिकाऊ विकल्प",
    preview: "अपने किसान का पूर्वावलोकन",
    farmPreview: "खेत पूर्वावलोकन"
  },
  ta: {
    title: "அவதார் & பண்ணை தனிப்பயனாக்கம்",
    subtitle: "சுற்றுச்சூழல் நட்பு வெகுமதிகளுடன் உங்கள் விவசாயி மற்றும் பண்ணையை வடிவமைக்கவும்",
    appearance: "தோற்றம்",
    outfit: "விவசாயி உடை",
    farmDesign: "பண்ணை வடிவமைப்பு",
    equipment: "சுற்றுச்சூழல் உபकரணங்கள்",
    unlock: "திறக்க",
    equip: "அணிய",
    equipped: "அணிந்துள்ளது",
    locked: "பூட்டப்பட்டது",
    levelRequired: "தேவையான நிலை",
    ecoReward: "சுற்றுச்சூழல் வெகுமதி",
    sustainableChoice: "நிலையான தேர்வு",
    preview: "உங்கள் விவசாயியின் முன்னோட்டம்",
    farmPreview: "பண்ணை முன்னோட்டம்"
  },
  te: {
    title: "అవతార్ & ఫార్మ్ కస్టమైజేషన్",
    subtitle: "పర్యావరణ అనుకూల రివార్డులతో మీ రైతు మరియు వ్యవసాయాన్ని డిజైన్ చేయండి",
    appearance: "రూపాన్ని",
    outfit: "రైతు దుస్తులు",
    farmDesign: "వ్యవసాయ డిజైన్",
    equipment: "పర్యావరణ పరికరాలు",
    unlock: "అన్‌లాక్",
    equip: "ధరించు",
    equipped: "ధరించారు",
    locked: "లాక్ చేయబడింది",
    levelRequired: "అవసరమైన స్థాయి",
    ecoReward: "పర్యావరణ రివార్డ్",
    sustainableChoice: "స్థిరమైన ఎంపిక",
    preview: "మీ రైతు ప్రివ్యూ",
    farmPreview: "వ్యవసాయ ప్రివ్యూ"
  },
  kn: {
    title: "ಅವತಾರ್ ಮತ್ತು ಫಾರ್ಮ್ ಕಸ್ಟಮೈಸೇಶನ್",
    subtitle: "ಪರಿಸರ ಸ್ನೇಹಿ ಪುರಸ್ಕಾರಗಳೊಂದಿಗೆ ನಿಮ್ಮ ರೈತ ಮತ್ತು ಕೃಷಿಯನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಿ",
    appearance: "ನೋಟ",
    outfit: "ರೈತ ಉಡುಪು",
    farmDesign: "ಕೃಷಿ ವಿನ್ಯಾಸ",
    equipment: "ಪರಿಸರ ಉಪಕರಣಗಳು",
    unlock: "ಅನ್‌ಲಾಕ್",
    equip: "ಧರಿಸಿ",
    equipped: "ಧರಿಸಲಾಗಿದೆ",
    locked: "ಲಾಕ್ ಮಾಡಲಾಗಿದೆ",
    levelRequired: "ಅಗತ್ಯವಿರುವ ಮಟ್ಟ",
    ecoReward: "ಪರಿಸರ ಪುರಸ್ಕಾರ",
    sustainableChoice: "ಸಮರ್ಥನೀಯ ಆಯ್ಕೆ",
    preview: "ನಿಮ್ಮ ರೈತನ ಪೂರ್ವವೀಕ್ಷಣೆ",
    farmPreview: "ಕೃಷಿ ಪೂರ್ವವೀಕ್ಷಣೆ"
  },
  ml: {
    title: "അവതാർ & ഫാം കസ്റ്റമൈസേഷൻ",
    subtitle: "പരിസ്ഥിതി സൗഹൃദ റിവാർഡുകളോടെ നിങ്ങളുടെ കർഷകനെയും കൃഷിയെയും ഡിസൈൻ ചെയ്യുക",
    appearance: "രൂപം",
    outfit: "കർഷക വസ്ത്രം",
    farmDesign: "ഫാം ഡിസൈൻ",
    equipment: "പരിസ്ഥിതി ഉപകരണങ്ങൾ",
    unlock: "അൺലോക്ക്",
    equip: "ധരിക്കുക",
    equipped: "ധരിച്ചു",
    locked: "ലോക്ക് ചെയ്തു",
    levelRequired: "ആവശ്യമായ ലെവൽ",
    ecoReward: "പരിസ്ഥിതി റിവാർഡ്",
    sustainableChoice: "സുസ്ഥിര തിരഞ്ഞെടുപ്പ്",
    preview: "നിങ്ങളുടെ കർഷകന്റെ പ്രിവ്യൂ",
    farmPreview: "ഫാം പ്രിവ്യൂ"
  }
};

function ct(key: string, language: string): string {
  return (customizationTranslations as any)[language]?.[key] || (customizationTranslations as any)['en'][key] || key;
}

const customizationItems: CustomizationItem[] = [
  // Appearance
  {
    id: 'beard-style-1',
    name: 'Traditional Beard',
    description: 'Classic farmer beard style',
    category: 'appearance',
    cost: 50,
    unlockLevel: 1,
    isUnlocked: true,
    isEquipped: false,
    icon: '🧔',
    rarity: 'common'
  },
  {
    id: 'hat-turban',
    name: 'Traditional Turban',
    description: 'Colorful traditional turban',
    category: 'appearance',
    cost: 100,
    unlockLevel: 3,
    isUnlocked: false,
    isEquipped: false,
    icon: '🎭',
    rarity: 'rare'
  },

  // Outfit
  {
    id: 'khadi-shirt',
    name: 'Khadi Cotton Shirt',
    description: 'Eco-friendly khadi cotton shirt',
    category: 'outfit',
    cost: 150,
    unlockLevel: 2,
    isUnlocked: false,
    isEquipped: false,
    icon: '👕',
    rarity: 'common'
  },
  {
    id: 'organic-vest',
    name: 'Organic Farming Vest',
    description: 'Special vest for organic farmers',
    category: 'outfit',
    cost: 200,
    unlockLevel: 5,
    isUnlocked: false,
    isEquipped: false,
    icon: '🦺',
    rarity: 'rare'
  },
  {
    id: 'solar-jacket',
    name: 'Solar-Powered Jacket',
    description: 'Futuristic jacket with solar panels',
    category: 'outfit',
    cost: 500,
    unlockLevel: 15,
    isUnlocked: false,
    isEquipped: false,
    icon: '🧥',
    rarity: 'legendary'
  },

  // Farm Design
  {
    id: 'bamboo-fence',
    name: 'Bamboo Fence',
    description: 'Sustainable bamboo fencing',
    category: 'farm',
    cost: 300,
    unlockLevel: 4,
    isUnlocked: false,
    isEquipped: false,
    icon: '🎋',
    rarity: 'common'
  },
  {
    id: 'flower-garden',
    name: 'Pollinator Garden',
    description: 'Beautiful garden to attract bees',
    category: 'farm',
    cost: 400,
    unlockLevel: 8,
    isUnlocked: false,
    isEquipped: false,
    icon: '🌻',
    rarity: 'rare'
  },
  {
    id: 'water-fountain',
    name: 'Rainwater Fountain',
    description: 'Decorative rainwater harvesting fountain',
    category: 'farm',
    cost: 800,
    unlockLevel: 12,
    isUnlocked: false,
    isEquipped: false,
    icon: '⛲',
    rarity: 'epic'
  },

  // Equipment
  {
    id: 'solar-tractor',
    name: 'Solar Tractor',
    description: 'Electric tractor powered by solar energy',
    category: 'equipment',
    cost: 1000,
    unlockLevel: 10,
    isUnlocked: false,
    isEquipped: false,
    icon: '🚜',
    rarity: 'epic'
  },
  {
    id: 'rainwater-tank',
    name: 'Smart Rainwater Tank',
    description: 'Automated rainwater collection system',
    category: 'equipment',
    cost: 600,
    unlockLevel: 7,
    isUnlocked: false,
    isEquipped: false,
    icon: '🏺',
    rarity: 'rare'
  },
  {
    id: 'wind-turbine',
    name: 'Mini Wind Turbine',
    description: 'Small wind turbine for clean energy',
    category: 'equipment',
    cost: 1200,
    unlockLevel: 18,
    isUnlocked: false,
    isEquipped: false,
    icon: '💨',
    rarity: 'legendary'
  }
];

export function AvatarCustomization({ playerLevel, coins, onPurchase, language = 'en' }: AvatarCustomizationProps) {
  const [items, setItems] = useState<CustomizationItem[]>(
    customizationItems.map(item => ({
      ...item,
      isUnlocked: item.unlockLevel <= playerLevel || item.isUnlocked
    }))
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('appearance');

  const handlePurchase = (item: CustomizationItem) => {
    if (coins < item.cost) {
      toast.error('Insufficient coins!');
      return;
    }

    if (item.unlockLevel > playerLevel) {
      toast.error(`Requires level ${item.unlockLevel}!`);
      return;
    }

    onPurchase(item.id, item.cost);
    setItems(items.map(i => 
      i.id === item.id ? { ...i, isUnlocked: true } : i
    ));
    toast.success(`Unlocked ${item.name}! 🎉`);
  };

  const handleEquip = (item: CustomizationItem) => {
    setItems(items.map(i => ({
      ...i,
      isEquipped: i.category === item.category && i.id === item.id ? true : 
                 i.category === item.category ? false : i.isEquipped
    })));
    toast.success(`Equipped ${item.name}! ✨`);
  };

  const filteredItems = items.filter(item => item.category === selectedCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'epic': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getEquippedItems = () => {
    const equipped: Record<string, CustomizationItem> = {};
    items.forEach(item => {
      if (item.isEquipped) {
        equipped[item.category] = item;
      }
    });
    return equipped;
  };

  const equippedItems = getEquippedItems();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {ct('title', language)}
        </h2>
        <p className="text-muted-foreground mt-2">
          {ct('subtitle', language)}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar Preview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-500" />
              {ct('preview', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gradient-to-b from-blue-100 to-green-100 rounded-lg p-8 min-h-[300px] flex flex-col items-center justify-center">
              {/* Sky background */}
              <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-200 to-blue-100 rounded-t-lg"></div>
              
              {/* Ground */}
              <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-b from-green-100 to-green-200 rounded-b-lg"></div>
              
              {/* Farmer Avatar */}
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-2">
                  {equippedItems.appearance?.icon || '👨‍🌾'}
                </div>
                <div className="text-4xl mb-2">
                  {equippedItems.outfit?.icon || '👕'}
                </div>
                <div className="flex justify-center gap-2 text-2xl">
                  {equippedItems.equipment?.icon && (
                    <span>{equippedItems.equipment.icon}</span>
                  )}
                </div>
              </div>
              
              {/* Farm elements */}
              {equippedItems.farm && (
                <div className="absolute bottom-4 left-4 text-2xl">
                  {equippedItems.farm.icon}
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">{ct('farmPreview', language)}</h4>
              <div className="flex flex-wrap gap-1">
                {Object.values(equippedItems).map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {item.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customization Options */}
        <div className="lg:col-span-2">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {ct('appearance', language)}
              </TabsTrigger>
              <TabsTrigger value="outfit" className="flex items-center gap-2">
                <Shirt className="h-4 w-4" />
                {ct('outfit', language)}
              </TabsTrigger>
              <TabsTrigger value="farm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {ct('farmDesign', language)}
              </TabsTrigger>
              <TabsTrigger value="equipment" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                {ct('equipment', language)}
              </TabsTrigger>
            </TabsList>

            {['appearance', 'outfit', 'farm', 'equipment'].map(category => (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredItems.map((item) => (
                    <Card 
                      key={item.id} 
                      className={`transition-all hover:shadow-lg ${
                        item.isEquipped ? 'ring-2 ring-purple-400 bg-purple-50' : ''
                      } ${getRarityColor(item.rarity)}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{item.icon}</div>
                            <div>
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {item.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className={getRarityColor(item.rarity)}>
                              {item.rarity}
                            </Badge>
                            {item.unlockLevel > 1 && (
                              <Badge variant="outline" className="text-xs">
                                Level {item.unlockLevel}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{item.cost} coins</span>
                            {item.category === 'equipment' && (
                              <Badge className="bg-green-100 text-green-700">
                                {ct('ecoReward', language)}
                              </Badge>
                            )}
                          </div>
                          
                          {item.isEquipped ? (
                            <Badge className="bg-purple-500 text-white">
                              {ct('equipped', language)}
                            </Badge>
                          ) : item.isUnlocked ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleEquip(item)}
                              className="bg-purple-500 hover:bg-purple-600"
                            >
                              {ct('equip', language)}
                            </Button>
                          ) : item.unlockLevel > playerLevel ? (
                            <Button size="sm" disabled className="flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              {ct('locked', language)}
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handlePurchase(item)}
                              disabled={coins < item.cost}
                              className="flex items-center gap-1"
                            >
                              <Unlock className="h-3 w-3" />
                              {ct('unlock', language)}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}