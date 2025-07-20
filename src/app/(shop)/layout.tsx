import { ThemeProvider } from "@/components/layouts/theme-provider";
import { Header } from "@/components/layouts/header";
import "../globals.css";
import { Footer } from "@/components/layouts/footer";

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
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
