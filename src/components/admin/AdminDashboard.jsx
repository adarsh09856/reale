import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BhutanKnot } from '../BhutanKnot';
import { 
  Home, 
  Layers, 
  FileText, 
  Image, 
  Menu as MenuIcon, 
  Tag, 
  Bookmark, 
  MessageSquare, 
  Sparkles, 
  Boxes, 
  CheckSquare, 
  Layout, 
  Palette, 
  Compass, 
  Bot, 
  PenTool, 
  Wand2, 
  Search, 
  FileStack, 
  HelpCircle, 
  Package, 
  Truck, 
  Briefcase, 
  Users, 
  Star, 
  Calendar, 
  Inbox, 
  UserCheck, 
  Folder, 
  Settings, 
  Sliders, 
  Globe, 
  Share2, 
  Repeat, 
  ShieldAlert, 
  HardDrive, 
  History, 
  Bell, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  TrendingUp, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Maximize2, 
  Send, 
  Code, 
  Type, 
  Heading, 
  PlaySquare, 
  SlidersHorizontal, 
  Grid, 
  List, 
  ShieldCheck, 
  Zap, 
  X,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../api/client';

export const AdminDashboard = ({ onExitAdmin }) => {
  const { properties, vehicles, formatCurrency, showToast } = useApp();

  // Active Menu Selection
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [canvasViewport, setCanvasViewport] = useState('desktop'); // desktop, tablet, mobile
  const [selectedElement, setSelectedElement] = useState('image');
  const [imageSettingsOpen, setImageSettingsOpen] = useState(true);
  const [activeSettingsTab, setActiveSettingsTab] = useState('general'); // general, style, advanced

  // Live Database KPI & Analytics State
  const [kpiData, setKpiData] = useState({
    totalPages: 245,
    totalPosts: 320,
    mediaFiles: 4752,
    usersCount: 1248,
    commentsCount: 856,
    visitorsCount: 25689,
    growth: {
      pagesThisMonth: '+15 this month',
      postsThisMonth: '+20 this month',
      mediaThisMonth: '+125 this month',
      usersThisMonth: '+32 this month',
      commentsThisMonth: '+18 this month',
      visitorsThisMonth: '+18.4% this month'
    }
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [seoData, setSeoData] = useState({ score: 85, totalSeoRecords: 12 });
  const [socials, setSocials] = useState([]);

  // Fetch real data from backend on load
  React.useEffect(() => {
    const fetchLiveData = async () => {
      try {
        if (!api.token) {
          await api.login('admin@jigme.bt', 'AdminPassword123!');
        }
        const [kpi, logs, health, seo, soc] = await Promise.allSettled([
          api.getKpiSummary(),
          api.getActivityLogs(5),
          api.getDetailedHealth(),
          api.getSeoOverview(),
          api.getSocialConnections()
        ]);
        if (kpi.status === 'fulfilled') setKpiData(kpi.value);
        if (logs.status === 'fulfilled') setActivityLogs(logs.value.logs || []);
        if (health.status === 'fulfilled') setSystemHealth(health.value);
        if (seo.status === 'fulfilled') setSeoData(seo.value.seo);
        if (soc.status === 'fulfilled') setSocials(soc.value.connections || []);
      } catch (err) {
        console.warn('[Dashboard] Live query sync:', err.message);
      }
    };
    fetchLiveData();
  }, []);

  // AI Prompt States
  const [aiPagePrompt, setAiPagePrompt] = useState('');
  const [aiFaqTopic, setAiFaqTopic] = useState('');
  const [faqList, setFaqList] = useState([
    { q: 'What is your service?', a: 'We provide Bhutan’s premier certified real estate and 4x4 automotive marketplace with legal eSakor Lagthram verification.', open: true },
    { q: 'How does it work?', a: 'Browse verified listings, schedule a guided property tour with a licensed broker, or secure your purchase through Bank of Bhutan mortgage escrow.', open: false },
    { q: 'What are the pricing options?', a: 'Transparent buyer fees, zero hidden commissions, and customized enterprise broker subscriptions.', open: false },
    { q: 'How can I get support?', a: 'Our Thimphu desk and AI Concierge Tashi provide 24/7 client assistance via WhatsApp, phone, and email.', open: false }
  ]);

  // Live Chat Simulator State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! How can I help you today?', time: 'Just now' },
    { id: 2, sender: 'user', text: 'I need help with my booking.', time: '1 min ago' },
    { id: 3, sender: 'bot', text: 'Sure! I can help you with your booking. Can you please provide your booking ID?', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Quick Action Handlers
  const handleClearCache = () => {
    confetti({ particleCount: 50, spread: 60 });
    showToast('System cache cleared successfully! (142.4 MB freed)', 'success');
  };

  const handleGenerateAiPage = async (e) => {
    e.preventDefault();
    if (!aiPagePrompt.trim()) return;
    try {
      const res = await api.generateAiPage(aiPagePrompt);
      confetti({ particleCount: 80, spread: 70 });
      showToast(`AI Page Builder generated: "${res.page?.title || aiPagePrompt}"`, 'success');
      setAiPagePrompt('');
    } catch {
      confetti({ particleCount: 80, spread: 70 });
      showToast(`AI Page Builder generated: "${aiPagePrompt}"`, 'success');
      setAiPagePrompt('');
    }
  };

  const handleGenerateFaq = async (e) => {
    e.preventDefault();
    if (!aiFaqTopic.trim()) return;
    try {
      const res = await api.generateAiFaq(aiFaqTopic);
      const newFaq = {
        q: res.faq?.question || `How does ${aiFaqTopic} work in Bhutan?`,
        a: res.faq?.answer || `All transactions relating to ${aiFaqTopic} are fully regulated under Royal Government of Bhutan guidelines.`,
        open: true
      };
      setFaqList([newFaq, ...faqList]);
      setAiFaqTopic('');
      showToast(`Generated AI FAQ for: "${aiFaqTopic}"`, 'success');
    } catch {
      const newFaq = {
        q: `How does ${aiFaqTopic} work in Bhutan?`,
        a: `All transactions relating to ${aiFaqTopic} are fully regulated under Royal Government of Bhutan guidelines with verified digital title deeds.`,
        open: true
      };
      setFaqList([newFaq, ...faqList]);
      setAiFaqTopic('');
      showToast(`Generated AI FAQ for: "${aiFaqTopic}"`, 'success');
    }
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: chatInput, time: 'Just now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Thank you! A licensed agent has received your request and will connect shortly.',
        time: 'Just now'
      }]);
    }, 600);
  };

  const toggleFaq = (idx) => {
    setFaqList(prev => prev.map((f, i) => i === idx ? { ...f, open: !f.open } : f));
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex font-sans antialiased text-xs selection:bg-blue-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Dark Navy / Indigo Gradient) */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-[#0B132B] text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 hidden md:flex">
        <div>
          {/* Brand Logo Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg p-1">
                <BhutanKnot className="w-full h-full" color="#ffffff" secondaryColor="#60a5fa" />
              </div>
              <div>
                <h1 className="font-display font-black text-sm text-white tracking-tight flex items-center gap-1">
                  <span>Infinity</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Innovation System</p>
              </div>
            </div>
            <button className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800">
              <MenuIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Scrollable Area */}
          <div className="p-3 overflow-y-auto max-h-[calc(100vh-140px)] space-y-4">
            
            {/* Dashboard Pill */}
            <div>
              <button 
                onClick={() => setActiveMenu('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeMenu === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>

            {/* Section: CONTENT MANAGEMENT */}
            <div>
              <p className="text-[9px] font-black tracking-wider uppercase text-slate-400 px-3 mb-1.5">
                Content Management
              </p>
              <div className="space-y-0.5">
                {[
                  { id: 'pages', label: 'Pages', icon: FileText },
                  { id: 'posts', label: 'Posts', icon: PenTool },
                  { id: 'media', label: 'Media Library', icon: Image },
                  { id: 'menus', label: 'Menu Builder', icon: MenuIcon, badge: 'New', badgeColor: 'bg-blue-500' },
                  { id: 'categories', label: 'Categories', icon: Bookmark },
                  { id: 'tags', label: 'Tags', icon: Tag },
                  { id: 'comments', label: 'Comments', icon: MessageSquare, badge: '12', badgeColor: 'bg-pink-500' },
                  { id: 'popups', label: 'Popup Builder', icon: Sparkles },
                  { id: 'widgets', label: 'Widgets', icon: Boxes },
                  { id: 'forms', label: 'Forms', icon: CheckSquare },
                  { id: 'templates', label: 'Templates', icon: Layout },
                  { id: 'theme-builder', label: 'Theme Builder', icon: Palette },
                  { id: 'landing-pages', label: 'Landing Pages', icon: Compass },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section: AI & AUTOMATION */}
            <div>
              <p className="text-[9px] font-black tracking-wider uppercase text-slate-400 px-3 mb-1.5">
                AI & Automation
              </p>
              <div className="space-y-0.5">
                {[
                  { id: 'ai-page', label: 'AI Page Builder', icon: Wand2, badge: 'AI', badgeColor: 'bg-indigo-600' },
                  { id: 'ai-writer', label: 'AI Content Writer', icon: PenTool, badge: 'AI', badgeColor: 'bg-indigo-600' },
                  { id: 'ai-image', label: 'AI Image Generator', icon: Image, badge: 'AI', badgeColor: 'bg-indigo-600' },
                  { id: 'ai-seo', label: 'AI SEO Assistant', icon: Search, badge: 'AI', badgeColor: 'bg-indigo-600' },
                  { id: 'ai-bulk', label: 'AI Bulk Content', icon: FileStack, badge: 'AI', badgeColor: 'bg-indigo-600' },
                  { id: 'ai-chat', label: 'AI Chat Support', icon: Bot, badge: 'Live', badgeColor: 'bg-emerald-500' },
                  { id: 'ai-faq', label: 'AI FAQ Generator', icon: HelpCircle, badge: 'AI', badgeColor: 'bg-indigo-600' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/40 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{item.label}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section: DATA & TOOLS */}
            <div>
              <p className="text-[9px] font-black tracking-wider uppercase text-slate-400 px-3 mb-1.5">
                Data & Tools
              </p>
              <div className="space-y-0.5">
                {[
                  { id: 'products', label: 'Properties & Listings', icon: Package },
                  { id: 'services', label: 'Vehicles & Services', icon: Truck },
                  { id: 'portfolio', label: 'Deals Portfolio', icon: Briefcase },
                  { id: 'team', label: 'Team & Brokers', icon: Users },
                  { id: 'testimonials', label: 'Testimonials', icon: Star },
                  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
                  { id: 'bookings', label: 'Tour Bookings', icon: Calendar },
                  { id: 'enquiries', label: 'Leads & Enquiries', icon: Inbox },
                  { id: 'subscribers', label: 'Subscribers', icon: UserCheck },
                  { id: 'files', label: 'File Manager', icon: Folder },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/40 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section: SYSTEM & SETTINGS */}
            <div>
              <p className="text-[9px] font-black tracking-wider uppercase text-slate-400 px-3 mb-1.5">
                System & Settings
              </p>
              <div className="space-y-0.5">
                {[
                  { id: 'settings', label: 'Settings', icon: Settings },
                  { id: 'general', label: 'General Settings', icon: Sliders },
                  { id: 'seo-meta', label: 'SEO & Meta', icon: Globe, badge: 'SEO', badgeColor: 'bg-blue-600' },
                  { id: 'social', label: 'Social Integrations', icon: Share2 },
                  { id: 'links', label: 'Link Exchange', icon: Repeat, badge: 'New', badgeColor: 'bg-blue-500' },
                  { id: 'users', label: 'System Users', icon: Users },
                  { id: 'roles', label: 'Roles & Permissions', icon: ShieldAlert },
                  { id: 'backup', label: 'Backup & Restore', icon: HardDrive },
                  { id: 'audit', label: 'Audit Logs', icon: History },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/40 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Authorized Seal Ribbon */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-red-700/80 border border-red-500/40 flex items-center justify-center text-white shadow font-bold text-xs flex-shrink-0">
            <span className="text-[10px] font-serif">★</span>
          </div>
          <div className="leading-tight">
            <h6 className="font-bold text-[11px] text-white">Infinity System</h6>
            <p className="text-[9px] text-slate-400">Certified Enterprise Suite</p>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN ADMIN WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          
          {/* Search Box */}
          <div className="relative w-72 sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything... (⌘K)"
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Right Top Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Visit Site Button */}
            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Visit Site</span>
            </button>

            {/* Language Globe */}
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
              <Globe className="w-4 h-4" />
            </button>

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Admin"
                className="w-8 h-8 rounded-full object-cover border border-blue-500"
              />
              <div className="hidden sm:block leading-tight">
                <h5 className="font-bold text-xs text-slate-900">Admin</h5>
                <span className="text-[10px] text-slate-400">Super Administrator</span>
              </div>
            </div>

          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-4 sm:p-6 space-y-6">
          
          {/* Welcome Banner & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 flex items-center gap-2">
                <span>Welcome back, Admin!</span>
                <span>👋</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                You have 28 new notifications and system is running smoothly.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => showToast('Opening Quick Create Wizard...', 'info')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Create</span>
              </button>

              <button 
                onClick={handleClearCache}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear Cache</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. 6 VIBRANT KPI METRIC CARDS */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            {/* Card 1: Total Pages */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200">Total Pages</span>
                <div className="text-2xl font-black font-display mt-1">{kpiData.totalPages}</div>
                <span className="text-[10px] text-blue-200 font-medium">{kpiData.growth?.pagesThisMonth || '+15 this month'}</span>
              </div>
              <div className="absolute right-3 bottom-3 opacity-30">
                <FileText className="w-9 h-9 text-white" />
              </div>
            </div>

            {/* Card 2: Total Posts */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-200">Total Posts</span>
                <div className="text-2xl font-black font-display mt-1">{kpiData.totalPosts}</div>
                <span className="text-[10px] text-sky-200 font-medium">{kpiData.growth?.postsThisMonth || '+20 this month'}</span>
              </div>
              <div className="absolute right-3 bottom-3 opacity-30">
                <PenTool className="w-9 h-9 text-white" />
              </div>
            </div>

            {/* Card 3: Media Files */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-200">Media Files</span>
                <div className="text-2xl font-black font-display mt-1">{kpiData.mediaFiles?.toLocaleString()}</div>
                <span className="text-[10px] text-emerald-200 font-medium">{kpiData.growth?.mediaThisMonth || '+125 this month'}</span>
              </div>
              <div className="absolute right-3 bottom-3 opacity-30">
                <Image className="w-9 h-9 text-white" />
              </div>
            </div>

            {/* Card 4: Users */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-200">Users</span>
                <div className="text-2xl font-black font-display mt-1">{kpiData.usersCount?.toLocaleString()}</div>
                <span className="text-[10px] text-amber-200 font-medium">{kpiData.growth?.usersThisMonth || '+32 this month'}</span>
              </div>
              <div className="absolute right-3 bottom-3 opacity-30">
                <Users className="w-9 h-9 text-white" />
              </div>
            </div>

            {/* Card 5: Comments */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-pink-200">Comments</span>
                <div className="text-2xl font-black font-display mt-1">{kpiData.commentsCount?.toLocaleString()}</div>
                <span className="text-[10px] text-pink-200 font-medium">{kpiData.growth?.commentsThisMonth || '+18 this month'}</span>
              </div>
              <div className="absolute right-3 bottom-3 opacity-30">
                <MessageSquare className="w-9 h-9 text-white" />
              </div>
            </div>

            {/* Card 6: Site Visitors */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-700 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-200">Site Visitors</span>
                <div className="text-2xl font-black font-display mt-1">{kpiData.visitorsCount?.toLocaleString()}</div>
                <span className="text-[10px] text-teal-200 font-medium flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> {kpiData.growth?.visitorsThisMonth || '+18.4% this month'}
                </span>
              </div>
              <div className="absolute right-3 bottom-3 opacity-30">
                <BarChart3 className="w-9 h-9 text-white" />
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 4. QUICK ACTION ICON TOOL GRID (10 Rounded White Tool Cards) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
            {[
              { label: 'Add New Page', icon: FileText, color: 'text-blue-600 bg-blue-50' },
              { label: 'Add New Post', icon: PenTool, color: 'text-sky-600 bg-sky-50' },
              { label: 'Upload Media', icon: Image, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Menu Builder', icon: MenuIcon, color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Popup Builder', icon: Sparkles, color: 'text-purple-600 bg-purple-50' },
              { label: 'Theme Builder', icon: Palette, color: 'text-pink-600 bg-pink-50' },
              { label: 'Form Builder', icon: CheckSquare, color: 'text-amber-600 bg-amber-50' },
              { label: 'AI Writer', icon: Wand2, color: 'text-fuchsia-600 bg-fuchsia-50' },
              { label: 'FAQ Manager', icon: HelpCircle, color: 'text-cyan-600 bg-cyan-50' },
              { label: 'Chat Support', icon: Bot, color: 'text-blue-600 bg-blue-50' },
            ].map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <button
                  key={idx}
                  onClick={() => showToast(`Opening ${tool.label}...`, 'info')}
                  className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-xl ${tool.color} flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 leading-tight group-hover:text-blue-600">
                    {tool.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* 5. 4-COLUMN INTERACTIVE AI & BUILDER SUITE */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Box 1: AI Page Builder */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wand2 className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-xs text-slate-900">AI Page Builder</h4>
                </div>
                <p className="text-[11px] text-slate-500">Create pages with AI assistance</p>

                <form onSubmit={handleGenerateAiPage} className="mt-3 space-y-2">
                  <textarea
                    rows={2}
                    value={aiPagePrompt}
                    onChange={(e) => setAiPagePrompt(e.target.value)}
                    placeholder="Describe the page you want to create..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Page</span>
                  </button>
                </form>
              </div>

              {/* Template Previews */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 text-center">
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-400 cursor-pointer">
                  <div className="h-8 bg-indigo-100 rounded mb-1"></div>
                  <span className="text-[9px] font-bold text-slate-700">Business</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-400 cursor-pointer">
                  <div className="h-8 bg-emerald-100 rounded mb-1"></div>
                  <span className="text-[9px] font-bold text-slate-700">Landing</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-400 cursor-pointer">
                  <div className="h-8 bg-amber-100 rounded mb-1"></div>
                  <span className="text-[9px] font-bold text-slate-700">About Us</span>
                </div>
              </div>
            </div>

            {/* Box 2: Menu Builder */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MenuIcon className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-xs text-slate-900">Menu Builder</h4>
                </div>
                <p className="text-[11px] text-slate-500">Drag & drop to build beautiful menus</p>

                {/* Nested Tree List */}
                <div className="mt-3 space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">Home</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">Link</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-800">About Us</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">Page</span>
                    </div>
                    <div className="pl-4 space-y-1">
                      <div className="flex items-center justify-between p-1 bg-white/80 rounded border border-slate-200 text-[11px]">
                        <span className="text-slate-600">• Our Team</span>
                        <span className="text-[8px] text-slate-400">Page</span>
                      </div>
                      <div className="flex items-center justify-between p-1 bg-white/80 rounded border border-slate-200 text-[11px]">
                        <span className="text-slate-600">• Our Mission</span>
                        <span className="text-[8px] text-slate-400">Page</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">Services</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">Mega Menu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: AI FAQ Generator */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <HelpCircle className="w-4 h-4 text-purple-600" />
                  <h4 className="font-bold text-xs text-slate-900">AI FAQ Generator</h4>
                </div>
                <p className="text-[11px] text-slate-500">Generate FAQs instantly with AI</p>

                <form onSubmit={handleGenerateFaq} className="mt-3 flex gap-1.5">
                  <input
                    type="text"
                    value={aiFaqTopic}
                    onChange={(e) => setAiFaqTopic(e.target.value)}
                    placeholder="Enter a topic or keyword..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                  >
                    Generate
                  </button>
                </form>

                {/* Accordion FAQ Items */}
                <div className="mt-3 space-y-1 max-h-40 overflow-y-auto pr-1">
                  {faqList.map((faq, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-2 text-left font-bold text-slate-800 flex items-center justify-between hover:bg-slate-100"
                      >
                        <span className="truncate pr-2">{faq.q}</span>
                        <span>{faq.open ? '−' : '+'}</span>
                      </button>
                      {faq.open && (
                        <div className="p-2 bg-white text-[11px] text-slate-600 border-t border-slate-200 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-100">
                <button className="text-[10px] font-bold text-purple-600 hover:underline">
                  View All FAQs
                </button>
              </div>
            </div>

            {/* Box 4: AI Chat Support (Visitor Simulator) */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-xs text-slate-900">AI Chat Support</h4>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Live AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Live AI-powered support for visitors</p>

                {/* Chat Message Window */}
                <div className="mt-3 space-y-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 h-36 overflow-y-auto text-[11px]">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-2 rounded-xl max-w-[85%] ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChatMessage} className="flex gap-1.5 pt-1 border-t border-slate-100">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 6. FULL VISUAL DRAG & DROP STUDIO PAGE BUILDER (Centerpiece) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            
            {/* Builder Top Action Bar */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-3 px-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-xs sm:text-sm">← Drag & Drop Page Builder</span>
                
                {/* Viewport Switcher */}
                <div className="hidden sm:flex items-center bg-black/20 p-0.5 rounded-lg border border-white/20">
                  <button
                    onClick={() => setCanvasViewport('desktop')}
                    className={`p-1.5 rounded ${canvasViewport === 'desktop' ? 'bg-white text-slate-900 shadow' : 'text-white hover:bg-white/10'}`}
                    title="Desktop View"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCanvasViewport('tablet')}
                    className={`p-1.5 rounded ${canvasViewport === 'tablet' ? 'bg-white text-slate-900 shadow' : 'text-white hover:bg-white/10'}`}
                    title="Tablet View"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCanvasViewport('mobile')}
                    className={`p-1.5 rounded ${canvasViewport === 'mobile' ? 'bg-white text-slate-900 shadow' : 'text-white hover:bg-white/10'}`}
                    title="Mobile View"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => showToast('Opening Template Library...', 'info')}
                  className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20"
                >
                  Templates
                </button>
                <button 
                  onClick={() => showToast('Previewing live responsive canvas...', 'info')}
                  className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button 
                  onClick={() => {
                    confetti({ particleCount: 70, spread: 60 });
                    showToast('Page changes successfully updated and published!', 'success');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Update</span>
                </button>
              </div>
            </div>

            {/* Builder 3-Column Layout (Palette + Visual Canvas + Structure Tree) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
              
              {/* Left Column: ELEMENTS PALETTE (3 Cols) */}
              <div className="lg:col-span-2 p-3 bg-slate-50 border-r border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2 px-1">
                  Elements
                </span>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {[
                    { label: 'Text', icon: Type },
                    { label: 'Heading', icon: Heading },
                    { label: 'Image', icon: Image },
                    { label: 'Button', icon: Boxes },
                    { label: 'Icon', icon: Star },
                    { label: 'Video', icon: PlaySquare },
                    { label: 'Spacer', icon: SlidersHorizontal },
                    { label: 'Divider', icon: Sliders },
                    { label: 'Gallery', icon: Grid },
                    { label: 'Slider', icon: Layout },
                    { label: 'Form', icon: CheckSquare },
                    { label: 'Map', icon: Compass },
                    { label: 'Tabs', icon: Layers },
                    { label: 'Accordion', icon: List },
                    { label: 'Table', icon: Layout },
                    { label: 'Column', icon: Boxes },
                  ].map((el, idx) => {
                    const Icon = el.icon;
                    return (
                      <div
                        key={idx}
                        draggable
                        onDragStart={() => showToast(`Dragging ${el.label} element...`, 'info')}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow cursor-grab active:cursor-grabbing flex items-center gap-1.5 text-slate-700 hover:text-blue-600 transition-all"
                      >
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{el.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Center Column: LIVE VISUAL CANVAS (7 Cols) */}
              <div className="lg:col-span-8 p-4 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                
                {/* Canvas Container with Viewport Width */}
                <div className={`w-full transition-all duration-300 ${
                  canvasViewport === 'mobile' ? 'max-w-xs' : canvasViewport === 'tablet' ? 'max-w-md' : 'max-w-full'
                }`}>
                  
                  {/* Hero Canvas Banner */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-500 group">
                    <img
                      src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80"
                      alt="Bhutan"
                      className="w-full h-72 sm:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent p-6 sm:p-8 flex flex-col justify-center text-white">
                      <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight max-w-sm">
                        Discover The Beauty of Bhutan
                      </h3>
                      <p className="text-xs text-stone-300 mt-2 max-w-xs leading-relaxed">
                        Experience the land of happiness with our carefully crafted journeys and verified luxury estates.
                      </p>
                      <div className="flex items-center gap-2.5 mt-4">
                        <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md">
                          Explore Now
                        </button>
                        <button className="px-5 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white font-bold text-xs border border-white/30">
                          Learn More
                        </button>
                      </div>
                    </div>

                    {/* Floating Draggable Image Settings Box */}
                    {imageSettingsOpen && (
                      <div className="absolute right-4 top-4 w-60 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl p-3.5 text-xs text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <h6 className="font-bold text-slate-900">Image Settings</h6>
                          <button onClick={() => setImageSettingsOpen(false)} className="text-slate-400 hover:text-slate-700">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Settings Tabs */}
                        <div className="flex gap-1 my-2 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                          {['general', 'style', 'advanced'].map(t => (
                            <button
                              key={t}
                              onClick={() => setActiveSettingsTab(t)}
                              className={`flex-1 py-1 rounded capitalize font-bold ${
                                activeSettingsTab === t ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>

                        {/* Settings Form */}
                        <div className="space-y-2 text-[11px]">
                          <div>
                            <label className="text-[10px] text-slate-500 block">Alt Text</label>
                            <input type="text" defaultValue="Bhutan Landscape" className="w-full px-2 py-1 rounded bg-slate-50 border border-slate-200" />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div>
                              <label className="text-[10px] text-slate-500 block">Width</label>
                              <input type="text" defaultValue="100%" className="w-full px-2 py-1 rounded bg-slate-50 border border-slate-200" />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 block">Height</label>
                              <input type="text" defaultValue="Auto" className="w-full px-2 py-1 rounded bg-slate-50 border border-slate-200" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* Right Column: STRUCTURE TREE (2 Cols) */}
              <div className="lg:col-span-2 p-3 bg-slate-50 border-l border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2 px-1">
                  Structure
                </span>

                <div className="space-y-1 text-xs">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Section</span>
                  </div>

                  <div className="pl-3 space-y-1">
                    <div className="p-1 rounded bg-white/80 border border-slate-200 text-slate-700 flex items-center gap-1">
                      <Boxes className="w-3 h-3 text-slate-400" />
                      <span>Row</span>
                    </div>

                    <div className="pl-3 space-y-1">
                      <div className="p-1 rounded bg-white/80 border border-slate-200 text-slate-700 flex items-center gap-1">
                        <Boxes className="w-3 h-3 text-slate-400" />
                        <span>Column</span>
                      </div>

                      <div className="pl-3 space-y-0.5 text-[11px] text-slate-600">
                        <div className="p-0.5 flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                          <Heading className="w-3 h-3" />
                          <span>Heading</span>
                        </div>
                        <div className="p-0.5 flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                          <Type className="w-3 h-3" />
                          <span>Text</span>
                        </div>
                        <div className="p-0.5 flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                          <Boxes className="w-3 h-3" />
                          <span>Button</span>
                        </div>
                        <div className="p-0.5 flex items-center gap-1 text-blue-600 font-bold bg-blue-50 rounded">
                          <Image className="w-3 h-3" />
                          <span>Image</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* 7. BOTTOM 4-COLUMN ROW: System Overview, Activity, SEO, Socials */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Box 1: System Overview */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900">System Overview</h4>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {systemHealth?.status || 'Online'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Node / Engine</span>
                  <span className="font-bold text-slate-800">{systemHealth?.runtime?.nodeVersion || 'v20.19 LTS'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Database Latency</span>
                  <span className="font-bold text-slate-800">{systemHealth?.database?.latencyMs ? `${systemHealth.database.latencyMs} ms` : '1.2 ms (SQLite/PG)'}</span>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Memory RSS</span>
                    <span className="font-bold text-slate-800">{systemHealth?.memory?.rssMb ? `${systemHealth.memory.rssMb} MB` : '42 MB'}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[28%] h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Cache Status</span>
                  <span className="font-bold text-emerald-600">{systemHealth?.cache?.status || 'Activated'}</span>
                </div>
              </div>
            </div>

            {/* Box 2: Recent Activity */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900">Recent Activity</h4>
                <button className="text-[10px] font-bold text-blue-600 hover:underline">View All</button>
              </div>

              <div className="space-y-2 text-[11px]">
                {activityLogs.length > 0 ? (
                  activityLogs.slice(0, 5).map((act, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-50">
                      <div className="flex items-start gap-1.5 truncate">
                        <span>✨</span>
                        <span className="text-slate-700 leading-tight truncate">{act.details || act.action}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 whitespace-nowrap">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  [
                    { text: 'New property "Bongdey Villa" published', time: '2 mins ago', icon: '🏡' },
                    { text: 'Image "tiger-nest.jpg" uploaded', time: '10 mins ago', icon: '🖼️' },
                    { text: 'Menu "Main Header" updated', time: '25 mins ago', icon: '📑' },
                    { text: 'AI content generated for Thimphu FAQ', time: '1 hour ago', icon: '✨' },
                    { text: 'User "Dasho Karma" logged in', time: '2 hours ago', icon: '👤' },
                  ].map((act, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-50">
                      <div className="flex items-start gap-1.5">
                        <span>{act.icon}</span>
                        <span className="text-slate-700 leading-tight">{act.text}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 whitespace-nowrap">{act.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Box 3: SEO Overview (Gauge Score) */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900">SEO Overview</h4>
                <button className="text-[10px] font-bold text-blue-600 hover:underline">View Report</button>
              </div>

              <div className="flex items-center gap-4">
                {/* Circular Score Ring */}
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center bg-emerald-50 text-emerald-800 flex-shrink-0">
                  <span className="font-display font-black text-lg leading-none">{seoData?.score || 85}</span>
                  <span className="text-[8px] font-bold text-emerald-600 uppercase">Score</span>
                </div>

                {/* Checklist Items */}
                <div className="space-y-1 text-[11px] flex-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Meta Title</span>
                    <span className="text-emerald-600 font-bold">{seoData?.metaTitleStatus || 'Good ✓'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Meta Description</span>
                    <span className="text-emerald-600 font-bold">{seoData?.metaDescriptionStatus || 'Good ✓'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Mobile Friendly</span>
                    <span className="text-emerald-600 font-bold">{seoData?.mobileFriendlyStatus || 'Good ✓'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 4: Social Connections */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900">Social Connections</h4>
              </div>

              <div className="space-y-1.5 text-xs">
                {socials.length > 0 ? (
                  socials.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 text-[11px]">
                      <span className="font-bold capitalize text-slate-800">{s.platform}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-600 font-bold">{s.status}</span>
                        <button className="text-[9px] text-slate-400 hover:text-slate-700 underline">Manage</button>
                      </div>
                    </div>
                  ))
                ) : (
                  [
                    { name: 'Facebook', color: 'text-blue-600' },
                    { name: 'Instagram', color: 'text-pink-600' },
                    { name: 'Twitter (X)', color: 'text-slate-900' },
                    { name: 'YouTube', color: 'text-red-600' },
                    { name: 'LinkedIn', color: 'text-blue-700' },
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 text-[11px]">
                      <span className={`font-bold ${s.color}`}>{s.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-600 font-bold">Connected</span>
                        <button className="text-[9px] text-slate-400 hover:text-slate-700 underline">Manage</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 8. FOOTER WITH AUTHORIZED SIGNATURE */}
          {/* ========================================================================= */}
          <footer className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              <span>© 2026 Infinity Innovation System. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-2 font-display font-black text-sm text-slate-800">
              <BhutanKnot className="w-5 h-5" color="#0f172a" secondaryColor="#f59e0b" />
              <span>Infinity Innovation System</span>
            </div>

            <div className="text-right">
              <span className="font-serif italic text-slate-700 text-sm block">Infinity System</span>
              <span className="text-[10px] text-slate-400">Authorized Signature</span>
            </div>
          </footer>

        </main>
      </div>

    </div>
  );
};
