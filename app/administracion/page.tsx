import type { Metadata } from 'next';
import AdminDashboardPage from './page-client';

export const metadata: Metadata = {
  title: 'Acceso Seguro | Cumaná Conecta',
  description: 'Panel privado de administración.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdministracionPage() {
  return <AdminDashboardPage />;
}
