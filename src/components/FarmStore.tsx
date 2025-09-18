import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { 
  ShoppingCart, 
  Coins, 
  Star, 
  Zap, 
  Shield, 
  TrendingUp,
  Package,
  Wrench,
  Sprout,
  Droplets
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "tools" | "seeds" | "upgrades" | "decorations";
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  effect?: string;
  owned: boolean;
}

interface FarmStoreProps {
  coins: number;
  onPurchase: (itemId: string, cost: number) => void;
}

export function FarmStore({ coins, onPurchase }: FarmStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("tools");
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

  const storeItems: StoreItem[] = [
    // Tools
    {
      id: "golden-hoe",
      name: "Golden Hoe",
      description: "A premium farming tool that prepares soil 50% faster",
      price: 250,
      category: "tools",
      icon: "⚡",
      rarity: "epic",
      effect: "+50% soil preparation speed",
      owned: false
    },
    {
      id: "water-sprinkler",
      name: "Auto Sprinkler System",
      description: "Automatically waters crops in a 3x3 area",
      price: 400,
      category: "tools",
      icon: "💧",
      rarity: "legendary",
      effect: "Auto-water 3x3 area",
      owned: false
    },
    {
      id: "steel-plow",
      name: "Steel Plow",
      description: "Durable plow that works with your oxen to till multiple plots",
      price: 180,
      category: "tools",
      icon: "🚜",
      rarity: "rare",
      effect: "Till 3 plots at once",
      owned: false
    },
    {
      id: "harvest-basket",
      name: "Woven Harvest Basket",
      description: "Traditional basket that increases crop yield by 25%",
      price: 150,
      category: "tools",
      icon: "🧺",
      rarity: "rare",
      effect: "+25% harvest yield",
      owned: false
    },

    // Seeds
    {
      id: "heritage-corn",
      name: "Heritage Corn Seeds",
      description: "Ancient variety that grows 30% faster and yields more",
      price: 80,
      category: "seeds",
      icon: "🌽",
      rarity: "rare",
      effect: "+30% growth speed, +20% yield",
      owned: false
    },
    {
      id: "golden-wheat",
      name: "Golden Wheat Seeds",
      description: "Premium wheat variety worth 3x normal wheat",
      price: 120,
      category: "seeds",
      icon: "🌾",
      rarity: "epic",
      effect: "3x coin value when sold",
      owned: false
    },
    {
      id: "rainbow-beans",
      name: "Rainbow Bean Seeds",
      description: "Magical beans that provide nitrogen to all surrounding crops",
      price: 200,
      category: "seeds",
      icon: "🌈",
      rarity: "legendary",
      effect: "Boosts all adjacent crops",
      owned: false
    },
    {
      id: "spice-chili",
      name: "Ancient Spice Chili",
      description: "Traditional variety that repels pests naturally",
      price: 100,
      category: "seeds",
      icon: "🌶️",
      rarity: "rare",
      effect: "Natural pest protection",
      owned: false
    },

    // Upgrades
    {
      id: "ox-power",
      name: "Stronger Oxen",
      description: "Upgrade your oxen to plow faster and more efficiently",
      price: 300,
      category: "upgrades",
      icon: "🐂",
      rarity: "epic",
      effect: "+100% plowing speed",
      owned: false
    },
    {
      id: "weather-blessing",
      name: "Weather Blessing",
      description: "Ancient ritual that provides favorable weather for 10 harvests",
      price: 500,
      category: "upgrades",
      icon: "⛅",
      rarity: "legendary",
      effect: "Perfect weather for 10 cycles",
      owned: false
    },
    {
      id: "soil-enhancer",
      name: "Soil Enhancement Ritual",
      description: "Traditional ceremony that permanently improves soil quality",
      price: 350,
      category: "upgrades",
      icon: "🌱",
      rarity: "epic",
      effect: "Permanent +25% growth speed",
      owned: false
    },
    {
      id: "farmer-energy",
      name: "Farmer's Vitality",
      description: "Herbal remedy that reduces farmer fatigue by half",
      price: 200,
      category: "upgrades",
      icon: "💪",
      rarity: "rare",
      effect: "50% less action cooldown",
      owned: false
    },

    // Decorations
    {
      id: "prayer-flags",
      name: "Tibetan Prayer Flags",
      description: "Colorful flags that bring good fortune to your farm",
      price: 50,
      category: "decorations",
      icon: "🎏",
      rarity: "common",
      effect: "+5% luck on all actions",
      owned: false
    },
    {
      id: "wind-chimes",
      name: "Bamboo Wind Chimes",
      description: "Soothing chimes that calm your livestock and crops",
      price: 75,
      category: "decorations",
      icon: "🎐",
      rarity: "common",
      effect: "+10% animal happiness",
      owned: false
    },
    {
      id: "stone-scarecrow",
      name: "Ancient Stone Scarecrow",
      description: "Mystical guardian that protects crops from all pests",
      price: 400,
      category: "decorations",
      icon: "🗿",
      rarity: "legendary",
      effect: "100% pest protection",
      owned: false
    },
    {
      id: "lotus-pond",
      name: "Sacred Lotus Pond",
      description: "Beautiful pond that provides unlimited water for irrigation",
      price: 600,
      category: "decorations",
      icon: "🪷",
      rarity: "legendary",
      effect: "Unlimited water supply",
      owned: false
    }
  ];

  const categories = {
    tools: { name: "Farming Tools", icon: <Wrench className="h-4 w-4" />, color: "bg-amber-100 text-amber-800" },
    seeds: { name: "Premium Seeds", icon: <Sprout className="h-4 w-4" />, color: "bg-green-100 text-green-800" },
    upgrades: { name: "Farm Upgrades", icon: <TrendingUp className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" },
    decorations: { name: "Decorations", icon: <Package className="h-4 w-4" />, color: "bg-purple-100 text-purple-800" }
  };

  const rarityColors = {
    common: "border-gray-300 bg-gray-50",
    rare: "border-blue-300 bg-blue-50",
    epic: "border-purple-300 bg-purple-50",
    legendary: "border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50"
  };

  const rarityTextColors = {
    common: "text-gray-600",
    rare: "text-blue-600",
    epic: "text-purple-600",
    legendary: "text-yellow-600"
  };

  const filteredItems = storeItems.filter(item => item.category === selectedCategory);

  const handlePurchase = (item: StoreItem) => {
    if (coins >= item.price && !ownedItems.includes(item.id)) {
      onPurchase(item.id, item.price);
      setOwnedItems(prev => [...prev, item.id]);
      toast.success(`🛒 Purchased ${item.name}! It's now available in your farm.`);
    } else if (ownedItems.includes(item.id)) {
      toast.info("You already own this item!");
    } else {
      toast.error("Not enough coins for this purchase!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
            Elytra Marketplace
          </h2>
          <p className="text-muted-foreground mt-2">
            Exchange your hard-earned coins for premium farming equipment and upgrades
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-lg border">
          <Coins className="h-6 w-6 text-yellow-500" />
          <span className="text-2xl font-semibold text-gray-800">{coins}</span>
          <span className="text-sm text-gray-500">coins</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
        <Tabs defaultValue="tools" className="w-full" onValueChange={setSelectedCategory}>
          <div className="border-b bg-gray-50/50">
            <TabsList className="grid w-full grid-cols-4 bg-transparent p-2">
              {Object.entries(categories).map(([key, category]) => (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl"
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.keys(categories).map(category => (
            <TabsContent key={category} value={category} className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => {
                  const isOwned = ownedItems.includes(item.id);
                  const canAfford = coins >= item.price;

                  return (
                    <Card 
                      key={item.id} 
                      className={`${rarityColors[item.rarity]} border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                        isOwned ? 'opacity-75' : ''
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{item.icon}</div>
                            <div>
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <Badge 
                                className={`${categories[item.category].color} mt-1 capitalize`}
                              >
                                {item.rarity}
                              </Badge>
                            </div>
                          </div>
                          {isOwned && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Owned
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-sm">
                          {item.description}
                        </CardDescription>
                        
                        {item.effect && (
                          <div className="bg-white/60 rounded-lg p-3 border">
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">Effect:</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.effect}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-yellow-500" />
                            <span className="text-xl font-semibold text-gray-800">{item.price}</span>
                          </div>
                          
                          <Button
                            onClick={() => handlePurchase(item)}
                            disabled={!canAfford || isOwned}
                            className={`${
                              canAfford && !isOwned 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                                : ''
                            } transition-all duration-300`}
                          >
                            {isOwned ? (
                              "Owned"
                            ) : canAfford ? (
                              <>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Buy Now
                              </>
                            ) : (
                              "Not Enough Coins"
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(categories).map(([key, category]) => {
          const categoryItems = storeItems.filter(item => item.category === key);
          const ownedCount = categoryItems.filter(item => ownedItems.includes(item.id)).length;
          
          return (
            <Card key={key} className="bg-white border shadow-md">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {category.icon}
                </div>
                <p className="text-sm text-gray-600 mb-1">{category.name}</p>
                <p className="text-lg font-semibold">
                  {ownedCount} / {categoryItems.length}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(ownedCount / categoryItems.length) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}