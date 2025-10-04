import { handleOrderReceipt } from './handleOrderReceipt';

interface OrderTransactionParams {
  orderId: string;
  products: any[];
  total: number;
  owner: {
    username: string;
    whatsappApiTlf: string;
  };
  customer: {
    name: string;
    phone: string;
  };
}

export async function handleOrderTransaction({
  orderId,
  products,
  total,
  owner,
  customer
}: OrderTransactionParams) {
  try {
    // TODO: Implement Stripe payment logic here
    // 1. Get buyer and seller Stripe accounts
    // 2. Create payment intent with application fee
    // 3. Transfer to seller account
    
    // For now, simulate successful payment
    const paymentSuccessful = true;
    
    if (paymentSuccessful) {
      // Generate WhatsApp notification for business owner
      const receiptResult = await handleOrderReceipt({
        products,
        total,
        owner,
        customer,
        orderType: 'stripe'
      });
      
      if (receiptResult.success && receiptResult.whatsappUrl) {
        // Auto-send WhatsApp for Stripe payments (since payment is already processed)
        if (typeof window !== 'undefined') {
          window.open(receiptResult.whatsappUrl, '_blank');
        }
      }
      
      return {
        success: true,
        receiptSent: receiptResult.success,
        orderId
      };
    } else {
      return {
        success: false,
        error: 'Payment failed'
      };
    }
    
  } catch (error) {
    console.error('Order transaction failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed'
    };
  }
}