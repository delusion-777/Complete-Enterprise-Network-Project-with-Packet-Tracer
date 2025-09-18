import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  ArrowRight, 
  Calendar, 
  Droplets, 
  Leaf, 
  RotateCcw, 
  Sprout, 
  Sun, 
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Step {
  title: string;
  description: string;
  visual: string;
  duration: string;
  tips: string[];
}

interface Method {
  id: string;
  title: string;
  description: string;
  origin: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeframe: string;
  benefits: string[];
  steps: Step[];
  visualDemo: {
    before: string;
    during: string;
    after: string;
  };
  relatedCrops: string[];
}

export function MethodsShowcase() {
  const [selectedMethod, setSelectedMethod] = useState<string>("three-sisters");
  const [currentStep, setCurrentStep] = useState<number>(0);

  const methods: Record<string, Method> = {
    "three-sisters": {
      id: "three-sisters",
      title: "Three Sisters Planting",
      description: "Ancient Native American technique of growing corn, beans, and squash together in a symbiotic relationship.",
      origin: "Indigenous North American tribes, 1000+ years",
      difficulty: "Intermediate",
      timeframe: "Full growing season (4-6 months)",
      benefits: [
        "Corn provides natural support structure for beans",
        "Beans fix nitrogen in soil, feeding corn and squash",
        "Squash leaves shade soil, retaining moisture and deterring weeds",
        "Maximizes space utilization and crop diversity",
        "Reduces need for external fertilizers"
      ],
      steps: [
        {
          title: "Site Preparation",
          description: "Choose a sunny location and prepare circular mounds 3 feet apart, each about 18 inches in diameter and 6 inches high.",
          visual: "🏔️ Create raised earth mounds",
          duration: "1 day",
          tips: [
            "Ensure good drainage in the mounds",
            "Add compost to enrich the soil",
            "Space mounds 3-4 feet apart for adequate sunlight"
          ]
        },
        {
          title: "Plant the Corn",
          description: "Plant 4-6 corn kernels in the center of each mound, spacing them about 4 inches apart in a circle.",
          visual: "🌽 Corn seeds in center circle",
          duration: "Late spring when soil is warm",
          tips: [
            "Use heirloom varieties for best results",
            "Plant when soil temperature reaches 60°F",
            "Water gently after planting"
          ]
        },
        {
          title: "Wait for Corn Growth",
          description: "Allow corn to grow to about 6 inches tall before planting beans. This gives corn a head start to provide support.",
          visual: "🌱 Small corn plants emerging",
          duration: "2-3 weeks",
          tips: [
            "Keep soil consistently moist",
            "Watch for pests and protect young plants",
            "Thin to 3-4 strongest corn plants per mound"
          ]
        },
        {
          title: "Plant the Beans",
          description: "Plant 4-6 bean seeds around the base of each corn plant, about 3 inches from the corn stalks.",
          visual: "🫘 Bean seeds around corn base",
          duration: "When corn is 6 inches tall",
          tips: [
            "Use pole beans, not bush varieties",
            "Plant beans 2-3 inches from corn stalks",
            "Lima beans or climbing beans work best"
          ]
        },
        {
          title: "Plant the Squash",
          description: "Plant 2-3 squash seeds around the outer edge of each mound, allowing vines to spread between mounds.",
          visual: "🎃 Squash seeds on mound edges",
          duration: "Same time as beans or 1 week later",
          tips: [
            "Choose winter squash varieties",
            "Allow plenty of space for vine spread",
            "Plant on the north side to avoid shading other plants"
          ]
        },
        {
          title: "Maintain and Harvest",
          description: "Water regularly, monitor growth, and harvest each crop as it matures - corn first, then beans, finally squash.",
          visual: "🌾 Mature three sisters garden",
          duration: "Throughout growing season",
          tips: [
            "Harvest corn when kernels are full and milky",
            "Pick beans regularly to encourage production",
            "Harvest squash after vines die back in fall"
          ]
        }
      ],
      visualDemo: {
        before: "Empty prepared mounds in spring soil",
        during: "Corn stalks supporting bean vines with squash spreading below",
        after: "Abundant harvest of all three crops working together"
      },
      relatedCrops: ["corn", "beans", "squash", "sunflower"]
    },
    "crop-rotation": {
      id: "crop-rotation",
      title: "Four-Field Crop Rotation",
      description: "Systematic rotation of different crop types across four fields to maintain soil fertility and break pest cycles.",
      origin: "Medieval Europe, perfected in 18th century Britain",
      difficulty: "Advanced",
      timeframe: "4-year cycle",
      benefits: [
        "Prevents soil nutrient depletion",
        "Breaks disease and pest cycles",
        "Improves soil structure over time",
        "Reduces need for external fertilizers",
        "Increases overall farm productivity"
      ],
      steps: [
        {
          title: "Plan Your Fields",
          description: "Divide your growing area into four equal sections. Each section will host a different crop category each year.",
          visual: "📐 Four equal field divisions",
          duration: "Planning phase - 1 week",
          tips: [
            "Label fields A, B, C, D for easy tracking",
            "Ensure each field has similar soil conditions",
            "Consider water access for each section"
          ]
        },
        {
          title: "Year 1 Planting",
          description: "Field A: Root crops (turnips, potatoes), Field B: Grains (wheat, barley), Field C: Legumes (clover, peas), Field D: Fallow or green manure",
          visual: "🥔🌾🫛🌱 First year layout",
          duration: "Full growing season",
          tips: [
            "Keep detailed records of what's planted where",
            "Monitor soil health in each field",
            "Note pest and disease occurrences"
          ]
        },
        {
          title: "Year 2 Rotation",
          description: "Rotate clockwise: Field A gets grains, Field B gets legumes, Field C gets fallow/green manure, Field D gets root crops.",
          visual: "🔄 Clockwise rotation pattern",
          duration: "Full growing season",
          tips: [
            "Clean tools between fields to prevent disease spread",
            "Add compost to the field coming out of fallow",
            "Continue detailed record keeping"
          ]
        },
        {
          title: "Year 3 Rotation",
          description: "Continue the clockwise pattern. Each field now hosts its third different crop type in the cycle.",
          visual: "🔄 Continued rotation",
          duration: "Full growing season",
          tips: [
            "Notice improvements in soil structure",
            "Compare yields to previous years",
            "Adjust rotation based on observations"
          ]
        },
        {
          title: "Year 4 Completion",
          description: "Complete the four-year cycle. Each field has now hosted all four crop categories once.",
          visual: "✅ Full cycle completed",
          duration: "Full growing season",
          tips: [
            "Evaluate the success of the rotation",
            "Plan improvements for the next cycle",
            "Document lessons learned"
          ]
        },
        {
          title: "Cycle Renewal",
          description: "Begin a new four-year cycle, incorporating lessons learned and making adjustments based on soil health and productivity.",
          visual: "🔄 New cycle begins",
          duration: "Ongoing",
          tips: [
            "Consider adding new crop varieties",
            "Soil test each field to track improvements",
            "Share results with other farmers"
          ]
        }
      ],
      visualDemo: {
        before: "Single crop fields showing signs of soil depletion",
        during: "Organized rotation with diverse crops in different fields",
        after: "Healthy, productive fields with improved soil fertility"
      },
      relatedCrops: ["wheat", "barley", "turnips", "clover", "peas", "potatoes"]
    },
    "companion-planting": {
      id: "companion-planting",
      title: "Companion Planting",
      description: "Strategic planting of different crops together to create beneficial relationships and improve overall garden health.",
      origin: "Traditional knowledge from cultures worldwide",
      difficulty: "Beginner",
      timeframe: "Single growing season",
      benefits: [
        "Natural pest control through beneficial relationships",
        "Improved nutrient uptake and soil health",
        "Space-efficient garden design",
        "Enhanced pollination and biodiversity",
        "Reduced need for pesticides and fertilizers"
      ],
      steps: [
        {
          title: "Learn Plant Partnerships",
          description: "Study which plants work well together and which should be kept apart. Research complementary root depths, growth habits, and nutrient needs.",
          visual: "📚 Study companion plant charts",
          duration: "1-2 weeks research",
          tips: [
            "Make a chart of beneficial and harmful plant combinations",
            "Consider plant heights and growth patterns",
            "Research traditional companion planting wisdom"
          ]
        },
        {
          title: "Design Your Garden Layout",
          description: "Plan your garden beds to group compatible plants together while separating incompatible ones.",
          visual: "🎨 Garden design sketch",
          duration: "1 week planning",
          tips: [
            "Draw your garden to scale on paper",
            "Plan for mature plant sizes",
            "Consider sun and water requirements"
          ]
        },
        {
          title: "Prepare Growing Areas",
          description: "Prepare soil in planned beds, ensuring good drainage and fertility for all the plants you'll be growing together.",
          visual: "🏗️ Soil preparation",
          duration: "1-2 days",
          tips: [
            "Test soil pH for different plant needs",
            "Add appropriate amendments for companion groups",
            "Create clear pathways between planting areas"
          ]
        },
        {
          title: "Plant Primary Crops",
          description: "Start with your main crops (like tomatoes, corn, or cabbage) that will form the backbone of each companion group.",
          visual: "🌱 Main crops planted first",
          duration: "1-2 days",
          tips: [
            "Plant larger, slower-growing crops first",
            "Leave space for companion plants",
            "Water thoroughly after planting"
          ]
        },
        {
          title: "Add Companion Plants",
          description: "Plant beneficial companions around your main crops. This might include herbs for pest control or nitrogen-fixing plants.",
          visual: "🌿 Adding companion plants",
          duration: "1-2 days",
          tips: [
            "Basil near tomatoes for pest control and flavor",
            "Marigolds throughout for general pest deterrence",
            "Lettuce under taller plants for space efficiency"
          ]
        },
        {
          title: "Monitor & Maintain",
          description: "Watch how your companion plants interact, adjust spacing if needed, and document which combinations work best.",
          visual: "👀 Ongoing observation",
          duration: "Throughout growing season",
          tips: [
            "Keep a garden journal of successes and failures",
            "Take photos to track growth patterns",
            "Be ready to remove plants that aren't working well together"
          ]
        }
      ],
      visualDemo: {
        before: "Separate single-crop plantings with pest and nutrient problems",
        during: "Mixed plantings with herbs, flowers, and vegetables growing together",
        after: "Thriving diverse garden with natural pest control and healthy plants"
      },
      relatedCrops: ["tomato", "basil", "lettuce", "carrots", "onions", "marigolds"]
    }
  };

  const currentMethod = methods[selectedMethod];
  const stepProgress = ((currentStep + 1) / currentMethod.steps.length) * 100;

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, currentMethod.steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
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
      <div>
        <h2>Traditional Methods Showcase</h2>
        <p className="text-muted-foreground">
          Step-by-step visual guides to traditional farming techniques
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Method Selection */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Farming Methods</CardTitle>
            <CardDescription>Choose a method to explore</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.values(methods).map((method) => (
              <Button
                key={method.id}
                variant={selectedMethod === method.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedMethod(method.id);
                  setCurrentStep(0);
                }}
                className="w-full justify-start p-4 h-auto"
              >
                <div className="text-left">
                  <div className="font-medium">{method.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {method.difficulty} • {method.timeframe}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Method Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{currentMethod.title}</CardTitle>
                  <CardDescription className="mt-2">{currentMethod.description}</CardDescription>
                </div>
                <Badge className={getDifficultyColor(currentMethod.difficulty)}>
                  {currentMethod.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {currentMethod.timeframe}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {currentMethod.origin}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-semibold mb-2">Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {currentMethod.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Guide */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Step-by-Step Guide</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {currentMethod.steps.length}
                </div>
              </div>
              <Progress value={stepProgress} className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{currentMethod.steps[currentStep].visual}</div>
                <h3 className="font-semibold mb-2">{currentMethod.steps[currentStep].title}</h3>
                <p className="text-muted-foreground mb-4">{currentMethod.steps[currentStep].description}</p>
                <Badge variant="outline" className="mb-4">
                  Duration: {currentMethod.steps[currentStep].duration}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tips for This Step</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {currentMethod.steps[currentStep].tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">💡</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  onClick={nextStep} 
                  disabled={currentStep === currentMethod.steps.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Visual Transformation */}
          <Card>
            <CardHeader>
              <CardTitle>Method Transformation</CardTitle>
              <CardDescription>See how this method changes your growing area over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Before</h4>
                  <div className="text-4xl mb-2">🏜️</div>
                  <p className="text-sm text-muted-foreground">{currentMethod.visualDemo.before}</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold mb-2">During</h4>
                  <div className="text-4xl mb-2">🌱</div>
                  <p className="text-sm text-muted-foreground">{currentMethod.visualDemo.during}</p>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <h4 className="font-semibold mb-2">After</h4>
                  <div className="text-4xl mb-2">🌾</div>
                  <p className="text-sm text-muted-foreground">{currentMethod.visualDemo.after}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Crops */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Crops</CardTitle>
              <CardDescription>Plants that work well with this method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentMethod.relatedCrops.map((crop) => (
                  <Badge key={crop} variant="secondary" className="capitalize">
                    {crop}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}