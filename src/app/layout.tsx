import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import RQProvider from './_component/RQProvivder';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LiveShorts',
  description: 'LiveShorts',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <RQProvider>{children}</RQProvider>
      </body>
    </html>
  );
}
