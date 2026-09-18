import { useI18n } from '../../i18n/index.jsx';

/**
 * Kun soatlari lentasi — mozaika chizigʻi kabi sahifani ikkiga boʻladi
 * va mahsulotning asosiy gʻoyasini bir qatorda aytadi: kun soatma-soat.
 */
const HOURS = [
  ['09:00', 'showreel.s1'],
  ['11:00', 'showreel.s2'],
  ['13:00', 'showreel.s3'],
  ['16:00', 'showreel.s4'],
  ['19:00', 'showreel.s5'],
  ['21:00', 'showreel.s6'],
];

export function Marquee() {
  const { t } = useI18n();
  const items = [...HOURS, ...HOURS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map(([time, key], index) => (
          <span className="marquee__item" key={`${time}-${index}`}>
            <span className="marquee__dot" />
            {time} · {t(key)}
          </span>
        ))}
      </div>
    </div>
  );
}
