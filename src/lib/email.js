import { Resend } from "resend";
import formatCurrency from "@/utils/formatCurrency";

const resend = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_FROM =
  process.env.RESEND_FROM_EMAIL || "GoalLine Turf <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kaluamoguaikay17@gmail.com";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getBookingTypeLabel(notes, players) {
  const raw = String(notes || "").trim();
  const match = raw.match(/booking_type:\s*(solo|private|open)/i);

  if (match?.[1]) {
    const type = match[1].toLowerCase();
    if (type === "open") return "Open to others";
    if (type === "private") return "Private booking";
    return "Solo / Individual";
  }

  return Number(players || 0) >= 8 ? "Private booking" : "Solo / Individual";
}

function buildBrandHeader(title, accent = "#0d7a45") {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17201c; max-width: 640px; margin: 0 auto; background: #ffffff;">
      <div style="padding: 20px 24px 12px; background: linear-gradient(135deg, #0d7a45 0%, #1a9d5f 100%); border-radius: 16px 16px 0 0; color: #ffffff;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
          <div style="width: 38px; height: 38px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.18); font-size: 18px; font-weight: 700;">G</div>
          <div>
            <div style="font-size: 20px; font-weight: 800; letter-spacing: 0.04em;">GoalLine Turf</div>
          </div>
        </div>
        <div style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.9;">${escapeHtml(title)}</div>
      </div>
      <div style="padding: 24px; border: 1px solid #dfe9e2; border-top: none; border-radius: 0 0 16px 16px; background: #f9fff9;">
  `;
}

function buildBrandFooter() {
  return `
        <div style="margin-top: 22px; padding-top: 16px; border-top: 1px solid #dfe9e2; font-size: 12px; color: #4b5563;">
          GoalLine Turf • Book your next match with confidence.
        </div>
      </div>
    </div>
  `;
}

export async function sendBookingConfirmationEmail({
  booking,
  customerEmail,
  customerName,
}) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "RESEND_API_KEY is not configured." };
  }

  if (!customerEmail) {
    return { sent: false, reason: "Customer email is missing." };
  }

  try {
    const result = await resend.emails.send({
      from: DEFAULT_FROM,
      to: customerEmail,
      subject: `Booking confirmed - GoalLine Turf #${booking.id}`,
      html: `
        ${buildBrandHeader("Booking confirmed")}
          <p style="margin: 0 0 12px; font-size: 16px;">Hi ${escapeHtml(customerName || "Player")},</p>
          <p style="margin: 0 0 18px; color: #344234;">Your booking at GoalLine Turf has been confirmed successfully.</p>

          <p style="margin: 0 0 8px;"><strong>Booking ID:</strong> ${escapeHtml(booking.id)}</p>
          <p style="margin: 0 0 8px;"><strong>Date & Time:</strong> ${escapeHtml(formatDate(booking.start_at))} to ${escapeHtml(formatDate(booking.end_at))}</p>
          <p style="margin: 0 0 8px;"><strong>Booking Type:</strong> ${escapeHtml(getBookingTypeLabel(booking.notes, booking.players))}</p>
          <p style="margin: 0 0 8px;"><strong>Players:</strong> ${escapeHtml(booking.players)}</p>
          <p style="margin: 0 0 8px;"><strong>Total:</strong> ₦${escapeHtml(formatCurrency(booking.total || 0))}</p>

          <p style="margin: 18px 0 0; color: #1b3c2d;">We look forward to seeing you at the turf.</p>
        ${buildBrandFooter()}
      `,
    });

    return { sent: true, id: result?.data?.id || null };
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
    return { sent: false, reason: error?.message || "Unknown email error." };
  }
}

export async function sendPendingBookingReminderEmail({
  booking,
  customerEmail,
  customerName,
}) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "RESEND_API_KEY is not configured." };
  }

  if (!customerEmail) {
    return { sent: false, reason: "Customer email is missing." };
  }

  try {
    const result = await resend.emails.send({
      from: DEFAULT_FROM,
      to: customerEmail,
      subject: `Pending booking reminder - GoalLine Turf #${booking.id}`,
      html: `
        ${buildBrandHeader("Pending booking reminder")}
          <p style="margin: 0 0 12px; font-size: 16px;">Hi ${escapeHtml(customerName || "Player")},</p>
          <p style="margin: 0 0 18px; color: #344234;">Your booking is still pending. To keep it active, please complete payment as soon as possible.</p>

          <p style="margin: 0 0 8px;"><strong>Booking ID:</strong> ${escapeHtml(booking.id)}</p>
          <p style="margin: 0 0 8px;"><strong>Date & Time:</strong> ${escapeHtml(formatDate(booking.start_at))} to ${escapeHtml(formatDate(booking.end_at))}</p>
          <p style="margin: 0 0 8px;"><strong>Booking Type:</strong> ${escapeHtml(getBookingTypeLabel(booking.notes, booking.players))}</p>
          <p style="margin: 0 0 8px;"><strong>Amount Due:</strong> ₦${escapeHtml(formatCurrency(booking.total || 0))}</p>

          <p style="margin: 18px 0 0; color: #1b3c2d;">Once payment is made, your booking will be confirmed and secured.</p>
        ${buildBrandFooter()}
      `,
    });

    return { sent: true, id: result?.data?.id || null };
  } catch (error) {
    console.error("Failed to send pending booking reminder email:", error);
    return { sent: false, reason: error?.message || "Unknown email error." };
  }
}

export async function sendExpiredBookingEmail({
  booking,
  customerEmail,
  customerName,
}) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "RESEND_API_KEY is not configured." };
  }

  if (!customerEmail) {
    return { sent: false, reason: "Customer email is missing." };
  }

  try {
    const result = await resend.emails.send({
      from: DEFAULT_FROM,
      to: customerEmail,
      subject: `Booking expired - GoalLine Turf #${booking.id}`,
      html: `
        ${buildBrandHeader("Booking expired")}
          <p style="margin: 0 0 12px; font-size: 16px;">Hi ${escapeHtml(customerName || "Player")},</p>
          <p style="margin: 0 0 18px; color: #344234;">This booking was not confirmed in time and has now expired.</p>

          <p style="margin: 0 0 8px;"><strong>Booking ID:</strong> ${escapeHtml(booking.id)}</p>
          <p style="margin: 0 0 8px;"><strong>Booked Time:</strong> ${escapeHtml(formatDate(booking.start_at))} to ${escapeHtml(formatDate(booking.end_at))}</p>
          <p style="margin: 0 0 8px;"><strong>Booking Type:</strong> ${escapeHtml(getBookingTypeLabel(booking.notes, booking.players))}</p>

          <p style="margin: 18px 0 0; color: #1b3c2d;">You can always make a new booking whenever you are ready to play.</p>
        ${buildBrandFooter()}
      `,
    });

    return { sent: true, id: result?.data?.id || null };
  } catch (error) {
    console.error("Failed to send expired booking email:", error);
    return { sent: false, reason: error?.message || "Unknown email error." };
  }
}

export async function sendPaymentConfirmationEmail({
  booking,
  customerEmail,
  customerName,
}) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "RESEND_API_KEY is not configured." };
  }

  if (!customerEmail) {
    return { sent: false, reason: "Customer email is missing." };
  }

  try {
    const result = await resend.emails.send({
      from: DEFAULT_FROM,
      to: customerEmail,
      subject: `Payment confirmed - GoalLine Turf #${booking.id}`,
      html: `
        ${buildBrandHeader("Payment confirmed")}
          <p style="margin: 0 0 12px; font-size: 16px;">Hi ${escapeHtml(customerName || "Player")},</p>
          <p style="margin: 0 0 18px; color: #344234;">We have received your payment and your booking is now confirmed.</p>

          <p style="margin: 0 0 8px;"><strong>Booking ID:</strong> ${escapeHtml(booking.id)}</p>
          <p style="margin: 0 0 8px;"><strong>Date & Time:</strong> ${escapeHtml(formatDate(booking.start_at))} to ${escapeHtml(formatDate(booking.end_at))}</p>
          <p style="margin: 0 0 8px;"><strong>Booking Type:</strong> ${escapeHtml(getBookingTypeLabel(booking.notes, booking.players))}</p>
          <p style="margin: 0 0 8px;"><strong>Amount Paid:</strong> ₦${escapeHtml(formatCurrency(booking.total || 0))}</p>

          <p style="margin: 18px 0 0; color: #1b3c2d;">Your session is secured and we look forward to seeing you at the turf.</p>
        ${buildBrandFooter()}
      `,
    });

    return { sent: true, id: result?.data?.id || null };
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error);
    return { sent: false, reason: error?.message || "Unknown email error." };
  }
}

export async function sendAdminCancellationAlertEmail({
  booking,
  customerEmail,
  customerName,
  customerPhone,
  reason,
}) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "RESEND_API_KEY is not configured." };
  }

  try {
    const result = await resend.emails.send({
      from: DEFAULT_FROM,
      to: ADMIN_EMAIL,
      subject: `Booking cancelled - GoalLine Turf #${booking.id}`,
      html: `
        ${buildBrandHeader("Booking cancelled")}
          <p style="margin: 0 0 12px; font-size: 16px;">A booking has been cancelled.</p>

          <p style="margin: 0 0 8px;"><strong>Customer:</strong> ${escapeHtml(customerName)}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
          <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${escapeHtml(customerPhone)}</p>
          <p style="margin: 0 0 8px;"><strong>Booking ID:</strong> ${escapeHtml(booking.id)}</p>
          <p style="margin: 0 0 8px;"><strong>Date & Time:</strong> ${escapeHtml(formatDate(booking.start_at))} to ${escapeHtml(formatDate(booking.end_at))}</p>
          <p style="margin: 0 0 8px;"><strong>Booking Type:</strong> ${escapeHtml(getBookingTypeLabel(booking.notes, booking.players))}</p>
          <p style="margin: 0 0 8px;"><strong>Reason:</strong> ${escapeHtml(reason || "Not provided")}</p>
        ${buildBrandFooter()}
      `,
    });

    return { sent: true, id: result?.data?.id || null };
  } catch (error) {
    console.error("Failed to send admin cancellation alert email:", error);
    return { sent: false, reason: error?.message || "Unknown email error." };
  }
}

export async function sendAdminBookingNotificationEmail({
  booking,
  customerEmail,
  customerName,
  customerPhone,
}) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "RESEND_API_KEY is not configured." };
  }

  try {
    const result = await resend.emails.send({
      from: DEFAULT_FROM,
      to: ADMIN_EMAIL,
      subject: `New GoalLine Turf booking - #${booking.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17201c; max-width: 640px; margin: 0 auto;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
            <h2 style="margin: 0 0 12px; color: #0f172a;">New Booking Received</h2>
            <p style="margin: 0 0 8px;"><strong>Customer:</strong> ${escapeHtml(customerName)}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
            <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${escapeHtml(customerPhone)}</p>
            <p style="margin: 0 0 8px;"><strong>Booking ID:</strong> ${escapeHtml(booking.id)}</p>
            <p style="margin: 0 0 8px;"><strong>Date & Time:</strong> ${escapeHtml(formatDate(booking.start_at))} to ${escapeHtml(formatDate(booking.end_at))}</p>
            <p style="margin: 0 0 8px;"><strong>Players:</strong> ${escapeHtml(booking.players)}</p>
            <p style="margin: 0 0 8px;"><strong>Booking Type:</strong> ${escapeHtml(getBookingTypeLabel(booking.notes, booking.players))}</p>
            <p style="margin: 0 0 8px;"><strong>Total:</strong> ₦${escapeHtml(formatCurrency(booking.total || 0))}</p>
          </div>
        </div>
      `,
    });

    return { sent: true, id: result?.data?.id || null };
  } catch (error) {
    console.error("Failed to send admin booking notification email:", error);
    return { sent: false, reason: error?.message || "Unknown email error." };
  }
}

export async function sendBookingEmails({
  booking,
  customerEmail,
  customerName,
  customerPhone,
}) {
  const customerResult = await sendBookingConfirmationEmail({
    booking,
    customerEmail,
    customerName,
  });

  const adminResult = await sendAdminBookingNotificationEmail({
    booking,
    customerEmail,
    customerName,
    customerPhone,
  });

  return { customerResult, adminResult };
}
