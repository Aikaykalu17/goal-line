import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request) {
  const data = await request.json();

  const fullName = String(data.fullName || "").trim();
  const phoneNumber = String(data.phoneNumber || "").trim();
  const email = String(data.email || "").trim();
  const subject = String(data.subject || "").trim();
  const message = String(data.message || "").trim();

  if (!fullName || !phoneNumber || !email || !message) {
    return Response.json(
      { success: false, error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json(
      { success: false, error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  try {
    await resend.emails.send({
      from: "GoalLine Turf <onboarding@resend.dev>",
      to: "kaluamoguaikay17@gmail.com",
      subject: "Booking Application",
      html: `
        <p><strong>Full Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Phone Number:</strong> ${escapeHtml(phoneNumber)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong> ${escapeHtml(message)}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
