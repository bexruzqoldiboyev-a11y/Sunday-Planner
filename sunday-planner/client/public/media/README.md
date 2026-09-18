# Media papkasi

Oʻz rasm va videolaringizni shu yerga tashlang, soʻng
`client/src/services/media.js` ichida yoʻlini koʻrsating:

```js
const PLACE_PHOTOS = { 'kafe-1': '/media/cafe-bon.jpg' };
const PLACE_VIDEOS = { 'entertainment-1': '/media/magic-city.mp4' };
```

Va `client/.env` ga:

```
VITE_MEDIA_ENABLED=true
```

Tavsiya: rasm 1200×675 (16:9), JPG/WebP, 300 KB gacha.
Video: mp4 (H.264), ovozsiz, 10–15 soniya, 3 MB gacha.

Fayl topilmasa sayt avtomatik jonli sahnaga qaytadi — xato chiqmaydi.
