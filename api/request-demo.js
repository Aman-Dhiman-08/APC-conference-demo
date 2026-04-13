import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 1. Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, company, email, phone, notes } = req.body;

  // 2. Transporter Configuration (Using env variables)
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    // 3. Send Notification to Sales
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'sales@wyreai.io',
      subject: `New Demo Request: ${name} (from Vercel)`,
      html: `
        <h2>New Demo Enrollment</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Notes:</strong> ${notes || 'No notes provided.'}</p>
      `
    });

    // 4. Send Confirmation to User
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "We received your demo request - Wyre AI",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #FF701F;">Thanks for reaching out, ${name}!</h2>
          <p>We've received your request for a Wyre AI demo. Our team will review your details for <b>${company}</b> and get in touch shortly.</p>
          <p>Best,<br><strong>The Wyre AI Team</strong></p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Vercel API error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process request.' });
  }
}
