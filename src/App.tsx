import React, { useState, useEffect, useCallback } from 'react';
import {
  Home, BookOpen, Search, Users, TrendingUp, Code2, Database,
  ChevronRight, ChevronDown, Flame, Zap, X, Plus, ExternalLink,
  Play, Youtube, Twitter, RefreshCw, Loader2, AlertCircle, Rss,
  FileText, Star, Clock, CheckCircle2, Sparkles, Globe, Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Config ──────────────────────────────────────────────────────────────

// ── Types ──────────────────────────────────────────────────────────────
interface Resource {
  id: string;
  name: string;
  description: string;
  stage: string;
  category: string;
  links: { url: string; type: string }[];
  completed?: boolean;
  status?: 'not_started' | 'in_progress' | 'completed';
}

interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

interface XPost {
  title: string;
  link: string;
  pubDate: string;
}

interface AIMaster {
  id: string;
  name: string;
  twitter: string;
  youtube: string;
  avatarColor: string;
  videos: YoutubeVideo[];
  posts: XPost[];
  loading?: boolean;
}

interface Stage {
  name: string;
  color: string;
  icon: string;
}

// ── Learning Stages ────────────────────────────────────────────────────
const LEARNING_STAGES: Stage[] = [
  { name: '第一阶段：Python编程基础', color: '#3498db', icon: '📘' },
  { name: '第二阶段：AI基本概念认知', color: '#9b59b6', icon: '🧠' },
  { name: '第三阶段：机器学习', color: '#e67e22', icon: '📊' },
  { name: '第四阶段：深度学习', color: '#e74c3c', icon: '🔥' },
  { name: '第五阶段：专项方向', color: '#c0392b', icon: '🎯' },
  { name: '第六阶段：项目实战', color: '#27ae60', icon: '🚀' },
];

// ── 38 Learning Resources (parsed from markdown) ──────────────────────
const RESOURCES: Resource[] = [
  // 第一阶段：Python编程基础
  { id: '1', name: '黑马程序员Python教程', description: '系统全面，实战项目多，约100小时', stage: '第一阶段：Python编程基础', category: 'Python入门', links: [{ url: 'https://www.bilibili.com/video/BV1ex411x7Em', type: 'bilibili' }], status: 'not_started' },
  { id: '2', name: '廖雪峰Python教程', description: '免费文档，边学边练，适合随时查阅', stage: '第一阶段：Python编程基础', category: 'Python入门', links: [{ url: 'https://www.liaoxuefeng.com/wiki/1016959663602400', type: 'docs' }], status: 'not_started' },
  { id: '3', name: '莫烦Python基础', description: '短小精悍，每个视频5-15分钟', stage: '第一阶段：Python编程基础', category: 'Python入门', links: [{ url: 'https://space.bilibili.com/243821484', type: 'bilibili' }], status: 'not_started' },
  { id: '4', name: 'Kaggle Python课程', description: '免费，边学边练，有 Kaggle 环境', stage: '第一阶段：Python编程基础', category: 'Python数据分析', links: [{ url: 'https://www.kaggle.com/learn/python', type: 'kaggle' }], status: 'not_started' },

  // 第二阶段：AI基本概念认知
  { id: '5', name: '王木头学科学 - AI科普系列', description: '零基础友好，动画讲解，每集10-15分钟', stage: '第二阶段：AI基本概念认知', category: 'AI入门科普', links: [{ url: 'https://www.bilibili.com/video/BV1gJ411v7dh', type: 'bilibili' }], status: 'not_started' },
  { id: '6', name: '3Blue1Brown 神经网络系列', description: '可视化讲解，直观理解神经网络原理，约4小时', stage: '第二阶段：AI基本概念认知', category: 'AI入门科普', links: [{ url: 'https://www.bilibili.com/video/BV1bx411M7Zx', type: 'bilibili' }], status: 'not_started' },
  { id: '7', name: 'Essence of Linear Algebra', description: '线性代数核心概念可视化，12集', stage: '第二阶段：AI基本概念认知', category: '数学基础', links: [{ url: 'https://www.bilibili.com/video/BV1ib411m7fd', type: 'bilibili' }], status: 'not_started' },
  { id: '8', name: 'Essence of Calculus', description: '微积分核心概念可视化', stage: '第二阶段：AI基本概念认知', category: '数学基础', links: [{ url: 'https://www.bilibili.com/video/BV1qW411N7FU', type: 'bilibili' }], status: 'not_started' },
  { id: '9', name: '机器之心 - 入门指南专栏', description: '精选入门文章', stage: '第二阶段：AI基本概念认知', category: '入门文章', links: [{ url: 'https://www.jiqizhixin.com/columns/ai-beginner', type: 'docs' }], status: 'not_started' },

  // 第三阶段：机器学习
  { id: '10', name: '吴恩达机器学习', description: '斯坦福大学教授，最经典的机器学习课程，约20小时', stage: '第三阶段：机器学习', category: '核心课程', links: [{ url: 'https://www.bilibili.com/video/BV164411b7dx', type: 'bilibili' }], status: 'not_started' },
  { id: '11', name: '李宏毅《机器学习》2024最新版', description: '台湾大学教授，讲解生动有趣，案例丰富，约30小时', stage: '第三阶段：机器学习', category: '核心课程', links: [{ url: 'https://www.bilibili.com/video/BV1Wv411h7kN', type: 'bilibili' }], status: 'not_started' },
  { id: '12', name: 'Kaggle入门课程', description: '免费，边学边练', stage: '第三阶段：机器学习', category: '实践练习', links: [{ url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'kaggle' }], status: 'not_started' },
  { id: '13', name: '莫烦Python机器学习', description: '代码驱动，快速上手', stage: '第三阶段：机器学习', category: '实践练习', links: [{ url: 'https://mofanpy.com/tutorials/machine-learning', type: 'docs' }], status: 'not_started' },

  // 第四阶段：深度学习
  { id: '14', name: '跟李沐学AI - 动手学深度学习', description: '亚马逊首席科学家李沐，代码实战驱动，约50小时', stage: '第四阶段：深度学习', category: '核心课程', links: [{ url: 'https://www.bilibili.com/video/BV1K64y1Q7wu', type: 'bilibili' }], status: 'not_started' },
  { id: '15', name: '李宏毅深度学习', description: '台湾教授授课，内容全面', stage: '第四阶段：深度学习', category: '核心课程', links: [{ url: 'https://www.bilibili.com/video/BV1Wv411h7kN', type: 'bilibili' }], status: 'not_started' },
  { id: '16', name: 'TensorFlow官方教程', description: '官方保证，内容准确', stage: '第四阶段：深度学习', category: '框架入门', links: [{ url: 'https://tensorflow.google.cn/tutorials', type: 'docs' }], status: 'not_started' },
  { id: '17', name: 'PyTorch官方教程', description: '快速上手实践', stage: '第四阶段：深度学习', category: '框架入门', links: [{ url: 'https://pytorch.org/tutorials', type: 'docs' }], status: 'not_started' },
  { id: '18', name: 'MNIST手写数字识别', description: '第一个深度学习项目', stage: '第四阶段：深度学习', category: '项目实战', links: [{ url: 'https://www.kaggle.com/c/digit-recognizer', type: 'kaggle' }], status: 'not_started' },

  // 第五阶段：专项方向
  { id: '19', name: 'CS231n CNN视觉识别', description: '计算机视觉标准课程，Numpy/PyTorch实现', stage: '第五阶段：专项方向', category: '计算机视觉', links: [{ url: 'https://www.bilibili.com/video/BV1nJ411z7fe', type: 'bilibili' }], status: 'not_started' },
  { id: '20', name: 'OpenCV入门', description: '计算机视觉基础', stage: '第五阶段：专项方向', category: '计算机视觉', links: [{ url: 'https://www.bilibili.com/video/BV1oJ411D71z', type: 'bilibili' }], status: 'not_started' },
  { id: '21', name: 'CS224n NLP深度学习', description: 'NLP标准课程，Transformer、BERT等', stage: '第五阶段：专项方向', category: '自然语言处理', links: [{ url: 'https://www.bilibili.com/video/BV1s4411N7fC', type: 'bilibili' }], status: 'not_started' },
  { id: '22', name: 'Transformer详解', description: 'Transformer架构详解', stage: '第五阶段：专项方向', category: '自然语言处理', links: [{ url: 'https://www.bilibili.com/video/BV1pu411o7BE', type: 'bilibili' }], status: 'not_started' },
  { id: '23', name: 'Hugging Face课程', description: '实战导向，学会使用预训练模型', stage: '第五阶段：专项方向', category: '自然语言处理', links: [{ url: 'https://huggingface.co/course/zh-CN', type: 'docs' }], status: 'not_started' },
  { id: '24', name: '李宏毅强化学习', description: '强化学习课程', stage: '第五阶段：专项方向', category: '强化学习', links: [{ url: 'https://www.bilibili.com/video/BV1MW411w79n', type: 'bilibili' }], status: 'not_started' },
  { id: '25', name: '莫烦Python强化学习', description: '强化学习实战', stage: '第五阶段：专项方向', category: '强化学习', links: [{ url: 'https://mofanpy.com/tutorials/machine-learning/reinforcement-learning', type: 'docs' }], status: 'not_started' },

  // 第六阶段：项目实战
  { id: '26', name: 'Kaggle竞赛', description: '免费数据集+GPU，实战竞赛', stage: '第六阶段：项目实战', category: '竞赛平台', links: [{ url: 'https://www.kaggle.com', type: 'kaggle' }], status: 'not_started' },
  { id: '27', name: '天池竞赛', description: '中文界面，比赛有奖金', stage: '第六阶段：项目实战', category: '竞赛平台', links: [{ url: 'https://tianchi.aliyun.com', type: 'docs' }], status: 'not_started' },
  { id: '28', name: '和鲸社区', description: '中文环境，项目模板多', stage: '第六阶段：项目实战', category: '竞赛平台', links: [{ url: 'https://www.heywhale.com', type: 'docs' }], status: 'not_started' },
  { id: '29', name: 'Google Colab', description: '无需安装，直接运行Python代码', stage: '第六阶段：项目实战', category: '在线环境', links: [{ url: 'https://colab.research.google.com', type: 'docs' }], status: 'not_started' },
  { id: '30', name: '百度AI Studio', description: '中文环境，免费算力充足', stage: '第六阶段：项目实战', category: '在线环境', links: [{ url: 'https://aistudio.baidu.com', type: 'docs' }], status: 'not_started' },

  // 工具与框架
  { id: '31', name: 'TensorFlow完整学习路径', description: '官方中文教程', stage: '第四阶段：深度学习', category: '框架', links: [{ url: 'https://tensorflow.google.cn/tutorials', type: 'docs' }], status: 'not_started' },
  { id: '32', name: 'PyTorch完整学习路径', description: '官方教程', stage: '第四阶段：深度学习', category: '框架', links: [{ url: 'https://pytorch.org/tutorials', type: 'docs' }], status: 'not_started' },
  { id: '33', name: 'Hugging Face模型库', description: '预训练模型集散地', stage: '第五阶段：专项方向', category: '框架', links: [{ url: 'https://huggingface.co/models', type: 'docs' }], status: 'not_started' },

  // 社区与支持
  { id: '34', name: '知乎AI学习', description: '问答社区', stage: '第二阶段：AI基本概念认知', category: '社区', links: [{ url: 'https://www.zhihu.com/topic/19551137', type: 'zhihu' }], status: 'not_started' },
  { id: '35', name: 'D2L教材（动手学深度学习）', description: '中英文双语教材', stage: '第四阶段：深度学习', category: '社区', links: [{ url: 'https://github.com/d2l-ai/d2l-zh', type: 'github' }], status: 'not_started' },
  { id: '36', name: '机器学习100天', description: 'GitHub学习项目', stage: '第三阶段：机器学习', category: '社区', links: [{ url: 'https://github.com/Avik-Jain/100-Days-Of-ML-Code', type: 'github' }], status: 'not_started' },

  // 公众号资源
  { id: '37', name: '机器之心', description: '每日推送AI新闻、教程', stage: '第二阶段：AI基本概念认知', category: '移动学习', links: [{ url: 'https://www.jiqizhixin.com', type: 'docs' }], status: 'not_started' },
  { id: '38', name: 'Datawhale', description: '数据科学学习社区', stage: '第三阶段：机器学习', category: '移动学习', links: [{ url: 'https://www.datawhale.cn', type: 'docs' }], status: 'not_started' },
];

// ── AI Masters (20位) ─────────────────────────────────────────────────
const AI_MASTERS = [
  { id: '1', name: 'Andrej Karpathy', twitter: 'karpathy', youtube: 'UCXUPKJOoM5L6O9S5JFZIkQw', avatarColor: 'from-orange-500 to-red-600' },
  { id: '2', name: 'Andrew Ng', twitter: 'AndrewYng', youtube: '', avatarColor: 'from-blue-600 to-indigo-700' },
  { id: '3', name: 'Yann LeCun', twitter: 'ylecun', youtube: '', avatarColor: 'from-blue-700 to-cyan-800' },
  { id: '4', name: 'Lex Fridman', twitter: 'lexfridman', youtube: 'UCSHZxQ5L7IuvZQqS9T9Carg', avatarColor: 'from-gray-600 to-gray-900' },
  { id: '5', name: 'Ilya Sutskever', twitter: 'ilyasut', youtube: '', avatarColor: 'from-emerald-600 to-teal-700' },
  { id: '6', name: 'Sebastian Raschka', twitter: 'rasbt', youtube: 'UCXUPKJOoM5L6O9S5JFZIkQw', avatarColor: 'from-indigo-600 to-blue-700' },
  { id: '7', name: 'Jim Fan', twitter: 'DrJimFan', youtube: '', avatarColor: 'from-green-600 to-emerald-700' },
  { id: '8', name: 'Jeremy Howard', twitter: 'jeremyhoward', youtube: 'UC7-c08hMUjF-4Bj9U9SjQSQ', avatarColor: 'from-green-700 to-teal-800' },
  { id: '9', name: 'Matt Wolfe', twitter: 'mattwolfe_', youtube: 'UCKl4w_DVJr-Q6KMhxvZHUpg', avatarColor: 'from-yellow-600 to-orange-600' },
  { id: '10', name: 'Two Minute Papers', twitter: 'karoly_zsolnai', youtube: 'UCbfYPyIT5T46Z2R卫国自选区', avatarColor: 'from-blue-500 to-cyan-600' },
  { id: '11', name: 'Rowan Cheung', twitter: 'rowancheung', youtube: '', avatarColor: 'from-purple-600 to-pink-600' },
  { id: '12', name: 'Wes Roth', twitter: 'WesRothMoney', youtube: 'UCcD8wn4K1cXoO0NlA0V6H4w', avatarColor: 'from-teal-600 to-cyan-700' },
  { id: '13', name: 'Allie K. Miller', twitter: 'alliekmiller', youtube: '', avatarColor: 'from-pink-600 to-rose-700' },
  { id: '14', name: 'Dr. Alan Thompson', twitter: '', youtube: 'UCZM8wN-uLbgz0t3tnuM47Rw', avatarColor: 'from-purple-700 to-indigo-800' },
  { id: '15', name: 'Logan Kilpatrick', twitter: 'OfficialLoganK', youtube: '', avatarColor: 'from-red-600 to-orange-700' },
  { id: '16', name: 'Yannic Kilcher', twitter: 'ykilcher', youtube: 'UCZM8wN-uLbgz0t3tnuM47Rw', avatarColor: 'from-purple-500 to-indigo-600' },
  { id: '17', name: 'Sam Altman', twitter: 'sama', youtube: '', avatarColor: 'from-gray-700 to-slate-900' },
  { id: '18', name: 'Greg Brockman', twitter: 'gdb', youtube: '', avatarColor: 'from-indigo-700 to-purple-800' },
  { id: '19', name: 'Jim Fan', twitter: 'DrJimFan', youtube: '', avatarColor: 'from-green-600 to-emerald-700' },
  { id: '20', name: 'Rowan Cheung', twitter: 'rowancheung', youtube: '', avatarColor: 'from-purple-600 to-pink-600' },
];

// ── API Functions ──────────────────────────────────────────────────────
async function fetchYouTubeVideos(channelId: string): Promise<YoutubeVideo[]> {
  if (!channelId) return [];

  try {
    const response = await fetch(`/api/youtube?channelId=${channelId}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.videos || [];
  } catch {
    return [];
  }
}

async function fetchXRss(handle: string): Promise<XPost[]> {
  try {
    const response = await fetch(`https://nitter.net/${handle}/rss`);
    if (!response.ok) return [];

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');
    const items = doc.querySelectorAll('item');

    return Array.from(items).slice(0, 5).map((item) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const content = title.replace(new RegExp(`^@${handle}\\s*[-:]?\\s*`), '');

      return {
        title: content,
        link: link || `https://twitter.com/${handle}`,
        pubDate: pubDate ? new Date(pubDate).toLocaleDateString('zh-CN') : '',
      };
    });
  } catch {
    return [];
  }
}

// ── App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<'dashboard' | 'resources' | 'masters' | 'progress'>('dashboard');
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [masters, setMasters] = useState<AIMaster[]>(AI_MASTERS.map(m => ({ ...m, videos: [], posts: [] })));
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [expandedMasterId, setExpandedMasterId] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{ id: string; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');

  // Toggle resource status
  const toggleResourceStatus = (id: string) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'completed' ? 'not_started' : r.status === 'not_started' ? 'in_progress' : 'completed';
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  // Fetch master data when expanded
  const fetchMasterData = useCallback(async (masterId: string) => {
    const master = AI_MASTERS.find(m => m.id === masterId);
    if (!master) return;

    setMasters(prev => prev.map(m => m.id === masterId ? { ...m, loading: true } : m));

    const [videos, posts] = await Promise.all([
      master.youtube ? fetchYouTubeVideos(master.youtube) : Promise.resolve([]),
      master.twitter ? fetchXRss(master.twitter) : Promise.resolve([]),
    ]);

    setMasters(prev => prev.map(m => m.id === masterId ? { ...m, videos, posts, loading: false } : m));
  }, []);

  useEffect(() => {
    if (expandedMasterId) {
      const master = masters.find(m => m.id === expandedMasterId);
      if (master && master.videos.length === 0 && master.posts.length === 0) {
        fetchMasterData(expandedMasterId);
      }
    }
  }, [expandedMasterId]);

  // Stats
  const stats = {
    total: resources.length,
    completed: resources.filter(r => r.status === 'completed').length,
    inProgress: resources.filter(r => r.status === 'in_progress').length,
  };

  // Filter resources
  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = !selectedStage || r.stage.includes(selectedStage);
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStage && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 hidden lg:flex flex-col z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">🧠</div>
          <h1 className="font-bold text-xl">AI学习追踪</h1>
        </div>

        <nav className="space-y-2">
          <NavItem icon={<Home size={20} />} label="首页" active={page === 'dashboard'} onClick={() => setPage('dashboard')} />
          <NavItem icon={<BookOpen size={20} />} label="资源库" active={page === 'resources'} onClick={() => setPage('resources')} badge={resources.length} />
          <NavItem icon={<Users size={20} />} label="AI大神" active={page === 'masters'} onClick={() => setPage('masters')} badge={AI_MASTERS.length} />
          <NavItem icon={<TrendingUp size={20} />} label="学习进度" active={page === 'progress'} onClick={() => setPage('progress')} />
        </nav>

        {/* Progress */}
        <div className="mt-auto bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">今日目标</p>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{stats.completed}/{stats.total}</span>
            <span className="text-sm text-indigo-600 font-bold">{Math.round((stats.completed / stats.total) * 100)}%</span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(stats.completed / stats.total) * 100}%` }} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 p-6">
        <AnimatePresence mode="wait">
          {page === 'dashboard' && (
            <DashboardPage
              key="dashboard"
              stats={stats}
              resources={resources}
              onNavigate={setPage}
            />
          )}
          {page === 'resources' && (
            <ResourcesPage
              key="resources"
              stages={LEARNING_STAGES}
              resources={filteredResources}
              selectedStage={selectedStage}
              setSelectedStage={setSelectedStage}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              onToggleStatus={toggleResourceStatus}
            />
          )}
          {page === 'masters' && (
            <MastersPage
              key="masters"
              masters={masters}
              expandedMasterId={expandedMasterId}
              setExpandedMasterId={setExpandedMasterId}
              onPlayVideo={setPlayingVideo}
            />
          )}
          {page === 'progress' && (
            <ProgressPage key="progress" stats={stats} resources={resources} stages={LEARNING_STAGES} />
          )}
        </AnimatePresence>
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {playingVideo && (
          <VideoModal videoId={playingVideo.id} title={playingVideo.title} onClose={() => setPlayingVideo(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Dashboard Page ─────────────────────────────────────────────────────
function DashboardPage({ stats, resources, onNavigate }: any) {
  const currentItem = resources.find(r => r.status === 'in_progress') || resources[0];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">欢迎回来，学习者</h2>
        <p className="text-gray-500">继续你的AI学习之旅</p>
      </header>

      {/* Current Learning */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white mb-8">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full mb-4 inline-block">{currentItem?.stage?.split('：')[0]}</span>
            <h3 className="text-2xl font-bold mb-2">{currentItem?.name}</h3>
            <p className="text-white/80">{currentItem?.description}</p>
            {currentItem?.links[0] && (
              <a href={currentItem.links[0].url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors">
                <ExternalLink size={16} />打开资源
              </a>
            )}
          </div>
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-white/20" cx="50%" cy="50%" r="45" fill="transparent" stroke="currentColor" strokeWidth="8" />
              <circle className="text-white" cx="50%" cy="50%" r="45" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={283} strokeDashoffset={283 - (283 * stats.completed / stats.total)} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">{Math.round((stats.completed / stats.total) * 100)}%</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard label="总资源数" value={stats.total} icon={<BookOpen className="text-blue-600" />} />
        <StatCard label="学习中" value={stats.inProgress} icon={<Clock className="text-amber-600" />} />
        <StatCard label="已完成" value={stats.completed} icon={<CheckCircle2 className="text-emerald-600" />} />
        <StatCard label="AI大神" value={AI_MASTERS.length} icon={<Users className="text-purple-600" />} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        <button onClick={() => onNavigate('resources')} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow text-left">
          <BookOpen className="text-indigo-600 mb-4" size={32} />
          <h3 className="font-bold mb-1">资源库</h3>
          <p className="text-gray-500 text-sm">浏览38套学习资源</p>
        </button>
        <button onClick={() => onNavigate('masters')} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow text-left">
          <Users className="text-indigo-600 mb-4" size={32} />
          <h3 className="font-bold mb-1">AI大神</h3>
          <p className="text-gray-500 text-sm">关注20位AI领域专家</p>
        </button>
        <button onClick={() => onNavigate('progress')} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow text-left">
          <TrendingUp className="text-indigo-600 mb-4" size={32} />
          <h3 className="font-bold mb-1">学习进度</h3>
          <p className="text-gray-500 text-sm">追踪你的学习旅程</p>
        </button>
      </div>
    </motion.div>
  );
}

// ── Resources Page ─────────────────────────────────────────────────────
function ResourcesPage({ stages, resources, selectedStage, setSelectedStage, searchQuery, setSearchQuery, filterStatus, setFilterStatus, onToggleStatus }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">资源库</h2>
          <p className="text-gray-500">{resources.length} 个资源</p>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="搜索资源..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="px-4 py-2.5 bg-gray-50 border-none rounded-xl" value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
            <option value="all">全部状态</option>
            <option value="not_started">未开始</option>
            <option value="in_progress">学习中</option>
            <option value="completed">已完成</option>
          </select>
        </div>

        {/* Stage Filter */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button onClick={() => setSelectedStage(null)} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', !selectedStage ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            全部阶段
          </button>
          {stages.map(stage => (
            <button key={stage.name} onClick={() => setSelectedStage(selectedStage === stage.name ? null : stage.name)} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', selectedStage === stage.name ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              {stage.icon} {stage.name.split('：')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Resource List */}
      <div className="space-y-4">
        {resources.map(resource => (
          <ResourceCard key={resource.id} resource={resource} onToggle={() => onToggleStatus(resource.id)} />
        ))}
      </div>
    </motion.div>
  );
}

function ResourceCard({ resource, onToggle }: { resource: Resource; onToggle: () => void }) {
  const statusColors = {
    not_started: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
  };
  const statusLabels = { not_started: '未开始', in_progress: '学习中', completed: '已完成' };

  const typeIcons: Record<string, string> = {
    bilibili: '🎬',
    youtube: '▶️',
    github: '💻',
    kaggle: '🏆',
    docs: '📄',
    zhihu: '💬',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-500">{resource.stage.split('：')[0]}</span>
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{resource.category}</span>
          </div>
          <h3 className="font-bold text-lg mb-1">{resource.name}</h3>
          <p className="text-gray-500 text-sm mb-4">{resource.description}</p>
          <div className="flex items-center gap-2">
            {resource.links.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">
                {typeIcons[link.type] || '🔗'} {link.type}
              </a>
            ))}
          </div>
        </div>
        <button onClick={onToggle} className={cn('px-4 py-2 rounded-xl text-sm font-medium', statusColors[resource.status || 'not_started'])}>
          {statusLabels[resource.status || 'not_started']}
        </button>
      </div>
    </div>
  );
}

// ── Masters Page ─────────────────────────────────────────────────────
function MastersPage({ masters, expandedMasterId, setExpandedMasterId, onPlayVideo }: any) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = masters.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      <header className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="text-orange-500" size={24} />
            <h2 className="text-3xl font-bold">AI大神</h2>
          </div>
          <p className="text-gray-500">关注20位AI领域顶尖专家，获取最新动态</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="搜索大神..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl w-64" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(master => (
          <MasterCard key={master.id} master={master} isExpanded={expandedMasterId === master.id} onToggle={() => setExpandedMasterId(expandedMasterId === master.id ? null : master.id)} onPlayVideo={onPlayVideo} />
        ))}
      </div>
    </motion.div>
  );
}

function MasterCard({ master, isExpanded, onToggle, onPlayVideo }: any) {
  return (
    <motion.div layout className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold', master.avatarColor)}>
            {master.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate">{master.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {master.youtube && <Youtube size={14} className="text-red-500" />}
              {master.twitter && <Twitter size={14} className="text-sky-500" />}
            </div>
          </div>
          <ChevronDown size={20} className={cn('text-gray-400 transition-transform', isExpanded && 'rotate-180')} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-100">
            <div className="p-4">
              {master.loading ? (
                <div className="flex items-center gap-2 text-gray-500 py-4">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-sm">加载中...</span>
                </div>
              ) : (
                <>
                  {master.videos.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Youtube size={14} className="text-red-500" /> 最新视频
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {master.videos.slice(0, 4).map(video => (
                          <div key={video.id} className="cursor-pointer rounded-lg overflow-hidden border border-gray-100 hover:border-indigo-200 transition-colors" onClick={() => onPlayVideo({ id: video.id, title: video.title })}>
                            <img src={video.thumbnail} alt={video.title} className="w-full aspect-video object-cover" />
                            <p className="text-xs p-2 truncate">{video.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {master.posts.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Twitter size={14} className="text-sky-500" /> 最新推文
                      </h4>
                      <div className="space-y-2">
                        {master.posts.slice(0, 3).map((post: any, idx: number) => (
                          <a key={idx} href={post.link} target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-600 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                            <p className="line-clamp-2">{post.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{post.pubDate}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Progress Page ─────────────────────────────────────────────────────
function ProgressPage({ stats, resources, stages }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">学习进度</h2>
        <p className="text-gray-500">追踪你的学习旅程</p>
      </header>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-gray-500">总资源数</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-bold">{stats.completed}</p>
          <p className="text-gray-500">已完成</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-amber-600" />
          </div>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
          <p className="text-gray-500">学习中</p>
        </div>
      </div>

      {/* Stage Progress */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="font-bold text-lg mb-6">各阶段进度</h3>
        <div className="space-y-4">
          {stages.map(stage => {
            const stageResources = resources.filter(r => r.stage.includes(stage.name));
            const completed = stageResources.filter(r => r.status === 'completed').length;
            const progress = stageResources.length > 0 ? (completed / stageResources.length) * 100 : 0;

            return (
              <div key={stage.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{stage.icon} {stage.name}</span>
                  <span className="text-sm text-gray-500">{completed}/{stageResources.length}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="h-3 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: stage.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-lg mb-4">总体进度</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-gray-100" cx="50%" cy="50%" r="45" fill="transparent" stroke="currentColor" strokeWidth="10" />
              <circle className="text-indigo-600" cx="50%" cy="50%" r="45" fill="transparent" stroke="currentColor" strokeWidth="10" strokeDasharray={283} strokeDashoffset={283 - (283 * stats.completed / stats.total)} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{Math.round((stats.completed / stats.total) * 100)}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-500 mb-4">你已经完成了 {stats.completed} 个资源的学习，继续加油！</p>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
                <p className="text-sm text-gray-500">已完成</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
                <p className="text-sm text-gray-500">学习中</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">{stats.total - stats.completed - stats.inProgress}</p>
                <p className="text-sm text-gray-500">未开始</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Video Modal ──────────────────────────────────────────────────────────
function VideoModal({ videoId, title, onClose }: { videoId: string; title: string; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          <p className="text-white text-sm font-medium line-clamp-1 flex-1 mr-3">{title}</p>
          <div className="flex items-center gap-2">
            <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white">
              <ExternalLink size={16} />
            </a>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="aspect-video w-full">
          <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Shared Components ────────────────────────────────────────────────────
function NavItem({ icon, label, active = false, onClick, badge }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; badge?: number }) {
  return (
    <button onClick={onClick} className={cn('w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all', active ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50')}>
      <div className="flex items-center gap-3">{icon}<span className="font-medium">{label}</span></div>
      {badge !== undefined && <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', active ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600')}>{badge}</span>}
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">{icon}</div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}