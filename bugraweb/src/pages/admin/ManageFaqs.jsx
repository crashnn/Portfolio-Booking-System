import React, { useState, useEffect } from 'react';
import { Save, Trash2, HelpCircle, Plus, Edit3, X, CheckCircle, AlertCircle } from 'lucide-react';
import API_URL from '../../api';

const ManageFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => { fetchFaqs(); }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/faqs`);
      if (!res.ok) throw new Error("Veri çekilemedi");
      const data = await res.json();
      setFaqs(data);
    } catch (err) { 
      console.error(err);
      setStatus({ type: 'error', message: 'Veriler yüklenemedi. Sunucuyu kontrol et.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) return;
    
    setLoading(true);
    const url = editingId ? `${API_URL}/api/faqs/${editingId}` : `${API_URL}/api/faqs`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ question: '', answer: '' });
        setEditingId(null);
        setStatus({ type: 'success', message: editingId ? 'Güncellendi!' : 'Eklendi!' });
        fetchFaqs();
      } else {
        throw new Error("Kayıt başarısız");
      }
    } catch (err) { 
      console.error(err); 
      setStatus({ type: 'error', message: 'Hata oluştu.' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Silmek istediğine emin misin?")) return;
    try {
        const res = await fetch(`${API_URL}/api/faqs/${id}`, { method: 'DELETE' });
        if(res.ok) {
            fetchFaqs();
            setStatus({ type: 'success', message: 'Silindi.' });
            setTimeout(() => setStatus(null), 3000);
        }
    } catch (err) { console.error(err); }
  };

  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setFormData({ question: faq.question, answer: faq.answer });
    setStatus(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><HelpCircle size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-dark">S.S.S Yönetimi</h2>
          <p className="text-gray-500 text-sm">Sık sorulan soruları buradan yönet.</p>
        </div>
      </div>

      {status && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
              {status.message}
          </div>
      )}

      {/* Grid: Mobilde 1 kolon, Masaüstünde 3 kolon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: FORM (Mobilde Üstte, Masaüstünde Solda ve Sticky) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 h-fit lg:sticky lg:top-24 z-10">
           <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
             {editingId ? <Edit3 size={20} className="text-orange-500"/> : <Plus size={20} className="text-primary"/>}
             {editingId ? 'Düzenle' : 'Yeni Ekle'}
           </h3>
           <form onSubmit={handleSubmit} className="space-y-5">
             <div>
               <label className="text-xs font-bold text-gray-500 ml-1 mb-1 block uppercase tracking-wider">Soru</label>
               <input 
                  value={formData.question} 
                  onChange={(e) => setFormData({...formData, question: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 h-12 focus:border-primary focus:bg-white focus:outline-none" 
                  placeholder="Örn: Fiyatlar nedir?"
               />
             </div>
             <div>
               <label className="text-xs font-bold text-gray-500 ml-1 mb-1 block uppercase tracking-wider">Cevap</label>
               <textarea 
                  value={formData.answer} 
                  onChange={(e) => setFormData({...formData, answer: e.target.value})} 
                  className="w-full h-40 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-primary focus:bg-white focus:outline-none resize-none leading-relaxed" 
                  placeholder="Cevabı yazın..."
               ></textarea>
             </div>
             <div className="flex gap-2 pt-2">
                <button disabled={loading} className={`flex-1 py-3 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 ${editingId ? 'bg-orange-500' : 'bg-dark hover:bg-primary'}`}>
                  {loading ? '...' : <><Save size={18} /> {editingId ? 'Güncelle' : 'Kaydet'}</>}
                </button>
                {editingId && (
                  <button type="button" onClick={() => {setEditingId(null); setFormData({question:'', answer:''})}} className="px-4 bg-gray-100 text-gray-500 rounded-xl"><X size={20}/></button>
                )}
             </div>
           </form>
        </div>

        {/* SAĞ: LİSTE */}
        <div className="lg:col-span-2 space-y-4">
           {faqs.length > 0 ? (
               faqs.map(faq => (
                 <div key={faq._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group relative">
                    {/* Mobilde Başlık ve Butonları Alt Alta Alabilmek için Flex-col ekledik */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                       <h4 className="font-bold text-dark text-lg sm:pr-20">{faq.question}</h4>
                       
                       {/* Butonlar mobilde sağ altta değil, akışta durur */}
                       <div className="flex gap-2 sm:absolute sm:top-6 sm:right-6 w-full sm:w-auto">
                          <button onClick={() => handleEdit(faq)} className="flex-1 sm:flex-none py-2 px-3 sm:p-2 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-100 flex items-center justify-center gap-2 sm:gap-0"><Edit3 size={16}/> <span className="sm:hidden text-sm font-bold">Düzenle</span></button>
                          <button onClick={() => handleDelete(faq._id)} className="flex-1 sm:flex-none py-2 px-3 sm:p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2 sm:gap-0"><Trash2 size={16}/> <span className="sm:hidden text-sm font-bold">Sil</span></button>
                       </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-3">{faq.answer}</p>
                 </div>
               ))
           ) : (
               <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center text-gray-400">Henüz soru yok.</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ManageFaqs;