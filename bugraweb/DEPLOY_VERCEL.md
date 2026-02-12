# Vercel ile Frontend (Vite) Deploy - Hızlı Rehber

1) Kodunuzu GitHub'a push edin.

2) Vercel'e bağlayın:
   - Vercel dashboard > New Project > Import from Git
   - Repository'yi seçin. Framework olarak `Other` veya `Vite` algılanır; build komutu otomatik `npm run build` olmalı.
   - Output Directory: `dist` (bu proje için `vercel.json` zaten ayarlı).

3) Environment Variables (Çok Önemli):
   - `VITE_API_URL` = backend'inizin tam URL'si (örn. `https://api.example.com`).
   - Eğer backend henüz deploy edilmediyse, frontend demo için geçici bir mock URL kullanabilirsiniz, ama müşterinin tam işlevselliği için backend'i ayrı bir servise deploy etmelisiniz.

4) Backend için (ayrı servis):
   - Backend'i Render / Railway / Heroku / Natro (veya başka bir sağlayıcı) üzerinde deploy edin.
   - Backend ortam değişkenlerinde `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (Vercel domain'iniz) ve Google credential ayarlarını ekleyin.
   - `CLIENT_URL` olarak Vercel projenizin URL'sini girin (örn. `https://your-project.vercel.app`) ki CORS engeli kalksın.

5) Vercel CLI ile deploy (isteğe bağlı):
```bash
# Vercel CLI yükle
npm i -g vercel

# Proje kökünden
vercel login
vercel --prod
```

6) Frontend ayarları proje içinde zaten hazır:
   - `src/api.js` dosyası `import.meta.env.VITE_API_URL` kullanıyor; Vercel üzerinde `VITE_API_URL` ayarlayın.
   - Root `package.json` içinde `build` script: `vite build` mevcut.

7) Notlar / Troubleshooting
   - Eğer frontend'den API çağrılarında CORS hatası alırsanız, backend'de `CLIENT_URL` ortam değişkeninin doğru olduğundan emin olun.
   - Geçici olarak backend'in CORS ayarını genişletmek isterseniz `app.use(cors())` yapabilirsiniz ama production için tavsiye edilmez.

İstersen backend'i de birlikte deploy etmene yardımcı olabilirim (Render veya Railway için adım adım). Eğer hazırsan, hangi sağlayıcıyı kullanmak istediğini söyle — ben backend deploy konfigurasyonunu hazırlayayım ve senin yerine env değişkenlerini nasıl ekleyeceğini göstereyim.
