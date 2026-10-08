import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <div className="pb-16 lg:pb-0">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
}
