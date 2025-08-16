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
