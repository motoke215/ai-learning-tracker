import React, { useState, useEffect, useCallback } from 'react';
import {
  Home, BookOpen, Search, Users, TrendingUp, Code2,
  ChevronRight, ChevronDown, Flame, Zap, X, Plus, ExternalLink,
  Play, Youtube, Twitter, RefreshCw, Loader2, AlertCircle, Rss,
  FileText, Star, Clock, CheckCircle2, Sparkles, Globe, Filter,
  Share2, ArrowLeft, PlayCircle, Sun, Moon, Languages, Copy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Types ──────────────────────────────────────────────────────────────
interface Resource {
  id: string;
  name: string;
  description: string;
  stage: string;
  category: string;
  links: { url: string; type: string }[];
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

interface SearchResult {
  title: string;
  url: string;
  platform: string;
}

// ── Theme Context ──────────────────────────────────────────────────────
type Theme = 'light' | 'dark';
const ThemeContext = React.createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
});

// ── Learning Stages ────────────────────────────────────────────────────
const LEARNING_STAGES: Stage[] = [
  { name: '第一阶段：Python编程基础', color: '#3498db', icon: '📘' },
  { name: '第二阶段：AI基本概念认知', color: '#9b59b6', icon: '🧠' },
  { name: '第三阶段：机器学习', color: '#e67e22', icon: '📊' },
  { name: '第四阶段：深度学习', color: '#e74c3c', icon: '🔥' },
  { name: '第五阶段：专项方向', color: '#c0392b', icon: '🎯' },
  { name: '第六阶段：项目实战', color: '#27ae60', icon: '🚀' },
];

// ── 38 Learning Resources ─────────────────────────────────────────────
const RESOURCES: Resource[] = [
  { id: '1', name: '黑马程序员Python教程', description: '系统全面，实战项目多，约100小时', stage: '第一阶段：Python编程基础', category: 'Python入门', links: [{ url: 'https://www.bilibili.com/video/BV1ex411x7Em', type: 'bilibili' }], status: 'not_started' },
  { id: '2', name: '廖雪峰Python教程', description: '免费文档，边学边练，适合随时查阅', stage: '第一阶段：Python编程基础', category: 'Python入门', links: [{ url: 'https://www.liaoxuefeng.com/wiki/1016959663602400', type: 'docs' }], status: 'not_started' },
  { id: '3', name: '莫烦Python基础', description: '短小精悍，每个视频5-15分钟', stage: '第一阶段：Python编程基础', category: 'Python入门', links: [{ url: 'https://space.bilibili.com/243821484', type: 'bilibili' }], status: 'not_started' },
  { id: '4', name: 'Kaggle Python课程', description: '免费，边学边练，有 Kaggle 环境', stage: '第一阶段：Python编程基础', category: 'Python数据分析', links: [{ url: 'https://www.kaggle.com/learn/python', type: 'kaggle' }], status: 'not_started' },
  { id: '5', name: '王木头学科学 - AI科普系列', description: '零基础友好，动画讲解，每集10-15分钟', stage: '第二阶段：AI基本概念认知', category: 'AI入门科普', links: [{ url: 'https://www.bilibili.com/video/BV1gJ411v7dh', type: 'bilibili' }], status: 'not_started' },
  { id: '6', name: '3Blue1Brown 神经网络系列', description: '可视化讲解，直观理解神经网络原理，约4小时', stage: '第二阶段：AI基本概念认知', category: 'AI入门科普', links: [{ url: 'https://www.bilibili.com/video/BV1bx411M7Zx', type: 'bilibili' }], status: 'not_started' },
  { id: '7', name: 'Essence of Linear Algebra', description: '线性代数核心概念可视化，12集', stage: '第二阶段：AI基本概念认知', category: '数学基础', links: [{ url: 'https://www.bilibili.com/video/BV1ib411m7fd', type: 'bilibili' }], status: 'not_started' },
  { id: '8', name: 'Essence of Calculus', description: '微积分核心概念可视化', stage: '第二阶段：AI基本概念认知', category: '数学基础', links: [{ url: 'https://www.bilibili.com/video/BV1qW411N7FU', type: 'bilibili' }], status: 'not_started' },
  { id: '9', name: '机器之心 - 入门指南专栏', description: '精选入门文章', stage: '第二阶段：AI基本概念认知', category: '入门文章', links: [{ url: 'https://www.jiqizhixin.com/columns/ai-beginner', type: 'docs' }], status: 'not_started' },
  { id: '10', name: '吴恩达机器学习', description: '斯坦福大学教授，最经典的机器学习课程，约20小时', stage: '第三阶段：机器学习', category: '核心课程', links: [{ url: 'https://www.bilibili.com/video/BV164411b7dx', type: 'bilibili' }], status: 'not_started' },
  { id: '11', name: '李宏毅《机器学习》2024最新版', description: '台湾大学教授，讲解生动有趣，案例丰富，约30小时', stage: '第三阶段：机器学习', category: '核心课程', links: [{ url: 'https://www.bilibili.com/video/BV1Wv411h7kN', type: 'bilibili' }], status: 'not_started' },
  { id: '12', name: 'Kaggle入门课程', description: '免费，边学边练', stage: '第三阶段：机器学习', category: '实践练习', links: [{ url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'kaggle' }], status: 'not_started' },
  { id: '13', name: '莫烦Python机器学习', description: '代码驱动，快速上手', stage: '第三阶段：机器学习', category: '实践练习', links: [{ url: 'https://mofanpy.com/tutorials/machine-learning', type: 'docs' }], status: 'not_started' },
  { id: '14', name: '跟李沐学AI - 动手学深度学习', description: '亚马逊首席科学家李沐，代码实战驱动，约50小时', stage: '第四阶段：深度学习', category: '核心课程', links: [{ url: 'https://www.bilibili.com/video/BV1K64y1Q7wu', type: 'bilibili' }], status: 'not_started' },
  { id: '15', name: '李宏毅深度学习', description: '台湾教授授课，内容全面', stage: '第四阶段：深度学习', category: '核心课程', links: [{ url: 'https://www.bilibili.com/video/BV1Wv411h7kN', type: 'bilibili' }], status: 'not_started' },
  { id: '16', name: 'TensorFlow官方教程', description: '官方保证，内容准确', stage: '第四阶段：深度学习', category: '框架入门', links: [{ url: 'https://tensorflow.google.cn/tutorials', type: 'docs' }], status: 'not_started' },
  { id: '17', name: 'PyTorch官方教程', description: '快速上手实践', stage: '第四阶段：深度学习', category: '框架入门', links: [{ url: 'https://pytorch.org/tutorials', type: 'docs' }], status: 'not_started' },
  { id: '18', name: 'MNIST手写数字识别', description: '第一个深度学习项目', stage: '第四阶段：深度学习', category: '项目实战', links: [{ url: 'https://www.kaggle.com/c/digit-recognizer', type: 'kaggle' }], status: 'not_started' },
  { id: '19', name: 'CS231n CNN视觉识别', description: '计算机视觉标准课程，Numpy/PyTorch实现', stage: '第五阶段：专项方向', category: '计算机视觉', links: [{ url: 'https://www.bilibili.com/video/BV1nJ411z7fe', type: 'bilibili' }], status: 'not_started' },
  { id: '20', name: 'OpenCV入门', description: '计算机视觉基础', stage: '第五阶段：专项方向', category: '计算机视觉', links: [{ url: 'https://www.bilibili.com/video/BV1oJ411D71z', type: 'bilibili' }], status: 'not_started' },
  { id: '21', name: 'CS224n NLP深度学习', description: 'NLP标准课程，Transformer、BERT等', stage: '第五阶段：专项方向', category: '自然语言处理', links: [{ url: 'https://www.bilibili.com/video/BV1s4411N7fC', type: 'bilibili' }], status: 'not_started' },
  { id: '22', name: 'Transformer详解', description: 'Transformer架构详解', stage: '第五阶段：专项方向', category: '自然语言处理', links: [{ url: 'https://www.bilibili.com/video/BV1pu411o7BE', type: 'bilibili' }], status: 'not_started' },
  { id: '23', name: 'Hugging Face课程', description: '实战导向，学会使用预训练模型', stage: '第五阶段：专项方向', category: '自然语言处理', links: [{ url: 'https://huggingface.co/course/zh-CN', type: 'docs' }], status: 'not_started' },
  { id: '24', name: '李宏毅强化学习', description: '强化学习课程', stage: '第五阶段：专项方向', category: '强化学习', links: [{ url: 'https://www.bilibili.com/video/BV1MW411w79n', type: 'bilibili' }], status: 'not_started' },
  { id: '25', name: '莫烦Python强化学习', description: '强化学习实战', stage: '第五阶段：专项方向', category: '强化学习', links: [{ url: 'https://mofanpy.com/tutorials/machine-learning/reinforcement-learning', type: 'docs' }], status: 'not_started' },
  { id: '26', name: 'Kaggle竞赛', description: '免费数据集+GPU，实战竞赛', stage: '第六阶段：项目实战', category: '竞赛平台', links: [{ url: 'https://www.kaggle.com', type: 'kaggle' }], status: 'not_started' },
  { id: '27', name: '天池竞赛', description: '中文界面，比赛有奖金', stage: '第六阶段：项目实战', category: '竞赛平台', links: [{ url: 'https://tianchi.aliyun.com', type: 'docs' }], status: 'not_started' },
  { id: '28', name: '和鲸社区', description: '中文环境，项目模板多', stage: '第六阶段：项目实战', category: '竞赛平台', links: [{ url: 'https://www.heywhale.com', type: 'docs' }], status: 'not_started' },
  { id: '29', name: 'Google Colab', description: '无需安装，直接运行Python代码', stage: '第六阶段：项目实战', category: '在线环境', links: [{ url: 'https://colab.research.google.com', type: 'docs' }], status: 'not_started' },
  { id: '30', name: '百度AI Studio', description: '中文环境，免费算力充足', stage: '第六阶段：项目实战', category: '在线环境', links: [{ url: 'https://aistudio.baidu.com', type: 'docs' }], status: 'not_started' },
  { id: '31', name: 'TensorFlow完整学习路径', description: '官方中文教程', stage: '第四阶段：深度学习', category: '框架', links: [{ url: 'https://tensorflow.google.cn/tutorials', type: 'docs' }], status: 'not_started' },
  { id: '32', name: 'PyTorch完整学习路径', description: '官方教程', stage: '第四阶段：深度学习', category: '框架', links: [{ url: 'https://pytorch.org/tutorials', type: 'docs' }], status: 'not_started' },
  { id: '33', name: 'Hugging Face模型库', description: '预训练模型集散地', stage: '第五阶段：专项方向', category: '框架', links: [{ url: 'https://huggingface.co/models', type: 'docs' }], status: 'not_started' },
  { id: '34', name: '知乎AI学习', description: '问答社区', stage: '第二阶段：AI基本概念认知', category: '社区', links: [{ url: 'https://www.zhihu.com/topic/19551137', type: 'zhihu' }], status: 'not_started' },
  { id: '35', name: 'D2L教材（动手学深度学习）', description: '中英文双语教材', stage: '第四阶段：深度学习', category: '社区', links: [{ url: 'https://github.com/d2l-ai/d2l-zh', type: 'github' }], status: 'not_started' },
  { id: '36', name: '机器学习100天', description: 'GitHub学习项目', stage: '第三阶段：机器学习', category: '社区', links: [{ url: 'https://github.com/Avik-Jain/100-Days-Of-ML-Code', type: 'github' }], status: 'not_started' },
  { id: '37', name: '机器之心', description: '每日推送AI新闻、教程', stage: '第二阶段：AI基本概念认知', category: '移动学习', links: [{ url: 'https://www.jiqizhixin.com', type: 'docs' }], status: 'not_started' },
  { id: '38', name: 'Datawhale', description: '数据科学学习社区', stage: '第三阶段：机器学习', category: '移动学习', links: [{ url: 'https://www.datawhale.cn', type: 'docs' }], status: 'not_started' },
];

// ── AI Masters (20位) - Verified AI/ML YouTube Channels ─────────────
const AI_MASTERS = [
  { id: '1', name: 'Andrej Karpathy', cnName: '安德烈·卡尔帕西', twitter: 'karpathy', youtube: 'UCXUPKJO5MZQN11PqgIvyuvQ', avatarColor: 'from-orange-500 to-red-600' },
  { id: '2', name: 'Lex Fridman', cnName: '莱克斯·弗里德曼', twitter: 'lexfridman', youtube: 'UCSHZKyawb77ixDdsGog4iWA', avatarColor: 'from-gray-600 to-gray-900' },
  { id: '3', name: '3Blue1Brown', cnName: '3Blue1Brown数学', twitter: '3blue1brown', youtube: 'UCYO_jab_esuFRV4b17AJtAw', avatarColor: 'from-amber-500 to-orange-600' },
  { id: '4', name: 'Two Minute Papers', cnName: '两分钟论文', twitter: 'karoly_zsolnai', youtube: 'UCbfYPyITQ-7l4upoX8nvctg', avatarColor: 'from-blue-500 to-cyan-600' },
  { id: '5', name: 'sentdex', cnName: 'sentdex编程', twitter: 'sentdex', youtube: 'UCfzlCWGWYyIQ0aLC5w48gBQ', avatarColor: 'from-green-500 to-emerald-600' },
  { id: '6', name: 'Siraj Raval', cnName: '锡拉杰·拉瓦尔', twitter: 'sirajraval', youtube: 'UCWN3xxRkmTPmbKwht9FuE5A', avatarColor: 'from-red-500 to-rose-600' },
  { id: '7', name: 'Andrew Ng', cnName: '吴恩达', twitter: 'AndrewYNg', youtube: 'UC0nw93YVMDAuABkfDexpF2Q', avatarColor: 'from-blue-600 to-indigo-700' },
  { id: '8', name: 'StatQuest', cnName: '统计quest', twitter: 'JoshStarmer', youtube: 'UCtYLUTtgS3k1Fg4y5tAhLbw', avatarColor: 'from-purple-500 to-indigo-600' },
  { id: '9', name: 'Yannic Kilcher', cnName: '亚尼克·基尔彻', twitter: 'ykilcher', youtube: 'UCZHmQk67mSJgfCCTn7xBfew', avatarColor: 'from-pink-500 to-rose-600' },
  { id: '10', name: 'AI Explained', cnName: 'AI释义', twitter: '', youtube: 'UCNJ1Ymd5yFuUPtn21xtRbbw', avatarColor: 'from-teal-500 to-cyan-600' },
  { id: '11', name: 'David Shapiro', cnName: '大卫·夏皮罗', twitter: 'davidshapiro71', youtube: 'UCvKRFNawVcuz4b9ihUTApCg', avatarColor: 'from-cyan-500 to-blue-600' },
  { id: '12', name: 'Hugging Face', cnName: '抱脸网', twitter: 'huggingface', youtube: 'UCHlNU7kIZhRgSbhHvFoy72w', avatarColor: 'from-yellow-500 to-orange-600' },
  { id: '13', name: 'DeepLearning.AI', cnName: '深度学习AI', twitter: 'deeplearningai_', youtube: 'UCcIXc5mJsHVYTZR1maL5l9w', avatarColor: 'from-emerald-600 to-teal-700' },
  { id: '14', name: 'Google DeepMind', cnName: '谷歌DeepMind', twitter: 'GoogleDeepMind', youtube: 'UCP7jMXSY2xbc3KCAE0MHQ-A', avatarColor: 'from-blue-600 to-indigo-800' },
  { id: '15', name: 'Cognitive Revolution', cnName: '认知革命', twitter: '', youtube: 'UCjNRVMBVI30Sak_p6HRWhIA', avatarColor: 'from-indigo-500 to-purple-600' },
  { id: '16', name: 'Editminds AI', cnName: '编辑思维AI', twitter: 'editminds', youtube: 'UCv7abH3RYaI77SF-2Av_5GA', avatarColor: 'from-violet-500 to-purple-600' },
  { id: '17', name: 'AI Jason', cnName: 'AI杰森', twitter: 'aijasonz', youtube: 'UCrXSVX9a1mj8l0CMLwKgMVw', avatarColor: 'from-lime-500 to-green-600' },
  { id: '18', name: 'Dr. Alan D. Thompson', cnName: '艾伦·汤普森博士', twitter: '', youtube: 'UC00DrQVoCf9Liv4D0KV0rGw', avatarColor: 'from-yellow-500 to-amber-600' },
  { id: '19', name: 'Yann LeCun', cnName: '杨立昆', twitter: 'ylecun', youtube: 'UCMU7l2bIv6MXlgJR3-E33Dw', avatarColor: 'from-sky-500 to-blue-600' },
  { id: '20', name: 'Sebastian Raschka', cnName: '塞巴斯蒂安·拉什卡', twitter: 'rasbt', youtube: 'UC_CzsS7UTjcxJ-xXp1ftxtA', avatarColor: 'from-orange-600 to-red-700' },
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
    const response = await fetch(`/api/x?handle=${handle}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.posts || [];
  } catch {
    return [];
  }
}

async function performSearch(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data;
  } catch {
    return [];
  }
}

async function translateText(text: string, fromLang = 'en', toLang = 'zh'): Promise<string> {
  if (!text.trim()) return '';
  try {
    const response = await fetch(`/api/translate?text=${encodeURIComponent(text.substring(0, 2000))}&from=${fromLang}&to=${toLang}`);
    if (!response.ok) return text;
    const data = await response.json();
    return data.translatedText || text;
  } catch {
    return text;
  }
}

// ── App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<'dashboard' | 'resources' | 'masters' | 'progress' | 'search'>('dashboard');
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [masters, setMasters] = useState<AIMaster[]>(AI_MASTERS.map(m => ({ ...m, videos: [], posts: [] })));
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{ id: string; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  // Iframe viewer state
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerTitle, setViewerTitle] = useState('');

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

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

  // Share to NotebookLM
  const shareToNotebookLM = (resource: Resource) => {
    const urls = resource.links.map(l => l.url).join('\n');
    navigator.clipboard.writeText(urls);
    alert('链接已复制，请在 NotebookLM 中粘贴\nhttps://notebooklm.google.com/');
  };

  // Open resource in iframe viewer
  const openResource = (url: string, title: string) => {
    setViewerUrl(url);
    setViewerTitle(title);
  };

  // Close iframe viewer
  const closeViewer = () => {
    setViewerUrl(null);
    setViewerTitle('');
  };

  // Fetch master data when selected
  const fetchMasterData = useCallback(async (masterId: string) => {
    const master = AI_MASTERS.find(m => m.id === masterId);
    if (!master) return;
    const existing = masters.find(m => m.id === masterId);
    if (existing && existing.videos.length > 0) return;
    setMasters(prev => prev.map(m => m.id === masterId ? { ...m, loading: true } : m));
    const [videos, posts] = await Promise.all([
      master.youtube ? fetchYouTubeVideos(master.youtube) : Promise.resolve([]),
      master.twitter ? fetchXRss(master.twitter) : Promise.resolve([]),
    ]);
    setMasters(prev => prev.map(m => m.id === masterId ? { ...m, videos, posts, loading: false } : m));
  }, [masters]);

  useEffect(() => {
    if (selectedMasterId) fetchMasterData(selectedMasterId);
  }, [selectedMasterId]);

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

  // Theme-aware colors
  const bg = theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50';
  const text = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const sidebarBg = theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <ThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
      <div className={cn('min-h-screen', bg, text)}>
        {/* Iframe Viewer */}
        <AnimatePresence>
          {viewerUrl && (
            <IframeViewer url={viewerUrl} title={viewerTitle} onClose={closeViewer} theme={theme} />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={cn('fixed left-0 top-0 h-full w-64 p-6 hidden lg:flex flex-col z-20', sidebarBg, 'border-r')}>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">🧠</div>
              <h1 className="font-bold text-xl">AI学习追踪</h1>
            </div>
            <button onClick={toggleTheme} className={cn('p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors', theme === 'dark' ? 'text-yellow-400' : 'text-gray-500')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <nav className="space-y-2">
            <NavItem icon={<Home size={20} />} label="首页" active={page === 'dashboard'} onClick={() => setPage('dashboard')} theme={theme} />
            <NavItem icon={<BookOpen size={20} />} label="资源库" active={page === 'resources'} onClick={() => setPage('resources')} badge={resources.length} theme={theme} />
            <NavItem icon={<Users size={20} />} label="AI大神" active={page === 'masters'} onClick={() => setPage('masters')} badge={AI_MASTERS.length} theme={theme} />
            <NavItem icon={<TrendingUp size={20} />} label="学习进度" active={page === 'progress'} onClick={() => setPage('progress')} theme={theme} />
            <NavItem icon={<Search size={20} />} label="AI搜索" active={page === 'search'} onClick={() => setPage('search')} theme={theme} />
          </nav>

          {/* Progress */}
          <div className={cn('mt-auto rounded-2xl p-4 border', theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-indigo-50 border-indigo-100')}>
            <p className={cn('text-xs font-semibold uppercase tracking-wider mb-2', theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')}>今日目标</p>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{stats.completed}/{stats.total}</span>
              <span className={cn('text-sm font-bold', theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')}>{Math.round((stats.completed / stats.total) * 100)}%</span>
            </div>
            <div className={cn('w-full rounded-full h-2', theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-200')}>
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(stats.completed / stats.total) * 100}%` }} />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:ml-64 p-6">
          <AnimatePresence mode="wait">
            {page === 'dashboard' && <DashboardPage key="dashboard" stats={stats} resources={resources} onNavigate={setPage} theme={theme} />}
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
                onShareToNotebookLM={shareToNotebookLM}
                onOpenResource={openResource}
                theme={theme}
              />
            )}
            {page === 'masters' && (
              <MastersPage
                key="masters"
                masters={masters}
                selectedMasterId={selectedMasterId}
                setSelectedMasterId={setSelectedMasterId}
                onPlayVideo={setPlayingVideo}
                theme={theme}
              />
            )}
            {page === 'progress' && <ProgressPage key="progress" stats={stats} resources={resources} stages={LEARNING_STAGES} theme={theme} />}
            {page === 'search' && <SearchPage key="search" onOpenResult={openResource} theme={theme} />}
          </AnimatePresence>
        </main>

        {/* Video Modal */}
        <AnimatePresence>
          {playingVideo && (
            <VideoModal videoId={playingVideo.id} title={playingVideo.title} onClose={() => setPlayingVideo(null)} theme={theme} />
          )}
        </AnimatePresence>
      </div>
    </ThemeContext.Provider>
  );
}

// ── Iframe Viewer ──────────────────────────────────────────────────────
function IframeViewer({ url, title, onClose, theme }: { url: string; title: string; onClose: () => void; theme: Theme }) {
  const [translating, setTranslating] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState('');

  const handleTranslate = async () => {
    if (translatedTitle) {
      setTranslatedTitle('');
      return;
    }
    setTranslating(true);
    try {
      const result = await translateText(title);
      setTranslatedTitle(result);
    } finally {
      setTranslating(false);
    }
  };

  const displayTitle = translatedTitle || title;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: theme === 'dark' ? '#030712' : '#ffffff' }}
    >
      {/* Toolbar */}
      <div className={cn('flex items-center justify-between px-4 py-3 border-b', theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-100 border-gray-200 text-gray-900')}>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className={cn('p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            <ArrowLeft size={18} />
          </button>
          <p className="text-sm font-medium line-clamp-1 flex-1 mr-4">{displayTitle}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleTranslate}
            disabled={translating}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all', theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700', translatedTitle && 'opacity-80')}
          >
            {translating ? <Loader2 size={14} className="animate-spin" /> : <Languages size={14} />}
            {translatedTitle ? '显示原文' : '翻译标题'}
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer" className={cn('p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} title="外部打开">
            <ExternalLink size={16} />
          </a>
          <button onClick={onClose} className={cn('p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            <X size={16} />
          </button>
        </div>
      </div>
      {/* iframe */}
      <iframe src={url} className="flex-1 w-full border-0" title={title} sandbox="allow-scripts allow-same-origin allow-popups allow-forms" />
    </motion.div>
  );
}

// ── Dashboard Page ─────────────────────────────────────────────────────
function DashboardPage({ stats, resources, onNavigate, theme }: any) {
  const currentItem = resources.find(r => r.status === 'in_progress') || resources[0];
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">欢迎回来，学习者</h2>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>继续你的AI学习之旅</p>
      </header>

      {/* Current Learning */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white mb-8">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full mb-4 inline-block">{currentItem?.stage?.split('：')[0]}</span>
            <h3 className="text-2xl font-bold mb-2">{currentItem?.name}</h3>
            <p className="text-white/80">{currentItem?.description}</p>
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
        <StatCard label="总资源数" value={stats.total} icon={<BookOpen className="text-blue-600" />} theme={theme} />
        <StatCard label="学习中" value={stats.inProgress} icon={<Clock className="text-amber-600" />} theme={theme} />
        <StatCard label="已完成" value={stats.completed} icon={<CheckCircle2 className="text-emerald-600" />} theme={theme} />
        <StatCard label="AI大神" value={AI_MASTERS.length} icon={<Users className="text-purple-600" />} theme={theme} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        <button onClick={() => onNavigate('resources')} className={cn(cardBg, 'p-6 rounded-2xl border hover:shadow-lg transition-shadow text-left', cardBorder)}>
          <BookOpen className="text-indigo-600 mb-4" size={32} />
          <h3 className="font-bold mb-1">资源库</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500 text-sm'}>浏览38套学习资源</p>
        </button>
        <button onClick={() => onNavigate('masters')} className={cn(cardBg, 'p-6 rounded-2xl border hover:shadow-lg transition-shadow text-left', cardBorder)}>
          <Users className="text-indigo-600 mb-4" size={32} />
          <h3 className="font-bold mb-1">AI大神</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500 text-sm'}>关注20位AI领域专家</p>
        </button>
        <button onClick={() => onNavigate('progress')} className={cn(cardBg, 'p-6 rounded-2xl border hover:shadow-lg transition-shadow text-left', cardBorder)}>
          <TrendingUp className="text-indigo-600 mb-4" size={32} />
          <h3 className="font-bold mb-1">学习进度</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500 text-sm'}>追踪你的学习旅程</p>
        </button>
      </div>
    </motion.div>
  );
}

// ── Resources Page ─────────────────────────────────────────────────────
function ResourcesPage({ stages, resources, selectedStage, setSelectedStage, searchQuery, setSearchQuery, filterStatus, setFilterStatus, onToggleStatus, onShareToNotebookLM, onOpenResource, theme }: any) {
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">资源库</h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{resources.length} 个资源</p>
        </div>
      </header>

      {/* Search & Filters */}
      <div className={cn(cardBg, 'rounded-2xl border p-4 mb-6', cardBorder)}>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="搜索资源..." className={cn('w-full pl-10 pr-4 py-2.5 border-none rounded-xl', inputBg)} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className={cn('px-4 py-2.5 border-none rounded-xl', inputBg)} value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
            <option value="all">全部状态</option>
            <option value="not_started">未开始</option>
            <option value="in_progress">学习中</option>
            <option value="completed">已完成</option>
          </select>
        </div>

        {/* Stage Filter */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button onClick={() => setSelectedStage(null)} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', !selectedStage ? 'bg-indigo-600 text-white' : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            全部阶段
          </button>
          {stages.map(stage => (
            <button key={stage.name} onClick={() => setSelectedStage(selectedStage === stage.name ? null : stage.name)} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', selectedStage === stage.name ? 'bg-indigo-600 text-white' : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              {stage.icon} {stage.name.split('：')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Resource List */}
      <div className="space-y-4">
        {resources.map(resource => (
          <ResourceCard key={resource.id} resource={resource} onToggle={() => onToggleStatus(resource.id)} onShareToNotebookLM={() => onShareToNotebookLM(resource)} onOpen={() => onOpenResource(resource.links[0]?.url, resource.name)} theme={theme} />
        ))}
      </div>
    </motion.div>
  );
}

function ResourceCard({ resource, onToggle, onShareToNotebookLM, onOpen, theme }: { resource: Resource; onToggle: () => void; onShareToNotebookLM: () => void; onOpen: () => void; theme: Theme }) {
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const statusColors = {
    not_started: theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600',
    in_progress: theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700',
    completed: theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
  };
  const statusLabels = { not_started: '未开始', in_progress: '学习中', completed: '已完成' };
  const typeIcons: Record<string, string> = {
    bilibili: '🎬', youtube: '▶️', github: '💻', kaggle: '🏆', docs: '📄', zhihu: '💬',
  };
  const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={cn(cardBg, 'rounded-2xl border p-6 hover:shadow-lg transition-shadow', cardBorder)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={cn('text-sm', muted)}>{resource.stage.split('：')[0]}</span>
            <span className={cn('text-xs px-2 py-0.5 rounded', theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600')}>{resource.category}</span>
          </div>
          <h3 className="font-bold text-lg mb-1">{resource.name}</h3>
          <p className={cn('text-sm mb-4', muted)}>{resource.description}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Open in viewer button */}
            <button onClick={onOpen} className="inline-flex items-center gap-1 text-sm bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors">
              <Globe size={14} /> 内部打开
            </button>
            {/* NotebookLM Share Button */}
            <button onClick={onShareToNotebookLM} className="inline-flex items-center gap-1 text-sm bg-green-500/10 text-green-600 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition-colors">
              <Share2 size={14} /> NotebookLM
            </button>
            {/* Resource Links - external */}
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

// ── Masters Page: Left sidebar + Right panel ─────────────────────────
function MastersPage({ masters, selectedMasterId, setSelectedMasterId, onPlayVideo, theme }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'videos' | 'posts'>('videos');

  const filtered = masters.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.cnName.includes(searchQuery));
  const selectedMaster = masters.find(m => m.id === selectedMasterId);
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex gap-6 h-[calc(100vh-60px)]">
      {/* Left: Master List */}
      <div className={cn('w-80 rounded-2xl border p-5 flex flex-col', cardBg, cardBorder)}>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="text-orange-500" size={20} />
            <h2 className="text-xl font-bold">AI大神</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="搜索大神..." className={cn('w-full pl-9 pr-3 py-2 border-none rounded-xl text-sm', inputBg)} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.map(master => (
            <div
              key={master.id}
              onClick={() => setSelectedMasterId(master.id)}
              className={cn('flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all', selectedMasterId === master.id ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800')}
            >
              <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm', master.avatarColor)}>
                {master.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{master.cnName}</p>
                <p className={cn('text-xs truncate', muted)}>{master.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Master Detail */}
      <div className={cn('flex-1 rounded-2xl border p-6 flex flex-col overflow-hidden', cardBg, cardBorder)}>
        {selectedMaster ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-xl', selectedMaster.avatarColor)}>
                {selectedMaster.name[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{selectedMaster.cnName}</h3>
                <p className={cn('text-sm', muted)}>{selectedMaster.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  {selectedMaster.twitter && (
                    <a href={`https://twitter.com/${selectedMaster.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-sky-600 hover:underline">
                      <Twitter size={14} /> @{selectedMaster.twitter}
                    </a>
                  )}
                  {selectedMaster.youtube && (
                    <a href={`https://www.youtube.com/channel/${selectedMaster.youtube}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-red-600 hover:underline">
                      <Youtube size={14} /> YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={cn('flex gap-1 mb-4 border-b', theme === 'dark' ? 'border-gray-800' : 'border-gray-100')}>
              <button onClick={() => setActiveTab('videos')} className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors', activeTab === 'videos' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700')}>
                <div className="flex items-center gap-2"><Youtube size={14} /> 最新视频</div>
              </button>
              <button onClick={() => setActiveTab('posts')} className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors', activeTab === 'posts' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700')}>
                <div className="flex items-center gap-2"><Twitter size={14} /> 最新推文</div>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {selectedMaster.loading ? (
                <div className="flex items-center gap-2 text-gray-500 py-8 justify-center">
                  <Loader2 size={20} className="animate-spin" />
                  <span>加载中...</span>
                </div>
              ) : activeTab === 'videos' ? (
                selectedMaster.videos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedMaster.videos.map(video => (
                      <div key={video.id} onClick={() => onPlayVideo({ id: video.id, title: video.title })} className={cn('cursor-pointer rounded-xl overflow-hidden border hover:shadow-md transition-all group', theme === 'dark' ? 'border-gray-800 hover:border-indigo-700' : 'border-gray-100 hover:border-indigo-300')}>
                        <div className="relative">
                          <img src={video.thumbnail} alt={video.title} className="w-full aspect-video object-cover" />
                          <div className={cn('absolute bottom-0 left-0 right-0 px-3 py-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1', theme === 'dark' ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-800')}>
                            <Languages size={12} /> 翻译
                          </div>
                        </div>
                        <VideoCardContent video={video} theme={theme} />}
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <PlayCircle size={40} className="mb-3 opacity-50" />
                    <p>暂无视频</p>
                  </div>
                )
              ) : (
                selectedMaster.posts.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMaster.posts.map((post: any, idx: number) => (
                      <a key={idx} href={post.link} target="_blank" rel="noopener noreferrer" className={cn('block rounded-xl p-4 hover:shadow transition-colors', theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100')}>
                        <p className="text-sm line-clamp-3">{post.title}</p>
                        <p className={cn('text-xs mt-2', muted)}>{post.pubDate}</p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <Twitter size={40} className="mb-3 opacity-50" />
                    <p>暂无推文</p>
                  </div>
                )
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Users size={48} className="mb-4 opacity-30" />
            <p className="text-lg">请在左侧选择一位大神</p>
            <p className="text-sm mt-1">查看他的最新视频和推文</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Search Page with Tavily ─────────────────────────────────────────────
function SearchPage({ onOpenResult, theme }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const data = await performSearch(query);
      setResults(data);
    } finally {
      setIsSearching(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    if (platform === 'bilibili') return '🎬';
    if (platform === 'youtube') return '▶️';
    if (platform === 'github') return '💻';
    if (platform === 'twitter') return '🐦';
    return '🌐';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-indigo-600" size={28} />
          <h2 className="text-3xl font-bold">AI搜索</h2>
        </div>
        <p className={muted}>使用AI搜索全网最新资讯</p>
      </header>

      {/* Search Box */}
      <div className={cn(cardBg, 'rounded-2xl border p-6 mb-6', cardBorder)}>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="搜索任何AI相关内容..."
            className={cn('flex-1 px-4 py-3 border-none rounded-xl text-lg', inputBg)}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={isSearching} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
            {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            搜索
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((result, idx) => (
            <SearchResultCard key={idx} result={result} onOpen={onOpenResult} theme={theme} />
          ))}
        </div>
      ) : (
        !isSearching && (
          <div className="text-center py-16 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-30" />
            <p>输入关键词开始搜索</p>
          </div>
        )
      )}
    </motion.div>
  );
}

// ── Progress Page ─────────────────────────────────────────────────────
function ProgressPage({ stats, resources, stages, theme }: any) {
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">学习进度</h2>
        <p className={muted}>追踪你的学习旅程</p>
      </header>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className={cn(cardBg, 'rounded-2xl border p-6 text-center', cardBorder)}>
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className={muted}>总资源数</p>
        </div>
        <div className={cn(cardBg, 'rounded-2xl border p-6 text-center', cardBorder)}>
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-bold">{stats.completed}</p>
          <p className={muted}>已完成</p>
        </div>
        <div className={cn(cardBg, 'rounded-2xl border p-6 text-center', cardBorder)}>
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-amber-600" />
          </div>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
          <p className={muted}>学习中</p>
        </div>
      </div>

      {/* Stage Progress */}
      <div className={cn(cardBg, 'rounded-2xl border p-6 mb-6', cardBorder)}>
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
                  <span className={cn('text-sm', muted)}>{completed}/{stageResources.length}</span>
                </div>
                <div className={cn('w-full rounded-full h-3', theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100')}>
                  <div className="h-3 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: stage.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Progress */}
      <div className={cn(cardBg, 'rounded-2xl border p-6', cardBorder)}>
        <h3 className="font-bold text-lg mb-4">总体进度</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle className={theme === 'dark' ? 'text-gray-800' : 'text-gray-100'} cx="50%" cy="50%" r="45" fill="transparent" stroke="currentColor" strokeWidth="10" />
              <circle className="text-indigo-600" cx="50%" cy="50%" r="45" fill="transparent" stroke="currentColor" strokeWidth="10" strokeDasharray={283} strokeDashoffset={283 - (283 * stats.completed / stats.total)} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{Math.round((stats.completed / stats.total) * 100)}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className={cn('mb-4', muted)}>你已经完成了 {stats.completed} 个资源的学习，继续加油！</p>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
                <p className={cn('text-sm', muted)}>已完成</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
                <p className={cn('text-sm', muted)}>学习中</p>
              </div>
              <div className="text-center">
                <p className={cn('text-2xl font-bold', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>{stats.total - stats.completed - stats.inProgress}</p>
                <p className={cn('text-sm', muted)}>未开始</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Video Modal ──────────────────────────────────────────────────────────
function VideoModal({ videoId, title, onClose, theme }: { videoId: string; title: string; onClose: () => void; theme: Theme }) {
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
function NavItem({ icon, label, active = false, onClick, badge, theme }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; badge?: number; theme: Theme }) {
  return (
    <button onClick={onClick} className={cn('w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all', active ? 'bg-indigo-600 text-white' : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')}>
      <div className="flex items-center gap-3">{icon}<span className="font-medium">{label}</span></div>
      {badge !== undefined && <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', active ? 'bg-white/20 text-white' : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-indigo-100 text-indigo-600')}>{badge}</span>}
    </button>
  );
}

function SearchResultCard({ result, onOpen, theme }: { result: SearchResult; onOpen: (url: string, title: string) => void; theme: Theme }) {
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translating, setTranslating] = useState(false);
  const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

  const handleTranslate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (translatedTitle) {
      setTranslatedTitle('');
      return;
    }
    setTranslating(true);
    try {
      const result_t = await translateText(result.title);
      setTranslatedTitle(result_t);
    } finally {
      setTranslating(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    if (platform === 'bilibili') return '🎬';
    if (platform === 'youtube') return '▶️';
    if (platform === 'github') return '💻';
    if (platform === 'twitter') return '🐦';
    return '🌐';
  };

  return (
    <div
      className={cn(cardBg, 'rounded-2xl border p-5 hover:shadow-lg transition-all cursor-pointer group', cardBorder)}
      onClick={() => onOpen(result.url, translatedTitle || result.title)}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{getPlatformIcon(result.platform)}</span>
        <span className={cn('text-xs px-2 py-0.5 rounded', theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600')}>{result.platform}</span>
        <button
          onClick={handleTranslate}
          disabled={translating}
          className={cn('flex items-center gap-1 text-xs px-2 py-0.5 rounded-md ml-auto transition-all', theme === 'dark' ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100', translatedTitle && 'opacity-60')}
        >
          {translating ? <Loader2 size={10} className="animate-spin" /> : <Languages size={10} />}
          {translatedTitle ? '原文' : '翻译标题'}
        </button>
      </div>
      <h3 className="font-bold text-lg mb-1 text-indigo-600">{translatedTitle || result.title}</h3>
      <div className="flex items-center gap-3">
        <p className={cn('text-sm line-clamp-1', muted)}>{result.url}</p>
        <span className={cn('flex items-center gap-1 text-xs ml-auto', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
          <Globe size={12} /> 内部打开
        </span>
      </div>
    </div>
  );
}

function VideoCardContent({ video, theme }: { video: YoutubeVideo; theme: Theme }) {
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translating, setTranslating] = useState(false);
  const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const handleTranslate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (translatedTitle) {
      setTranslatedTitle('');
      return;
    }
    setTranslating(true);
    try {
      const result = await translateText(video.title);
      setTranslatedTitle(result);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="p-3">
      <p className="text-sm font-medium line-clamp-2">
        {translatedTitle || video.title}
      </p>
      <div className="flex items-center justify-between mt-1">
        <p className={cn('text-xs', muted)}>{video.publishedAt}</p>
        <button
          onClick={handleTranslate}
          disabled={translating}
          className={cn('flex items-center gap-1 text-xs px-2 py-0.5 rounded-md transition-all', theme === 'dark' ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100', translatedTitle && 'opacity-60')}
        >
          {translating ? <Loader2 size={10} className="animate-spin" /> : <Languages size={10} />}
          {translatedTitle ? '原文' : '翻译'}
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, theme }: any) {
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  return (
    <div className={cn(cardBg, 'rounded-2xl border p-6 text-center', cardBorder)}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-indigo-50">{icon}</div>
      <p className="text-3xl font-bold">{value}</p>
      <p className={muted + ' text-sm'}>{label}</p>
    </div>
  );
}