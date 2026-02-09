// layout itu akan muncul di file yang sejajar dan semua folder dibawahnya
"use client";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div data-theme="light">
        {children}
        </div>
        </body>
    </html>
  );
}
