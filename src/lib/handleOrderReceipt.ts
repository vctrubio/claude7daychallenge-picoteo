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
  orderType: "pickup" | "stripe";
}

export async function handleOrderReceipt(data: ReceiptData): Promise<{ success: boolean; receipt?: string; whatsappUrl?: string; error?: string }> {
  try {
    const receipt = generateReceiptMessage(data);

    // Generate WhatsApp URL but don't open it yet
    const whatsappUrl = `https://wa.me/${data.owner.whatsappApiTlf}?text=${encodeURIComponent(receipt)}`;

    return {
      success: true,
      receipt,
      whatsappUrl,
    };
  } catch (error) {
    console.error("Failed to generate WhatsApp receipt:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate receipt",
    };
  }
}

export function sendWhatsAppMessage(whatsappUrl: string): void {
  if (typeof window !== "undefined") {
    window.open(whatsappUrl, "_blank");
  }
}

function generateReceiptMessage(data: ReceiptData): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let receipt = `🧾 **NEW ORDER - PICOTEO**\n\n`;
  receipt += `📅 **Date:** ${dateStr}\n`;
  receipt += `⏰ **Time:** ${timeStr}\n\n`;

  receipt += `👤 **Customer:**\n`;
  receipt += `Name: ${data.customer.name}\n`;
  receipt += `Phone: ${data.customer.phone}\n\n`;

  receipt += `🛒 **Order Details:**\n`;
  receipt += `Type: ${data.orderType === "pickup" ? "🚶 Pickup in Person" : "💳 Paid with Stripe"}\n\n`;

  receipt += `📦 **Items Ordered:**\n`;
  receipt += `${"─".repeat(35)}\n`;

  data.products.forEach((product, index) => {
    const lineTotal = product.basePricePerUnit * product.quantity;
    receipt += `${index + 1}. ${product.name}\n`;
    receipt += `   €${product.basePricePerUnit.toFixed(2)} per ${product.unit} × ${product.quantity}\n`;
    receipt += `   Subtotal: €${lineTotal.toFixed(2)}\n\n`;
  });

  receipt += `${"─".repeat(35)}\n`;
  receipt += `💰 **TOTAL: €${data.total.toFixed(2)}**\n`;
  receipt += `${"─".repeat(35)}\n\n`;

  if (data.orderType === "pickup") {
    receipt += `📍 **Next Steps:**\n`;
    receipt += `• Customer will pick up in person\n`;
    receipt += `• Please prepare the order\n`;
    receipt += `• Collect payment on pickup\n`;
  } else {
    receipt += `📍 **Next Steps:**\n`;
    receipt += `• Payment already processed via Stripe\n`;
    receipt += `• Please prepare the order\n`;
    receipt += `• Customer will arrange pickup\n`;
  }

  receipt += `\n🌟 *Powered by Picoteo - Local Marketplace*`;

  return receipt;
}
