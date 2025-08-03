export interface PaymentItem {
  id: string;
  courseName: string;
  amount: number;
  orderNumber: string;
  orderDate: string;
  completionDate: string;
  paymentMethod: string;
  status: "completed" | "cancelled" | "refunded";
  receiptLink?: string;
}

export interface PaymentHistoryState {
  payments: PaymentItem[];
  loading: boolean;
  error: string | null;
  activeFilter: "all" | "completed" | "cancelled" | "refunded";
}
