import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { CheckCircle, Clock, Coins, Star, RotateCcw } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Plot {
  x: number;
  y: number;
  crop: string | null;
  stage: number; // 0 = empty, 1 = planted, 2 = growing, 3 = mature, 4 = ready
  watered: boolean;
  lastWatered: number;
  plantedTime: number;
  method: string | null;
  companions: string[];
}

interface FarmGame3DProps {
  onEarnRewards: (xp: number, coins: number) => void;
}

export function FarmGame3D({ onEarnRewards }: FarmGame3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<string>("plant");
  const [selectedCrop, setSelectedCrop] = useState<string>("corn");
  const [selectedMethod, setSelectedMethod] = useState<string>("traditional");
  const [plots, setPlots] = useState<Plot[]>([]);
  const [gameTime, setGameTime] = useState<number>(0);
  const [water, setWater] = useState<number>(100);
  const [season, setSeason] = useState<string>("spring");
  const [farmerPos, setFarmerPos] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [farmerMoving, setFarmerMoving] = useState<boolean>(false);

  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 700;
  const TILE_WIDTH = 64;
  const TILE_HEIGHT = 32;
  const GRID_WIDTH = 12;
  const GRID_HEIGHT = 10;

  // Crop types with enhanced properties and symbols
  const crops = {
    corn: { 
      color: "#FFD700", 
      growTime: 8000, 
      companions: ["beans", "squash"], 
      xp: 20,
      symbol: "🌽",
      stages: ["🌱", "🌿", "🌾", "🌽"]
    },
    beans: { 
      color: "#228B22", 
      growTime: 6000, 
      companions: ["corn", "squash"], 
      xp: 15,
      symbol: "🫘",
      stages: ["🌱", "🌿", "🫛", "🫘"]
    },
    squash: { 
      color: "#FF8C00", 
      growTime: 10000, 
      companions: ["corn", "beans"], 
      xp: 25,
      symbol: "🎃",
      stages: ["🌱", "🌿", "🥒", "🎃"]
    },
    tomato: { 
      color: "#FF6347", 
      growTime: 7000, 
      companions: ["basil"], 
      xp: 18,
      symbol: "🍅",
      stages: ["🌱", "🌿", "🟢", "🍅"]
    },
    basil: { 
      color: "#32CD32", 
      growTime: 4000, 
      companions: ["tomato"], 
      xp: 12,
      symbol: "🌿",
      stages: ["🌱", "🌿", "🌿", "🌿"]
    },
    wheat: { 
      color: "#DAA520", 
      growTime: 12000, 
      companions: [], 
      xp: 30,
      symbol: "🌾",
      stages: ["🌱", "🌿", "🌾", "🌾"]
    },
    lettuce: { 
      color: "#90EE90", 
      growTime: 3000, 
      companions: [], 
      xp: 10,
      symbol: "🥬",
      stages: ["🌱", "🌿", "🥬", "🥬"]
    },
    rice: {
      color: "#F5DEB3",
      growTime: 15000,
      companions: [],
      xp: 35,
      symbol: "🌾",
      stages: ["🌱", "🌿", "🌾", "🌾"]
    },
    chili: {
      color: "#FF4500",
      growTime: 9000,
      companions: ["tomato"],
      xp: 22,
      symbol: "🌶️",
      stages: ["🌱", "🌿", "🟢", "🌶️"]
    }
  };

  const methods = {
    traditional: { name: "Traditional", bonus: 1.0, description: "Standard planting method" },
    companion: { name: "Companion Planting", bonus: 1.5, description: "Plant compatible crops together" },
    rotation: { name: "Crop Rotation", bonus: 1.3, description: "Rotate crops to maintain soil health" },
    intercropping: { name: "Intercropping", bonus: 1.4, description: "Mix different crops in same area" }
  };

  // Initialize plots in isometric grid
  useEffect(() => {
    const initialPlots: Plot[] = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        initialPlots.push({
          x: col,
          y: row,
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
    setFarmerPos({x: 0, y: 0});
  }, []);

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(prev => prev + 100);
      
      // Update season every 30 seconds
      const seasons = ["spring", "summer", "fall", "winter"];
      setSeason(seasons[Math.floor(Date.now() / 30000) % 4]);
      
      // Regenerate water slowly
      setWater(prev => Math.min(100, prev + 0.2));
      
      // Update plots
      setPlots(prevPlots => 
        prevPlots.map(plot => {
          if (plot.crop && plot.stage > 0 && plot.stage < 4) {
            const crop = crops[plot.crop as keyof typeof crops];
            const elapsed = gameTime - plot.plantedTime;
            const waterBonus = plot.watered ? 1.3 : 0.7;
            const companionBonus = plot.companions.length > 0 ? 1.4 : 1.0;
            const growthRate = waterBonus * companionBonus;
            const progressThreshold = crop.growTime / growthRate;
            
            if (elapsed > progressThreshold && plot.stage < 4) {
              return { ...plot, stage: Math.min(4, plot.stage + 1) };
            }
            
            // Water evaporates over time
            if (plot.watered && gameTime - plot.lastWatered > 6000) {
              return { ...plot, watered: false };
            }
          }
          return plot;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [gameTime]);

  // Convert grid coordinates to isometric screen coordinates
  const gridToIso = (gridX: number, gridY: number) => {
    const isoX = (gridX - gridY) * (TILE_WIDTH / 2) + CANVAS_WIDTH / 2;
    const isoY = (gridX + gridY) * (TILE_HEIGHT / 2) + 100;
    return { x: isoX, y: isoY };
  };

  // Convert screen coordinates to grid coordinates
  const isoToGrid = (screenX: number, screenY: number) => {
    const relativeX = screenX - CANVAS_WIDTH / 2;
    const relativeY = screenY - 100;
    
    const gridX = (relativeX / (TILE_WIDTH / 2) + relativeY / (TILE_HEIGHT / 2)) / 2;
    const gridY = (relativeY / (TILE_HEIGHT / 2) - relativeX / (TILE_WIDTH / 2)) / 2;
    
    return { 
      x: Math.round(gridX), 
      y: Math.round(gridY) 
    };
  };

  // Draw isometric tile
  const drawTile = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, outline = "#8B4513") => {
    const points = [
      { x: x, y: y },
      { x: x + TILE_WIDTH / 2, y: y + TILE_HEIGHT / 2 },
      { x: x, y: y + TILE_HEIGHT },
      { x: x - TILE_WIDTH / 2, y: y + TILE_HEIGHT / 2 }
    ];

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = outline;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // Draw farmer character
  const drawFarmer = (ctx: CanvasRenderingContext2D, gridX: number, gridY: number) => {
    const { x, y } = gridToIso(gridX, gridY);
    
    // Farmer body (Indian farmer with turban)
    ctx.fillStyle = "#8B4513"; // Brown skin
    ctx.fillRect(x - 8, y - 35, 16, 20);
    
    // Turban
    ctx.fillStyle = "#FF6B35"; // Orange turban
    ctx.beginPath();
    ctx.arc(x, y - 40, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Turban detail
    ctx.fillStyle = "#FFD700"; // Gold detail
    ctx.beginPath();
    ctx.arc(x, y - 40, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Clothes
    ctx.fillStyle = "#FFFFFF"; // White kurta
    ctx.fillRect(x - 12, y - 15, 24, 30);
    
    // Arms
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(x - 18, y - 10, 8, 15);
    ctx.fillRect(x + 10, y - 10, 8, 15);
    
    // Legs
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x - 8, y + 15, 6, 20);
    ctx.fillRect(x + 2, y + 15, 6, 20);

    // Add farming tool if selected
    if (selectedTool === "water") {
      // Water bucket
      ctx.fillStyle = "#4682B4";
      ctx.fillRect(x + 15, y - 5, 8, 10);
      ctx.strokeStyle = "#2F4F4F";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 15, y - 5, 8, 10);
      
      // Bucket handle
      ctx.beginPath();
      ctx.arc(x + 19, y - 8, 4, 0, Math.PI, true);
      ctx.stroke();
    } else if (selectedTool === "plant") {
      // Seed bag
      ctx.fillStyle = "#8FBC8F";
      ctx.fillRect(x + 12, y - 2, 10, 8);
      ctx.strokeStyle = "#556B2F";
      ctx.strokeRect(x + 12, y - 2, 10, 8);
    }
    
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(x, y + 35, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  // Canvas drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87CEEB"); // Sky blue
    gradient.addColorStop(1, "#98FB98"); // Pale green
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw plots in isometric view (back to front for proper layering)
    for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
      for (let col = GRID_WIDTH - 1; col >= 0; col--) {
        const plotIndex = row * GRID_WIDTH + col;
        const plot = plots[plotIndex];
        if (!plot) continue;

        const { x, y } = gridToIso(col, row);
        
        // Determine tile color
        let tileColor = "#90EE90"; // Light green for empty
        if (plot.watered) {
          tileColor = "#8FBC8F"; // Darker green when watered
        }
        if (plot.crop) {
          tileColor = "#DEB887"; // Burlywood for planted
        }

        drawTile(ctx, x, y, tileColor);

        // Draw crop if present
        if (plot.crop && plot.stage > 0) {
          const crop = crops[plot.crop as keyof typeof crops];
          const stageIndex = Math.min(plot.stage - 1, crop.stages.length - 1);
          const cropSymbol = crop.stages[stageIndex];
          
          // Set font for emoji
          ctx.font = "24px Arial";
          ctx.textAlign = "center";
          ctx.fillText(cropSymbol, x, y - 10);
          
          // Add sparkle effect for ready crops
          if (plot.stage === 4) {
            ctx.fillStyle = "#FFD700";
            ctx.font = "16px Arial";
            ctx.fillText("✨", x + 15, y - 20);
            ctx.fillText("✨", x - 15, y - 5);
          }
        }

        // Water indicator
        if (plot.watered) {
          ctx.fillStyle = "#4169E1";
          ctx.font = "12px Arial";
          ctx.fillText("💧", x - 20, y + 20);
        }

        // Companion indicator
        if (plot.companions.length > 0) {
          ctx.fillStyle = "#FF69B4";
          ctx.font = "10px Arial";
          ctx.fillText("🤝", x + 20, y - 15);
        }
      }
    }

    // Draw farmer (always on top)
    drawFarmer(ctx, farmerPos.x, farmerPos.y);

    // Draw UI overlay
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(10, 10, 200, 60);
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Tool: ${selectedTool}`, 20, 30);
    ctx.fillText(`Crop: ${selectedCrop}`, 20, 45);
    ctx.fillText(`Water: ${Math.round(water)}%`, 20, 60);

    // Draw season indicator
    const seasonEmojis = {
      spring: "🌸",
      summer: "☀️", 
      fall: "🍂",
      winter: "❄️"
    };
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`${seasonEmojis[season as keyof typeof seasonEmojis]} ${season}`, CANVAS_WIDTH - 20, 40);

  }, [plots, farmerPos, selectedTool, selectedCrop, water, season]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    const { x: gridX, y: gridY } = isoToGrid(screenX, screenY);

    // Check if click is within bounds
    if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) return;

    const plotIndex = gridY * GRID_WIDTH + gridX;
    const clickedPlot = plots[plotIndex];
    if (!clickedPlot) return;

    // Move farmer to clicked location
    setFarmerMoving(true);
    setFarmerPos({x: gridX, y: gridY});
    setTimeout(() => setFarmerMoving(false), 500);

    if (selectedTool === "plant" && !clickedPlot.crop) {
      // Plant crop
      const newPlots = [...plots];
      
      // Check for companion planting
      const neighbors = getNeighbors(plotIndex);
      const companions: string[] = [];
      
      if (selectedMethod === "companion") {
        neighbors.forEach(neighborIndex => {
          const neighbor = plots[neighborIndex];
          if (neighbor && neighbor.crop && crops[selectedCrop as keyof typeof crops].companions.includes(neighbor.crop)) {
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
      toast.success(`🌱 Planted ${selectedCrop}! The farmer is pleased.`);
      
    } else if (selectedTool === "water" && clickedPlot.crop && water > 10) {
      // Water crop
      const newPlots = [...plots];
      newPlots[plotIndex] = { ...clickedPlot, watered: true, lastWatered: gameTime };
      setPlots(newPlots);
      setWater(prev => prev - 10);
      toast.success("💧 Crop watered! The farmer carries the bucket with care.");
      
    } else if (selectedTool === "harvest" && clickedPlot.stage === 4) {
      // Harvest crop
      const crop = crops[clickedPlot.crop as keyof typeof crops];
      const methodBonus = methods[clickedPlot.method as keyof typeof methods]?.bonus || 1.0;
      const companionBonus = clickedPlot.companions.length > 0 ? 1.2 : 1.0;
      
      const xpEarned = Math.round(crop.xp * methodBonus * companionBonus);
      const coinsEarned = Math.round(crop.xp * 0.6 * methodBonus * companionBonus);
      
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
      
      toast.success(`🌾 ${crop.symbol} Harvested ${clickedPlot.crop}! +${xpEarned} XP, +${coinsEarned} coins`);
    }
  };

  const getNeighbors = (plotIndex: number): number[] => {
    const row = Math.floor(plotIndex / GRID_WIDTH);
    const col = plotIndex % GRID_WIDTH;
    const neighbors: number[] = [];

    // Check all 8 adjacent positions
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < GRID_HEIGHT && newCol >= 0 && newCol < GRID_WIDTH) {
          neighbors.push(newRow * GRID_WIDTH + newCol);
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
    setFarmerPos({x: 0, y: 0});
    toast.success("🧹 The farmer has cleared the entire farm!");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>3D Isometric Farm</h2>
          <p className="text-muted-foreground">Experience traditional farming in beautiful 3D perspective</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="capitalize">
            {season} Season
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm">💧 Water: {Math.round(water)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Your 3D Farm</CardTitle>
              <CardDescription>Click on tiles to plant, water, or harvest. Watch the Indian farmer work!</CardDescription>
            </CardHeader>
            <CardContent>
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={handleCanvasClick}
                className="border rounded-lg cursor-pointer bg-gradient-to-b from-sky-200 to-green-200"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🧑‍🌾 Farmer Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant={selectedTool === "plant" ? "default" : "outline"}
                  onClick={() => setSelectedTool("plant")}
                  className="justify-start"
                >
                  🌱 Plant Seeds
                </Button>
                <Button
                  variant={selectedTool === "water" ? "default" : "outline"}
                  onClick={() => setSelectedTool("water")}
                  className="justify-start"
                  disabled={water < 10}
                >
                  🪣 Water Bucket
                </Button>
                <Button
                  variant={selectedTool === "harvest" ? "default" : "outline"}
                  onClick={() => setSelectedTool("harvest")}
                  className="justify-start"
                >
                  ⚡ Harvest
                </Button>
              </div>
            </CardContent>
          </Card>

          {selectedTool === "plant" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>🌾 Indian Crops</CardTitle>
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
                        <span className="text-lg mr-2">{crop.symbol}</span>
                        {cropName.charAt(0).toUpperCase() + cropName.slice(1)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🏛️ Traditional Methods</CardTitle>
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
              <CardTitle>🛠️ Farm Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={clearAllPlots} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear All Plots
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📖 Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span>💧</span>
                <span>Watered plot</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🤝</span>
                <span>Companion planting</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span>Ready to harvest</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🧑‍🌾</span>
                <span>Indian farmer</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}