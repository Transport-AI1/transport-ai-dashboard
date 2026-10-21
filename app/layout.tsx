import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard Empresarial | Transport AI",
  description:
    "Demostración interactiva de un dashboard empresarial de Transport AI para visualizar actividad, procesos, tareas e informes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
