import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,             // 👈 using SSL port
  secure: true,          // 👈 must be true for port 465
  auth: {
    user: "edunexlearnsphere@gmail.com",
    pass: "nkej nigj bjec cmnw", // ⚠️ Gmail App Password (16 chars, not your real password)
  },
             // 👈 force IPv6
  logger: true,
  debug: true,           // 👈 detailed logs
});

// Send a test email
async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: '"Edunexs Test" <edunexlearnsphere@gmail.com>', // sender
      to: "ola411089@gmail.com",                            // receiver
      subject: "Test Email from Nodemailer",
      text: "Hello! This is a test email sent using Nodemailer.",
      html: "<b>Hello!</b> This is a test email sent using <i>Nodemailer</i> 🚀",
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

sendTestEmail();
