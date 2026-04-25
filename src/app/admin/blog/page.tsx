'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    Plus, Trash2, Edit, Save, X, ArrowLeft, Bold, Italic, 
    Underline, List, ListOrdered, Quote, Link as LinkIcon, 
    Image as ImageIcon, Code, ChevronRight, Eye, MoreVertical, 
    Calendar, Tag, Layers, MessageSquare, CheckCircle2, 
    Clock, Brain, Search, Sparkles
} from 'lucide-react';
import Image from 'next/image';
import MediaPicker from '@/components/admin/MediaPicker';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function BlogManagement() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [editingPost, setEditingPost] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: 'Wellness & Microdosing',
        tags: ['Fusion Bars'],
        isPublic: true,
        allowComments: true,
        targetKeyword: '',
        seoTitle: '',
        seoDescription: '',
        imageAlt: ''
    });
    const [tagInput, setTagInput] = useState('');
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [mediaTarget, setMediaTarget] = useState<'featured' | 'content'>('featured');
    const editorRef = useRef<any>(null);

    // List Filtering State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/blog');
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (publishOverride?: boolean) => {
        if (!formData.title || !formData.content) {
            alert('Title and Content are required.');
            return;
        }
        setIsSaving(true);
        const targetIsPublic = publishOverride !== undefined ? publishOverride : formData.isPublic;
        const method = editingPost ? 'PUT' : 'POST';
        const body = { ...formData, isPublic: targetIsPublic, id: editingPost?.id };

        try {
            const res = await fetch('/api/admin/blog', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                await fetchPosts();
                setView('list');
                setEditingPost(null);
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error || 'Failed to save'}`);
            }
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchPosts();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const handleDuplicate = async (post: any, e: React.MouseEvent) => {
        e.stopPropagation();
        const body = { ...post, id: undefined, title: `${post.title} (Copy)`, isPublic: false, slug: undefined };
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) fetchPosts();
        } catch (error) {
            console.error('Duplicate failed');
        } finally {
            setIsSaving(false);
        }
    };

    const openEditor = (post: any = null) => {
        if (post) {
            setEditingPost(post);
            let parsedTags = ['Fusion Bars'];
            try {
                if (typeof post.tags === 'string') parsedTags = JSON.parse(post.tags);
                else if (Array.isArray(post.tags)) parsedTags = post.tags;
            } catch (e) {}

            setFormData({
                title: post.title,
                excerpt: post.excerpt || '',
                content: post.content,
                image: post.image || '',
                category: post.category || 'Wellness & Microdosing',
                tags: parsedTags,
                isPublic: post.isPublic ?? true,
                allowComments: post.allowComments ?? true,
                targetKeyword: post.targetKeyword || '',
                seoTitle: post.seoTitle || '',
                seoDescription: post.seoDescription || '',
                imageAlt: post.imageAlt || ''
            });
        } else {
            setEditingPost(null);
            setFormData({ 
                title: '', excerpt: '', content: '', image: '',
                category: 'Wellness & Microdosing', tags: ['Fusion Bars'],
                isPublic: false, allowComments: true, targetKeyword: '',
                seoTitle: '', seoDescription: '', imageAlt: ''
            });
        }
        setView('editor');
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    };

    const insertMarkdown = (before: string, after: string = '') => {
        const textarea = document.getElementById('blog-content-editor') as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
        setFormData({ ...formData, content: newText });
        setTimeout(() => {
            textarea.focus();
            const newPos = start + before.length + selectedText.length + after.length;
            textarea.setSelectionRange(newPos, newPos);
        }, 0);
    };

    const handleMediaSelect = (url: string) => {
        if (mediaTarget === 'featured') {
            setFormData({ ...formData, image: url });
        } else {
            editorRef.current?.insertImage(url);
        }
        setIsMediaPickerOpen(false);
    };

    // --- LIST VIEW ---
    if (view === 'list') {
        const publicPosts = posts.filter(p => p.isPublic).length;
        const drafts = posts.filter(p => !p.isPublic).length;
        const filtered = posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        const startIndex = (currentPage - 1) * postsPerPage;
        const paginated = filtered.slice(startIndex, startIndex + postsPerPage);
        const totalPages = Math.ceil(filtered.length / postsPerPage);

        return (
            <div className="flex flex-col min-h-screen w-full bg-[#0a0510] text-slate-100 font-sans selection:bg-primary/30">
                {/* Navigation Header */}
                <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4 lg:px-20 bg-[#0a0510]/80 backdrop-blur-xl sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <Brain size={20} />
                            </div>
                            <h2 className="text-lg font-bold tracking-tight text-white hidden sm:block">Fusion CMS</h2>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex justify-center px-12">
                        <nav className="hidden lg:flex items-center gap-8">
                            <a className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="#">Dashboard</a>
                            <a className="text-primary text-sm font-bold relative after:content-[''] after:absolute after:-bottom-5 after:left-0 after:right-0 after:h-[2px] after:bg-primary" href="#">Posts</a>
                            <a className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="#">Analytics</a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => openEditor()}
                            className="flex items-center justify-center rounded-xl h-10 px-6 bg-primary text-white text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                        >
                            <span>Create New Post</span>
                        </button>
                        <div className="ml-2 size-9 rounded-full overflow-hidden border border-white/10">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 py-12 px-6 lg:px-20 animate-fade-in max-w-7xl mx-auto w-full">
                    {/* Welcome Section */}
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black tracking-tight text-white">Content Library</h1>
                            <p className="text-slate-400 text-sm">Manage, refine, and publish your brand stories.</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <input 
                                    className="h-12 w-64 rounded-xl border border-white/5 bg-white/[0.03] pl-11 pr-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="Search stories..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        {['All', 'Wellness & Microdosing', 'Product Launch', 'Science & Research', 'Community Stories', 'Lifestyle'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setCurrentPage(1);
                                }}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                                    selectedCategory === cat 
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                    : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Total Posts', value: posts.length, icon: Layers, color: 'text-primary' },
                            { label: 'Published', value: publicPosts, icon: CheckCircle2, color: 'text-green-400' },
                            { label: 'Drafts', value: drafts, icon: Clock, color: 'text-amber-400' },
                            { label: 'Engagement', value: 'High', icon: MessageSquare, color: 'text-purple-400' }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] shadow-sm hover:border-white/10 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-white/[0.03] ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                                        <p className="text-2xl font-black text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Posts Table */}
                    <div className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden shadow-2xl backdrop-blur-sm">
                        {isLoading ? (
                            <div className="py-32 flex flex-col items-center justify-center gap-4">
                                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Synchronizing Data</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[1000px]">
                                    <thead>
                                        <tr className="bg-white/[0.02] border-b border-white/5">
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Post Detail</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Category</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Publication</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {paginated.map((post) => (
                                            <tr 
                                                key={post.id} 
                                                onClick={() => openEditor(post)}
                                                className="group hover:bg-white/[0.03] transition-all cursor-pointer"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="relative size-14 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                                                            {post.image ? (
                                                                <Image src={post.image} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                            ) : (
                                                                <div className="size-full bg-white/5 flex items-center justify-center text-slate-600">
                                                                    <ImageIcon size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-1 overflow-hidden">
                                                            <p className="font-bold text-white truncate max-w-[300px]">{post.title}</p>
                                                            <p className="text-xs text-slate-500 truncate max-w-[300px]">{post.excerpt || 'No excerpt provided...'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-wider text-slate-300">
                                                        {post.category || 'Lifestyle'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Calendar size={14} className="text-primary/50" />
                                                        <span className="text-xs font-bold">{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {post.isPublic ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Live</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Draft</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); openEditor(post); }} 
                                                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                                                            title="Edit Post"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => handleDuplicate(post, e)} 
                                                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                                                            title="Duplicate"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => handleDelete(post.id, e)} 
                                                            className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        
                                        {/* Pagination Controls inside Table Footer space */}
                                        {totalPages > 1 && (
                                            <tr>
                                                <td colSpan={5} className="px-8 py-6 border-t border-white/5">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                            Page {currentPage} of {totalPages}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                disabled={currentPage === 1}
                                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                                className="h-10 px-4 rounded-xl border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                            >
                                                                Prev
                                                            </button>
                                                            <button 
                                                                disabled={currentPage === totalPages}
                                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                                className="h-10 px-4 rounded-xl border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                            >
                                                                Next
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        {filtered.length === 0 && paginated.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-32 text-center">
                                                    <div className="flex flex-col items-center gap-6">
                                                        <div className="size-20 bg-white/[0.02] rounded-3xl flex items-center justify-center text-slate-700">
                                                            <Layers size={40} />
                                                        </div>
                                                        <div className="text-center space-y-2">
                                                            <p className="text-lg font-bold text-white">No stories match your criteria</p>
                                                            <p className="text-sm text-slate-500">Try adjusting your search or category filter.</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => {
                                                                setSearchQuery('');
                                                                setSelectedCategory('All');
                                                            }}
                                                            className="text-primary text-xs font-black uppercase tracking-widest hover:underline"
                                                        >
                                                            Clear all filters
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                {posts.length === 0 && (
                                    <div className="py-32 flex flex-col items-center justify-center gap-6">
                                        <div className="size-20 bg-white/[0.02] rounded-3xl flex items-center justify-center text-slate-700">
                                            <Layers size={40} />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="text-lg font-bold text-white">No stories found</p>
                                            <p className="text-sm text-slate-500">Start your journey by creating your first post.</p>
                                        </div>
                                        <button 
                                            onClick={() => openEditor()}
                                            className="px-8 h-12 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
                                        >
                                            Write My First Story
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <footer className="py-12 px-6 lg:px-20 border-t border-white/5 text-center mt-auto">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
                        © 2026 Fusion Shroom Bars. Managed with precision.
                    </p>
                </footer>
            </div>
        );
    }

    // --- EDITOR VIEW (PIXEL PERFECT RECONSTRUCTION) ---
    return (
        <div className="flex flex-col min-h-screen w-full bg-[#0d0814] text-slate-100 font-sans selection:bg-primary/30 animate-fade-in">
            {/* Navigation Header for Editor */}
            <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4 lg:px-20 bg-[#0d0814]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setView('list')} 
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Brain size={20} />
                        </div>
                        <h2 className="text-lg font-bold tracking-tight text-white hidden sm:block">Fusion Editor</h2>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        disabled={isSaving}
                        onClick={() => handleSubmit(false)}
                        className="h-10 px-6 rounded-xl border border-white/5 bg-white/[0.03] text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button 
                        disabled={isSaving}
                        onClick={() => handleSubmit(true)}
                        className="h-10 px-10 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/30 transition-all font-bold disabled:opacity-50"
                    >
                        {isSaving ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </header>

            <div className="flex-1 py-12 px-6 lg:px-20 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Post Title</label>
                            <input 
                                className="w-full rounded-2xl border border-white/5 bg-white/[0.03] h-20 px-8 text-2xl font-black text-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-800" 
                                placeholder="Enter a descriptive title..."
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Content</label>
                            <div className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden min-h-[650px] flex flex-col focus-within:border-primary/30 transition-all shadow-2xl">
                                <RichTextEditor 
                                    ref={editorRef}
                                    content={formData.content} 
                                    onChange={(content) => setFormData({...formData, content})}
                                    onImageClick={() => {
                                        setMediaTarget('content');
                                        setIsMediaPickerOpen(true);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Excerpt / Summary</label>
                            <textarea 
                                className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-8 text-sm leading-relaxed text-slate-300 focus:border-primary/50 outline-none transition-all placeholder:text-slate-800 resize-none h-32" 
                                placeholder="Briefly describe what this post is about..."
                                value={formData.excerpt}
                                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                            />
                        </div>
                    </div>

                    <aside className="space-y-8">
                        <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] space-y-6 shadow-xl">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Publication Details</h3>
                            
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase text-slate-500">Featured Image</label>
                                <div 
                                    className="aspect-[4/3] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:bg-white/[0.04] transition-all cursor-pointer group relative overflow-hidden"
                                    onClick={() => {
                                        setMediaTarget('featured');
                                        setIsMediaPickerOpen(true);
                                    }}
                                >
                                    {formData.image ? (
                                        <img src={formData.image} alt="Cover" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                                    ) : (
                                        <>
                                            <div className="size-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-slate-600 group-hover:text-primary transition-all">
                                                <ImageIcon size={24} />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400">Set Thumbnail Image</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase text-slate-500">Category</label>
                                <div className="relative">
                                    <select 
                                        className="w-full h-14 rounded-2xl border border-white/5 bg-white/[0.03] px-6 text-xs font-bold text-slate-100 focus:border-primary/50 outline-none appearance-none cursor-pointer"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        {['Wellness & Microdosing', 'Product Launch', 'Science & Research', 'Community Stories', 'Lifestyle'].map(c => (
                                            <option key={c} value={c} className="bg-[#0d0814]">{c}</option>
                                        ))}
                                    </select>
                                    <ChevronRight size={14} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-600 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase text-slate-500">Tags</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {(formData.tags || []).map(t => (
                                        <span key={t} className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                                            {t} 
                                            <button onClick={() => removeTag(t)} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                                <input 
                                    className="w-full h-14 rounded-2xl border border-white/5 bg-white/[0.03] px-6 text-xs font-bold text-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-800"
                                    placeholder="Add a tag..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                />
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-5">
                                 <div className="flex items-center justify-between group cursor-pointer" onClick={() => setFormData({...formData, allowComments: !formData.allowComments})}>
                                    <div className="space-y-0.5">
                                        <span className="block text-[10px] font-black uppercase text-slate-400 group-hover:text-slate-200 transition-colors">Allow Comments</span>
                                        <span className="block text-[9px] text-slate-600">Enable discussions</span>
                                    </div>
                                    <button className={`w-12 h-6 rounded-full transition-all relative ${formData.allowComments ? 'bg-primary' : 'bg-white/10'}`}>
                                        <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${formData.allowComments ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}>
                                    <div className="space-y-0.5">
                                        <span className="block text-[10px] font-black uppercase text-slate-400 group-hover:text-slate-200 transition-colors">Public Post</span>
                                        <span className="block text-[9px] text-slate-600">Visible to users</span>
                                    </div>
                                    <button className={`w-12 h-6 rounded-full transition-all relative ${formData.isPublic ? 'bg-primary' : 'bg-white/10'}`}>
                                        <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${formData.isPublic ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">SEO Configuration</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-700">Meta Title</label>
                                    <input 
                                        className="w-full text-xs font-bold rounded-xl border border-white/5 bg-white/[0.03] px-5 h-12 outline-none focus:border-primary/50 text-slate-300" 
                                        placeholder="Title for search results..."
                                        value={formData.seoTitle}
                                        onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-700">Meta Description</label>
                                    <textarea 
                                        className="w-full text-xs font-bold rounded-xl border border-white/5 bg-white/[0.03] p-5 h-24 outline-none focus:border-primary/50 text-slate-400 resize-none" 
                                        placeholder="Description for search results..."
                                        value={formData.seoDescription}
                                        onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <MediaPicker 
                isOpen={isMediaPickerOpen} 
                onClose={() => setIsMediaPickerOpen(false)} 
                onSelect={handleMediaSelect} 
            />
        </div>
    );
}
