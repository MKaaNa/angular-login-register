export interface Invoice {
  reservationId: number;
  invoiceNumber?: string;
  userEmail?: string;
  paymentDate?: string;
  totalAmount?: number;
  details?: string;
}