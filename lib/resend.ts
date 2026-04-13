// ─────────────────────────────────────────────────────────────────────────────
// lib/resend.ts
// Email sending via Resend.
// Used for order confirmations only.
// ─────────────────────────────────────────────────────────────────────────────

import { Resend } from 'resend'
import { BRAND } from './constants'
import { formatPrice, formatDate } from './utils'
import type { Order } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY!)

// ─── Order Confirmation Email ─────────────────────────────────────────────────

export async function sendOrderConfirmation(order: Order, email?: string) {
  // Skip if no email provided (phone-only users)
  if (!email) return

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E8E8E4;">
          <strong>${item.productName}</strong><br/>
          <span style="color: #888880; font-size: 13px;">
            ${item.color}${item.size ? ` · ${item.size}` : ''} · Qty: ${item.quantity}
          </span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E8E8E4; text-align: right;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('')

  await resend.emails.send({
    from:    `${BRAND.name} <orders@louispolo.in>`,
    to:      email,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Helvetica Neue', Arial, sans-serif; color: #1A1A1A;">
        
        <div style="padding: 40px 0; text-align: center; border-bottom: 1px solid #E8E8E4;">
          <h1 style="font-family: Georgia, serif; font-weight: 400; font-size: 28px; letter-spacing: 0.15em;">
            LOUIS POLO
          </h1>
          <p style="color: #C9A96E; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; margin-top: 4px;">
            Trendsetters in Luggage
          </p>
        </div>

        <div style="padding: 32px 0;">
          <h2 style="font-family: Georgia, serif; font-weight: 400; font-size: 22px; margin-bottom: 8px;">
            Your order is confirmed
          </h2>
          <p style="color: #888880; margin-bottom: 24px;">
            Order ${order.orderNumber} · Placed on ${formatDate(order.createdAt)}
          </p>

          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
          </table>

          <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #1A1A1A; display: flex; justify-content: space-between;">
            <strong>Total</strong>
            <strong>${formatPrice(order.total)}</strong>
          </div>
        </div>

        <div style="padding: 24px; background: #FAFAF8; margin-top: 16px;">
          <h3 style="font-size: 14px; margin-bottom: 8px;">Delivering to</h3>
          <p style="color: #888880; font-size: 13px; line-height: 1.6;">
            ${order.address.name}<br/>
            ${order.address.line1}${order.address.line2 ? `, ${order.address.line2}` : ''}<br/>
            ${order.address.city}, ${order.address.state} — ${order.address.pincode}
          </p>
        </div>

        <div style="padding: 32px 0; text-align: center; color: #888880; font-size: 12px;">
          <p>Questions? Reply to this email or WhatsApp us at ${BRAND.phone}</p>
          <p style="margin-top: 8px;">© ${new Date().getFullYear()} Louis Polo. All rights reserved.</p>
        </div>

      </div>
    `,
  })
}

export default resend
