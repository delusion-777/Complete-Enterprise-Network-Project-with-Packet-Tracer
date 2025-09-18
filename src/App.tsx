import { useState, useCallback, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { FarmDashboard } from "./components/FarmDashboard";
import { FarmingChallenges } from "./components/FarmingChallenges";
import { TraditionalTechniques } from "./components/TraditionalTechniques";
import { KisanGoFarm2D } from "./components/KisanGoFarm2D";
import { MethodsShowcase } from "./components/MethodsShowcase";
import { EnhancedFarmStore } from "./components/EnhancedFarmStore";
import { KnowledgeHub } from "./components/KnowledgeHub";
import { AvatarCustomization } from "./components/AvatarCustomization";
import { Home, Target, BookOpen, Trophy, Gamepad2, Play, Store, Globe, Users, User } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PlayerStats {
  level: number;
  experience: number;
  coins: number;
  completedChallenges: number;
  achievements: string[];
  purchasedItems: string[];
}

// Multi-language translations
const translations = {
  en: {
    appName: "Kisan-Go Pro",
    appSubtitle: "Smart Sustainable Agriculture Platform",
    dashboard: "Dashboard",
    farmGame: "2D Farm",
    store: "Store", 
    methods: "Methods",
    challenges: "Challenges",
    library: "Library",
    awards: "Awards",
    knowledgeHub: "Knowledge Hub",
    customize: "Customize",
    level: "Level",
    yourAchievements: "Your Achievements",
    milestonesUnlocked: "Milestones you've unlocked on your sustainable farming journey",
    noAchievementsYet: "No achievements yet",
    startJourney: "Start your farming journey by completing challenges and unlock your first achievement!",
    beginJourney: "Begin Your Journey",
    achievementUnlocked: "Achievement unlocked!"
  },
  hi: {
    appName: "किसान-गो प्रो",
    appSubtitle: "स्मार्ट सस्टेनेबल एग्रीकल्चर प्लेटफॉर्म",
    dashboard: "डैशबोर्ड",
    farmGame: "2डी खेत",
    store: "दुकान",
    methods: "तरीके",
    challenges: "चुनौतियां",
    library: "पुस्तकालय",
    awards: "पुरस्कार",
    knowledgeHub: "ज्ञान केंद्र",
    customize: "अनुकूलित करें",
    level: "स्तर",
    yourAchievements: "आपकी उपलब्धियां",
    milestonesUnlocked: "आपकी टिकाऊ कृषि यात्रा में अनलॉक किए गए मील के पत्थर",
    noAchievementsYet: "अभी तक कोई उपलब्धि नहीं",
    startJourney: "चुनौतियों को पूरा करके अपनी कृषि यात्रा शुरू करें और अपनी पहली उपलब्धि अनलॉक करें!",
    beginJourney: "अपनी यात्रा शुरू करें",
    achievementUnlocked: "उपलब्धि अनलॉक हुई!"
  },
  ta: {
    appName: "கிசான்-கோ ப்ரோ",
    appSubtitle: "ஸ்மார்ட் சுஸ்டைனபிள் அக்ரிகல்சர் ப்ளாட்ஃபார்ம்",
    dashboard: "டாஷ்போர்டு",
    farmGame: "2டி பண்ணை",
    store: "கடை",
    methods: "முறைகள்",
    challenges: "சவால்கள்",
    library: "நூலகம்",
    awards: "விருதுகள்",
    knowledgeHub: "அறிவு மையம்",
    customize: "தனிப்பயனாக்கு",
    level: "நிலை",
    yourAchievements: "உங்கள் சாதனைகள்",
    milestonesUnlocked: "உங்கள் நிலையான விவசாய பயணத்தில் திறக்கப்பட்ட மைல்கற்கள்",
    noAchievementsYet: "இன்னும் சாதனைகள் இல்லை",
    startJourney: "சவால்களை முடித்து உங்கள் விவசாய பயணத்தை தொடங்கி உங்கள் முதல் சாதனையை திறக்கவும்!",
    beginJourney: "உங்கள் பயணத்தை தொடங்கவும்",
    achievementUnlocked: "சாதனை திறக்கப்பட்டது!"
  },
  te: {
    appName: "కిసాన్-గో ప్రో",
    appSubtitle: "స్మార్ట్ సస్టైనబుల్ అగ్రికల్చర్ ప్లాట్‌ఫార్మ్",
    dashboard: "డాష్‌బోర్డ్",
    farmGame: "2డి వ్యవసాయం",
    store: "దుకాణం",
    methods: "పద్ధతులు",
    challenges: "సవాళ్లు",
    library: "గ్రంథాలయం",
    awards: "అవార్డులు",
    knowledgeHub: "జ్ఞాన కేంద్రం",
    customize: "అనుకూలీకరించు",
    level: "స్థాయి",
    yourAchievements: "మీ విజయాలు",
    milestonesUnlocked: "మీ స్థిరమైన వ్యవసాయ ప్రయాణంలో అన్‌లాక్ చేసిన మైలురాళ్లు",
    noAchievementsYet: "ఇంకా విజయాలు లేవు",
    startJourney: "సవాళ్లను పూర్తి చేయడం ద్వారా మీ వ్యవసాయ ప్రయాణాన్ని ప్రారంభించి మీ మొదటి విజయాన్ని అన్‌లాక్ చేయండి!",
    beginJourney: "మీ ప్రయాణాన్ని ప్రారంభించండి",
    achievementUnlocked: "విజయం అన్‌లాక్ అయింది!"
  },
  kn: {
    appName: "ಕಿಸಾನ್-ಗೋ ಪ್ರೋ",
    appSubtitle: "ಸ್ಮಾರ್ಟ್ ಸಸ್ಟೈನಬಲ್ ಅಗ್ರಿಕಲ್ಚರ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    farmGame: "2ಡಿ ಕೃಷಿ",
    store: "ಅಂಗಡಿ",
    methods: "ವಿಧಾನಗಳು",
    challenges: "ಸವಾಲುಗಳು",
    library: "ಗ್ರಂಥಾಲಯ",
    awards: "ಪ್ರಶಸ್ತಿಗಳು",
    knowledgeHub: "ಜ್ಞಾನ ಕೇಂದ್ರ",
    customize: "ಕಸ್ಟಮೈಸ್ ಮಾಡಿ",
    level: "ಮಟ್ಟ",
    yourAchievements: "ನಿಮ್ಮ ಸಾಧನೆಗಳು",
    milestonesUnlocked: "ನಿಮ್ಮ ಸುಸ್ಥಿರ ಕೃಷಿ ಪ್ರಯಾಣದಲ್ಲಿ ಅನ್‌ಲಾಕ್ ಮಾಡಿದ ಮೈಲಿಗಲ್ಲುಗಳು",
    noAchievementsYet: "ಇನ್ನೂ ಯಾವುದೇ ಸಾಧನೆಗಳಿಲ್ಲ",
    startJourney: "ಸವಾಲುಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸುವ ಮೂಲಕ ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಮೊದಲ ಸಾಧನೆಯನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಿ!",
    beginJourney: "ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ",
    achievementUnlocked: "ಸಾಧನೆ ಅನ್‌ಲಾಕ್ ಆಗಿದೆ!"
  },
  ml: {
    appName: "കിസാൻ-ഗോ പ്രോ",
    appSubtitle: "സ്മാർട്ട് സസ്റ്റൈനബിൾ അഗ്രികൾച്ചർ പ്ലാറ്റ്‌ഫോം",
    dashboard: "ഡാഷ്‌ബോർഡ്",
    farmGame: "2ഡി കൃഷി",
    store: "കട",
    methods: "രീതികൾ",
    challenges: "വെല്ലുവിളികൾ",
    library: "ലൈബ്രറി",
    awards: "അവാർഡുകൾ",
    knowledgeHub: "അറിവ് കേന്ദ്രം",
    customize: "കസ്റ്റമൈസ് ചെയ്യുക",
    level: "ലെവൽ",
    yourAchievements: "നിങ്ങളുടെ നേട്ടങ്ങൾ",
    milestonesUnlocked: "നിങ്ങളുടെ സുസ്ഥിര കാർഷിക യാത്രയിൽ അൺലോക്ക് ചെയ്ത നാഴികക്കല്ലുകൾ",
    noAchievementsYet: "ഇതുവരെ നേട്ടങ്ങളൊന്നുമില്ല",
    startJourney: "വെല്ലുവിളികൾ പൂർത്തിയാക്കി നിങ്ങളുടെ കാർഷിക യാത്ര ആരംഭിക്കുകയും നിങ്ങളുടെ ആദ്യ നേട്ടം അൺലോക്ക് ചെയ്യുകയും ചെയ്യുക!",
    beginJourney: "നിങ്ങളുടെ യാത്ര ആരംഭിക്കുക",
    achievementUnlocked: "നേട്ടം അൺലോക്ക് ചെയ്തു!"
  }
};

function t(key: string, lang: string = 'en'): string {
  return (translations as any)[lang]?.[key] || (translations as any)['en'][key] || key;
}

export default function App() {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    experience: 0,
    coins: 100,
    completedChallenges: 0,
    achievements: [],
    purchasedItems: []
  });

  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading completion
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCompleteChallenge = useCallback((challengeId: string, xp: number, coins: number) => {
    setPlayerStats(prev => {
      const newExperience = prev.experience + xp;
      const newLevel = Math.floor(newExperience / 1000) + 1;
      const newAchievements = [...prev.achievements];
      
      // Add level-up achievement
      if (newLevel > prev.level) {
        newAchievements.push(`Level ${newLevel} Farmer`);
        toast.success(`🎉 Level Up! You reached Level ${newLevel}!`);
      }

      // Add challenge-specific achievements
      if (challengeId === "crop-rotation") {
        newAchievements.push("Rotation Master");
      } else if (challengeId === "companion-planting") {
        newAchievements.push("Three Sisters Guardian");
      } else if (challengeId === "natural-composting") {
        newAchievements.push("Soil Builder");
      } else if (challengeId === "seed-saving") {
        newAchievements.push("Heritage Keeper");
      }

      toast.success(`🌱 Challenge completed! +${xp} XP, +${coins} coins`);

      return {
        ...prev,
        level: newLevel,
        experience: newExperience,
        coins: prev.coins + coins,
        completedChallenges: prev.completedChallenges + 1,
        achievements: newAchievements,
        purchasedItems: prev.purchasedItems
      };
    });
  }, []);

  const handleStorePurchase = useCallback((itemId: string, cost: number) => {
    setPlayerStats(prev => ({
      ...prev,
      coins: prev.coins - cost,
      purchasedItems: [...prev.purchasedItems, itemId]
    }));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-pale to-orange-light flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-orange-medium to-orange-dark rounded-xl flex items-center justify-center shadow-lg mb-4 mx-auto">
            <svg className="w-10 h-10 text-white animate-spin" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              <circle cx="7" cy="17" r="2" fill="currentColor" opacity="0.7"/>
              <circle cx="17" cy="17" r="2" fill="currentColor" opacity="0.7"/>
              <path d="M9 19C9 19.5 9.5 20 10 20H14C14.5 20 15 19.5 15 19V18H9V19Z" opacity="0.5"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-orange-dark">Loading Kisan-Go Pro...</h2>
          <p className="text-muted-foreground mt-1">Preparing your sustainable farming experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-pale to-orange-light">
      <header className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-orange-medium to-orange-dark rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                  <circle cx="7" cy="17" r="2" fill="currentColor" opacity="0.7"/>
                  <circle cx="17" cy="17" r="2" fill="currentColor" opacity="0.7"/>
                  <path d="M9 19C9 19.5 9.5 20 10 20H14C14.5 20 15 19.5 15 19V18H9V19Z" opacity="0.5"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-semibold bg-gradient-to-r from-orange-dark to-green-600 bg-clip-text text-transparent">
                  {t('appName', language)}
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">{t('appSubtitle', language)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 h-8 bg-card border-border">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                  <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                  <SelectItem value="ml">മലയാളം</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-md border border-border">
                <Trophy className="h-5 w-5 text-orange-medium" />
                <span className="font-semibold text-foreground">{t('level', language)} {playerStats.level}</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-medium to-orange-dark rounded-full px-4 py-2 shadow-md">
                <span className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-orange-medium text-xs font-bold">₹</span>
                </span>
                <span className="font-semibold text-white">{playerStats.coins}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-8 bg-card rounded-2xl shadow-lg border border-border p-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-medium data-[state=active]:to-orange-dark data-[state=active]:text-white">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard', language)}</span>
            </TabsTrigger>
            <TabsTrigger value="farm-game" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('farmGame', language)}</span>
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-medium data-[state=active]:to-orange-dark data-[state=active]:text-white">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">{t('store', language)}</span>
            </TabsTrigger>
            <TabsTrigger value="showcase" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">{t('methods', language)}</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">{t('challenges', language)}</span>
            </TabsTrigger>
            <TabsTrigger value="techniques" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{t('library', language)}</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">{t('awards', language)}</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge-hub" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t('knowledgeHub', language)}</span>
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t('customize', language)}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <FarmDashboard playerStats={playerStats} language={language} />
          </TabsContent>

          <TabsContent value="farm-game">
            <KisanGoFarm2D 
              onEarnRewards={(xp, coins) => {
                setPlayerStats(prev => {
                  const newExperience = prev.experience + xp;
                  const newLevel = Math.floor(newExperience / 1000) + 1;
                  const newAchievements = [...prev.achievements];
                  
                  if (newLevel > prev.level) {
                    newAchievements.push(`Level ${newLevel} Farmer`);
                    toast.success(`🎉 Level Up! You reached Level ${newLevel}!`);
                  }

                  return {
                    ...prev,
                    level: newLevel,
                    experience: newExperience,
                    coins: prev.coins + coins,
                    achievements: newAchievements,
                    purchasedItems: prev.purchasedItems
                  };
                });
              }}
              purchasedItems={playerStats.purchasedItems}
              language={language}
            />
          </TabsContent>

          <TabsContent value="store">
            <EnhancedFarmStore 
              coins={playerStats.coins}
              onPurchase={handleStorePurchase}
              language={language}
            />
          </TabsContent>

          <TabsContent value="showcase">
            <MethodsShowcase />
          </TabsContent>

          <TabsContent value="challenges">
            <FarmingChallenges onCompleteChallenge={handleCompleteChallenge} />
          </TabsContent>

          <TabsContent value="techniques">
            <TraditionalTechniques />
          </TabsContent>

          <TabsContent value="achievements">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-semibold bg-gradient-to-r from-orange-dark to-orange-medium bg-clip-text text-transparent">
                  {t('yourAchievements', language)}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {t('milestonesUnlocked', language)}
                </p>
              </div>
              
              {playerStats.achievements.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {playerStats.achievements.map((achievement, index) => (
                    <div key={index} className="p-6 border rounded-2xl bg-gradient-to-br from-card to-orange-pale shadow-lg border-border flex items-center gap-4">
                      <div className="bg-gradient-to-br from-orange-medium to-orange-dark rounded-full p-3 shadow-md">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{achievement}</h3>
                        <p className="text-sm text-orange-dark font-medium">{t('achievementUnlocked', language)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-orange-light to-orange-pale rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Trophy className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">{t('noAchievementsYet', language)}</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t('startJourney', language)}
                  </p>
                  <Button 
                    onClick={() => {
                      const tabsElement = document.querySelector('[value="challenges"]') as HTMLElement;
                      tabsElement?.click();
                    }}
                    className="bg-gradient-to-r from-orange-medium to-orange-dark hover:from-orange-dark hover:to-orange-medium text-white px-8 py-3 rounded-full shadow-lg"
                  >
                    {t('beginJourney', language)}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="knowledge-hub">
            <KnowledgeHub language={language} />
          </TabsContent>

          <TabsContent value="customize">
            <AvatarCustomization 
              playerLevel={playerStats.level}
              coins={playerStats.coins}
              onPurchase={handleStorePurchase}
              language={language}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}