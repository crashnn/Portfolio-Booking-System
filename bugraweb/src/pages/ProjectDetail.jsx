import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Film, Play, Pause, Image as ImageIcon, Instagram, Link as LinkIcon } from 'lucide-react';
import { OrbitProgress } from 'react-loading-indicators';
import API_URL from '../api';
// TikTok İkonu
const TikTokIcon = ({ size = 22, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.57-.26-1.1-.59-1.62-.93c-.01 2.92.01 5.84-.02 8.75c-.08 1.4-.54 2.79-1.35 3.94c-1.31 1.92-3.58 3.17-5.91 3.21c-1.43.08-2.86-.31-4.08-1.03c-2.02-1.19-3.44-3.37-3.65-5.71c-.02-.5-.03-1-.01-1.49c.18-1.9 1.12-3.72 2.58-4.96c1.66-1.44 3.98-2.13 6.15-1.72c.02 1.48-.04 2.96-.04 4.44c-.99-.32-2.15-.23-3.02.37c-.63.41-1.11 1.04-1.36 1.75c-.21.51-.15 1.07-.14 1.61c.24 1.64 1.82 3.02 3.5 2.87c1.12-.01 2.19-.66 2.77-1.61c.19-.33.4-.67.41-1.06c.1-1.79.06-3.57.07-5.36c.01-4.03-.01-8.05.02-12.07"/>"
    </svg>
);

// Özel Video Oynatıcı
const CustomVideoPlayer = ({ src }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };
    return (
        <div className="relative w-full h-full group cursor-pointer bg-black rounded-2xl overflow-hidden" onClick={togglePlay}>
            <video ref={videoRef} src={src} className="w-full h-full object-cover" loop playsInline onContextMenu={(e) => e.preventDefault()} />
            <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xl transform group-hover:scale-110 transition-transform">
                    {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />}
                </div>
            </div>
            <div className="absolute top-4 left-4 z-20 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md border border-white/10 pointer-events-none">
                <Film size={12} /> Video
            </div>
        </div>
    );
};

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`${API_URL}/api/projects/${id}`)
            .then(res => res.json())
            .then(data => { setProject(data); setLoading(false); })
            .catch(err => console.error(err));
    }, [id]);

        if (loading) return <div className="min-h-screen flex items-center justify-center">
          <OrbitProgress color="#6D28D9" variant="track-disc" speedPlus="0" easing="ease-in-out" /></div>;
    if (!project) return <div className="h-screen flex items-center justify-center bg-black text-white">Proje bulunamadı.</div>;

    return (
        <div className="bg-white min-h-screen">

            {/* --- 1. KAPAK (İNDİRME KORUMALI) --- */}
            <div className="relative w-full h-[85vh] bg-black">
                <img src={project.thumbnail} className="w-full h-full object-cover opacity-80" alt="Kapak" onContextMenu={(e) => e.preventDefault()} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
                <div className="absolute top-28 left-6 md:left-20 z-50">
                    <Link to="/portfolio" className="inline-flex items-center text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full font-medium border border-white/10 text-sm">
                        <ArrowLeft size={18} className="mr-2" /> Geri Dön
                    </Link>
                </div>
                <div className="absolute bottom-0 left-0 w-full px-6 md:px-20 pb-16">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.category && project.category.split(',').map((cat, idx) => (
                            <span key={idx} className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">{cat}</span>
                        ))}
                    </div>
                    <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight max-w-5xl leading-none">{project.title}</h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-300 font-medium text-lg border-t border-white/20 pt-6">
                        <p className="flex items-center gap-2"><User size={20} className="text-white" /> {project.client || 'Bağımsız Yapım'}</p>
                        <p className="flex items-center gap-2"><Calendar size={20} className="text-white" /> {project.date || 'Tarih Yok'}</p>

                        {/* SOSYAL MEDYA LİNKLERİ (VARSA GÖSTER) */}
                        {(project.instagramUrl || project.tiktokUrl) && (
                            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
                                {project.instagramUrl && (
                                    <a href={project.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500 transition hover:scale-110">
                                        <Instagram size={22} />
                                    </a>
                                )}
                                {project.tiktokUrl && (
                                    <a href={project.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-teal-400 transition hover:scale-110">
                                        <TikTokIcon size={22} />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto px-4 md:px-10 mt-20">

                {/* --- 2. HİKAYE --- */}
                <div className="max-w-4xl mx-auto mb-24 text-center">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-6">Proje Detayları</h3>
                    <p className="text-xl md:text-2xl text-gray-800 leading-relaxed whitespace-pre-wrap font-light">{project.description}</p>
                </div>

                {/* --- 3. MASONRY GALERİ (BOŞLUK SORUNU ÇÖZÜLDÜ) --- */}
                {project.gallery && project.gallery.length > 0 && (
                    <div className="mb-20">
                        <h3 className="text-2xl font-bold text-dark mb-8 pl-4 border-l-4 border-primary">Prodüksiyon Galerisi</h3>

                        {/* CSS Columns ile Masonry Düzeni */}
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {project.gallery.map((item, idx) => (
                                // 'break-inside-avoid' ile öğelerin bölünmesini engelliyoruz
                                <div key={idx} className="break-inside-avoid rounded-2xl overflow-hidden shadow-lg bg-gray-100 relative group mb-6">
                                    {item.type === 'video' ? (
                                        <CustomVideoPlayer src={item.url} />
                                    ) : (
                                        <div className="relative">
                                            <div className="absolute top-4 left-4 z-20 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md border border-white/10 pointer-events-none">
                                                <ImageIcon size={12} /> Fotoğraf
                                            </div>
                                            <img src={item.url} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" alt="galeri" onContextMenu={(e) => e.preventDefault()} />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;