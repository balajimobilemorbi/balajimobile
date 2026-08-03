/**
 * Share utility helper for sharing phone details via Web Share API, WhatsApp, or Copying to Clipboard.
 */
export function buildPhoneShareMessage(phone) {
  const title = phone.title || `${phone.brand} Phone`;
  const price = phone.bmPrice ? `₹${Number(phone.bmPrice).toLocaleString('en-IN')}` : (phone.price || 'Best Price');
  const ram = phone.ram ? `RAM: ${phone.ram}` : '';
  const storage = phone.storage ? `Storage: ${phone.storage}` : '';
  const processor = phone.processor ? `Processor: ${phone.processor}` : '';
  const camera = phone.camera ? `Camera: ${phone.camera}` : '';
  const battery = phone.battery ? `Battery: ${phone.battery}` : '';
  const link = phone.id && !phone.isExternal ? `${window.location.origin}/product/${phone.id}` : window.location.origin;

  const specLines = [ram, storage, processor, camera, battery].filter(Boolean).map(s => `• ${s}`).join('\n');

  return `📱 *${title}* at Balaji Mobile!
💰 *Special Price:* ${price}
${specLines}

🛍️ *Order & Specs at Balaji Mobile (Morbi, Gujarat):*
${link}`;
}

export async function sharePhoneDetails(phone) {
  const text = buildPhoneShareMessage(phone);
  const title = phone.title || 'Balaji Mobile';
  const url = phone.id && !phone.isExternal ? `${window.location.origin}/product/${phone.id}` : window.location.origin;

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      });
      return { success: true, method: 'native' };
    } catch (e) {
      if (e.name !== 'AbortError') {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        return { success: true, method: 'whatsapp' };
      }
      return { success: false, method: 'cancelled' };
    }
  } else {
    try {
      await navigator.clipboard.writeText(text);
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      return { success: true, method: 'whatsapp' };
    } catch (err) {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      return { success: true, method: 'whatsapp' };
    }
  }
}
