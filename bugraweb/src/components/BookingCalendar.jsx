import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Varsayılan stiller
import { format } from 'date-fns';
import { tr } from 'date-fns/locale'; // Türkçe tarih formatı

const BookingCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [busyDates, setBusyDates] = useState([]); // Google'dan gelecek dolu tarihler
  const [selectedDate, setSelectedDate] = useState(null);

  // Simüle edilmiş Google API çağrısı
  useEffect(() => {
    // Burada ileride Google Calendar API isteği olacak
    const fetchGoogleCalendarEvents = async () => {
      // Örnek: Ayın 15'i ve 20'si dolu olsun
      const mockBusyDates = [
        new Date(2025, 1, 15).toDateString(), // Ay indeksleri 0'dan başlar (Ocak:0, Şubat:1)
        new Date(2025, 1, 20).toDateString(),
      ];
      setBusyDates(mockBusyDates);
    };

    fetchGoogleCalendarEvents();
  }, []);

  const isDateBusy = (dateToCheck) => {
    return busyDates.includes(dateToCheck.toDateString());
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    if (!isDateBusy(newDate)) {
      setSelectedDate(newDate);
      // Burada modal açıp ödeme/iletişim formuna yönlendireceğiz
      alert(`Seçilen Tarih: ${format(newDate, 'dd MMMM yyyy', { locale: tr })} için rezervasyon başlatılıyor.`);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl max-w-lg mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-primary">Müsaitlik Takvimi</h2>
      <p className="text-gray-400 text-sm mb-6 text-center">Yeşil günler kiralanabilir, kırmızı günler doludur.</p>
      
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            if (isDateBusy(date)) {
              return 'bg-red-500 text-white rounded-lg opacity-50 cursor-not-allowed hover:bg-red-500'; // Dolu gün stili
            } else {
              return 'bg-green-600 text-white rounded-lg hover:bg-green-500 font-bold'; // Boş gün stili
            }
          }
        }}
        tileDisabled={({ date }) => isDateBusy(date)} // Dolu günlere tıklamayı engelle
        className="w-full text-black rounded-lg border-none"
      />
      
      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-800 rounded border border-green-500 animate-pulse">
          <p className="text-green-400 font-semibold">
            Seçili Gün: {format(selectedDate, 'dd MMMM yyyy', { locale: tr })}
          </p>
          <button className="mt-2 w-full bg-primary hover:bg-red-700 text-white py-2 px-4 rounded transition">
            Bu Günü Kirala / Satın Al
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;