import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// İkon isim çakışmasını önlemek için Calendar'ı CalendarIcon olarak import ettik
import { Save, Calendar as CalendarIcon, Tag, Trash2, LayoutList, PenSquare, UploadCloud, X, Plus, Image as ImageIcon, Film, Eye } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import API_URL from '../../api';

const PREDEFINED_CATEGORIES = [
  { id: 1, name: 'Reklam / Tanıtım', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 2, name: 'Kurgu / Edit', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 3, name: 'Sosyal Medya Yönetimi', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 4, name: 'Klip Çekim', color: 'bg-red-100 text-red-700 border-red-200' },
];

const ManageProjects = () => {
  const initialForm = { title: '', thumbnail: '', description: '', client: '', date: '', instagramUrl: '', tiktokUrl: '', gallery: [] };
  const [formData, setFormData] = useState(initialForm);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingProjects, setExistingProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  // Takvim Pop-up kontrolü
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      setExistingProjects(data);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- DÜZELTİLEN TARİH FONKSİYONU ---
  const handleDateChange = (date) => {
    // React-Calendar direkt Date objesi verir, e.target.value değil.
    const formattedDate = format(date, 'd MMMM yyyy', { locale: tr });
    setFormData({ ...formData, date: formattedDate });
    setShowDatePicker(false); // Seçim yapınca takvimi kapat
  };

  const toggleCategory = (catName) => {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  // --- RESİM İŞLEME FONKSİYONLARI ---
  const convertToWebP = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/webp', 0.8)); 
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const webp = await convertToWebP(file);
      setFormData({ ...formData, thumbnail: webp });
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newMedia = [];

    for (const file of files) {
      if (file.size > 50 * 1024 * 1024) {
        alert(`"${file.name}" çok büyük (Max 50MB). Yüklenmedi.`);
        continue;
      }
      if (file.type.startsWith('image/')) {
        const webp = await convertToWebP(file);
        newMedia.push({ type: 'image', url: webp });
      } else if (file.type.startsWith('video/')) {
        const videoData = await readFileAsBase64(file);
        newMedia.push({ type: 'video', url: videoData });
      }
    }
    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...newMedia] }));
  };

  const removeGalleryItem = (index) => {
    const updatedGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: updatedGallery });
  };

  const handleEditClick = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      thumbnail: project.thumbnail,
      description: project.description,
      client: project.client || '',
      date: project.date || '',
      instagramUrl: project.instagramUrl || '',
      tiktokUrl: project.tiktokUrl || '',
      gallery: project.gallery || [] 
    });
    setSelectedCategories(project.category ? project.category.split(', ') : []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
    setSelectedCategories([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.thumbnail || selectedCategories.length === 0) {
        alert("Başlık, Kapak Resmi ve Kategori zorunludur.");
        return;
    }
    setLoading(true);

    const payload = { ...formData, category: selectedCategories.join(', ') };

    try {
      const url = editingId ? `${API_URL}/api/projects/${editingId}` : `${API_URL}/api/projects`;
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        cancelEdit();
        fetchProjects();
      }
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Silmek istediğine emin misin?")) return;
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) setExistingProjects(existingProjects.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div>
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <LayoutList size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-dark">Proje Yönetimi</h2>
                <p className="text-gray-500 text-sm">Portfolyona yeni işler ekle veya düzenle.</p>
            </div>
        </div>

      {/* Grid: Mobilde 1 kolon, Büyük Ekranda 5 kolon */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* --- SOL TARA: FORM (Mobilde tam genişlik, Büyük Ekranda 3/5) --- */}
        <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                {editingId ? <PenSquare className="text-orange-500"/> : <Save className="text-primary" />} 
                {editingId ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-light border border-gray-200 rounded-xl p-3 focus:border-primary focus:outline-none font-bold text-lg" placeholder="Proje Başlığı" />

                {/* Kategoriler */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PREDEFINED_CATEGORIES.map((cat) => (
                        <button type="button" key={cat.id} onClick={() => toggleCategory(cat.name)} className={`p-2 rounded-lg text-xs font-bold border transition h-12 sm:h-auto flex items-center justify-center text-center ${selectedCategories.includes(cat.name) ? 'bg-primary text-white scale-105' : 'bg-white hover:bg-gray-50'}`}>
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <input name="client" value={formData.client} onChange={handleChange} className="w-full sm:w-1/2 bg-light border border-gray-200 rounded-xl p-3 focus:outline-none" placeholder="Müşteri Adı" />
                    
                    {/* --- ÖZEL TAKVİM BİLEŞENİ (Pop-up) --- */}
                    <div className="w-full sm:w-1/2 relative">
                        <button 
                            type="button" 
                            onClick={() => setShowDatePicker(!showDatePicker)} 
                            className="w-full bg-light border border-gray-200 rounded-xl p-3 text-left flex items-center justify-between text-gray-600 hover:border-primary focus:border-primary transition h-[50px]"
                        >
                            <span className={formData.date ? 'text-dark font-bold' : 'text-gray-400'}>
                                {formData.date || 'Tarih Seçiniz'}
                            </span>
                            <CalendarIcon size={18} />
                        </button>

                        {showDatePicker && (
                            <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 z-50 w-72 animate-in fade-in zoom-in-95 duration-200">
                                <Calendar 
                                    onChange={handleDateChange} 
                                    locale="tr-TR"
                                    value={formData.date ? new Date(formData.date) : new Date()}
                                    className="!w-full !border-none font-sans text-sm"
                                    tileClassName={({ date, view }) => 
                                        view === 'month' && date.getDay() === 0 ? 'text-red-500 font-bold' : 'text-dark'
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <input name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className="w-full bg-light border border-gray-200 rounded-xl p-3 focus:outline-none" placeholder="Instagram Linki" />
                    <input name="tiktokUrl" value={formData.tiktokUrl} onChange={handleChange} className="w-full bg-light border border-gray-200 rounded-xl p-3 focus:outline-none" placeholder="TikTok Linki" />
                </div>

                {/* Kapak Resmi */}
                <div className="bg-light border border-gray-200 rounded-xl p-4">
                    <label className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2"><ImageIcon size={16} /> Kapak Görseli</label>
                    {formData.thumbnail ? (
                        <div className="relative rounded-xl overflow-hidden aspect-video group border border-gray-300">
                            <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Kapak" />
                            <button type="button" onClick={() => setFormData({...formData, thumbnail: ''})} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition"><X size={16} /></button>
                        </div>
                    ) : (
                        <label className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition">
                            <UploadCloud size={32} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-500">Bilgisayardan Seç</span>
                            <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                        </label>
                    )}
                </div>

                {/* Galeri */}
                <div className="bg-light border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-bold text-gray-600 flex items-center gap-2"><LayoutList size={16} /> Galeri</label>
                        <label className="cursor-pointer bg-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-primary transition"><Plus size={14} /> Medya Ekle <input type="file" multiple accept="image/*,video/mp4,video/webm" onChange={handleGalleryUpload} className="hidden" /></label>
                    </div>
                    {formData.gallery.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {formData.gallery.map((item, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-300 bg-black">
                                    {item.type === 'video' ? <video src={item.url} className="w-full h-full object-cover opacity-80" /> : <img src={item.url} className="w-full h-full object-cover" alt="galeri" />}
                                    <div className="absolute bottom-1 left-1 bg-black/50 text-white p-0.5 rounded text-[10px]">{item.type === 'video' ? <Film size={10}/> : <ImageIcon size={10}/>}</div>
                                    <button type="button" onClick={() => removeGalleryItem(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition"><X size={12} /></button>
                                </div>
                            ))}
                        </div>
                    ) : <div className="text-xs text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">Medya yok.</div>}
                </div>
                
                <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full bg-light border border-gray-200 rounded-xl p-3 h-32 focus:outline-none resize-none" placeholder="Proje Açıklaması..."></textarea>
                
                <button disabled={loading} className={`w-full py-4 font-bold rounded-xl transition text-white ${editingId ? 'bg-orange-500' : 'bg-dark hover:bg-primary'}`}>
                    {loading ? '...' : editingId ? 'Güncelle' : 'Yayınla'}
                </button>
                {editingId && <button type="button" onClick={cancelEdit} className="w-full py-2 text-gray-400 text-sm">Vazgeç</button>}
            </form>
        </div>

        {/* --- SAĞ TARAF: LİSTE (Mobilde tam genişlik, Büyük Ekranda 2/5) --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 h-[500px] lg:h-[800px] flex flex-col">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2"><LayoutList className="text-primary" /> Mevcut Projeler</h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {existingProjects.map(project => (
                    <div key={project._id} className={`flex gap-3 p-3 rounded-xl border transition ${editingId === project._id ? 'bg-orange-50 border-orange-300' : 'bg-light border-gray-100'}`}>
                        <img src={project.thumbnail} className="w-16 h-16 object-cover rounded-lg bg-gray-200 shrink-0" alt="thumb" />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-dark text-sm truncate">{project.title}</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Link to={`/portfolio/${project._id}`} target="_blank" className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-600 hover:text-white flex items-center gap-1"><Eye size={12} /> İncele</Link>
                                <button onClick={() => handleEditClick(project)} className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded hover:bg-orange-500 hover:text-white">Düzenle</button>
                                <button onClick={() => handleDelete(project._id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-600 hover:text-white">Sil</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProjects;