import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './guards';

// Pages
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import AuthPage from '../pages/AuthPage';
import WishlistPage from '../pages/WishlistPage';
import ProfilePage from '../pages/ProfilePage';
import OrdersPage from '../pages/OrdersPage';
import CategoriesPage from '../pages/CategoriesPage';
import OrderDetailsPage from '../pages/OrderDetailsPage';

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminAddProduct from '../pages/admin/AdminAddProduct';
import AdminEditProduct from '../pages/admin/AdminEditProduct';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminHomePage from '../pages/admin/AdminHomePage';
import AdminCategories from '../pages/admin/AdminCategories';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'product/:slug', element: <ProductDetailPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'cart', element: <CartPage /> },
      {
        path: 'login',
        element: <GuestRoute><AuthPage /></GuestRoute>,
      },
      {
        path: 'checkout',
        element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>,
      },
      {
        path: 'order-success',
        element: <ProtectedRoute><OrderSuccessPage /></ProtectedRoute>,
      },
      {
        path: 'wishlist',
        element: <ProtectedRoute><WishlistPage /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: 'orders',
        element: <ProtectedRoute><OrdersPage /></ProtectedRoute>,
      },
      {
        path: 'orders/:id',
        element: <ProtectedRoute><OrderDetailsPage /></ProtectedRoute>,
      },
      {
        path: 'admin',
        element: <AdminRoute><AdminDashboard /></AdminRoute>,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'homepage', element: <AdminHomePage /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'categories', element: <AdminCategories /> },
          { path: 'add-product', element: <AdminAddProduct /> },
          { path: 'edit-product/:id', element: <AdminEditProduct /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'users', element: <div className="p-8 text-center bg-white rounded-2xl border border-gray-100"><h2 className="text-xl font-bold mb-2">Customers Management</h2><p className="text-gray-500">Coming Soon: Track your customer base and their activities.</p></div> },
          { path: 'coupons', element: <div className="p-8 text-center bg-white rounded-2xl border border-gray-100"><h2 className="text-xl font-bold mb-2">Discount Coupons</h2><p className="text-gray-500">Coming Soon: Create and manage promotional codes.</p></div> },
          { path: 'reviews', element: <div className="p-8 text-center bg-white rounded-2xl border border-gray-100"><h2 className="text-xl font-bold mb-2">Product Reviews</h2><p className="text-gray-500">Coming Soon: Moderate and view customer ratings.</p></div> },
        ],
      },
    ],
  },
]);

export default router;
