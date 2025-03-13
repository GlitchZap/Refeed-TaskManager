import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Management App',
  description: 'A vibrant task management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white`}>
        <div className="container mx-auto px-4 py-8">

          <main>{children}</main>
          <footer className="mt-12 py-6 text-center text-sm text-fuchsia-300/50">
            <p>AAYUSH KUMAR &copy; 2025. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}