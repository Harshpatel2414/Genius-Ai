import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './globals.css';
import { AuthContextProvider } from '@/context/AuthContext';
import { ChatContextProvider } from '@/context/ChatContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GeniusAi - Products Suggestion with Chat',
  description: 'Generated by create next app',
  keywords: 'GeniusAI, AI technology, product recommendations, personalized assistance, online experience',
  author: 'GeniusAI Team'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <ChatContextProvider>
            <div className="flex flex-col h-dvh">
            <Toaster position="top-center" />
              <Navbar />
              <div className="flex flex-1 overflow-hidden relative">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">{children}</main>
              </div>
            </div>
          </ChatContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
