import { ThemeProvider } from "@/components/layouts/theme-provider";
import { Header } from "@/components/layouts/header";
import "../globals.css";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="shop-theme"
      disableTransitionOnChange
    >
      <Header />
      {children}
    </ThemeProvider>
  );
}
