export const metadata = {
  title: "Studio — Tarek Sports Cards",
  robots: { index: false, follow: false },
};

// The Studio manages its own full-screen chrome, so this root layout is bare.
export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
