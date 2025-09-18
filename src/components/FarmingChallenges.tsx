import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { CheckCircle, Clock, Coins, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xpReward: number;
  coinReward: number;
  timeRequired: string;
  steps: string[];
  image: string;
  completed: boolean;
  traditionalMethod: string;
}

interface FarmingChallengesProps {
  onCompleteChallenge: (challengeId: string, xp: number, coins: number) => void;
}

export function FarmingChallenges({ onCompleteChallenge }: FarmingChallengesProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const challenges: Challenge[] = [
    {
      id: "crop-rotation",
      title: "Master Crop Rotation",
      description: "Learn the ancient practice of rotating crops to maintain soil health and prevent pests.",
      category: "Soil Health",
      difficulty: "Beginner",
      xpReward: 150,
      coinReward: 50,
      timeRequired: "2 weeks",
      steps: [
        "Study your current crop layout",
        "Plan a 4-season rotation cycle",
        "Plant nitrogen-fixing legumes in designated areas",
        "Document soil changes over time",
        "Harvest and evaluate results"
      ],
      image: "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwcm90YXRpb24lMjBhZ3JpY3VsdHVyYWwlMjBmaWVsZHN8ZW58MXx8fHwxNzU4MTA5NDgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      completed: false,
      traditionalMethod: "Used by ancient civilizations like the Romans and Native Americans"
    },
    {
      id: "companion-planting",
      title: "Three Sisters Planting",
      description: "Practice the Native American technique of growing corn, beans, and squash together.",
      category: "Plant Partnerships",
      difficulty: "Intermediate",
      xpReward: 200,
      coinReward: 75,
      timeRequired: "1 season",
      steps: [
        "Prepare raised mounds or hills",
        "Plant corn kernels in the center",
        "Wait 2 weeks, then plant beans around corn",
        "Plant squash at the base of the mound",
        "Monitor growth and symbiotic relationships",
        "Harvest in sequence as crops mature"
      ],
      image: "https://images.unsplash.com/photo-1542365775-6e6177a8e296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGZhcm1pbmclMjBtZXRob2RzJTIwYW5jaWVudCUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc1ODEwOTQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      completed: false,
      traditionalMethod: "Indigenous North American agricultural technique dating back 1000+ years"
    },
    {
      id: "natural-composting",
      title: "Traditional Composting",
      description: "Create rich soil amendments using ancient composting techniques.",
      category: "Soil Building",
      difficulty: "Beginner",
      xpReward: 100,
      coinReward: 30,
      timeRequired: "3 months",
      steps: [
        "Collect brown materials (dried leaves, straw)",
        "Gather green materials (vegetable scraps, grass clippings)",
        "Layer materials in 3:1 brown to green ratio",
        "Turn pile weekly for aeration",
        "Monitor temperature and moisture",
        "Apply finished compost to garden beds"
      ],
      image: "https://images.unsplash.com/photo-1716903282677-3a1b5c936b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wb3N0aW5nJTIwc29pbCUyMG9yZ2FuaWMlMjBmYXJtaW5nfGVufDF8fHx8MTc1ODEwOTQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      completed: false,
      traditionalMethod: "Practiced by ancient Chinese and Roman farmers"
    },
    {
      id: "seed-saving",
      title: "Heritage Seed Saving",
      description: "Learn to save and preserve heirloom varieties for future generations.",
      category: "Preservation",
      difficulty: "Advanced",
      xpReward: 300,
      coinReward: 100,
      timeRequired: "1 full season",
      steps: [
        "Select the best performing plants",
        "Allow seeds to fully mature on the plant",
        "Harvest seeds at optimal time",
        "Properly dry and clean seeds",
        "Store in cool, dry conditions",
        "Test germination rates",
        "Plant saved seeds next season"
      ],
      image: "https://images.unsplash.com/photo-1737960320564-9e681df95dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhcm1pbmclMjBvcmdhbmljJTIwY3JvcHN8ZW58MXx8fHwxNzU4MTA5NDgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      completed: false,
      traditionalMethod: "Essential practice for farmers throughout human history"
    }
  ];

  const handleStepComplete = (stepIndex: number) => {
    if (!selectedChallenge) return;
    
    const stepId = `${selectedChallenge.id}-${stepIndex}`;
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      
      // Check if all steps are completed
      const challengeStepIds = selectedChallenge.steps.map((_, i) => `${selectedChallenge.id}-${i}`);
      const challengeCompletedSteps = completedSteps.filter(step => step.startsWith(selectedChallenge.id));
      
      if (challengeCompletedSteps.length + 1 === selectedChallenge.steps.length) {
        // Challenge completed!
        onCompleteChallenge(selectedChallenge.id, selectedChallenge.xpReward, selectedChallenge.coinReward);
        setSelectedChallenge(null);
        setCompletedSteps([]);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedChallenge) {
    const challengeProgress = completedSteps.filter(step => 
      step.startsWith(selectedChallenge.id)
    ).length;
    const progressPercentage = (challengeProgress / selectedChallenge.steps.length) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedChallenge(null)}>
            ← Back to Challenges
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedChallenge.title}</CardTitle>
                <CardDescription className="mt-2">{selectedChallenge.description}</CardDescription>
                <div className="flex items-center gap-2 mt-4">
                  <Badge className={getDifficultyColor(selectedChallenge.difficulty)}>
                    {selectedChallenge.difficulty}
                  </Badge>
                  <Badge variant="outline">{selectedChallenge.category}</Badge>
                </div>
              </div>
              <ImageWithFallback
                src={selectedChallenge.image}
                alt={selectedChallenge.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Star className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
                <p className="font-semibold">{selectedChallenge.xpReward} XP</p>
              </div>
              <div>
                <Coins className="h-6 w-6 mx-auto mb-1 text-yellow-600" />
                <p className="font-semibold">{selectedChallenge.coinReward} Coins</p>
              </div>
              <div>
                <Clock className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                <p className="font-semibold">{selectedChallenge.timeRequired}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-2">Traditional Method</h4>
              <p className="text-muted-foreground">{selectedChallenge.traditionalMethod}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4>Progress ({challengeProgress}/{selectedChallenge.steps.length})</h4>
                <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="mb-4" />
            </div>

            <div className="space-y-3">
              <h4>Challenge Steps</h4>
              {selectedChallenge.steps.map((step, index) => {
                const stepId = `${selectedChallenge.id}-${index}`;
                const isCompleted = completedSteps.includes(stepId);
                
                return (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Button
                      variant={isCompleted ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStepComplete(index)}
                      disabled={isCompleted}
                      className="mt-0.5"
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : <span>{index + 1}</span>}
                    </Button>
                    <div className="flex-1">
                      <p className={isCompleted ? "line-through text-muted-foreground" : ""}>{step}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>Farming Challenges</h2>
        <p className="text-muted-foreground">Master traditional farming techniques through guided challenges</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="mb-2">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline">{challenge.category}</Badge>
                  </div>
                </div>
                <ImageWithFallback
                  src={challenge.image}
                  alt={challenge.title}
                  className="w-16 h-16 object-cover rounded-lg ml-4"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {challenge.xpReward} XP
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="h-4 w-4" />
                    {challenge.coinReward}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {challenge.timeRequired}
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => setSelectedChallenge(challenge)}
                disabled={challenge.completed}
              >
                {challenge.completed ? "Completed" : "Start Challenge"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}