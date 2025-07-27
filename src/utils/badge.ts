export const getStatusVariant = (status: string) => {
  switch (status) {
    case "PAID":
      return "success";
    case "FAILED":
      return "destructive";
    case "PENDING":
      return "secondary";
    case "CONFIRMED":
      return "info";
    case "PROCESSING":
      return "warning";
    case "SHIPPED":
      return "info";
    case "DELIVERED":
      return "success";
    case "CANCELLED":
      return "destructive";
    default:
      return "default";
  }
};


export const getStatusLabel = (status: string) => {
  const statusMap: { [key: string]: string } = {
    PENDING: "Pendente",
    PAID: "Pago",
    FAILED: "Falhou",
    CONFIRMED: "Confirmado",
    PROCESSING: "Processando",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
  };
  return statusMap[status] || status;
};
