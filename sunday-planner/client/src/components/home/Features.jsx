import { motion } from 'framer-motion';
import { Tilt } from '../ui/Tilt.jsx';
import { useI18n } from '../../i18n/index.jsx';

const FEATURES = [
  {
    icon: '🧮',
    title: 'Budjet majburan sarflanmaydi',
    text: '500 000 soʻmingiz boʻlsa ham, 320 000 soʻmga yaxshi kun chiqsa — shuni taklif qilamiz. Qolgani cho\u02bbntagingizda qoladi.',
  },
  {
    icon: '🚕',
    title: 'Yoʻl ham hisobga olinadi',
    text: 'Joylar orasidagi masofa, yoʻlda ketadigan vaqt va taxminiy taksi puli rejaga qoʻshiladi.',
  },
  {
    icon: '🔁',
    title: 'Har bir qadam almashadi',
    text: 'Kino oʻrniga bouling. Bosasiz — vaqt va budjet shu zahoti qayta hisoblanadi.',
  },
  {
    icon: '🌗',
    title: 'Kunduz va tun rejimi',
    text: 'Tanlovingiz brauzerda saqlanadi, keyingi kirganingizda oʻzi eslab qoladi.',
  },
  {
    icon: '📍',
    title: 'Toshkentning haqiqiy joylari',
    text: 'Nom, manzil, reyting va ish vaqti Google Places dan. Har bir nuqtani xaritada ochib koʻrasiz.',
  },
  {
    icon: '📤',
    title: 'Ulashish va chop etish',
    text: 'Doʻstlarga yuboriladigan qisqa matn yoki chop etish uchun toza sahifa.',
  },
];

export function Features() {
  const { t } = useI18n();
  const items = FEATURES.map((feature, index) => ({
    icon: feature.icon,
    title: t(`features.${index + 1}.title`),
    text: t(`features.${index + 1}.text`),
  }));

  return (
    <section className="section">
      <div className="shell shell--wide">
        <h2 style={{ marginBottom: 'var(--space-4)' }}>{t('features.title')}</h2>
        <div className="features">
          {items.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 44, rotateX: 12 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Tilt strength={7} lift={5}>
                <article className="feature">
                  <span className="feature__icon float-y" aria-hidden="true">
                    {feature.icon}
                  </span>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>
                </article>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
