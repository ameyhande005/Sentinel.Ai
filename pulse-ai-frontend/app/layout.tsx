import "@/styles/globals.css";

export const metadata = {
  title: "Pulse AI",
  description: "AI-driven project intelligence for engineering teams."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
