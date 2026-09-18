import { useEffect, useState } from 'react';
import { PlaceArt } from './PlaceArt.jsx';
import { photoFor, videoFor } from '../../services/media.js';
import { findWikiPhoto } from '../../services/wikiPhotos.js';

/**
 * Joy muqovasi. Rasm qidirish tartibi:
 *   1. Real video (agar sozlangan boʻlsa)
 *   2. Google Places / Commons / oʻz rasmingiz — media.js dan
 *   3. Wikipedia REST API — maqola nomi boʻyicha topilgan real foto
 *   4. Jonli SVG sahna
 *
 * Har bir bosqich xato bersa keyingisiga oʻtadi, shuning uchun sahifada
 * hech qachon «singan rasm» chiqmaydi.
 */
export function PlaceMedia({ place, size = 'md', withVideo = false, className = '', onPhoto }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [wiki, setWiki] = useState(null);
  const [wikiFailed, setWikiFailed] = useState(false);

  const configured = photoFor(place);
  const video = withVideo ? videoFor(place) : null;

  // Sozlangan rasm boʻlmasa (yoki ochilmasa) — Wikipedia'dan qidiramiz.
  useEffect(() => {
    let cancelled = false;
    const needsWiki = (!configured || photoFailed) && place?.id;
    if (!needsWiki) return undefined;

    findWikiPhoto(place.id, place.name, 'Toshkent').then((result) => {
      if (cancelled) return;
      if (result?.url) {
        setWiki(result);
        onPhoto?.({ source: 'wiki', page: result.page, title: result.title });
      } else {
        setWikiFailed(true);
        onPhoto?.(null);
      }
    });

    return () => {
      cancelled = true;
    };
    // onPhoto ataylab bogʻlanishga qoʻshilmagan: u har renderda yangi funksiya
    // boʻlishi mumkin va bu cheksiz sikl hosil qilardi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place?.id, configured, photoFailed]);

  const sizeClass = size === 'sm' ? 'cover--sm' : size === 'tall' ? 'cover--tall' : '';

  const showVideo = video && !videoFailed;
  const showConfigured = !showVideo && configured && !photoFailed;
  const showWiki = !showVideo && !showConfigured && wiki?.url && !wikiFailed;
  const photoSrc = showConfigured ? configured : showWiki ? wiki.url : null;

  return (
    <span className={`cover ${sizeClass} ${className}`}>
      {showVideo ? (
        <video
          className="cover__photo"
          src={video}
          poster={configured || undefined}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
        />
      ) : null}

      {photoSrc ? (
        <img
          className="cover__photo"
          src={photoSrc}
          alt={place.name}
          loading="lazy"
          decoding="async"
          onError={() => (showConfigured ? setPhotoFailed(true) : setWikiFailed(true))}
        />
      ) : null}

      {!showVideo && !photoSrc ? <PlaceArt category={place.category} seed={place.id} /> : null}

      {showVideo || photoSrc ? <span className="cover__shade" aria-hidden="true" /> : null}

      <span className="cover__badge" aria-hidden="true">
        {place.emoji}
      </span>
    </span>
  );
}
