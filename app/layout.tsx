import './globals.css';

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex w-full h-full bg-gray-100">
        {/* The children will take up the entire space */}
        {children}
      </body>
    </html>
  );
}
