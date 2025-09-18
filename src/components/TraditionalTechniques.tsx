import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Leaf, Droplets, Bug, Recycle, Sprout, Sun } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Technique {
  id: string;
  title: string;
  description: string;
  origin: string;
  benefits: string[];
  howTo: string[];
  season: string;
  difficulty: "Easy" | "Medium" | "Hard";
  icon: React.ReactNode;
  image: string;
}

export function TraditionalTechniques() {
  const techniques: Record<string, Technique[]> = {
    soil: [
      {
        id: "composting",
        title: "Traditional Composting",
        description: "Ancient method of decomposing organic matter to create nutrient-rich soil amendment.",
        origin: "Practiced by Chinese farmers over 2,000 years ago",
        benefits: [
          "Improves soil structure and fertility",
          "Reduces waste and environmental impact",
          "Increases beneficial soil microorganisms",
          "Retains moisture in soil"
        ],
        howTo: [
          "Layer brown materials (dried leaves, straw) with green materials (vegetable scraps)",
          "Maintain 3:1 ratio of brown to green materials",
          "Turn pile every 2-3 weeks for aeration",
          "Keep moisture level like a wrung-out sponge",
          "Compost is ready when dark and crumbly (3-6 months)"
        ],
        season: "Year-round",
        difficulty: "Easy",
        icon: <Recycle className="h-5 w-5" />,
        image: "https://images.unsplash.com/photo-1716903282677-3a1b5c936b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wb3N0aW5nJTIwc29pbCUyMG9yZ2FuaWMlMjBmYXJtaW5nfGVufDF8fHx8MTc1ODEwOTQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        id: "crop-rotation",
        title: "Four-Field Crop Rotation",
        description: "Systematic rotation of different crops to maintain soil health and prevent pest buildup.",
        origin: "Developed in medieval Europe, refined in 18th century",
        benefits: [
          "Prevents soil nutrient depletion",
          "Reduces pest and disease cycles",
          "Improves soil structure",
          "Increases overall yield"
        ],
        howTo: [
          "Divide farmland into four sections",
          "Year 1: Wheat/grain → Turnips → Barley/oats → Clover/fallow",
          "Rotate crops clockwise each year",
          "Include nitrogen-fixing legumes",
          "Document soil changes and yields"
        ],
        season: "Plan annually",
        difficulty: "Medium",
        icon: <Sprout className="h-5 w-5" />,
        image: "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwcm90YXRpb24lMjBhZ3JpY3VsdHVyYWwlMjBmaWVsZHN8ZW58MXx8fHwxNzU4MTA5NDgzfDA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ],
    planting: [
      {
        id: "companion-planting",
        title: "Three Sisters Planting",
        description: "Native American technique of growing corn, beans, and squash together symbiotically.",
        origin: "Indigenous North American tribes, 1000+ years old",
        benefits: [
          "Corn provides support for beans",
          "Beans fix nitrogen for corn and squash",
          "Squash leaves shade soil and deter pests",
          "Maximizes space efficiency"
        ],
        howTo: [
          "Create mounds 3 feet apart",
          "Plant 4-6 corn seeds in center of mound",
          "When corn is 6 inches tall, plant beans around it",
          "Plant squash at the base of mound",
          "Harvest corn first, then beans, finally squash"
        ],
        season: "Late spring to early fall",
        difficulty: "Medium",
        icon: <Leaf className="h-5 w-5" />,
        image: "https://images.unsplash.com/photo-1542365775-6e6177a8e296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGZhcm1pbmclMjBtZXRob2RzJTIwYW5jaWVudCUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc1ODEwOTQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        id: "intercropping",
        title: "Polyculture Intercropping",
        description: "Growing multiple crops in the same space to maximize biodiversity and yield.",
        origin: "Traditional farming systems worldwide",
        benefits: [
          "Increased biodiversity",
          "Better pest control",
          "Improved soil health",
          "Higher overall productivity"
        ],
        howTo: [
          "Choose compatible plants with different growth habits",
          "Mix deep and shallow-rooted plants",
          "Combine plants with different nutrient needs",
          "Stagger planting times for continuous harvest",
          "Monitor for competition and adjust spacing"
        ],
        season: "Varies by crop combination",
        difficulty: "Hard",
        icon: <Sprout className="h-5 w-5" />,
        image: "https://images.unsplash.com/photo-1737960320564-9e681df95dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhcm1pbmclMjBvcmdhbmljJTIwY3JvcHN8ZW58MXx8fHwxNzU4MTA5NDgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ],
    water: [
      {
        id: "rainwater-harvesting",
        title: "Traditional Rainwater Harvesting",
        description: "Ancient techniques for collecting and storing rainwater for agricultural use.",
        origin: "Practiced in arid regions for thousands of years",
        benefits: [
          "Reduces dependence on groundwater",
          "Provides soft water free of chemicals",
          "Reduces erosion and runoff",
          "Cost-effective water source"
        ],
        howTo: [
          "Install gutters and downspouts on roof",
          "Connect to storage tanks or barrels",
          "Add first-flush diverters to improve quality",
          "Cover storage to prevent mosquitoes",
          "Use gravity-fed distribution system"
        ],
        season: "Year-round collection",
        difficulty: "Medium",
        icon: <Droplets className="h-5 w-5" />,
        image: "https://images.unsplash.com/photo-1542365775-6e6177a8e296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGZhcm1pbmclMjBtZXRob2RzJTIwYW5jaWVudCUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc1ODEwOTQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        id: "drip-irrigation",
        title: "Clay Pot Irrigation",
        description: "Ancient slow-release watering system using buried clay pots.",
        origin: "Used in ancient China and North Africa",
        benefits: [
          "Conserves water efficiently",
          "Delivers water directly to roots",
          "Reduces water waste from evaporation",
          "Low maintenance system"
        ],
        howTo: [
          "Bury unglazed clay pots near plant roots",
          "Leave neck of pot above ground",
          "Fill pots with water as needed",
          "Water seeps slowly through clay walls",
          "Refill pots regularly based on weather"
        ],
        season: "Growing season",
        difficulty: "Easy",
        icon: <Droplets className="h-5 w-5" />,
        image: "https://images.unsplash.com/photo-1716903282677-3a1b5c936b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wb3N0aW5nJTIwc29pbCUyMG9yZ2FuaWMlMjBmYXJtaW5nfGVufDF8fHx8MTc1ODEwOTQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ],
    pest: [
      {
        id: "beneficial-insects",
        title: "Beneficial Insect Gardens",
        description: "Creating habitats to attract natural predators that control pest populations.",
        origin: "Observed in traditional farming communities worldwide",
        benefits: [
          "Natural pest control without chemicals",
          "Supports biodiversity",
          "Pollination services",
          "Long-term ecological balance"
        ],
        howTo: [
          "Plant diverse flowering plants for nectar",
          "Include native plants that support local insects",
          "Provide shelter with small brush piles",
          "Avoid pesticides completely",
          "Create year-round habitat diversity"
        ],
        season: "Plant in spring, maintain year-round",
        difficulty: "Medium",
        icon: <Bug className="h-5 w-5" />,
        image: "https://images.unsplash.com/photo-1737960320564-9e681df95dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhcm1pbmclMjBvcmdhbmljJTIwY3JvcHN8ZW58MXx8fHwxNzU4MTA5NDgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        id: "trap-crops",
        title: "Trap Crop Strategy",
        description: "Using sacrificial crops to lure pests away from main crops.",
        origin: "Traditional knowledge from various cultures",
        benefits: [
          "Protects main crops from pest damage",
          "Reduces need for pesticides",
          "Concentrates pests for easier management",
          "Can provide additional harvest if managed well"
        ],
        howTo: [
          "Plant attractive 'trap' crops around main crops",
          "Choose plants pests prefer over main crop",
          "Plant trap crops slightly earlier",
          "Monitor and remove heavily infested trap plants",
          "Rotate trap crop varieties annually"
        ],
        season: "During growing season",
        difficulty: "Medium",
        icon: <Bug className="h-5 w-5" />,
        image: "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwcm90YXRpb24lMjBhZ3JpY3VsdHVyYWwlMjBmaWVsZHN8ZW58MXx8fHwxNzU4MTA5NDgzfDA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const TechniqueCard = ({ technique }: { technique: Technique }) => (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {technique.icon}
            <CardTitle className="text-lg">{technique.title}</CardTitle>
          </div>
          <Badge className={getDifficultyColor(technique.difficulty)}>
            {technique.difficulty}
          </Badge>
        </div>
        <CardDescription>{technique.description}</CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{technique.season}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImageWithFallback
          src={technique.image}
          alt={technique.title}
          className="w-full h-32 object-cover rounded-lg"
        />
        
        <div>
          <h4 className="font-semibold mb-2">Historical Origin</h4>
          <p className="text-sm text-muted-foreground">{technique.origin}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Benefits</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {technique.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">How to Implement</h4>
          <ol className="text-sm text-muted-foreground space-y-1">
            {technique.howTo.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="font-medium text-primary">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2>Traditional Farming Techniques</h2>
        <p className="text-muted-foreground">
          Discover time-tested methods that have sustained agriculture for centuries
        </p>
      </div>

      <Tabs defaultValue="soil" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="soil" className="flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            Soil Health
          </TabsTrigger>
          <TabsTrigger value="planting" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Planting
          </TabsTrigger>
          <TabsTrigger value="water" className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Water Management
          </TabsTrigger>
          <TabsTrigger value="pest" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Pest Control
          </TabsTrigger>
        </TabsList>

        {Object.entries(techniques).map(([category, categoryTechniques]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {categoryTechniques.map((technique) => (
                <TechniqueCard key={technique.id} technique={technique} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}