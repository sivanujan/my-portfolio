import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

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

    const secureConnection = process.env.EMAIL_SECURE === "true";
    const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
    const emailPort = parseInt(process.env.EMAIL_PORT || "587", 10);
    const emailUser = process.env.EMAIL_USER || "thanarasansivanujan@gmail.com";
    const emailPass = process.env.EMAIL_PASS || "";
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || emailUser;

    const mailOptions = {
      from: { name: `${name} (Transmission Portal)`, email: emailUser },
      to: recipientEmail,
      reply: email, // worker-mailer uses 'reply' instead of 'replyTo'
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

    if (process.env.NODE_ENV === "development") {
      console.log("==================================================");
      console.log("[DEV MODE] EMAIL TRANSMISSION SIMULATION");
      console.log(`From: ${mailOptions.from.name} <${mailOptions.from.email}>`);
      console.log(`To: ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Text: ${mailOptions.text}`);
      console.log("==================================================");

      return NextResponse.json({ success: true, message: "[DEV MODE] Transmission logged to console." });
    }

    // Dynamic import of worker-mailer to prevent webpack loading it in non-worker environments if possible
    const { WorkerMailer } = await import(/* webpackIgnore: true */ "worker-mailer");

    const mailer = await WorkerMailer.connect({
      host: emailHost,
      port: emailPort,
      secure: secureConnection,
      startTls: !secureConnection,
      credentials: {
        username: emailUser,
        password: emailPass,
      },
      authType: ["login", "plain"],
    });

    await mailer.send(mailOptions);
    await mailer.close();

    return NextResponse.json({ success: true, message: "Transmission successfully processed." });
  } catch (error: any) {
    console.error("SMTP Transmission Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
