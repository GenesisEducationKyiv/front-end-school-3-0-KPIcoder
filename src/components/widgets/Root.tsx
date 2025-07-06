import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';

function Root() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Root;
