interface Product {
  _id: string;
  name: string;
  basePricePerUnit: number;
  unit: string;
  quantity: number;
}

interface Owner {
  username: string;
  whatsappApiTlf: string;
}

interface Customer {
  name: string;
  phone: string;
}

interface ReceiptData {
  products: Product[];
  total: number;
  owner: Owner;
  customer: Customer;
  orderType: 'pickup' | 'delivery';
}

export async function handleBasketReceipt(data: ReceiptData): Promise<boolean> {
  try {
    const receipt = generateReceiptMessage(data);
    
    // TODO: Replace with actual WhatsApp API call
    console.log('WhatsApp Receipt to:', data.owner.whatsappApiTlf);
    console.log('Message:', receipt);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Failed to send WhatsApp receipt:', error);
    return false;
  }
}

function generateReceiptMessage(data: ReceiptData): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  let receipt = `🧾 **NEW ORDER - PICOTEO**\n\n`;
  receipt += `📅 **Date:** ${dateStr}\n`;
  receipt += `⏰ **Time:** ${timeStr}\n\n`;
  
  receipt += `👤 **Customer:**\n`;
  receipt += `Name: ${data.customer.name}\n`;
  receipt += `Phone: ${data.customer.phone}\n\n`;
  
  receipt += `🛒 **Order Details:**\n`;
  receipt += `Type: ${data.orderType === 'pickup' ? '🚶 Pickup in Person' : '🚚 Delivery'}\n\n`;
  
  receipt += `📦 **Items Ordered:**\n`;
  receipt += `${'─'.repeat(35)}\n`;
  
  data.products.forEach((product, index) => {
    const lineTotal = product.basePricePerUnit * product.quantity;
    receipt += `${index + 1}. ${product.name}\n`;
    receipt += `   €${product.basePricePerUnit.toFixed(2)} per ${product.unit} × ${product.quantity}\n`;
    receipt += `   Subtotal: €${lineTotal.toFixed(2)}\n\n`;
  });
  
  receipt += `${'─'.repeat(35)}\n`;
  receipt += `💰 **TOTAL: €${data.total.toFixed(2)}**\n`;
  receipt += `${'─'.repeat(35)}\n\n`;
  
  if (data.orderType === 'pickup') {
    receipt += `📍 **Next Steps:**\n`;
    receipt += `• Customer will pick up in person\n`;
    receipt += `• Please prepare the order\n`;
    receipt += `• Collect payment on pickup\n`;
  } else {
    receipt += `📍 **Next Steps:**\n`;
    receipt += `• Prepare order for delivery\n`;
    receipt += `• Contact customer for delivery details\n`;
  }
  
  receipt += `\n🌟 *Powered by Picoteo - Local Marketplace*`;
  
  return receipt;
}

// Function to simulate WhatsApp API call
async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  // TODO: Implement actual WhatsApp Business API integration
  // Example with WhatsApp Business API:
  /*
  const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "text",
      text: {
        body: message
      }
    })
  });
  
  return response.ok;
  */
  
  console.log(`Sending WhatsApp to ${phoneNumber}:`, message);
  return true;
}