import { Outlet } from '@tanstack/react-router';
import Header from './widgets/Header';
import Footer from './widgets/Footer';

function Root() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4">
        <Outlet />
      </main>
      <Footer showSocials={true} showLegalLinks={true} />
    </div>
  );
}

export default Root;
