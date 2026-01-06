// app/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ImageTextSection from '@/components/ImageTextSection';
import FeaturesGrid from '@/components/FeaturesGrid';
import BenefitsSection from '@/components/BenefitsSection';
import CTASection from '@/components/CTASection';

export default function Home() {
    return (
        <>
            <Header />

            <main className="w-full">
                <HeroSection />
                <ImageTextSection />
                <FeaturesGrid />
                <BenefitsSection />
                <CTASection />
            </main>

            <Footer />
        </>
    );
}