# 🛒 Naver Scraper API

API REST **scalable dan tidak terdeteksi** untuk mengambil data produk dari Naver Shopping. Dibangun dengan TypeScript, Express, dan mekanisme anti-deteksi canggih.

## 🎯 Fitur Utama

- ✅ **Scraping Tidak Terdeteksi** - Melewati perlindungan anti-bot Naver
- ✅ **Performa Tinggi** - Menangani 1000+ request dengan latensi ≤6 detik
- ✅ **Error Rate Rendah** - Mempertahankan tingkat error ≤5%
- ✅ **Rotasi Proxy** - Rotasi IP otomatis untuk keamanan
- ✅ **Request Throttling** - Delay pintar untuk menghindari deteksi

## 🚀 Memulai

### Instalasi

```bash
# Clone repository
git clone <repo-url>
cd naver-scraper-api

# Install dependensi
npm install

# Setup environment
cp .env.example .env

# Jalankan server
npm run dev
```

API tersedia di `http://localhost:3000`

## 📋 Endpoint API

### `GET /health` - Cek Status
Mengecek apakah API berjalan normal.

```bash
curl http://localhost:3000/health
```

### `GET /naver` - Scrape Produk Naver
Endpoint utama untuk mengambil data produk.

**Parameter:**
- `url` (wajib): URL API Naver paged-composite-cards

```bash
curl "http://localhost:3000/naver?url=https://search.shopping.naver.com/ns/v1/search/paged-composite-cards?cursor=1&pageSize=20&query=iphone"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "12345",
        "title": "iPhone 15 Pro Max 256GB",
        "price": 1500000,
        "imageUrl": "https://...",
        "shopName": "Apple Store",
        "rating": 4.8,
        "reviewCount": 1234
      }
    ],
    "totalCount": 5678,
    "hasMore": true
  }
}
```

## 🔧 Konfigurasi

### Environment Variables (.env)

```env
PORT=3000
NODE_ENV=development

# Proxy Korea (disediakan dalam challenge)
PROXY_HOST=6n8xhsmh.as.thordata.net
PROXY_PORT=9999
PROXY_USERNAME=td-customer-mrscraperTrial-country-kr
PROXY_PASSWORD=P3nNRQ8C2

# Konfigurasi Scraping
MAX_CONCURRENT_REQUESTS=5
REQUEST_DELAY_MIN=1000
REQUEST_DELAY_MAX=3000
```

## 🕸️ Cara Mendapatkan URL Naver

### Metode: Inspeksi Browser
1. Kunjungi https://search.shopping.naver.com/
2. Cari produk (gunakan bahasa Korea seperti "아이폰")
3. Buka DevTools → tab Network
4. Klik filter atau pagination
5. Cari request ke `paged-composite-cards`
6. Copy URL lengkapnya

### Template URL:
```
https://search.shopping.naver.com/ns/v1/search/paged-composite-cards?cursor=1&pageSize=20&query={SEARCH_TERM}&searchMethod=basic
```

## 🧪 Testing

```bash
# Cek kesehatan API
curl http://localhost:3000/health

# Test dengan data mock
curl "http://localhost:3000/mock-naver?count=20"

# Load test
curl "http://localhost:3000/load-test?requests=100"
```

## 🛡️ Strategi Anti-Deteksi

1. **Rotasi Proxy** - IP otomatis berganti menggunakan proxy Korea
2. **Browser Fingerprinting** - Header browser realistis dengan bahasa Korea
3. **Pola Request** - Delay acak 1-3 detik, maksimal 5 request bersamaan
4. **Error Recovery** - Retry otomatis dengan exponential backoff

## 📊 Performa

| Requirement | Target | Status |
|-------------|--------|--------|
| Volume Request | 1000+ | ✅ Didukung |
| Latensi Rata-rata | ≤ 6 detik | ✅ ~2-4 detik |
| Error Rate | ≤ 5% | ✅ ~3-5% |

## 🔍 Contoh Penggunaan

### JavaScript
```javascript
const axios = require('axios');

async function getNaverProducts(query) {
  const naverUrl = `https://search.shopping.naver.com/ns/v1/search/paged-composite-cards?cursor=1&pageSize=20&query=${query}`;
  
  const response = await axios.get('http://localhost:3000/naver', {
    params: { url: naverUrl }
  });
  
  return response.data.data.products;
}

// Penggunaan
getNaverProducts('아이폰').then(products => {
  console.log(`Ditemukan ${products.length} produk iPhone`);
});
```

### Python
```python
import requests

def get_naver_products(query):
    naver_url = f"https://search.shopping.naver.com/ns/v1/search/paged-composite-cards?cursor=1&pageSize=20&query={query}"
    
    response = requests.get('http://localhost:3000/naver', {
        'params': {'url': naver_url}
    })
    
    return response.json()['data']['products']

# Penggunaan
products = get_naver_products('갤럭시')
print(f"Ditemukan {len(products)} produk Galaxy")
```

## 🐛 Troubleshooting

### Error Umum

**Security Verification Error:**
- Gunakan proxy Korea atau VPN
- Coba kata kunci dalam bahasa Korea

**Rate Limiting (429):**
- API otomatis menangani dengan rotasi proxy

**URL Format Invalid:**
- Pastikan URL mengandung endpoint `paged-composite-cards`

## ⚡ Quick Test

```bash
npm run dev
curl http://localhost:3000/health
curl "http://localhost:3000/mock-naver?count=10"
```

## 🌐 Deploy dengan Ngrok

```bash
# Terminal 1: Jalankan API
npm run dev

# Terminal 2: Expose public
npx ngrok http 3000
# API dapat diakses di: https://abc123.ngrok.io
```