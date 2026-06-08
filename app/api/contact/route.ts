import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, subject, message" },
        { status: 400 }
      );
    }

    // Configure Nodemailer transporter
    const secureConnection = process.env.EMAIL_SECURE === "true";
    
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587", 10),
      secure: secureConnection,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Gmail SMTP requires TLS/STARTTLS for port 587
      tls: {
        rejectUnauthorized: false,
      },
    });

    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || process.env.EMAIL_USER;

    // Define the email contents
    const mailOptions = {
      from: `"${name} (Transmission Portal)" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      replyTo: email, // Allows clicking reply in Gmail directly to the sender
      subject: `[Transmission Portal] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: 0 auto; border: 2px solid #000; padding: 20px; background-color: #0A0F0A; color: #00FF41;">
          <h2 style="border-bottom: 2px solid #00FF41; padding-bottom: 10px; margin-top: 0; color: #00FF41; text-transform: uppercase; letter-spacing: 2px;">
            &gt; INCOMING_TRANSMISSION
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px; color: #888888;">SENDER:</td>
              <td style="padding: 6px 0; color: #FFFFFF;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #888888;">EMAIL:</td>
              <td style="padding: 6px 0; color: #FFFFFF;"><a href="mailto:${email}" style="color: #00FF41; text-decoration: underline;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #888888;">SUBJECT:</td>
              <td style="padding: 6px 0; color: #FFFFFF;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #888888;">TIMESTAMP:</td>
              <td style="padding: 6px 0; color: #FFFFFF;">${new Date().toISOString()}</td>
            </tr>
          </table>
          <div style="border-top: 1px dashed #00FF41; padding-top: 15px;">
            <p style="font-weight: bold; margin-bottom: 10px; color: #888888;">MESSAGE PAYLOAD:</p>
            <pre style="background-color: #050805; border: 1px solid #113311; padding: 15px; color: #00FF41; white-space: pre-wrap; font-family: 'Courier New', Courier, monospace; margin: 0; line-height: 1.5;">${message}</pre>
          </div>
          <div style="margin-top: 25px; font-size: 10px; color: #888888; text-align: center; border-top: 2px solid #00FF41; padding-top: 10px;">
            SYSTEM PORTFOLIO TRANSMISSION PORTAL &bull; SECURED BY GMAIL SMTP
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Transmission successfully processed." });
  } catch (error: any) {
    console.error("SMTP Transmission Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
