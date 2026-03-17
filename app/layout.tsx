import type { Metadata } from 'next';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';

export const metadata: Metadata = {
  title: 'Мысли в урну',
  description: 'Выбрасывайте негативные мысли',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
