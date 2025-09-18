import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Camera, Heart, MessageCircle, Share2, Upload, Award, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface FarmPost {
  id: string;
  userId: string;
  userName: string;
  userLevel: number;
  title: string;
  description: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  category: 'traditional' | 'organic' | 'water-saving' | 'soil-health' | 'pest-control';
  timestamp: Date;
  isLiked: boolean;
  tags: string[];
}

interface KnowledgeHubProps {
  language?: string;
}

const hubTranslations = {
  en: {
    title: "Kisan-Go Pro Knowledge Hub",
    subtitle: "Share sustainable farming experiences and learn from the community",
    shareKnowledge: "Share Your Knowledge",
    uploadPhoto: "Upload Photo",
    farmTitle: "Farm Practice Title",
    description: "Describe your farming method or observation",
    category: "Category",
    traditional: "Traditional Methods",
    organic: "Organic Farming",
    waterSaving: "Water Conservation",
    soilHealth: "Soil Health",
    pestControl: "Pest Control",
    tags: "Tags (comma separated)",
    sharePost: "Share Post",
    trendingPosts: "Trending Posts",
    recentPosts: "Recent Posts",
    bestPractices: "Best Practices",
    likes: "likes",
    comments: "comments",
    like: "Like",
    comment: "Comment",
    share: "Share"
  },
  hi: {
    title: "किसान-गो प्रो ज्ञान केंद्र",
    subtitle: "स्थायी कृषि अनुभव साझा करें और समुदाय से सीखें",
    shareKnowledge: "अपना ज्ञान साझा करें",
    uploadPhoto: "फोटो अपलोड करें",
    farmTitle: "कृषि प्रथा शीर्षक",
    description: "अपनी कृषि विधि या अवलोकन का वर्णन करें",
    category: "श्रेणी",
    traditional: "पारंपरिक विधियां",
    organic: "जैविक खेती",
    waterSaving: "जल संरक्षण",
    soilHealth: "मिट्टी स्वास्थ्य",
    pestControl: "कीट नियंत्रण",
    tags: "टैग (अल्पविराम से अलग)",
    sharePost: "पोस्ट साझा करें",
    trendingPosts: "लोकप्रिय पोस्ट",
    recentPosts: "नवीनतम पोस्ट",
    bestPractices: "सर्वोत्तम प्रथाएं",
    likes: "पसंद",
    comments: "टिप्पणी",
    like: "पसंद",
    comment: "टिप्पणी",
    share: "साझा करें"
  },
  ta: {
    title: "அறிவு பகிர்வு மையம்",
    subtitle: "உங்கள் விவசாய அனுபவங்களைப் பகிர்ந்து மற்றவர்களிடமிருந்து கற்றுக்கொள்ளுங்கள்",
    shareKnowledge: "உங்கள் அறிவைப் பகிருங்கள்",
    uploadPhoto: "புகைப்படம் பதிவேற்றுக",
    farmTitle: "விவசாய நடைமுறை தலைப்பு",
    description: "உங்கள் விவசாய முறை அல்லது கவனிப்பை விவரிக்கவும்",
    category: "வகை",
    traditional: "பாரம்பரிய முறைகள்",
    organic: "இயற்கை விவசாயம்",
    waterSaving: "நீர் சேமிப்பு",
    soilHealth: "மண் ஆரோக்கியம்",
    pestControl: "பூச்சி கட்டுப்பாடு",
    tags: "குறிச்சொற்கள் (கமாவால் பிரிக்கப்பட்டது)",
    sharePost: "பகிர்வு இடுகை",
    trendingPosts: "பிரபலமான பதிவுகள்",
    recentPosts: "சமீபத்திய பதிவுகள்",
    bestPractices: "சிறந்த நடைமுறைகள்",
    likes: "விருப்பங்கள்",
    comments: "கருத்துகள்",
    like: "விருப்பம்",
    comment: "கருத்து",
    share: "பகிர்"
  },
  te: {
    title: "జ్ఞాన భాగస్వామ్య కేంద్రం",
    subtitle: "మీ వ్యవసాయ అనుభవాలను పంచుకోండి మరియు ఇతరుల నుండి నేర్చుకోండి",
    shareKnowledge: "మీ జ్ఞానాన్ని పంచుకోండి",
    uploadPhoto: "ఫోటో అప్‌లోడ్ చేయండి",
    farmTitle: "వ్యవసాయ అభ్యాస శీర్షిక",
    description: "మీ వ్యవసాయ పద్ధతి లేదా పరిశీలనను వివరించండి",
    category: "వర్గం",
    traditional: "సాంప్రదాయ పద్ధతులు",
    organic: "సేంద్రీయ వ్యవసాయం",
    waterSaving: "నీటి పరిరక్షణ",
    soilHealth: "నేల ఆరోగ్యం",
    pestControl: "కీటకాల నియంత్రణ",
    tags: "ట్యాగ్‌లు (కామాతో వేరు చేయబడిన)",
    sharePost: "పోస్ట్ భాగస్వామ్యం",
    trendingPosts: "ట్రెండింగ్ పోస్ట్‌లు",
    recentPosts: "ఇటీవలి పోస్ట్‌లు",
    bestPractices: "ఉత్తమ అభ్యాసాలు",
    likes: "ఇష్టాలు",
    comments: "వ్యాఖ్యలు",
    like: "ఇష్టం",
    comment: "వ్యాఖ్య",
    share: "భాగస్వామ్యం"
  },
  kn: {
    title: "ಜ್ಞಾನ ಹಂಚಿಕೆ ಕೇಂದ್ರ",
    subtitle: "ನಿಮ್ಮ ಕೃಷಿ ಅನುಭವಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ಇತರರಿಂದ ಕಲಿಯಿರಿ",
    shareKnowledge: "ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ",
    uploadPhoto: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    farmTitle: "ಕೃಷಿ ಅಭ್ಯಾಸ ಶೀರ್ಷಿಕೆ",
    description: "ನಿಮ್ಮ ಕೃಷಿ ವಿಧಾನ ಅಥವಾ ಅವಲೋಕನವನ್ನು ವಿವರಿಸಿ",
    category: "ವರ್ಗ",
    traditional: "ಸಾಂಪ್ರದಾಯಿಕ ವಿಧಾನಗಳು",
    organic: "ಸಾವಯವ ಕೃಷಿ",
    waterSaving: "ನೀರಿನ ಸಂರಕ್ಷಣೆ",
    soilHealth: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
    pestControl: "ಕೀಟ ನಿಯಂತ್ರಣ",
    tags: "ಟ್ಯಾಗ್‌ಗಳು (ಕಾಮಾದಿಂದ ಬೇರ್ಪಡಿಸಲಾಗಿದೆ)",
    sharePost: "ಪೋಸ್ಟ್ ಹಂಚಿಕೊಳ್ಳಿ",
    trendingPosts: "ಟ್ರೆಂಡಿಂಗ್ ಪೋಸ್ಟ್‌ಗಳು",
    recentPosts: "ಇತ್ತೀಚಿನ ಪೋಸ್ಟ್‌ಗಳು",
    bestPractices: "ಉತ್ತಮ ಅಭ್ಯಾಸಗಳು",
    likes: "ಇಷ್ಟಗಳು",
    comments: "ಕಾಮೆಂಟ್‌ಗಳು",
    like: "ಇಷ್ಟ",
    comment: "ಕಾಮೆಂಟ್",
    share: "ಹಂಚಿಕೊಳ್ಳಿ"
  },
  ml: {
    title: "അറിവ് പങ്കിടൽ കേന്ദ്രം",
    subtitle: "നിങ്ങളുടെ കൃഷി അനുഭവങ്ങൾ പങ്കിടുകയും മറ്റുള്ളവരിൽ നിന്ന് പഠിക്കുകയും ചെയ്യുക",
    shareKnowledge: "നിങ്ങളുടെ അറിവ് പങ്കിടുക",
    uploadPhoto: "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
    farmTitle: "കാർഷിക പ്രാക്ടീസ് ശീർഷകം",
    description: "നിങ്ങളുടെ കാർഷിക രീതി അല്ലെങ്കിൽ നിരീക്ഷണം വിവരിക്കുക",
    category: "വിഭാഗം",
    traditional: "പരമ്പരാഗത രീതികൾ",
    organic: "ജൈവിക കൃഷി",
    waterSaving: "ജല സംരക്ഷണം",
    soilHealth: "മണ്ണിന്റെ ആരോഗ്യം",
    pestControl: "കീട നിയന്ത്രണം",
    tags: "ടാഗുകൾ (കോമ ഉപയോഗിച്ച് വേർതിരിച്ചത്)",
    sharePost: "പോസ്റ്റ് പങ്കിടുക",
    trendingPosts: "ട്രെൻഡിംഗ് പോസ്റ്റുകൾ",
    recentPosts: "സമീപകാല പോസ്റ്റുകൾ",
    bestPractices: "മികച്ച സമ്പ്രദായങ്ങൾ",
    likes: "ലൈക്കുകൾ",
    comments: "കമന്റുകൾ",
    like: "ലൈക്ക്",
    comment: "കമന്റ്",
    share: "പങ്കിടുക"
  }
};

function ht(key: string, language: string): string {
  return (hubTranslations as any)[language]?.[key] || (hubTranslations as any)['en'][key] || key;
}

// Sample farm posts data
const samplePosts: FarmPost[] = [
  {
    id: '1',
    userId: 'farmer1',
    userName: 'Rajesh Kumar',
    userLevel: 12,
    title: 'Traditional Water Harvesting Success',
    description: 'Implemented ancient tank irrigation system. Saved 40% water and increased yield by 25%.',
    likes: 34,
    comments: 12,
    category: 'water-saving',
    timestamp: new Date('2024-01-15'),
    isLiked: false,
    tags: ['water-conservation', 'traditional', 'tank-irrigation']
  },
  {
    id: '2',
    userId: 'farmer2',
    userName: 'Priya Sharma',
    userLevel: 8,
    title: 'Neem Oil Pest Control Recipe',
    description: 'Mix neem oil with soap water. Spray early morning. Reduced pest damage by 80% in tomatoes.',
    likes: 56,
    comments: 23,
    category: 'pest-control',
    timestamp: new Date('2024-01-14'),
    isLiked: true,
    tags: ['organic', 'neem', 'pest-control', 'tomatoes']
  },
  {
    id: '3',
    userId: 'farmer3',
    userName: 'Murugan A',
    userLevel: 15,
    title: 'Companion Planting with Three Sisters',
    description: 'Growing corn, beans, and squash together. Beans fix nitrogen, corn provides support, squash covers soil.',
    likes: 78,
    comments: 31,
    category: 'traditional',
    timestamp: new Date('2024-01-13'),
    isLiked: false,
    tags: ['companion-planting', 'traditional', 'nitrogen-fixing']
  }
];

export function KnowledgeHub({ language = 'en' }: KnowledgeHubProps) {
  const [posts, setPosts] = useState<FarmPost[]>(samplePosts);
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'best'>('trending');
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    category: 'traditional' as const,
    tags: ''
  });

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSubmitPost = () => {
    if (!newPost.title || !newPost.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const post: FarmPost = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      userLevel: 5,
      title: newPost.title,
      description: newPost.description,
      likes: 0,
      comments: 0,
      category: newPost.category,
      timestamp: new Date(),
      isLiked: false,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', description: '', category: 'traditional', tags: '' });
    toast.success('Your farming knowledge has been shared! 🌱');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'traditional': return 'bg-orange-100 text-orange-700';
      case 'organic': return 'bg-green-100 text-green-700';
      case 'water-saving': return 'bg-blue-100 text-blue-700';
      case 'soil-health': return 'bg-yellow-100 text-yellow-700';
      case 'pest-control': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const sortedPosts = posts.sort((a, b) => {
    switch (activeTab) {
      case 'trending': return b.likes - a.likes;
      case 'recent': return b.timestamp.getTime() - a.timestamp.getTime();
      case 'best': return (b.likes + b.comments) - (a.likes + a.comments);
      default: return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          {ht('title', language)}
        </h2>
        <p className="text-muted-foreground mt-2">
          {ht('subtitle', language)}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Share Knowledge Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-500" />
              {ht('shareKnowledge', language)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              {ht('uploadPhoto', language)}
            </Button>
            
            <Input
              placeholder={ht('farmTitle', language)}
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            
            <Textarea
              placeholder={ht('description', language)}
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              rows={4}
            />
            
            <select 
              className="w-full p-2 border rounded-md"
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value as any })}
            >
              <option value="traditional">{ht('traditional', language)}</option>
              <option value="organic">{ht('organic', language)}</option>
              <option value="water-saving">{ht('waterSaving', language)}</option>
              <option value="soil-health">{ht('soilHealth', language)}</option>
              <option value="pest-control">{ht('pestControl', language)}</option>
            </select>
            
            <Input
              placeholder={ht('tags', language)}
              value={newPost.tags}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
            />
            
            <Button onClick={handleSubmitPost} className="w-full bg-gradient-to-r from-green-500 to-blue-500">
              <Share2 className="h-4 w-4 mr-2" />
              {ht('sharePost', language)}
            </Button>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'trending', label: ht('trendingPosts', language), icon: TrendingUp },
              { id: 'recent', label: ht('recentPosts', language), icon: Users },
              { id: 'best', label: ht('bestPractices', language), icon: Award }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? "default" : "outline"}
                onClick={() => setActiveTab(id as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {sortedPosts.map((post) => (
              <Card key={post.id} className="transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{post.userName}</h4>
                          <Badge variant="secondary" className="text-xs">
                            Level {post.userLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {post.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(post.category)}>
                      {ht(post.category, language)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-gray-700">{post.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1 ${post.isLiked ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes} {ht('likes', language)}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments} {ht('comments', language)}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}