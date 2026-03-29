import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, BookOpen, CheckCircle2, Clock, Plus, Search,
  TrendingUp, MoreVertical, ChevronRight, BrainCircuit, Code2,
  Database, Globe, Star, Users, Play, ExternalLink, Youtube,
  Twitter, ChevronDown, ChevronUp, Flame, Zap, X,
  Home, Bot, User, Terminal, Bell, Settings, Sparkles,
  ArrowLeft, HelpCircle, Globe2, FileText, Quote, MessageSquare,
  RefreshCw, Loader2, AlertCircle, Rss,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Config ──────────────────────────────────────────────────────────────
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

// ── Types ──────────────────────────────────────────────────────────────
interface Resource {
  id: string; title: string;
  category: 'Fundamentals' | 'NLP' | 'Computer Vision' | 'MLOps' | 'Ethics';
  status: 'Not Started' | 'In Progress' | 'Completed';
  rating: number; lastAccessed: string; description: string;
  links?: { url: string; type: string }[];
  stage?: string;
}

interface YoutubeVideo {
  id: string; title: string; duration: string;
  views: string; publishedAt: string; thumbnail: string;
}

interface XPost {
  id: string; content: string;
  likes: string; retweets: string; publishedAt: string;
  url: string;
}

interface AIMaster {
  id: string; name: string; handle: string;
  avatar: string; avatarColor: string;
  role: string; company: string; followers: string;
  tags: string[]; bio: string;
  youtubeChannelId?: string;
  twitterHandle?: string;
  videos: YoutubeVideo[];
  posts: XPost[];
  loadingVideos?: boolean;
  loadingPosts?: boolean;
  errorVideos?: string | null;
  errorPosts?: string | null;
}

type Page = 'dashboard' | 'resources' | 'masters' | 'progress' | 'datasets' | 'projects';

// ── AI Masters with Channel IDs ─────────────────────────────────────────
const AI_MASTERS: AIMaster[] = [
  // YouTube 频道
  {
    id:'andrej', name:'Andrej Karpathy', handle:'@karpathy',
    avatar:'AK', avatarColor:'from-orange-500 to-red-600',
    role:'前特斯拉AI负责人', company:'Tesla / OpenAI',
    followers:'890K', tags:['LLMs','Neural Nets','PyTorch'],
    bio:'前特斯拉AI负责人,顶级AI导师。Building neural networks from scratch, explaining AI fundamentals with unmatched clarity.',
    youtubeChannelId:'UCXUPKJOoM5L6O9S5JFZIkQw',
    twitterHandle:'karpathy',
    videos:[], posts:[],
  },
  {
    id:'lex', name:'Lex Fridman', handle:'@lexfridman',
    avatar:'LF', avatarColor:'from-gray-600 to-gray-900',
    role:'AI研究者 & 播客主持人', company:'MIT / Independent',
    followers:'4.1M', tags:['Interviews','Deep Learning','Philosophy'],
    bio:'知名AI访谈主持人,深度对话领袖。',
    youtubeChannelId:'UCSHZxQ5L7IuvZQqS9T9Carg',
    twitterHandle:'lexfridman',
    videos:[], posts:[],
  },
  {
    id:'twominute', name:'Two Minute Papers', handle:'@TwoMinutePapers',
    avatar:'TM', avatarColor:'from-blue-500 to-cyan-600',
    role:'AI研究传播者', company:'Independent',
    followers:'1.7M', tags:['Research','AI News','Computer Vision'],
    bio:'2分钟带你看懂最前沿AI论文。',
    youtubeChannelId:'UCbfYPyIT5T46Z2R卫国自选区',
    twitterHandle:'karoly_zsolnai',
    videos:[], posts:[],
  },
  {
    id:'matt-wolfe', name:'Matt Wolfe', handle:'@mreflow',
    avatar:'MW', avatarColor:'from-yellow-600 to-orange-600',
    role:'AI工具实测专家', company:'Independent',
    followers:'850K', tags:['Tools Review','AI News','Practical'],
    bio:'AI工具实测与每日新闻拆解。',
    youtubeChannelId:'UCKl4w_DVJr-Q6KMhxvZHUpg',
    videos:[], posts:[],
  },
  {
    id:'wes-roth', name:'Wes Roth', handle:'@WesRoth',
    avatar:'WR', avatarColor:'from-teal-600 to-cyan-700',
    role:'AI产业分析师', company:'Independent',
    followers:'420K', tags:['Industry Analysis','Future Trends','Deep Dives'],
    bio:'深度分析AI产业格局与未来预测。',
    youtubeChannelId:'UCcD8wn4K1cXoO0NlA0V6H4w',
    videos:[], posts:[],
  },
  {
    id:'sebastian', name:'Sebastian Raschka', handle:'@SebastianRaschka',
    avatar:'SR', avatarColor:'from-indigo-600 to-blue-700',
    role:'LLM架构专家', company:'Independent / Lightning AI',
    followers:'380K', tags:['LLM','Open Source','Architecture'],
    bio:'硬核开源模型与LLM架构教学。',
    youtubeChannelId:'UCXUPKJOoM5L6O9S5JFZIkQw',
    videos:[], posts:[],
  },
  {
    id:'jeremy', name:'Jeremy Howard', handle:'@howardjeremy',
    avatar:'JH', avatarColor:'from-green-700 to-teal-800',
    role:'fast.ai创始人', company:'fast.ai',
    followers:'520K', tags:['Practical ML','Education','PyTorch'],
    bio:'fast.ai创始人,实战派AI大师。',
    youtubeChannelId:'UC7-c08hMUjF-4Bj9U9SjQSQ',
    videos:[], posts:[],
  },
  {
    id:'yannic', name:'Yannic Kilcher', handle:'@ykilcher',
    avatar:'YK', avatarColor:'from-purple-500 to-indigo-600',
    role:'AI研究者 & 教育家', company:'Independent',
    followers:'470K', tags:['Papers','Research','Deep Learning'],
    bio:'Deep dives into the latest AI research papers.',
    youtubeChannelId:'UCZM8wN-uLbgz0t3tnuM47Rw',
    twitterHandle:'ykilcher',
    videos:[], posts:[],
  },
  // X/Twitter 为主
  {
    id:'andrew-ng', name:'Andrew Ng (吴恩达)', handle:'@AndrewYNg',
    avatar:'AN', avatarColor:'from-blue-600 to-indigo-700',
    role:'AI教育泰斗', company:'DeepLearning.ai / Coursera',
    followers:'1.1M', tags:['AI Education','Deep Learning','Coursera'],
    bio:'AI教育泰斗,DeepLearning.ai创始人。全球最知名的AI教育者,开创了在线AI教育的先河。',
    twitterHandle:'AndrewYNg',
    videos:[], posts:[],
  },
  {
    id:'sam-altman', name:'Sam Altman', handle:'@sama',
    avatar:'SA', avatarColor:'from-gray-700 to-slate-900',
    role:'OpenAI首席执行官', company:'OpenAI',
    followers:'3.2M', tags:['OpenAI','ChatGPT','AGI'],
    bio:'OpenAI首席执行官。领导开发ChatGPT和GPT系列模型。',
    twitterHandle:'sama',
    videos:[], posts:[],
  },
  {
    id:'yann-lecun', name:'Yann LeCun', handle:'@ylecun',
    avatar:'YL', avatarColor:'from-blue-700 to-cyan-800',
    role:'Meta首席AI科学家', company:'Meta AI',
    followers:'680K', tags:['Computer Vision','CNN','Turing Award'],
    bio:'Meta首席AI科学家,图灵奖得主。卷积神经网络(CNN)之父。',
    twitterHandle:'ylecun',
    videos:[], posts:[],
  },
  {
    id:'ilya', name:'Ilya Sutskever', handle:'@ilyasut',
    avatar:'IS', avatarColor:'from-emerald-600 to-teal-700',
    role:'OpenAI联合创始人', company:'OpenAI (前首席科学家)',
    followers:'320K', tags:['Deep Learning','GPT','Research'],
    bio:'OpenAI联合创始人,前首席科学家。深度学习领域的先驱者之一。',
    twitterHandle:'ilyasut',
    videos:[], posts:[],
  },
  {
    id:'jim-fan', name:'Jim Fan', handle:'@DrJimFan',
    avatar:'JF', avatarColor:'from-green-600 to-emerald-700',
    role:'NVIDIA资深科学家', company:'NVIDIA',
    followers:'280K', tags:['具身智能','Robotics','AGI'],
    bio:'NVIDIA资深科学家,通用具身智能专家。',
    twitterHandle:'DrJimFan',
    videos:[], posts:[],
  },
  {
    id:'rowan', name:'Rowan Cheung', handle:'@rowancheung',
    avatar:'RC', avatarColor:'from-purple-600 to-pink-600',
    role:'AI资讯专家', company:'The Rundown AI',
    followers:'560K', tags:['AI News','Trends','Tools'],
    bio:'The Rundown AI创始人,每日为50万+订阅者提供最新AI动态。',
    twitterHandle:'rowancheung',
    videos:[], posts:[],
  },
];

// ── YouTube API ──────────────────────────────────────────────────────────────
async function fetchYouTubeVideos(channelId: string): Promise<YoutubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6&type=video`
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    return (data.items || []).map((item: any) => ({
      id: item.id.videoId || item.id,
      title: item.snippet.title,
      duration: '',
      views: '',
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('zh-CN'),
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
    }));
  } catch (e) {
    console.error('YouTube API error:', e);
    return [];
  }
}

// ── X (Twitter) RSS via Nitter ──────────────────────────────────────────────
async function fetchXRss(handle: string): Promise<XPost[]> {
  try {
    // 使用 nitter.net RSS feed
    const response = await fetch(`https://nitter.net/${handle}/rss`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');
    const items = doc.querySelectorAll('item');

    return Array.from(items).slice(0, 5).map((item, idx) => {
      const title = item.querySelector('title')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';

      // 从标题提取内容（去掉 "@handle - " 前缀）
      const content = title.replace(new RegExp(`^@${handle}\\s*[-:]?\\s*`), '');

      return {
        id: String(idx),
        content,
        likes: '',
        retweets: '',
        publishedAt: pubDate ? new Date(pubDate).toLocaleDateString('zh-CN') : '',
        url: link || `https://twitter.com/${handle}`,
      };
    });
  } catch (e) {
    console.error('X RSS error:', e);
    return [];
  }
}

// ── App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [masters, setMasters] = useState<AIMaster[]>(AI_MASTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all'|'in-progress'|'completed'>('all');
  const [expandedId, setExpandedId] = useState<string|null>(null);
  const [playingVideo, setPlayingVideo] = useState<{videoId:string;title:string}|null>(null);

  const fetchMasterData = useCallback(async (masterId: string) => {
    const master = AI_MASTERS.find(m => m.id === masterId);
    if (!master) return;

    // 获取 YouTube 视频
    if (master.youtubeChannelId && !masters.find(m => m.id === masterId)?.videos.length) {
      setMasters(prev => prev.map(m =>
        m.id === masterId ? { ...m, loadingVideos: true } : m
      ));
      const videos = await fetchYouTubeVideos(master.youtubeChannelId);
      setMasters(prev => prev.map(m =>
        m.id === masterId ? { ...m, videos, loadingVideos: false, errorVideos: videos.length === 0 ? '暂无视频' : null } : m
      ));
    }

    // 获取 X RSS
    if (master.twitterHandle && !masters.find(m => m.id === masterId)?.posts.length) {
      setMasters(prev => prev.map(m =>
        m.id === masterId ? { ...m, loadingPosts: true } : m
      ));
      const posts = await fetchXRss(master.twitterHandle);
      setMasters(prev => prev.map(m =>
        m.id === masterId ? { ...m, posts, loadingPosts: false, errorPosts: posts.length === 0 ? '暂无推文' : null } : m
      ));
    }
  }, [masters]);

  useEffect(() => {
    if (expandedId) {
      fetchMasterData(expandedId);
    }
  }, [expandedId]);

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'in-progress' && res.status === 'In Progress') || (activeTab === 'completed' && res.status === 'Completed');
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: resources.length,
    completed: resources.filter(r => r.status === 'Completed').length,
    inProgress: resources.filter(r => r.status === 'In Progress').length,
    avgRating: (resources.reduce((acc, r) => acc + r.rating, 0) / (resources.filter(r => r.rating > 0).length || 1)).toFixed(1),
  };

  const toggleResourceStatus = (id: string) => {
    setResources(prev => prev.map(res => {
      if (res.id === id) {
        return {
          ...res,
          status: res.status === 'Completed' ? 'Not Started' : 'Completed',
          lastAccessed: res.status === 'Completed' ? '-' : new Date().toISOString().split('T')[0]
        };
      }
      return res;
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 hidden lg:flex flex-col z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><BrainCircuit size={24} /></div>
          <h1 className="font-bold text-xl tracking-tight">AI Tracker</h1>
        </div>
        <nav className="space-y-1.5">
          <NavItem icon={<Home size={20}/>} label="首页" active={page==='dashboard'} onClick={()=>setPage('dashboard')}/>
          <NavItem icon={<BookOpen size={20}/>} label="资源库" active={page==='resources'} onClick={()=>setPage('resources')}/>
          <NavItem icon={<Users size={20}/>} label="AI 大神" active={page==='masters'} onClick={()=>setPage('masters')} badge={AI_MASTERS.length}/>
          <NavItem icon={<TrendingUp size={20}/>} label="学习进度" active={page==='progress'} onClick={()=>setPage('progress')}/>
          <NavItem icon={<Database size={20}/>} label="数据集" active={page==='datasets'} onClick={()=>setPage('datasets')}/>
          <NavItem icon={<Code2 size={20}/>} label="项目" active={page==='projects'} onClick={()=>setPage('projects')}/>
        </nav>
        <div className="mt-auto">
          <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Daily Goal</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{stats.completed}/{stats.total} Resources</span>
              <span className="text-sm text-indigo-600 font-bold">{Math.round((stats.completed/stats.total)*100)}%</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-1.5">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{width: `${(stats.completed/stats.total)*100}%`}}/>
            </div>
          </div>
        </div>
      </aside>

      <main className="lg:ml-64 p-4 md:p-8 lg:p-12">
        <AnimatePresence mode="wait">
          {page === 'dashboard' && <DashboardPage key="dashboard" stats={stats} resources={resources} searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeTab={activeTab} setActiveTab={setActiveTab} filteredResources={filteredResources} onToggleStatus={toggleResourceStatus} />}
          {page === 'resources' && <ResourcesPage key="resources" resources={resources} searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeTab={activeTab} setActiveTab={setActiveTab} filteredResources={filteredResources} onToggleStatus={toggleResourceStatus} />}
          {page === 'masters' && <motion.div key="masters" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.2}}><AIMastersPage masters={masters} expandedId={expandedId} setExpandedId={setExpandedId} playingVideo={playingVideo} setPlayingVideo={setPlayingVideo} /></motion.div>}
          {page === 'progress' && <ProgressPage key="progress" stats={stats} resources={resources} />}
          {page === 'datasets' && <DatasetsPage key="datasets" />}
          {page === 'projects' && <ProjectsPage key="projects" />}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {playingVideo && <VideoModal videoId={playingVideo.videoId} title={playingVideo.title} onClose={() => setPlayingVideo(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Dashboard Page ─────────────────────────────────────────────────────
function DashboardPage({ stats, resources, searchQuery, setSearchQuery, activeTab, setActiveTab, filteredResources, onToggleStatus }: {
  stats: any; resources: Resource[]; searchQuery: string; setSearchQuery: (s: string) => void;
  activeTab: string; setActiveTab: (s: any) => void; filteredResources: Resource[];
  onToggleStatus: (id: string) => void;
}) {
  const currentItem = resources.find(r => r.status === 'In Progress') || resources[0];

  return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.2}}>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">欢迎回来，学习者</h2>
          <p className="text-gray-500">本周已学习 {stats.completed} 个资源，继续加油！</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200">
          <Plus size={20}/>添加资源
        </button>
      </header>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white mb-10 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-4 inline-block">{currentItem?.stage || '基础'}</span>
            <h3 className="text-2xl font-bold mb-2">{currentItem?.title}</h3>
            <p className="text-white/80 max-w-lg">{currentItem?.description}</p>
            {currentItem?.links?.[0] && <a href={currentItem.links[0].url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"><ExternalLink size={14}/>打开资源</a>}
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-white/20" cx="50%" cy="50%" r="42" fill="transparent" stroke="currentColor" strokeWidth="8"/>
              <circle className="text-white" cx="50%" cy="50%" r="42" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={264} strokeDashoffset={264 - (264 * Math.round((stats.completed/stats.total)*100) / 100)} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">{Math.round((stats.completed/stats.total)*100)}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="总资源数" value={stats.total} icon={<BookOpen className="text-blue-600"/>}/>
        <StatCard label="学习中" value={stats.inProgress} icon={<Clock className="text-amber-600"/>}/>
        <StatCard label="已完成" value={stats.completed} icon={<CheckCircle2 className="text-emerald-600"/>}/>
        <StatCard label="平均评分" value={stats.avgRating} icon={<Star className="text-indigo-600"/>}/>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
            <TabButton active={activeTab==='all'} onClick={()=>setActiveTab('all')}>全部</TabButton>
            <TabButton active={activeTab==='in-progress'} onClick={()=>setActiveTab('in-progress')}>学习中</TabButton>
            <TabButton active={activeTab==='completed'} onClick={()=>setActiveTab('completed')}>已完成</TabButton>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
            <input type="text" placeholder="搜索资源..." className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 w-full md:w-64 outline-none" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">资源</th><th className="px-6 py-4">分类</th>
                <th className="px-6 py-4">状态</th><th className="px-6 py-4">评分</th>
                <th className="px-6 py-4">最后访问</th><th className="px-6 py-4"/>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResources.map(res=>(
                <tr key={res.id} className="group hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', res.category==='Fundamentals'?'bg-blue-50 text-blue-600':res.category==='NLP'?'bg-purple-50 text-purple-600':res.category==='Ethics'?'bg-rose-50 text-rose-600':'bg-indigo-50 text-indigo-600')}>
                        {res.category==='Fundamentals'?<Database size={20}/>:res.category==='NLP'?<Globe size={20}/>:<BookOpen size={20}/>}
                      </div>
                      <div><p className="font-semibold text-sm">{res.title}</p><p className="text-xs text-gray-400 line-clamp-1">{res.description}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-5"><span className="text-xs font-medium px-2.5 py-1 bg-gray-100 rounded-full text-gray-600">{res.category}</span></td>
                  <td className="px-6 py-5">
                    <button onClick={() => onToggleStatus(res.id)} className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full',res.status==='Completed'?'bg-emerald-500':res.status==='In Progress'?'bg-amber-500':'bg-gray-300')}/>
                      <span className="text-sm font-medium">{res.status === 'Completed' ? '已完成' : res.status === 'In Progress' ? '学习中' : '未开始'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-5"><div className="flex items-center gap-1">{[...Array(5)].map((_,i) => (<Star key={i} size={14} className={cn(i<res.rating?'text-amber-400 fill-amber-400':'text-gray-200')}/>))}</div></td>
                  <td className="px-6 py-5 text-sm text-gray-500">{res.lastAccessed}</td>
                  <td className="px-6 py-5 text-right"><button className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-400"><MoreVertical size={18}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredResources.length===0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><Search size={32} className="text-gray-300"/></div>
            <h3 className="text-lg font-semibold mb-1">未找到资源</h3>
            <p className="text-gray-500">请尝试调整搜索或筛选条件</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Resources Page ─────────────────────────────────────────────────────
function ResourcesPage({ resources, searchQuery, setSearchQuery, activeTab, setActiveTab, filteredResources, onToggleStatus }: {
  resources: Resource[]; searchQuery: string; setSearchQuery: (s: string) => void;
  activeTab: string; setActiveTab: (s: any) => void; filteredResources: Resource[];
  onToggleStatus: (id: string) => void;
}) {
  const categories = Array.from(new Set(resources.map(r => r.category)));

  return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.2}}>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">资源库</h2>
          <p className="text-gray-500">探索所有精选的 AI 学习资源</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
            <input type="text" placeholder="搜索资源..." className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 w-full outline-none" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
            <TabButton active={activeTab==='all'} onClick={()=>setActiveTab('all')}>全部</TabButton>
            <TabButton active={activeTab==='in-progress'} onClick={()=>setActiveTab('in-progress')}>学习中</TabButton>
            <TabButton active={activeTab==='completed'} onClick={()=>setActiveTab('completed')}>已完成</TabButton>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(cat => (
            <span key={cat} className="text-xs bg-indigo-50 text-indigo-700 font-medium px-3 py-1.5 rounded-full">{cat}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(res => (
          <div key={res.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', res.category==='Fundamentals'?'bg-blue-50 text-blue-600':res.category==='NLP'?'bg-purple-50 text-purple-600':res.category==='Ethics'?'bg-rose-50 text-rose-600':'bg-indigo-50 text-indigo-600')}>
                <FileText size={24}/>
              </div>
              <button onClick={() => onToggleStatus(res.id)} className={cn('px-3 py-1 rounded-full text-xs font-medium', res.status==='Completed'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700')}>
                {res.status === 'Completed' ? '已完成' : res.status === 'In Progress' ? '学习中' : '未开始'}
              </button>
            </div>
            <h3 className="font-bold text-lg mb-2">{res.title}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{res.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{res.stage}</span>
              <div className="flex items-center gap-1">{[...Array(5)].map((_,i) => (<Star key={i} size={12} className={cn(i<res.rating?'text-amber-400 fill-amber-400':'text-gray-200')}/>))}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── AI Masters Page ─────────────────────────────────────────────────────
function AIMastersPage({ masters, expandedId, setExpandedId, playingVideo, setPlayingVideo }: {
  masters: AIMaster[];
  expandedId: string | null; setExpandedId: (s: string | null) => void;
  playingVideo: {videoId:string;title:string} | null; setPlayingVideo: (s: any) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = masters.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame size={22} className="text-orange-500"/>
            <h2 className="text-3xl font-bold tracking-tight">AI 大神</h2>
          </div>
          <p className="text-gray-500">关注顶尖 AI 研究者和教育者，点击展开获取最新内容</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
          <input type="text" placeholder="搜索大神或标签..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 w-full md:w-64 outline-none shadow-sm" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
        </div>
      </header>

      <div className="space-y-4">
        {filtered.map(master => (
          <MasterCard key={master.id} master={master} isExpanded={expandedId === master.id} onToggle={() => setExpandedId(expandedId === master.id ? null : master.id)} onPlayVideo={(videoId, title) => setPlayingVideo({ videoId, title })} />
        ))}
      </div>
    </div>
  );
}

// ── Master Card ──────────────────────────────────────────────────────────
function MasterCard({ master, isExpanded, onToggle, onPlayVideo }: {
  master: AIMaster; isExpanded: boolean;
  onToggle: () => void; onPlayVideo: (videoId: string, title: string) => void;
}) {
  return (
    <motion.div layout className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 cursor-pointer hover:bg-gray-50/60 transition-colors" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md', master.avatarColor)}>
            {master.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-bold text-base">{master.name}</h3>
              <span className="text-gray-400 text-sm">{master.handle}</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                <Zap size={10}/>{master.followers}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{master.role} · <span className="font-medium text-gray-700">{master.company}</span></p>
            <div className="flex gap-1.5 flex-wrap">
              {master.tags.map(tag => (
                <span key={tag} className="text-xs bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {master.youtubeChannelId && (
              <span className="p-2 rounded-lg bg-red-50 text-red-600" title="YouTube">
                <Youtube size={18}/>
              </span>
            )}
            {master.twitterHandle && (
              <span className="p-2 rounded-lg bg-sky-50 text-sky-600" title="X/Twitter">
                <Rss size={18}/>
              </span>
            )}
            <div className="p-2 text-gray-400 ml-1">{isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}</div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div key="panel" initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} transition={{duration: 0.25, ease: 'easeInOut'}} className="overflow-hidden">
            <div className="px-5 pb-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed mt-4 mb-5">{master.bio}</p>

              {/* YouTube Videos */}
              {master.youtubeChannelId && (
                <>
                  {master.loadingVideos ? (
                    <div className="flex items-center gap-3 text-gray-500 py-4">
                      <Loader2 size={20} className="animate-spin" />
                      <span className="text-sm">获取YouTube视频中...</span>
                    </div>
                  ) : master.videos.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <Youtube size={16} className="text-red-500"/>
                        <h4 className="font-semibold text-sm text-gray-800">最新视频</h4>
                        <span className="text-xs text-gray-400">{master.videos.length} 个</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
                        {master.videos.map(video => (
                          <VideoCard key={video.id} video={video} onPlay={() => onPlayVideo(video.id, video.title)}/>
                        ))}
                      </div>
                    </>
                  ) : !master.errorVideos ? null : (
                    <div className="flex items-center gap-2 text-gray-400 py-4">
                      <AlertCircle size={14} />
                      <span className="text-sm">{master.errorVideos}</span>
                    </div>
                  )}
                </>
              )}

              {/* X/Twitter Posts */}
              {master.twitterHandle && (
                <>
                  {master.loadingPosts ? (
                    <div className="flex items-center gap-3 text-gray-500 py-4">
                      <Loader2 size={20} className="animate-spin" />
                      <span className="text-sm">获取X推文中...</span>
                    </div>
                  ) : master.posts.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <Rss size={16} className="text-sky-500"/>
                        <h4 className="font-semibold text-sm text-gray-800">最新推文</h4>
                        <span className="text-xs text-gray-400">{master.posts.length} 条</span>
                        <a href={`https://twitter.com/${master.twitterHandle}`} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-indigo-600 hover:underline flex items-center gap-1">
                          查看全部 <ExternalLink size={12}/>
                        </a>
                      </div>
                      <div className="space-y-3">
                        {master.posts.map(post => <PostCard key={post.id} post={post}/>)}
                      </div>
                    </>
                  ) : !master.errorPosts ? null : (
                    <div className="flex items-center gap-2 text-gray-400 py-4">
                      <AlertCircle size={14} />
                      <span className="text-sm">{master.errorPosts}</span>
                    </div>
                  )}
                </>
              )}

              {!master.youtubeChannelId && !master.twitterHandle && (
                <div className="text-center py-8 text-gray-400"><p className="text-sm">暂无数据</p></div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Video Card ───────────────────────────────────────────────────────────
function VideoCard({ video, onPlay }: { video: YoutubeVideo; onPlay: () => void }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="group rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all" onClick={onPlay}>
      <div className="relative aspect-video bg-gray-100">
        {!imgError && video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" onError={() => setImgError(true)}/>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Youtube size={36} className="text-red-500 opacity-60"/>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play size={20} className="text-gray-900 ml-0.5" fill="currentColor"/>
          </div>
        </div>
        {video.duration && <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-mono px-1.5 py-0.5 rounded">{video.duration}</span>}
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug mb-2">{video.title}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{video.views || '最新'}</span><span>{video.publishedAt}</span>
        </div>
      </div>
    </div>
  );
}

// ── Post Card (X/Twitter) ────────────────────────────────────────────────
function PostCard({ post }: { post: XPost }) {
  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-sky-200 hover:shadow-md transition-all group">
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.content}</p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{post.publishedAt}</span>
        <div className="text-sky-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          查看 <ExternalLink size={12}/>
        </div>
      </div>
    </a>
  );
}

// ── Progress Page ─────────────────────────────────────────────────────
function ProgressPage({ stats, resources }: { stats: any; resources: Resource[] }) {
  const completedResources = resources.filter(r => r.status === 'Completed');

  return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.2}}>
      <header className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-1">学习进度</h2>
        <p className="text-gray-500">追踪你的学习旅程</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-3xl border border-gray-200 p-6">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen size={32} className="text-blue-600"/>
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-gray-500">总资源数</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-200 p-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-emerald-600"/>
          </div>
          <p className="text-3xl font-bold">{stats.completed}</p>
          <p className="text-gray-500">已完成</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-200 p-6">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
            <Clock size={32} className="text-amber-600"/>
          </div>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
          <p className="text-gray-500">学习中</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6">
        <h3 className="font-bold text-lg mb-6">完成进度</h3>
        <div className="w-full bg-gray-100 rounded-full h-4 mb-4">
          <div className="bg-indigo-600 h-4 rounded-full transition-all" style={{width: `${(stats.completed/stats.total)*100}%`}}/>
        </div>
        <p className="text-sm text-gray-500 text-center">{Math.round((stats.completed/stats.total)*100)}% 完成</p>
      </div>

      {completedResources.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 mt-6">
          <h3 className="font-bold text-lg mb-4">已完成</h3>
          <div className="space-y-3">
            {completedResources.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <CheckCircle2 size={20} className="text-emerald-600"/>
                <span className="font-medium">{r.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Datasets Page ─────────────────────────────────────────────────────
function DatasetsPage({ }: { }) {
  const datasets = [
    { name: 'MNIST', description: '手写数字识别数据集', size: '15MB', type: '图像' },
    { name: 'COCO', description: '目标检测与分割数据集', size: '25GB', type: '图像' },
    { name: 'WikiText', description: '语言模型训练数据集', size: '100MB', type: '文本' },
    { name: 'Common Crawl', description: '网页爬虫数据集', size: '数百GB', type: '文本' },
  ];

  return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.2}}>
      <header className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-1">数据集</h2>
        <p className="text-gray-500">常用机器学习数据集资源</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {datasets.map((ds, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Database size={24} className="text-indigo-600"/>
              </div>
              <div>
                <h3 className="font-bold text-lg">{ds.name}</h3>
                <span className="text-xs text-gray-500">{ds.type}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">{ds.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{ds.size}</span>
              <button className="text-indigo-600 text-sm font-medium hover:underline">下载</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Projects Page ─────────────────────────────────────────────────────
function ProjectsPage({ }: { }) {
  const projects = [
    { name: '图像分类器', description: '使用 CNN 实现图像分类', progress: 80, status: '进行中' },
    { name: '聊天机器人', description: '基于 LLM 的对话系统', progress: 45, status: '进行中' },
    { name: '目标检测', description: 'YOLO 目标检测实现', progress: 100, status: '已完成' },
  ];

  return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.2}}>
      <header className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-1">项目</h2>
        <p className="text-gray-500">你的 AI 学习项目</p>
      </header>

      <div className="space-y-6">
        {projects.map((proj, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">{proj.name}</h3>
                <p className="text-sm text-gray-500">{proj.description}</p>
              </div>
              <span className={cn('text-xs font-medium px-3 py-1 rounded-full', proj.status === '已完成' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                {proj.status}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${proj.progress}%`}}/>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">{proj.progress}%</p>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
        <Plus size={20}/>创建新项目
      </button>
    </motion.div>
  );
}

// ── Video Modal ──────────────────────────────────────────────────────────
function VideoModal({ videoId, title, onClose }: { videoId: string; title: string; onClose: () => void }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}} transition={{type:'spring',duration:0.3}} className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          <p className="text-white text-sm font-medium line-clamp-1 flex-1 mr-3">{title}</p>
          <div className="flex items-center gap-2">
            <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <ExternalLink size={16}/>
            </a>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <X size={16}/>
            </button>
          </div>
        </div>
        <div className="aspect-video w-full">
          <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="w-full h-full"/>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Shared Components ────────────────────────────────────────────────────
function NavItem({ icon, label, active = false, onClick, badge }: {
  icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; badge?: number;
}) {
  return (
    <button onClick={onClick} className={cn('w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group', active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600')}>
      <div className="flex items-center gap-3">{icon}<span className="font-medium">{label}</span></div>
      <div className="flex items-center gap-1.5">
        {badge !== undefined && <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded-full', active ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600')}>{badge}</span>}
        {active && <ChevronRight size={16}/>}
      </div>
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">{icon}</div>
        <TrendingUp size={16} className="text-emerald-500"/>
      </div>
      <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn('px-4 py-2 rounded-lg text-sm font-semibold transition-all', active ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
      {children}
    </button>
  );
}

// ── Static Data ─────────────────────────────────────────────────────────
const INITIAL_RESOURCES: Resource[] = [
  { id:'1', title:'Attention Is All You Need', category:'Fundamentals', status:'Completed', rating:5, lastAccessed:'2024-03-25', description:'The seminal paper introducing the Transformer architecture.', stage:'基础', links:[{url:'https://arxiv.org/abs/1706.03762', type:'Paper'}] },
  { id:'2', title:'Deep Learning Specialization', category:'Fundamentals', status:'In Progress', rating:4, lastAccessed:'2024-03-27', description:'Comprehensive series of courses by Andrew Ng.', stage:'基础', links:[{url:'https://www.coursera.org/learn/neural-networks-deep-learning', type:'Course'}] },
  { id:'3', title:'Large Language Models at Scale', category:'NLP', status:'Not Started', rating:0, lastAccessed:'-', description:'Advanced techniques for training and deploying LLMs.', stage:'进阶', links:[] },
  { id:'4', title:'AI Ethics and Governance', category:'Ethics', status:'In Progress', rating:3, lastAccessed:'2024-03-20', description:'Understanding the societal impact of AI systems.', stage:'高级', links:[] },
  { id:'5', title:'PyTorch Deep Learning', category:'Fundamentals', status:'Not Started', rating:0, lastAccessed:'-', description:'Master PyTorch framework for neural network development.', stage:'基础', links:[] },
  { id:'6', title:'Computer Vision Fundamentals', category:'Computer Vision', status:'Not Started', rating:0, lastAccessed:'-', description:'Learn CNN, object detection, and image segmentation.', stage:'进阶', links:[] },
  { id:'7', title:'MLOps Essentials', category:'MLOps', status:'Not Started', rating:0, lastAccessed:'-', description:'Production-ready machine learning systems.', stage:'高级', links:[] },
  { id:'8', title:'Reinforcement Learning', category:'NLP', status:'Not Started', rating:0, lastAccessed:'-', description:'Deep Q-learning, policy gradients, and RLHF.', stage:'高级', links:[] },
];