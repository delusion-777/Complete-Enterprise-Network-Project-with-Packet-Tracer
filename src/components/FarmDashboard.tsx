import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Leaf, Trophy, Target, Coins, Users, Droplets, Trees, Zap, Award, TrendingUp, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface FarmDashboardProps {
  playerStats: {
    level: number;
    experience: number;
    coins: number;
    completedChallenges: number;
    achievements: string[];
  };
  language?: string;
}

interface KnowledgeCard {
  id: string;
  title: string;
  fact: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
}

// Knowledge cards database
const knowledgeCards: KnowledgeCard[] = [
  {
    id: 'tank-irrigation',
    title: 'Tank Irrigation',
    fact: 'Ancient Indian farmers used tank irrigation systems to store rainwater for dry seasons.',
    category: 'Water Management',
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'terrace-farming',
    title: 'Terrace Farming',
    fact: 'Terrace farming was invented to stop soil erosion in hilly areas and maximize arable land.',
    category: 'Soil Conservation',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'companion-planting',
    title: 'Three Sisters',
    fact: 'Corn, beans, and squash grown together create a perfect symbiotic relationship.',
    category: 'Crop Management',
    rarity: 'epic',
    unlocked: false
  },
  {
    id: 'organic-pest-control',
    title: 'Neem Protection',
    fact: 'Neem oil naturally repels over 200 species of insects without harming beneficial ones.',
    category: 'Pest Control',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'soil-microbes',
    title: 'Living Soil',
    fact: 'One teaspoon of soil contains more microorganisms than there are people on Earth.',
    category: 'Soil Health',
    rarity: 'legendary',
    unlocked: false
  }
];

export function FarmDashboard({ playerStats, language = 'en' }: FarmDashboardProps) {
  const expToNextLevel = 1000;
  const progressPercentage = (playerStats.experience / expToNextLevel) * 100;
  const [unlockedCards, setUnlockedCards] = useState<KnowledgeCard[]>([]);
  const [showKnowledgeCard, setShowKnowledgeCard] = useState<KnowledgeCard | null>(null);

  // Mock impact data - this would come from game state
  const impactData = {
    waterSaved: 234,
    co2Reduced: 45,
    treesPlanted: 12,
    soilImproved: 78
  };

  const ecoTitle = playerStats.level < 5 ? "Eco Rookie" : 
                   playerStats.level < 15 ? "Green Guardian" : "Planet Hero";

  return (
    <div className="space-y-6">
      {/* Full Background Hero Section */}
      <div className="relative rounded-2xl overflow-hidden min-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-orange-400">
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            {/* Decorative farm elements */}
            <div className="absolute top-20 left-10 text-white/30 text-6xl">🌾</div>
            <div className="absolute top-32 right-20 text-white/30 text-4xl">🌱</div>
            <div className="absolute bottom-20 left-20 text-white/30 text-5xl">🌿</div>
            <div className="absolute bottom-32 right-10 text-white/30 text-3xl">🍃</div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/20">
          <div className="p-8 md:p-12 h-full flex flex-col justify-center max-w-3xl">
            <div className="text-white space-y-6">
              <Badge className="bg-orange-medium/90 text-white border-none w-fit text-sm px-4 py-2">
                {ecoTitle}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Kisan-Go Pro
              </h1>
              <p className="text-2xl md:text-3xl opacity-90 font-medium">Smart Sustainable Agriculture Platform</p>
              <p className="text-lg md:text-xl opacity-85 max-w-2xl leading-relaxed">
                Empowering farmers with traditional wisdom and modern technology for sustainable agriculture practices that protect our planet
              </p>
              <div className="flex flex-wrap items-center gap-8 text-base">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6" />
                  <span>Traditional Knowledge</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6" />
                  <span>Sustainable Future</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6" />
                  <span>Smart Technology</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-semibold">{playerStats.level}</p>
            <p className="text-sm text-muted-foreground">Farm Level</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Coins className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-semibold">{playerStats.coins}</p>
            <p className="text-sm text-muted-foreground">Farm Coins</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-semibold">{playerStats.completedChallenges}</p>
            <p className="text-sm text-muted-foreground">Challenges</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Leaf className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-semibold">{playerStats.achievements.length}</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Experience Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Experience Progress</CardTitle>
          <CardDescription>
            {playerStats.experience} / {expToNextLevel} XP to reach Level {playerStats.level + 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="w-full" />
        </CardContent>
      </Card>

      {/* Impact Tracker Dashboard */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Impact Tracker
            </CardTitle>
            <CardDescription>Your positive environmental impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-blue-600">{impactData.waterSaved}L</p>
                <p className="text-xs text-muted-foreground">Water Saved</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Trees className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-green-600">{impactData.treesPlanted}</p>
                <p className="text-xs text-muted-foreground">Trees Planted</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Zap className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold text-purple-600">{impactData.co2Reduced}kg</p>
                <p className="text-xs text-muted-foreground">CO₂ Reduced</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Award className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold text-orange-600">{impactData.soilImproved}%</p>
                <p className="text-xs text-muted-foreground">Soil Health</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Knowledge Cards Collection
            </CardTitle>
            <CardDescription>Unlockable farming wisdom cards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {knowledgeCards.slice(0, 6).map((card, index) => (
                <div
                  key={card.id}
                  className={`aspect-square rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                    unlockedCards.some(c => c.id === card.id)
                      ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                  onClick={() => unlockedCards.some(c => c.id === card.id) && setShowKnowledgeCard(card)}
                >
                  <div className="h-full flex flex-col items-center justify-center p-2">
                    {unlockedCards.some(c => c.id === card.id) ? (
                      <>
                        <Award className="h-6 w-6 text-yellow-600 mb-1" />
                        <p className="text-xs font-medium text-center leading-tight">{card.category}</p>
                      </>
                    ) : (
                      <>
                        <div className="h-6 w-6 bg-gray-300 rounded mb-1"></div>
                        <p className="text-xs text-gray-400">???</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => setUnlockedCards([knowledgeCards[0]])}
            >
              Unlock Sample Card
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Your latest farming milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {playerStats.achievements.length > 0 ? (
              playerStats.achievements.slice(-3).map((achievement, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  {achievement}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground">Complete challenges to earn achievements!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Card Modal */}
      {showKnowledgeCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-yellow-800">{showKnowledgeCard.title}</CardTitle>
              <Badge className={`w-fit mx-auto ${
                showKnowledgeCard.rarity === 'legendary' ? 'bg-purple-500' :
                showKnowledgeCard.rarity === 'epic' ? 'bg-purple-400' :
                showKnowledgeCard.rarity === 'rare' ? 'bg-blue-400' : 'bg-green-400'
              }`}>
                {showKnowledgeCard.rarity}
              </Badge>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">{showKnowledgeCard.category}</p>
              <p className="text-gray-700 font-medium">"{showKnowledgeCard.fact}"</p>
              <Button 
                onClick={() => setShowKnowledgeCard(null)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                Awesome! 🌟
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}