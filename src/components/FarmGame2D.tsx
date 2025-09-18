import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Sprout, Droplets, Bug, RotateCcw, Coins, Star } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Plot {
  x: number;
  y: number;
  width: number;
  height: number;
  crop: string | null;
  stage: number; // 0 = empty, 1 = planted, 2 = growing, 3 = mature, 4 = ready
  watered: boolean;
  lastWatered: number;
  plantedTime: number;
  method: string | null;
  companions: string[];
}

interface FarmGame2DProps {
  onEarnRewards: (xp: number, coins: number) => void;
}

export function FarmGame2D({ onEarnRewards }: FarmGame2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<string>("plant");
  const [selectedCrop, setSelectedCrop] = useState<string>("corn");
  const [selectedMethod, setSelectedMethod] = useState<string>("traditional");
  const [plots, setPlots] = useState<Plot[]>([]);
  const [gameTime, setGameTime] = useState<number>(0);
  const [water, setWater] = useState<number>(100);
  const [season, setSeason] = useState<string>("spring");

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PLOT_SIZE = 80;
  const PLOTS_PER_ROW = 8;
  const PLOTS_PER_COL = 6;

  // Crop types with growth times and companion benefits
  const crops = {
    corn: { color: "#FFD700", growTime: 8000, companions: ["beans", "squash"], xp: 20 },
    beans: { color: "#228B22", growTime: 6000, companions: ["corn", "squash"], xp: 15 },
    squash: { color: "#FF8C00", growTime: 10000, companions: ["corn", "beans"], xp: 25 },
    tomato: { color: "#FF6347", growTime: 7000, companions: ["basil"], xp: 18 },
    basil: { color: "#32CD32", growTime: 4000, companions: ["tomato"], xp: 12 },
    wheat: { color: "#DAA520", growTime: 12000, companions: [], xp: 30 },
    lettuce: { color: "#90EE90", growTime: 3000, companions: [], xp: 10 }
  };

  const methods = {
    traditional: { name: "Traditional", bonus: 1.0, description: "Standard planting method" },
    companion: { name: "Companion Planting", bonus: 1.5, description: "Plant compatible crops together" },
    rotation: { name: "Crop Rotation", bonus: 1.3, description: "Rotate crops to maintain soil health" },
    intercropping: { name: "Intercropping", bonus: 1.4, description: "Mix different crops in same area" }
  };

  // Initialize plots
  useEffect(() => {
    const initialPlots: Plot[] = [];
    for (let row = 0; row < PLOTS_PER_COL; row++) {
      for (let col = 0; col < PLOTS_PER_ROW; col++) {
        initialPlots.push({
          x: col * PLOT_SIZE + 50,
          y: row * PLOT_SIZE + 50,
          width: PLOT_SIZE - 5,
          height: PLOT_SIZE - 5,
          crop: null,
          stage: 0,
          watered: false,
          lastWatered: 0,
          plantedTime: 0,
          method: null,
          companions: []
        });
      }
    }
    setPlots(initialPlots);
  }, []);

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(prev => prev + 100);
      
      // Update season every 30 seconds
      const seasons = ["spring", "summer", "fall", "winter"];
      setSeason(seasons[Math.floor(Date.now() / 30000) % 4]);
      
      // Regenerate water slowly
      setWater(prev => Math.min(100, prev + 0.1));
      
      // Update plots
      setPlots(prevPlots => 
        prevPlots.map(plot => {
          if (plot.crop && plot.stage > 0 && plot.stage < 4) {
            const crop = crops[plot.crop as keyof typeof crops];
            const elapsed = gameTime - plot.plantedTime;
            const waterBonus = plot.watered ? 1.2 : 0.8;
            const companionBonus = plot.companions.length > 0 ? 1.3 : 1.0;
            const growthRate = waterBonus * companionBonus;
            const progressThreshold = crop.growTime / growthRate;
            
            if (elapsed > progressThreshold && plot.stage < 4) {
              return { ...plot, stage: Math.min(4, plot.stage + 1) };
            }
            
            // Water evaporates over time
            if (plot.watered && gameTime - plot.lastWatered > 5000) {
              return { ...plot, watered: false };
            }
          }
          return plot;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [gameTime]);

  // Canvas drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#8FBC8F";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw plots
    plots.forEach(plot => {
      // Plot background
      ctx.fillStyle = plot.watered ? "#8B4513" : "#D2B48C";
      ctx.fillRect(plot.x, plot.y, plot.width, plot.height);
      
      // Plot border
      ctx.strokeStyle = "#654321";
      ctx.lineWidth = 2;
      ctx.strokeRect(plot.x, plot.y, plot.width, plot.height);

      if (plot.crop) {
        const crop = crops[plot.crop as keyof typeof crops];
        ctx.fillStyle = crop.color;
        
        // Draw crop based on stage
        const centerX = plot.x + plot.width / 2;
        const centerY = plot.y + plot.height / 2;
        const size = Math.min(plot.width, plot.height) * 0.6;
        
        switch (plot.stage) {
          case 1: // Seed
            ctx.fillRect(centerX - 3, centerY - 3, 6, 6);
            break;
          case 2: // Sprout
            ctx.fillRect(centerX - 5, centerY - 5, 10, 10);
            ctx.fillStyle = "#228B22";
            ctx.fillRect(centerX - 2, centerY - 8, 4, 6);
            break;
          case 3: // Growing
            ctx.fillRect(centerX - size/4, centerY - size/4, size/2, size/2);
            ctx.fillStyle = "#228B22";
            ctx.fillRect(centerX - size/6, centerY - size/3, size/3, size/4);
            break;
          case 4: // Mature/Ready
            ctx.fillRect(centerX - size/3, centerY - size/3, size*0.66, size*0.66);
            ctx.fillStyle = "#228B22";
            ctx.fillRect(centerX - size/4, centerY - size/2, size/2, size/3);
            // Add sparkle effect for ready crops
            ctx.fillStyle = "#FFD700";
            ctx.beginPath();
            ctx.arc(centerX + size/4, centerY - size/4, 3, 0, Math.PI * 2);
            ctx.fill();
            break;
        }

        // Show companion indicators
        if (plot.companions.length > 0) {
          ctx.fillStyle = "#FF69B4";
          ctx.beginPath();
          ctx.arc(plot.x + plot.width - 8, plot.y + 8, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Water indicator
      if (plot.watered) {
        ctx.fillStyle = "#4169E1";
        ctx.beginPath();
        ctx.arc(plot.x + 8, plot.y + plot.height - 8, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw grid lines for better visibility
    ctx.strokeStyle = "#00000020";
    ctx.lineWidth = 1;
    for (let i = 0; i <= PLOTS_PER_ROW; i++) {
      const x = i * PLOT_SIZE + 50;
      ctx.beginPath();
      ctx.moveTo(x, 50);
      ctx.lineTo(x, 50 + PLOTS_PER_COL * PLOT_SIZE);
      ctx.stroke();
    }
    for (let i = 0; i <= PLOTS_PER_COL; i++) {
      const y = i * PLOT_SIZE + 50;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(50 + PLOTS_PER_ROW * PLOT_SIZE, y);
      ctx.stroke();
    }
  }, [plots]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked plot
    const clickedPlot = plots.find(plot => 
      x >= plot.x && x <= plot.x + plot.width &&
      y >= plot.y && y <= plot.y + plot.height
    );

    if (!clickedPlot) return;

    const plotIndex = plots.indexOf(clickedPlot);

    if (selectedTool === "plant" && !clickedPlot.crop) {
      // Plant crop
      const newPlots = [...plots];
      
      // Check for companion planting
      const neighbors = getNeighbors(plotIndex);
      const companions: string[] = [];
      
      if (selectedMethod === "companion") {
        neighbors.forEach(neighborIndex => {
          const neighbor = plots[neighborIndex];
          if (neighbor.crop && crops[selectedCrop as keyof typeof crops].companions.includes(neighbor.crop)) {
            companions.push(neighbor.crop);
            // Also update the neighbor to include this crop as companion
            newPlots[neighborIndex] = { ...neighbor, companions: [...neighbor.companions, selectedCrop] };
          }
        });
      }

      newPlots[plotIndex] = {
        ...clickedPlot,
        crop: selectedCrop,
        stage: 1,
        plantedTime: gameTime,
        method: selectedMethod,
        companions
      };

      setPlots(newPlots);
      toast.success(`🌱 Planted ${selectedCrop} using ${methods[selectedMethod as keyof typeof methods].name}!`);
      
    } else if (selectedTool === "water" && clickedPlot.crop && water > 10) {
      // Water crop
      const newPlots = [...plots];
      newPlots[plotIndex] = { ...clickedPlot, watered: true, lastWatered: gameTime };
      setPlots(newPlots);
      setWater(prev => prev - 10);
      toast.success("💧 Crop watered!");
      
    } else if (selectedTool === "harvest" && clickedPlot.stage === 4) {
      // Harvest crop
      const crop = crops[clickedPlot.crop as keyof typeof crops];
      const methodBonus = methods[clickedPlot.method as keyof typeof methods]?.bonus || 1.0;
      const companionBonus = clickedPlot.companions.length > 0 ? 1.2 : 1.0;
      
      const xpEarned = Math.round(crop.xp * methodBonus * companionBonus);
      const coinsEarned = Math.round(crop.xp * 0.5 * methodBonus * companionBonus);
      
      onEarnRewards(xpEarned, coinsEarned);
      
      const newPlots = [...plots];
      newPlots[plotIndex] = {
        ...clickedPlot,
        crop: null,
        stage: 0,
        watered: false,
        lastWatered: 0,
        plantedTime: 0,
        method: null,
        companions: []
      };
      setPlots(newPlots);
      
      toast.success(`🌾 Harvested ${clickedPlot.crop}! +${xpEarned} XP, +${coinsEarned} coins`);
    }
  };

  const getNeighbors = (plotIndex: number): number[] => {
    const row = Math.floor(plotIndex / PLOTS_PER_ROW);
    const col = plotIndex % PLOTS_PER_ROW;
    const neighbors: number[] = [];

    // Check all 8 adjacent positions
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < PLOTS_PER_COL && newCol >= 0 && newCol < PLOTS_PER_ROW) {
          neighbors.push(newRow * PLOTS_PER_ROW + newCol);
        }
      }
    }
    return neighbors;
  };

  const clearAllPlots = () => {
    setPlots(plots.map(plot => ({
      ...plot,
      crop: null,
      stage: 0,
      watered: false,
      lastWatered: 0,
      plantedTime: 0,
      method: null,
      companions: []
    })));
    toast.success("🧹 Farm cleared!");
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case "spring": return "text-green-600";
      case "summer": return "text-yellow-600";
      case "fall": return "text-orange-600";
      case "winter": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>2D Farm Simulator</h2>
          <p className="text-muted-foreground">Practice traditional farming methods interactively</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className={getSeasonColor(season)}>
            {season.charAt(0).toUpperCase() + season.slice(1)}
          </Badge>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{Math.round(water)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Your Farm</CardTitle>
              <CardDescription>Click on plots to plant, water, or harvest crops</CardDescription>
            </CardHeader>
            <CardContent>
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={handleCanvasClick}
                className="border rounded-lg cursor-pointer bg-green-100"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant={selectedTool === "plant" ? "default" : "outline"}
                  onClick={() => setSelectedTool("plant")}
                  className="justify-start"
                >
                  <Sprout className="h-4 w-4 mr-2" />
                  Plant
                </Button>
                <Button
                  variant={selectedTool === "water" ? "default" : "outline"}
                  onClick={() => setSelectedTool("water")}
                  className="justify-start"
                  disabled={water < 10}
                >
                  <Droplets className="h-4 w-4 mr-2" />
                  Water
                </Button>
                <Button
                  variant={selectedTool === "harvest" ? "default" : "outline"}
                  onClick={() => setSelectedTool("harvest")}
                  className="justify-start"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Harvest
                </Button>
              </div>
            </CardContent>
          </Card>

          {selectedTool === "plant" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Crops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(crops).map(([cropName, crop]) => (
                      <Button
                        key={cropName}
                        variant={selectedCrop === cropName ? "default" : "outline"}
                        onClick={() => setSelectedCrop(cropName)}
                        className="justify-start text-xs"
                      >
                        <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: crop.color }} />
                        {cropName.charAt(0).toUpperCase() + cropName.slice(1)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(methods).map(([methodName, method]) => (
                      <Button
                        key={methodName}
                        variant={selectedMethod === methodName ? "default" : "outline"}
                        onClick={() => setSelectedMethod(methodName)}
                        className="w-full justify-start text-xs"
                      >
                        <div className="text-left">
                          <div>{method.name}</div>
                          <div className="text-xs text-muted-foreground">{method.bonus}x bonus</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Farm Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={clearAllPlots} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Farm
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Watered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                <span>Companion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Ready to harvest</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}