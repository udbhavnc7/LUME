import type { Metadata } from 'next';
import '../src/index.css';
import '../src/lume.css';
import { assetUrl } from '../src/utils/assetUrl';

export const metadata: Metadata = {
  title: 'LUME | Acquisition Intelligence',
  description: 'Evidence-weighted statutory land acquisition foresight and intervention command center.',
  applicationName: 'LUME',
  manifest: assetUrl('/manifest.webmanifest'),
  icons: {
    icon: assetUrl('/icon.svg'),
    apple: assetUrl('/pwa-192x192.png'),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
