import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { PinProvider } from "./context/PinContext";

export const metadata: Metadata = {
  title: "Diary",
  description: "A personal neomorphic diary",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <PinProvider>{children}</PinProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
