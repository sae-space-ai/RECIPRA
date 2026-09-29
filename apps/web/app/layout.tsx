import type { Metadata } from 'next';

/**
 * RECIPRA Web — Root Layout.
 *
 * HITO 1: Minimal technical layout. No commercial UI yet.
 */

export const metadata: Metadata = {
  title: 'RECIPRA — Reward OS Foundation',
  description: 'RECIPRA platform foundation. Development milestone HITO-1.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          backgroundColor: '#0a0a0f',
          color: '#e5e7eb',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
