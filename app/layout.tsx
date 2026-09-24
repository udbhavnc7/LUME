import type { Metadata } from 'next';
import '../src/index.css';
import '../src/lume.css';

export const metadata: Metadata = {
  title: 'LUME | Acquisition Intelligence',
  description: 'Evidence-weighted statutory land acquisition foresight and intervention command center.',
  applicationName: 'LUME',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    apple: '/pwa-192x192.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
