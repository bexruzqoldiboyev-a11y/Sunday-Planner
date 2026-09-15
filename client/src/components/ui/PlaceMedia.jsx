import { useState } from 'react';
import { PlaceArt } from './PlaceArt.jsx';
import { photoFor, videoFor } from '../../services/media.js';

/**
 * Joy muqovasi.
 *  1. Real video boʻlsa — video (ovozsiz, doimiy takrorlanadi).
 *  2. Real rasm boʻlsa — rasm.
 *  3. Boʻlmasa (yoki yuklanmasa) — jonli sahna.
 * Shu tartib tufayli sahifada hech qachon "singan rasm" chiqmaydi.
 */
export function PlaceMedia({ place, size = 'md', withVideo = false, className = '' }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const photo = photoFor(place);
  const video = withVideo ? videoFor(place) : null;
  const sizeClass = size === 'sm' ? 'cover--sm' : size === 'tall' ? 'cover--tall' : '';

  const showVideo = video && !videoFailed;
  const showPhoto = !showVideo && photo && !photoFailed;

  return (
    <span className={`cover ${sizeClass} ${className}`}>
      {showVideo ? (
        <video
          className="cover__photo"
          src={video}
          poster={photo || undefined}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
        />
      ) : null}

      {showPhoto ? (
        <img
          className="cover__photo"
          src={photo}
          alt={place.name}
          loading="lazy"
          decoding="async"
          onError={() => setPhotoFailed(true)}
        />
      ) : null}

      {!showVideo && !showPhoto ? <PlaceArt category={place.category} seed={place.id} /> : null}

      {showVideo || showPhoto ? <span className="cover__shade" aria-hidden="true" /> : null}

      <span className="cover__badge" aria-hidden="true">
        {place.emoji}
      </span>
    </span>
  );
}
