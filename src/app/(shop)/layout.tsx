import { ThemeProvider } from "@/components/layouts/theme-provider";
import "../globals.css";
import { Footer } from "@/components/layouts/footer";
import { HeaderClient } from "@/components/layouts/header/header-client";
import { HeaderServer } from "@/components/layouts/header/header-server";

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
        <HeaderServer />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

// glock-18 shinobu FT - 27 reais;
// awp neo noir - 159 - 172 reais;
// ak-74 desejo noturno ft - 51 reais;

// total = 250 reais;