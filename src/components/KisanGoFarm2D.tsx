import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RotateCcw, Play, Pause, Droplets, Sun, CloudRain } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Plot {
  x: number;
  y: number;
  state: "empty" | "planted" | "watered" | "growing" | "mature" | "ready";
  crop: string | null;
  stage: number;
  lastWatered: number;
  plantedTime: number;
  waterLevel: number;
}

interface KisanGoFarm2DProps {
  onEarnRewards: (xp: number, coins: number) => void;
  purchasedItems: string[];
  language: string;
}

// Multi-language translations for the farm game
const farmTranslations = {
  en: {
    farmSimulator: "Kisan-Go 2D Farm",
    farmDesc: "Horizontal farming with traditional South Indian crops",
    plantTool: "Plant",
    waterTool: "Water", 
    harvestTool: "Harvest",
    cropSelection: "Choose Crop:",
    waterLevel: "Water Level:",
    season: "Season:",
    resetFarm: "Reset Farm",
    farmGuide: "Farm Guide",
    plantSeeds: "Plant seeds in empty plots",
    waterCrops: "Water crops for faster growth",
    harvestReady: "Harvest when crops are ready",
    spring: "Spring",
    summer: "Summer",
    monsoon: "Monsoon",
    winter: "Winter"
  },
  hi: {
    farmSimulator: "किसान-गो 2डी खेत",
    farmDesc: "पारंपरिक दक्षिण भारतीय फसलों के साथ क्षैतिज खेती",
    plantTool: "बोना",
    waterTool: "पानी",
    harvestTool: "कटाई",
    cropSelection: "फसल चुनें:",
    waterLevel: "पानी का स्तर:",
    season: "मौसम:",
    resetFarm: "खेत रीसेट करें",
    farmGuide: "खेती गाइड",
    plantSeeds: "खाली प्लॉट में बीज बोएं",
    waterCrops: "तेज़ बढ़ने के लिए फसल को पानी दें",
    harvestReady: "जब फसल तैयार हो तो कटाई करें",
    spring: "वसंत",
    summer: "गर्मी",
    monsoon: "मानसून",
    winter: "सर्दी"
  },
  ta: {
    farmSimulator: "கிசான்-கோ 2டி பண்ணை",
    farmDesc: "பாரம்பரிய தென்னிந்திய பயிர்களுடன் கிடைமட்ட விவசாயம்",
    plantTool: "நடவு",
    waterTool: "நீர்",
    harvestTool: "அறுவடை",
    cropSelection: "பயிரைத் தேர்ந்தெடுங்கள்:",
    waterLevel: "நீர் மட்டம்:",
    season: "பருவம்:",
    resetFarm: "பண்ணையை மீட்டமைக்கவும்",
    farmGuide: "விவசாய வழிகாட்டி",
    plantSeeds: "வெற்று நிலங்களில் விதைகளை நடவு செய்யுங்கள்",
    waterCrops: "வேகமான வளர்ச்சிக்கு பயிர்களுக்கு நீர் ஊற்றுங்கள்",
    harvestReady: "பயிர்கள் தயாராகும்போது அறுவடை செய்யுங்கள்",
    spring: "இளவேனில்",
    summer: "கோடை",
    monsoon: "பருவமழை",
    winter: "குளிர்காலம்"
  },
  te: {
    farmSimulator: "కిసాన్-గో 2డి వ్యవసాయం",
    farmDesc: "సాంప్రదాయ దక్షిణ భారత పంటలతో క్షితిజ సమాంతర వ్యవసాయం",
    plantTool: "నాటడం",
    waterTool: "నీరు",
    harvestTool: "కోత",
    cropSelection: "పంటను ఎంచుకోండి:",
    waterLevel: "నీటి స్థాయి:",
    season: "సీజన్:",
    resetFarm: "వ్యవసాయాన్ని రీసెట్ చేయండి",
    farmGuide: "వ్యవసాయ గైడ్",
    plantSeeds: "ఖాళీ ప్లాట్లలో విత్తనాలు నాటండి",
    waterCrops: "వేగవంతమైన పెరుగుదల కోసం పంటలకు నీరు పోయండి",
    harvestReady: "పంటలు సిద్ధమైనప్పుడు కోత చేయండి",
    spring: "వసంతం",
    summer: "వేసవి",
    monsoon: "వర్షాకాలం",
    winter: "శీతాకాలం"
  },
  kn: {
    farmSimulator: "ಕಿಸಾನ್-ಗೋ 2ಡಿ ಕೃಷಿ",
    farmDesc: "ಸಾಂಪ್ರದಾಯಿಕ ದಕ್ಷಿಣ ಭಾರತೀಯ ಬೆಳೆಗಳೊಂದಿಗೆ ಸಮತಲ ಕೃಷಿ",
    plantTool: "ನಾಟಿ",
    waterTool: "ನೀರು",
    harvestTool: "ಕೊಯ್ಲು",
    cropSelection: "ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
    waterLevel: "ನೀರಿನ ಮಟ್ಟ:",
    season: "ಋತು:",
    resetFarm: "ಕೃಷಿಯನ್ನು ಮರುಹೊಂದಿಸಿ",
    farmGuide: "ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ",
    plantSeeds: "ಖಾಲಿ ಪ್ಲಾಟ್‌ಗಳಲ್ಲಿ ಬೀಜಗಳನ್ನು ನಾಟಿ",
    waterCrops: "ವೇಗವಾದ ಬೆಳವಣಿಗೆಗಾಗಿ ಬೆಳೆಗಳಿಗೆ ನೀರು ಹಾಕಿ",
    harvestReady: "ಬೆಳೆಗಳು ಸಿದ್ಧವಾದಾಗ ಕೊಯ್ಲು ಮಾಡಿ",
    spring: "ವಸಂತ",
    summer: "ಬೇಸಿಗೆ",
    monsoon: "ಮಾನ್‌ಸೂನ್",
    winter: "ಚಳಿಗಾಲ"
  },
  ml: {
    farmSimulator: "കിസാൻ-ഗോ 2ഡി കൃഷി",
    farmDesc: "പരമ്പരാഗത ദക്ഷിണേന്ത്യൻ വിളകളോടൊപ്പം തിരശ്ചീന കൃഷി",
    plantTool: "നടൽ",
    waterTool: "വെള്ളം",
    harvestTool: "വിളവെടുപ്പ്",
    cropSelection: "വിള തിരഞ്ഞെടുക്കുക:",
    waterLevel: "ജലനിരപ്പ്:",
    season: "സീസൺ:",
    resetFarm: "കൃഷി പുനഃസജ്ജമാക്കുക",
    farmGuide: "കൃഷി ഗൈഡ്",
    plantSeeds: "ഒഴിഞ്ഞ പ്ലോട്ടുകളിൽ വിത്തുകൾ നടുക",
    waterCrops: "വേഗത്തിലുള്ള വളർച്ചയ്ക്കായി വിളകൾക്ക് വെള്ളം നൽകുക",
    harvestReady: "വിളകൾ തയ്യാറാകുമ്പോൾ വിളവെടുക്കുക",
    spring: "വസന്തം",
    summer: "വേനൽ",
    monsoon: "മൺസൂൺ",
    winter: "ശീതകാലം"
  }
};

function ft(key: string, language: string): string {
  return (farmTranslations as any)[language]?.[key] || (farmTranslations as any)['en'][key] || key;
}

export function KisanGoFarm2D({ onEarnRewards, purchasedItems, language }: KisanGoFarm2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [selectedTool, setSelectedTool] = useState<string>("plant");
  const [selectedCrop, setSelectedCrop] = useState<string>("rice");
  const [plots, setPlots] = useState<Plot[]>([]);
  const [gameTime, setGameTime] = useState<number>(0);
  const [water, setWater] = useState<number>(100);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [season, setSeason] = useState<string>("spring");
  const [weather, setWeather] = useState<string>("sunny");

  // South Indian crops with regional preferences
  const crops = {
    rice: { 
      symbol: "🌾", 
      growTime: 8000,
      xp: 25, 
      stages: ["🌱", "🌿", "🌾", "🌾"],
      color: "#F5DEB3",
      regions: ["ta", "te", "kn", "ml"]
    },
    coconut: {
      symbol: "🥥",
      growTime: 15000,
      xp: 40,
      stages: ["🌱", "🌿", "🌴", "🥥"],
      color: "#8B4513",
      regions: ["kn", "ml", "ta"]
    },
    banana: {
      symbol: "🍌",
      growTime: 10000,
      xp: 30,
      stages: ["🌱", "🌿", "🍃", "🍌"],
      color: "#FFD700",
      regions: ["ta", "kn", "ml"]
    },
    coffee: { 
      symbol: "☕", 
      growTime: 18000, 
      xp: 50, 
      stages: ["🌱", "🌿", "🌸", "☕"],
      color: "#8B4513",
      regions: ["kn", "ml"]
    },
    cardamom: {
      symbol: "🫚",
      growTime: 12000,
      xp: 35,
      stages: ["🌱", "🌿", "🌿", "🫚"],
      color: "#90EE90",
      regions: ["kn", "ml"]
    },
    pepper: {
      symbol: "🫛",
      growTime: 14000,
      xp: 45,
      stages: ["🌱", "🌿", "🍃", "🫛"],
      color: "#228B22",
      regions: ["kn", "ml"]
    },
    turmeric: {
      symbol: "🟡",
      growTime: 11000,
      xp: 32,
      stages: ["🌱", "🌿", "🍃", "🟡"],
      color: "#FFD700",
      regions: ["ta", "te", "kn"]
    },
    millet: {
      symbol: "🌾",
      growTime: 9000,
      xp: 28,
      stages: ["🌱", "🌿", "🌾", "🌾"],
      color: "#DEB887",
      regions: ["ta", "te", "kn"]
    }
  };

  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 300;
  const PLOT_SIZE = 80;
  const PLOT_COUNT = 10;

  // Initialize plots in horizontal layout
  useEffect(() => {
    const initialPlots: Plot[] = [];
    for (let i = 0; i < PLOT_COUNT; i++) {
      initialPlots.push({
        x: i * (PLOT_SIZE + 10) + 50,
        y: CANVAS_HEIGHT / 2 - PLOT_SIZE / 2,
        state: "empty",
        crop: null,
        stage: 0,
        lastWatered: 0,
        plantedTime: 0,
        waterLevel: 0
      });
    }
    setPlots(initialPlots);
  }, []);

  // Game loop
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setGameTime(prev => prev + 100);
      setWater(prev => Math.min(100, prev + 0.5));
      
      setPlots(prevPlots => 
        prevPlots.map(plot => {
          if (plot.crop && plot.stage > 0 && plot.stage < 4) {
            const crop = crops[plot.crop as keyof typeof crops];
            const elapsed = gameTime - plot.plantedTime;
            const waterBonus = plot.state === "watered" ? 1.5 : 1.0;
            const weatherBonus = weather === "rainy" ? 1.3 : 1.0;
            
            const adjustedGrowTime = crop.growTime / (waterBonus * weatherBonus);
            
            if (elapsed > adjustedGrowTime / 4 * plot.stage) {
              const newStage = Math.min(4, plot.stage + 1);
              let newState = plot.state;
              
              if (newStage === 4) newState = "ready";
              else if (newStage > 1) newState = "growing";
              
              return { ...plot, stage: newStage, state: newState };
            }
            
            // Water evaporation
            if (plot.state === "watered" && gameTime - plot.lastWatered > 5000) {
              return { ...plot, state: "planted", waterLevel: Math.max(0, plot.waterLevel - 10) };
            }
          }
          return plot;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [gameTime, isAnimating, weather]);

  // Weather and season changes
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const weathers = ["sunny", "cloudy", "rainy"];
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
      setWeather(randomWeather);
    }, 15000);

    const seasonInterval = setInterval(() => {
      const seasons = ["spring", "summer", "monsoon", "winter"];
      const currentIndex = seasons.indexOf(season);
      const nextSeason = seasons[(currentIndex + 1) % seasons.length];
      setSeason(nextSeason);
      toast.success(`Season changed to ${ft(nextSeason, language)}!`);
    }, 30000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(seasonInterval);
    };
  }, [season, language]);

  // Drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(0.7, "#98FB98");
    gradient.addColorStop(1, "#8FBC8F");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw weather effects
    if (weather === "rainy") {
      ctx.strokeStyle = "rgba(100, 150, 255, 0.6)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * CANVAS_WIDTH;
        const y = (gameTime / 10 + Math.random() * 100) % CANVAS_HEIGHT;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y + 10);
        ctx.stroke();
      }
    } else if (weather === "sunny") {
      // Draw sun
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH - 60, 60, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Sun rays
      ctx.strokeStyle = "#FFED4E";
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(
          CANVAS_WIDTH - 60 + Math.cos(angle) * 40,
          60 + Math.sin(angle) * 40
        );
        ctx.lineTo(
          CANVAS_WIDTH - 60 + Math.cos(angle) * 55,
          60 + Math.sin(angle) * 55
        );
        ctx.stroke();
      }
    }

    // Draw horizontal soil line
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, CANVAS_HEIGHT - 40, CANVAS_WIDTH, 40);

    // Draw plots
    plots.forEach((plot, index) => {
      // Plot border
      ctx.strokeStyle = "#654321";
      ctx.lineWidth = 2;
      ctx.strokeRect(plot.x, plot.y, PLOT_SIZE, PLOT_SIZE);
      
      // Plot background based on state
      let bgColor = "#D2B48C"; // Dry soil
      switch (plot.state) {
        case "planted":
          bgColor = "#A0522D";
          break;
        case "watered":
          bgColor = "#654321";
          break;
        case "growing":
          bgColor = "#556B2F";
          break;
        case "ready":
          bgColor = "#6B8E23";
          break;
      }
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(plot.x + 2, plot.y + 2, PLOT_SIZE - 4, PLOT_SIZE - 4);
      
      // Draw crop if present
      if (plot.crop && plot.stage > 0) {
        const crop = crops[plot.crop as keyof typeof crops];
        const stageIndex = Math.min(plot.stage - 1, crop.stages.length - 1);
        const cropSymbol = crop.stages[stageIndex];
        
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText(cropSymbol, plot.x + PLOT_SIZE / 2, plot.y + PLOT_SIZE / 2 + 10);
        
        // Sparkle effect for ready crops
        if (plot.state === "ready") {
          const time = Date.now() / 1000;
          ctx.fillStyle = "#FFD700";
          ctx.font = "16px Arial";
          ctx.fillText("✨", plot.x + 15 + Math.sin(time * 2) * 5, plot.y + 20);
          ctx.fillText("✨", plot.x + PLOT_SIZE - 15 - Math.sin(time * 2) * 5, plot.y + PLOT_SIZE - 10);
        }
      }
      
      // Water indicator
      if (plot.state === "watered") {
        ctx.fillStyle = "#4169E1";
        ctx.font = "16px Arial";
        ctx.fillText("💧", plot.x + PLOT_SIZE - 20, plot.y + 20);
      }
      
      // Plot number
      ctx.fillStyle = "#333";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText((index + 1).toString(), plot.x + PLOT_SIZE / 2, plot.y - 5);
    });

    // Weather icon
    let weatherIcon = "☀️";
    if (weather === "rainy") weatherIcon = "🌧️";
    else if (weather === "cloudy") weatherIcon = "☁️";
    
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText(weatherIcon, 20, 40);

  }, [plots, gameTime, weather]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      draw();
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (isAnimating) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, isAnimating]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked plot
    const clickedPlotIndex = plots.findIndex(plot => 
      x >= plot.x && x <= plot.x + PLOT_SIZE && 
      y >= plot.y && y <= plot.y + PLOT_SIZE
    );

    if (clickedPlotIndex === -1) return;

    const clickedPlot = plots[clickedPlotIndex];

    if (selectedTool === "plant" && clickedPlot.state === "empty") {
      const newPlots = [...plots];
      newPlots[clickedPlotIndex] = {
        ...clickedPlot,
        state: "planted",
        crop: selectedCrop,
        stage: 1,
        plantedTime: gameTime,
        waterLevel: 20
      };
      setPlots(newPlots);
      toast.success(`${ft('plantSeeds', language)} - ${selectedCrop}!`);

    } else if (selectedTool === "water" && (clickedPlot.state === "planted" || clickedPlot.state === "growing") && water > 10) {
      const newPlots = [...plots];
      newPlots[clickedPlotIndex] = { 
        ...clickedPlot, 
        state: "watered", 
        lastWatered: gameTime,
        waterLevel: Math.min(100, clickedPlot.waterLevel + 30)
      };
      setPlots(newPlots);
      setWater(prev => prev - 10);
      toast.success(ft('waterCrops', language));

    } else if (selectedTool === "harvest" && clickedPlot.state === "ready") {
      const crop = crops[clickedPlot.crop as keyof typeof crops];
      const xpEarned = crop.xp;
      const coinsEarned = Math.round(crop.xp * 0.8);
      
      onEarnRewards(xpEarned, coinsEarned);
      
      const newPlots = [...plots];
      newPlots[clickedPlotIndex] = {
        ...clickedPlot,
        state: "empty",
        crop: null,
        stage: 0,
        plantedTime: 0,
        lastWatered: 0,
        waterLevel: 0
      };
      setPlots(newPlots);
      
      toast.success(`${ft('harvestReady', language)} ${clickedPlot.crop}! +${xpEarned} XP, +${coinsEarned} coins`);
    }
  };

  const resetFarm = () => {
    setPlots(plots.map(plot => ({
      ...plot,
      state: "empty",
      crop: null,
      stage: 0,
      plantedTime: 0,
      lastWatered: 0,
      waterLevel: 0
    })));
    setWater(100);
    toast.success("Farm reset!");
  };

  // Filter crops based on language/region
  const availableCrops = Object.entries(crops).filter(([_, crop]) => 
    crop.regions.includes(language) || language === 'en' || language === 'hi'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-orange-dark to-green-600 bg-clip-text text-transparent">
            {ft('farmSimulator', language)}
          </h2>
          <p className="text-muted-foreground mt-2">
            {ft('farmDesc', language)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAnimating(!isAnimating)}
            className="border-orange-medium hover:bg-orange-pale"
          >
            {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="flex items-center gap-2">
            {weather === "sunny" && <Sun className="h-4 w-4 text-orange-medium" />}
            {weather === "rainy" && <CloudRain className="h-4 w-4 text-blue-500" />}
            {weather === "cloudy" && <CloudRain className="h-4 w-4 text-gray-500" />}
            <span className="text-sm font-medium">{ft(season, language)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4">
          <Card className="bg-card shadow-xl border border-border overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-pale to-green-50 border-b border-border">
              <CardTitle className="text-xl text-foreground">{ft('farmSimulator', language)}</CardTitle>
              <CardDescription>
                {ft('farmDesc', language)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 bg-gradient-to-b from-orange-pale to-green-50">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={handleCanvasClick}
                className="cursor-pointer w-full"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-card shadow-lg border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                🛠️ {ft('farmGuide', language)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "plant", icon: "🌱", name: ft('plantTool', language) },
                { id: "water", icon: "💧", name: ft('waterTool', language) },
                { id: "harvest", icon: "🌾", name: ft('harvestTool', language) }
              ].map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "outline"}
                  onClick={() => setSelectedTool(tool.id)}
                  className="w-full justify-start p-3 h-auto bg-card hover:bg-orange-pale border-border"
                  disabled={tool.id === "water" && water < 10}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{tool.icon}</span>
                    <span className="font-medium">{tool.name}</span>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {selectedTool === "plant" && (
            <Card className="bg-card shadow-lg border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-foreground">{ft('cropSelection', language)}</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger className="w-full bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCrops.map(([cropName, crop]) => (
                      <SelectItem key={cropName} value={cropName}>
                        <div className="flex items-center gap-2">
                          <span>{crop.symbol}</span>
                          <span className="capitalize">{cropName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          <Card className="bg-card shadow-lg border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground">📊 Farm Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground">{ft('waterLevel', language)}</span>
                  <span className="text-foreground">{Math.round(water)}%</span>
                </div>
                <Progress value={water} className="w-full" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-foreground">{ft('season', language)}</span>
                <Badge variant="secondary" className="bg-orange-pale text-orange-dark border-orange-medium">
                  {ft(season, language)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border border-border">
            <CardContent className="p-4">
              <Button 
                variant="destructive" 
                onClick={resetFarm} 
                className="w-full bg-red-500 hover:bg-red-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {ft('resetFarm', language)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}