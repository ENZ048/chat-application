const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: 'no-reply@resend.dev', // you can use a custom domain here if verified
      to,
      subject,
      html,
    });

    console.log("✅ Email response from Resend:", data); // ✅ Correct variable

    return data;
  } catch (error) {
    console.error("❌ Resend email failed:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
