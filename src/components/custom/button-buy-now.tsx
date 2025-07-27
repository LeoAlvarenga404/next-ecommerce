import { Button } from "../ui/button";
import { useCart } from "@/hooks/use-cart";
import { IProduct } from "@/@types/product";
import { toast } from "sonner";

export function ButtonBuyNow({ product }: { product: IProduct }) {
  const { addItem, isAddingItem } = useCart();

  const handleNavigateToCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      addItem({ product: product, quantity: 1 });
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      toast.error("Erro ao adicionar produto ao carrinho. Tente novamente.");
    }
  };

  return (
    <Button
      className="flex-1"
      size="lg"
      onClick={handleNavigateToCheckout}
      disabled={isAddingItem}
    >
      Comprar Agora
    </Button>
  );
}
