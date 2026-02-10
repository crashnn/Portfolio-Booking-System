import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Check, AlertCircle, Package, ArrowRight, Info } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import API_URL from '../api';
import 'react-calendar/dist/Calendar.css';
import { format, isWithinInterval } from 'date-fns';
import { tr } from 'date-fns/locale';
import { OrbitProgress } from 'react-loading-indicators';

const calendarStyle = `
  .react-calendar { border: none; border-radius: 1.5rem; padding: 24px; width: 100%; font-family: inherit; background: #fff; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
  .react-calendar__tile--active { background: #6D28D9 !important; color: white !important; border-radius: 8px; }
  .react-calendar__tile--now { background: #f3e8ff; color: #6D28D9; border-radius: 8px; font-weight: bold; }
  .react-calendar__tile:disabled { background-color: transparent; color: #d1d5db; text-decoration: line-through; }
  .busy-date { background-color: #F97316 !important; color: white !important; border-radius: 8px; opacity: 0.8; pointer-events: none; }
  .react-calendar__navigation button { font-size: 1.2rem; font-weight: bold; color: #1F2937; }
`;

const Booking = () => {
  const location = useLocation();
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [busyDates, setBusyDates] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = ["Sosyal Medya Başlangıç", "Profesyonel Kurgu", "Tam Kapsamlı Prodüksiyon"];
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    equipment: 'Sosyal Medya Başlangıç'
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/calendar/busy-dates`)
      .then(res => res.json())
      .then(data => {
        setBusyDates(data);
        setPageLoading(false);
      })
      .catch(err => {
        console.error("Takvim hatası:", err);
        setPageLoading(false);
      });
  }, []);

  useEffect(() => {
    if (location.state?.selectedPackage) {
      setFormData(prev => ({
        ...prev,
        equipment: location.state.selectedPackage
      }));
    }
  }, [location]);

  if (pageLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <OrbitProgress color="#6D28D9" variant="track-disc" speedPlus="0" easing="ease-in-out" />
    </div>
  );

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isBusy = busyDates.some(busy => {
        const start = new Date(busy.start);
        const end = new Date(busy.end);
        return isWithinInterval(date, { start, end });
      });
      if (isBusy) return 'busy-date';
    }
    return null;
  };

  const tileDisabled = ({ date }) => {
    if (date < new Date().setHours(0, 0, 0, 0)) return true;
    return busyDates.some(busy => {
      const start = new Date(busy.start);
      const end = new Date(busy.end);
      return isWithinInterval(date, { start, end });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      startDate: dateRange[0],
      endDate: dateRange[1]
    };

    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', phone: '', email: '', equipment: 'Sosyal Medya Başlangıç' });
      }
    } catch (err) {
      alert("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-light min-h-screen">
      <style>{calendarStyle}</style>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">Hizmet Rezervasyonu</h1>
          <p className="text-gray-500">Çalışmak istediğiniz tarih aralığını ve paketi seçin.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div>
            <div className="bg-white p-2 rounded-3xl shadow-lg border border-gray-100">
              <div className="p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="text-primary" /> Tarih Seçimi
                </h3>
                <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
                  <Info size={12} /> Tek gün için aynı tarihe 2 kez basın
                </div>
              </div>

              <Calendar
                onChange={setDateRange}
                value={dateRange}
                selectRange={true}
                tileClassName={tileClassName}
                tileDisabled={tileDisabled}
                minDate={new Date()}
                locale="tr-TR"
                prev2Label={null}
                next2Label={null}
              />

              <div className="p-4 text-sm font-medium text-gray-500 flex flex-wrap gap-4 justify-center mt-2">
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-600 rounded-full"></div> Seçili</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Dolu</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-fit">

            {success ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                  <Check size={48} />
                </div>
                <h3 className="text-3xl font-bold text-dark mb-4">Talep Alındı!</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Rezervasyon talebiniz başarıyla oluşturuldu. <br />Müsaitlik kontrolü sonrası size dönüş yapılacaktır.
                </p>
                <button onClick={() => setSuccess(false)} className="px-8 py-3 bg-dark text-white rounded-xl font-bold hover:bg-primary transition">Yeni Rezervasyon</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-dark mb-6 border-b border-gray-100 pb-4">
                  Rezervasyon Detayları
                </h3>

                {/* Tarih Özeti */}
                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">Başlangıç</span>
                    <div className="font-bold text-dark text-lg">
                      {dateRange[0] ? format(dateRange[0], 'd MMMM yyyy', { locale: tr }) : '-'}
                    </div>
                  </div>
                  <div className="text-primary/30"><ArrowRight /></div>
                  <div className="text-right">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">Bitiş</span>
                    <div className="font-bold text-dark text-lg">
                      {dateRange[1] ? format(dateRange[1], 'd MMMM yyyy', { locale: tr }) : (dateRange[0] ? format(dateRange[0], 'd MMMM yyyy', { locale: tr }) : '-')}
                    </div>
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Paket Seçimi</label>
                  <div className="relative">
                    <Package className="absolute top-3.5 left-3 text-gray-400 z-10" size={20} />

                    {/* GÖRÜNEN BUTON */}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-light border border-gray-200 rounded-xl p-3 pl-10 text-left flex items-center justify-between focus:outline-none focus:border-primary font-medium"
                    >
                      <span className={formData.equipment ? 'text-dark' : 'text-gray-500'}>
                        {formData.equipment || "Paket Seçiniz"}
                      </span>
                      <div className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </button>

                    {/* AÇILIR MENÜ (Custom Options) */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {options.map((option, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, equipment: option });
                              setIsDropdownOpen(false); // Seçince kapat
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-primary/5 transition flex items-center justify-between group ${formData.equipment === option ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600'}`}
                          >
                            {option}
                            {formData.equipment === option && <Check size={16} className="text-primary" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Kişisel Bilgiler */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ad Soyad</label>
                    <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-light border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary" placeholder="İsim Soyisim" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label>
                    <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-light border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary" placeholder="05..." type="tel" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">E-posta</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-light border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary" placeholder="ornek@mail.com" />
                </div>

                <div className="flex items-start gap-3 bg-orange-50 p-4 rounded-xl text-sm text-orange-800 border border-orange-100">
                  <AlertCircle size={20} className="mt-0.5 shrink-0 text-orange-500" />
                  <p className="leading-relaxed">
                    Bu işlem bir ön rezervasyondur. Ödeme alınmaz.
                  </p>
                </div>

                <button disabled={loading} className="w-full py-4 bg-dark text-white font-bold rounded-xl hover:bg-primary transition shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1">
                  {loading ? 'İletiliyor...' : 'Rezervasyonu Tamamla'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Booking;