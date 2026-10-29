import type { ReactNode } from "react";

export const metadata = { title: "feedback-hub" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 720,
          margin: "2rem auto",
          padding: "0 1rem",
        }}
      >
        <header>
          <a href="/">feedback-hub</a>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
