import { Hero } from '../components/home/Hero.jsx';
import { HowItWorks } from '../components/home/HowItWorks.jsx';
import { Showreel } from '../components/home/Showreel.jsx';
import { PlacesGallery } from '../components/home/PlacesGallery.jsx';
import { Marquee } from '../components/home/Marquee.jsx';
import { Features } from '../components/home/Features.jsx';
import { CallToAction } from '../components/home/CallToAction.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Showreel />
      <PlacesGallery />
      <HowItWorks />
      <Features />
      <CallToAction />
    </>
  );
}
