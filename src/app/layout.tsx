import '@/app/styles/globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={'h-full antialiased'}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
