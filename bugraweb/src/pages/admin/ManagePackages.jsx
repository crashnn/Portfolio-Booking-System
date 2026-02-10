import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Package as PackageIcon } from 'lucide-react';
import API_URL from '../../api';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null); 

  useEffect(() => {
    fetch(`${API_URL}/api/packages`)
      .then(res => res.json())
      .then(data => {
        setPackages(data);
        setLoading(false);
      });
  }, []);

 
  const handleChange = (index, field, value) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = value;
    setPackages(updatedPackages);
  };

  // Özellikleri Düzenleme 
  const handleFeaturesChange = (index, value) => {
    const updatedPackages = [...packages];
    // Satırlara bölerek diziye çevir
    updatedPackages[index].features = value.split('\n');
    setPackages(updatedPackages);
  };

  // Kaydetme
  const handleSave = async (pkg) => {
    setSavingId(pkg._id);
    try {
      await fetch(`${API_URL}/api/packages/${pkg._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkg),
      });
      setTimeout(() => setSavingId(null), 1000); 
    } catch (err) {
      console.error(err);
      setSavingId(null);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 text-primary rounded-xl">
                <PackageIcon size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-dark">Paketleri Düzenle</h2>
                <p className="text-gray-500 text-sm">Fiyatları ve içerikleri buradan anlık güncelleyebilirsin.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
                <div key={pkg._id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group hover:border-primary/30 transition-all">
                    
                    {/* Başlık Alanı */}
                    <div className="p-6 bg-gray-50 border-b border-gray-100">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Paket Adı</label>
                        <input 
                            value={pkg.title} 
                            onChange={(e) => handleChange(idx, 'title', e.target.value)}
                            className="w-full bg-transparent font-bold text-xl text-dark focus:outline-none focus:text-primary transition-colors"
                        />
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Fiyat */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Fiyat</label>
                            <input 
                                value={pkg.price} 
                                onChange={(e) => handleChange(idx, 'price', e.target.value)}
                                className="w-full bg-light border border-gray-200 rounded-xl p-3 font-bold text-lg text-green-600 focus:outline-none focus:border-green-500"
                            />
                        </div>

                        {/* Açıklama */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Kısa Açıklama</label>
                            <input 
                                value={pkg.description} 
                                onChange={(e) => handleChange(idx, 'description', e.target.value)}
                                className="w-full bg-light border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                            />
                        </div>

                        {/* Özellikler (Maddeler) */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                                <span>Paket İçeriği</span>
                                <span className="text-[10px] bg-gray-200 px-2 rounded text-gray-500">Her satır bir madde</span>
                            </label>
                            <textarea 
                                value={pkg.features.join('\n')} 
                                onChange={(e) => handleFeaturesChange(idx, e.target.value)}
                                className="w-full h-40 bg-light border border-gray-200 rounded-xl p-3 text-sm leading-relaxed focus:outline-none focus:border-primary resize-none"
                            ></textarea>
                        </div>

                        {/* Kaydet Butonu */}
                        <button 
                            onClick={() => handleSave(pkg)}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                savingId === pkg._id 
                                ? 'bg-green-500 text-white shadow-green-200 shadow-lg' 
                                : 'bg-dark text-white hover:bg-primary hover:shadow-lg hover:-translate-y-1'
                            }`}
                        >
                            {savingId === pkg._id ? (
                                <><CheckCircle size={20} /> Kaydedildi</>
                            ) : (
                                <><Save size={20} /> Değişiklikleri Kaydet</>
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default ManagePackages;