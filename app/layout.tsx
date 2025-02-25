import './globals.css';
import Sidebar from '../components/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-100">
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
