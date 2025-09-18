import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { RotateCcw, Play, Pause } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Plot {
  x: number;
  y: number;
  state: "dry" | "plowed" | "planted" | "watered" | "growing" | "mature" | "ready";
  crop: string | null;
  stage: number;
  lastWatered: number;
  plantedTime: number;
  method: string | null;
  companions: string[];
}

interface ElytraFarm3DProps {
  onEarnRewards: (xp: number, coins: number) => void;
  purchasedItems: string[];
}

export function ElytraFarm3D({ onEarnRewards, purchasedItems }: ElytraFarm3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [selectedTool, setSelectedTool] = useState<string>("plow");
  const [selectedCrop, setSelectedCrop] = useState<string>("corn");
  const [plots, setPlots] = useState<Plot[]>([]);
  const [gameTime, setGameTime] = useState<number>(0);
  const [water, setWater] = useState<number>(100);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [farmerPos, setFarmerPos] = useState<{x: number, y: number}>({x: 5, y: 5});
  const [farmerAction, setFarmerAction] = useState<string>("idle");
  const [oxenPos, setOxenPos] = useState<{x: number, y: number}>({x: 3, y: 3});
  const [showOxen, setShowOxen] = useState<boolean>(false);

  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 800;
  const TILE_WIDTH = 48;
  const TILE_HEIGHT = 24;
  const GRID_WIDTH = 16;
  const GRID_HEIGHT = 12;

  // Enhanced crop system with Indian varieties
  const crops = {
    corn: { 
      symbol: "🌽", 
      growTime: 8000, 
      xp: 20, 
      stages: ["🌱", "🌿", "🌾", "🌽"],
      color: "#FFD700"
    },
    rice: {
      symbol: "🌾",
      growTime: 12000,
      xp: 30,
      stages: ["🌱", "🌿", "🌾", "🌾"],
      color: "#F5DEB3"
    },
    wheat: { 
      symbol: "🌾", 
      growTime: 10000, 
      xp: 25, 
      stages: ["🌱", "🌿", "🌾", "🌾"],
      color: "#DAA520"
    },
    chili: {
      symbol: "🌶️",
      growTime: 9000,
      xp: 22,
      stages: ["🌱", "🌿", "🟢", "🌶️"],
      color: "#FF4500"
    },
    beans: { 
      symbol: "🫘", 
      growTime: 6000, 
      xp: 15, 
      stages: ["🌱", "🌿", "🫛", "🫘"],
      color: "#228B22"
    },
    cotton: {
      symbol: "🤍",
      growTime: 14000,
      xp: 35,
      stages: ["🌱", "🌿", "🌸", "🤍"],
      color: "#F8F8FF"
    }
  };

  // Initialize plots
  useEffect(() => {
    const initialPlots: Plot[] = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        initialPlots.push({
          x: col,
          y: row,
          state: "dry",
          crop: null,
          stage: 0,
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
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setGameTime(prev => prev + 100);
      setWater(prev => Math.min(100, prev + 0.3));
      
      setPlots(prevPlots => 
        prevPlots.map(plot => {
          if (plot.crop && plot.stage > 0 && plot.stage < 4) {
            const crop = crops[plot.crop as keyof typeof crops];
            const elapsed = gameTime - plot.plantedTime;
            const waterBonus = plot.state === "watered" ? 1.5 : 1.0;
            const progressThreshold = crop.growTime / waterBonus;
            
            if (elapsed > progressThreshold) {
              const newStage = Math.min(4, plot.stage + 1);
              let newState = plot.state;
              if (newStage === 4) newState = "ready";
              else if (newStage > 1) newState = "growing";
              
              return { ...plot, stage: newStage, state: newState };
            }
            
            // Water evaporates
            if (plot.state === "watered" && gameTime - plot.lastWatered > 5000) {
              return { ...plot, state: "planted" };
            }
          }
          return plot;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [gameTime, isAnimating]);

  // Convert grid to isometric coordinates
  const gridToIso = (gridX: number, gridY: number) => {
    const isoX = (gridX - gridY) * (TILE_WIDTH / 2) + CANVAS_WIDTH / 2;
    const isoY = (gridX + gridY) * (TILE_HEIGHT / 2) + 150;
    return { x: isoX, y: isoY };
  };

  // Convert screen to grid coordinates
  const isoToGrid = (screenX: number, screenY: number) => {
    const relativeX = screenX - CANVAS_WIDTH / 2;
    const relativeY = screenY - 150;
    
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

  // Draw detailed farmer with animations
  const drawFarmer = (ctx: CanvasRenderingContext2D, gridX: number, gridY: number, action: string) => {
    const { x, y } = gridToIso(gridX, gridY);
    const time = Date.now() / 1000;
    
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(x, y + 35, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Farmer body (Indian farmer)
    ctx.fillStyle = "#8B4513"; // Brown skin
    
    if (action === "bending") {
      // Bending animation for planting
      ctx.fillRect(x - 8, y - 25, 16, 15); // Bent torso
      ctx.fillRect(x - 6, y - 10, 12, 20); // Legs
    } else {
      // Standing pose
      ctx.fillRect(x - 8, y - 35, 16, 20); // Torso
      ctx.fillRect(x - 6, y - 15, 12, 25); // Legs
    }
    
    // Turban (animated for walking)
    const turbankOffset = action === "walking" ? Math.sin(time * 8) * 2 : 0;
    ctx.fillStyle = "#FF6B35"; // Orange turban
    ctx.beginPath();
    ctx.arc(x, y - 40 + turbankOffset, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Turban decoration
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(x, y - 40 + turbankOffset, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Clothes
    ctx.fillStyle = "#FFFFFF"; // White kurta
    if (action === "bending") {
      ctx.fillRect(x - 12, y - 25, 24, 25);
    } else {
      ctx.fillRect(x - 12, y - 35, 24, 30);
    }
    
    // Arms with tools
    ctx.fillStyle = "#8B4513";
    const armOffset = action === "working" ? Math.sin(time * 6) * 5 : 0;
    
    if (selectedTool === "water") {
      // Holding watering can
      ctx.fillRect(x - 18, y - 15 + armOffset, 8, 15);
      ctx.fillRect(x + 10, y - 15 - armOffset, 8, 15);
      
      // Watering can
      ctx.fillStyle = "#4682B4";
      ctx.fillRect(x + 15, y - 10, 12, 8);
      ctx.fillRect(x + 25, y - 8, 8, 3); // Spout
      
      // Water drops if watering
      if (action === "watering") {
        ctx.fillStyle = "#0066CC";
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(x + 35 + i * 3, y + 5 + i * 4, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
    } else if (selectedTool === "plant") {
      // Holding seed bag
      ctx.fillRect(x - 18, y - 10, 8, 15);
      ctx.fillRect(x + 10, y - 10, 8, 15);
      
      ctx.fillStyle = "#8FBC8F";
      ctx.fillRect(x + 12, y - 8, 10, 8);
      
    } else if (selectedTool === "plow") {
      // Holding plow handle
      ctx.fillRect(x - 18, y - 10, 8, 15);
      ctx.fillRect(x + 10, y - 10, 8, 15);
      
      // Plow handle
      ctx.strokeStyle = "#8B4513";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 15, y - 5);
      ctx.lineTo(x + 25, y + 10);
      ctx.stroke();
    }
  };

  // Draw oxen for plowing
  const drawOxen = (ctx: CanvasRenderingContext2D, gridX: number, gridY: number) => {
    const { x, y } = gridToIso(gridX, gridY);
    
    // Two oxen side by side
    for (let i = 0; i < 2; i++) {
      const oxX = x + (i - 0.5) * 40;
      
      // Ox body
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(oxX - 15, y - 20, 30, 15);
      
      // Ox head
      ctx.fillStyle = "#A0522D";
      ctx.fillRect(oxX - 10, y - 35, 20, 15);
      
      // Horns
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(oxX - 8, y - 35);
      ctx.lineTo(oxX - 12, y - 45);
      ctx.moveTo(oxX + 8, y - 35);
      ctx.lineTo(oxX + 12, y - 45);
      ctx.stroke();
      
      // Legs
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(oxX - 12, y - 5, 6, 15);
      ctx.fillRect(oxX - 2, y - 5, 6, 15);
      ctx.fillRect(oxX + 8, y - 5, 6, 15);
    }
    
    // Yoke connecting the oxen
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x - 35, y - 25);
    ctx.lineTo(x + 35, y - 25);
    ctx.stroke();
    
    // Plow
    ctx.fillStyle = "#654321";
    ctx.fillRect(x - 8, y + 10, 16, 8);
    ctx.fillStyle = "#C0C0C0"; // Metal blade
    ctx.fillRect(x - 6, y + 18, 12, 6);
  };

  // Main drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(0.7, "#98FB98");
    gradient.addColorStop(1, "#90EE90");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw sun
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - 100, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Sun rays
    ctx.strokeStyle = "#FFED4E";
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(
        CANVAS_WIDTH - 100 + Math.cos(angle) * 50,
        80 + Math.sin(angle) * 50
      );
      ctx.lineTo(
        CANVAS_WIDTH - 100 + Math.cos(angle) * 70,
        80 + Math.sin(angle) * 70
      );
      ctx.stroke();
    }

    // Draw plots (back to front for proper layering)
    for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
      for (let col = GRID_WIDTH - 1; col >= 0; col--) {
        const plotIndex = row * GRID_WIDTH + col;
        const plot = plots[plotIndex];
        if (!plot) continue;

        const { x, y } = gridToIso(col, row);
        
        // Determine tile color based on state
        let tileColor = "#D2B48C"; // Dry sand
        let borderColor = "#8B4513";
        
        switch (plot.state) {
          case "dry":
            tileColor = "#D2B48C"; // Sandy
            break;
          case "plowed":
            tileColor = "#8B4513"; // Dark soil
            break;
          case "planted":
            tileColor = "#A0522D"; // Rich soil
            break;
          case "watered":
            tileColor = "#654321"; // Wet soil
            break;
          case "growing":
            tileColor = "#556B2F"; // Growing soil
            break;
          case "mature":
          case "ready":
            tileColor = "#6B8E23"; // Fertile soil
            break;
        }

        drawTile(ctx, x, y, tileColor, borderColor);

        // Draw crop if present
        if (plot.crop && plot.stage > 0) {
          const crop = crops[plot.crop as keyof typeof crops];
          const stageIndex = Math.min(plot.stage - 1, crop.stages.length - 1);
          const cropSymbol = crop.stages[stageIndex];
          
          ctx.font = "28px Arial";
          ctx.textAlign = "center";
          ctx.fillText(cropSymbol, x, y - 15);
          
          // Sparkle effect for ready crops
          if (plot.state === "ready") {
            const time = Date.now() / 1000;
            ctx.fillStyle = "#FFD700";
            ctx.font = "16px Arial";
            ctx.fillText("✨", x + 15 + Math.sin(time * 2) * 5, y - 25);
            ctx.fillText("✨", x - 15 - Math.sin(time * 2) * 5, y - 5);
          }
        }

        // State indicators
        if (plot.state === "watered") {
          ctx.fillStyle = "#4169E1";
          ctx.font = "14px Arial";
          ctx.fillText("💧", x - 15, y + 15);
        }
      }
    }

    // Draw oxen if plowing mode and should show
    if (showOxen && selectedTool === "plow") {
      drawOxen(ctx, oxenPos.x, oxenPos.y);
    }

    // Draw farmer (always on top)
    drawFarmer(ctx, farmerPos.x, farmerPos.y, farmerAction);

    // UI overlays
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillRect(20, 20, 280, 80);
    ctx.strokeStyle = "#E0E0E0";
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, 280, 80);
    
    ctx.fillStyle = "#1D1D1F";
    ctx.font = "16px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Tool: ${selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)}`, 35, 45);
    ctx.fillText(`Crop: ${selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}`, 35, 65);
    ctx.fillText(`Water: ${Math.round(water)}%`, 35, 85);

    // Water meter
    const waterBarWidth = 200;
    const waterBarHeight = 8;
    ctx.fillStyle = "#E0E0E0";
    ctx.fillRect(CANVAS_WIDTH - waterBarWidth - 30, 30, waterBarWidth, waterBarHeight);
    ctx.fillStyle = "#007AFF";
    ctx.fillRect(CANVAS_WIDTH - waterBarWidth - 30, 30, (water / 100) * waterBarWidth, waterBarHeight);
    
    ctx.fillStyle = "#1D1D1F";
    ctx.font = "14px -apple-system";
    ctx.textAlign = "right";
    ctx.fillText("Water Supply", CANVAS_WIDTH - 30, 55);

  }, [plots, farmerPos, farmerAction, selectedTool, selectedCrop, water, oxenPos, showOxen]);

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

  const handleCanvasClick = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    const { x: gridX, y: gridY } = isoToGrid(screenX, screenY);

    if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) return;

    const plotIndex = gridY * GRID_WIDTH + gridX;
    const clickedPlot = plots[plotIndex];
    if (!clickedPlot) return;

    // Move farmer to location
    setFarmerPos({x: gridX, y: gridY});

    if (selectedTool === "plow" && clickedPlot.state === "dry") {
      // Show oxen and animate plowing
      setShowOxen(true);
      setOxenPos({x: gridX, y: gridY});
      setFarmerAction("working");
      
      setTimeout(() => {
        const newPlots = [...plots];
        newPlots[plotIndex] = { ...clickedPlot, state: "plowed" };
        setPlots(newPlots);
        setFarmerAction("idle");
        setShowOxen(false);
        toast.success("🐂 Oxen have plowed the field! Soil is ready for planting.");
      }, 2000);

    } else if (selectedTool === "plant" && clickedPlot.state === "plowed") {
      setFarmerAction("bending");
      
      setTimeout(() => {
        const newPlots = [...plots];
        newPlots[plotIndex] = {
          ...clickedPlot,
          state: "planted",
          crop: selectedCrop,
          stage: 1,
          plantedTime: gameTime
        };
        setPlots(newPlots);
        setFarmerAction("idle");
        toast.success(`🌱 Planted ${selectedCrop}! The farmer carefully places each seed.`);
      }, 1500);

    } else if (selectedTool === "water" && (clickedPlot.state === "planted" || clickedPlot.state === "growing") && water > 10) {
      setFarmerAction("watering");
      
      setTimeout(() => {
        const newPlots = [...plots];
        newPlots[plotIndex] = { 
          ...clickedPlot, 
          state: "watered", 
          lastWatered: gameTime 
        };
        setPlots(newPlots);
        setWater(prev => prev - 10);
        setFarmerAction("idle");
        toast.success("💧 Crops watered with care! Growth will be enhanced.");
      }, 2000);

    } else if (selectedTool === "harvest" && clickedPlot.state === "ready") {
      setFarmerAction("working");
      
      setTimeout(() => {
        const crop = crops[clickedPlot.crop as keyof typeof crops];
        const xpEarned = crop.xp;
        const coinsEarned = Math.round(crop.xp * 0.8);
        
        onEarnRewards(xpEarned, coinsEarned);
        
        const newPlots = [...plots];
        newPlots[plotIndex] = {
          ...clickedPlot,
          state: "dry",
          crop: null,
          stage: 0,
          plantedTime: 0,
          lastWatered: 0
        };
        setPlots(newPlots);
        setFarmerAction("idle");
        
        toast.success(`🌾 Harvested ${clickedPlot.crop}! +${xpEarned} XP, +${coinsEarned} coins`);
      }, 1500);
    }
  };

  const resetFarm = () => {
    setPlots(plots.map(plot => ({
      ...plot,
      state: "dry",
      crop: null,
      stage: 0,
      plantedTime: 0,
      lastWatered: 0
    })));
    setFarmerPos({x: 5, y: 5});
    setFarmerAction("idle");
    setShowOxen(false);
    toast.success("🔄 Farm reset! Ready for a new beginning.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
            Elytra Farm Simulator
          </h2>
          <p className="text-muted-foreground mt-2">
            Experience authentic farming from soil preparation to harvest
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAnimating(!isAnimating)}
            className="border-blue-200 hover:bg-blue-50"
          >
            {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isAnimating ? "Pause" : "Play"}
          </Button>
          <Progress value={water} className="w-24" />
          <span className="text-sm text-gray-600">Water: {Math.round(water)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-5">
          <Card className="bg-white shadow-xl border border-gray-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-yellow-50 border-b">
              <CardTitle className="text-xl">Your 3D Farm</CardTitle>
              <CardDescription>
                Click to plow with oxen, plant seeds, water crops, and harvest your bounty
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={handleCanvasClick}
                className="cursor-pointer bg-gradient-to-b from-sky-100 to-green-100"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-white shadow-lg border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                🛠️ Farming Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "plow", icon: "🐂", name: "Plow with Oxen", desc: "Prepare dry soil" },
                { id: "plant", icon: "🌱", name: "Plant Seeds", desc: "Sow your crops" },
                { id: "water", icon: "🪣", name: "Water Can", desc: "Nurture growth" },
                { id: "harvest", icon: "🌾", name: "Harvest", desc: "Collect crops" }
              ].map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "outline"}
                  onClick={() => setSelectedTool(tool.id)}
                  className="w-full justify-start p-3 h-auto bg-white hover:bg-gray-50"
                  disabled={tool.id === "water" && water < 10}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{tool.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">{tool.desc}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {selectedTool === "plant" && (
            <Card className="bg-white shadow-lg border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">🌾 Crop Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(crops).map(([cropName, crop]) => (
                  <Button
                    key={cropName}
                    variant={selectedCrop === cropName ? "default" : "outline"}
                    onClick={() => setSelectedCrop(cropName)}
                    className="w-full justify-start text-sm bg-white hover:bg-gray-50"
                  >
                    <span className="text-lg mr-3">{crop.symbol}</span>
                    <div className="text-left">
                      <div className="capitalize font-medium">{cropName}</div>
                      <div className="text-xs text-muted-foreground">{crop.xp} XP</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="bg-white shadow-lg border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">🎯 Farm Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={resetFarm} 
                className="w-full bg-red-500 hover:bg-red-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Farm
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-green-50 border border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">📖 Farm Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-amber-700">
                <span>🐂</span>
                <span>Use oxen to plow dry land</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <span>🌱</span>
                <span>Plant seeds in plowed soil</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <span>💧</span>
                <span>Water crops for faster growth</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-700">
                <span>✨</span>
                <span>Harvest when crops sparkle</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}