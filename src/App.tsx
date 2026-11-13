import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { MarketplaceHome } from './components/MarketplaceHome';
import { SellProductPage } from './components/SellProductPage';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { OrdersView } from './components/OrdersView';
import { ProfileView } from './components/ProfileView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ToastContainer } from './components/ToastContainer';
import { ShopOwnerDashboard } from './components/ShopOwnerDashboard';

const AppContent: React.FC = () => {
  const { currentUser, activeView } = useMarketplace();

  if (!currentUser) {
    return (
      <>
        <AuthPage />
        <ToastContainer />
      </>
    );
  }

  if (currentUser.role === 'shop_owner') {
    return (
      <>
        <ShopOwnerDashboard />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] text-[#17212F]">
      <Navbar />

      <main className="flex-1">
        {activeView === 'marketplace' && <MarketplaceHome />}
        {activeView === 'sell' && <SellProductPage />}
        {activeView === 'cart' && <CartView />}
        {activeView === 'checkout' && <CheckoutView />}
        {activeView === 'orders' && <OrdersView />}
        {activeView === 'profile' && <ProfileView />}
      </main>

      <Footer />

      <ProductDetailModal />
      <OrderSuccessModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <AppContent />
    </MarketplaceProvider>
  );
}
