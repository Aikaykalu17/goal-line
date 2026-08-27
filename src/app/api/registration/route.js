import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const data = await request.json();
  try {
    await resend.emails.send({
      from: "GoalLine Turf <onboarding@resend.dev>",
      to: "kaluamoguaikay17@gmail.com",
      subject: "Booking Application",
      html: `
        <p><strong>Full Name:</strong> ${data.fullName}</p>
        <p><strong>Phone Number:</strong> ${data.phoneNumber}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong> ${data.message}</p>
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
