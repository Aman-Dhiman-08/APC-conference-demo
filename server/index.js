import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../mailer/.env') });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Transporter (Reusable from mailer)
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Endpoint to handle Demo Enrollment Form
app.post('/api/request-demo', async (req, res) => {
  const { name, company, email, phone, notes } = req.body;

  console.log('Received demo request:', { name, email });

  try {
    // 1. Send Notification to Sales (sales@wyreai.io)
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'sales@wyreai.io', // Notification recipient
      subject: `New Demo Request: ${name} from ${company}`,
      html: `
        <h2>New Demo Enrollment</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Notes:</strong> ${notes || 'No notes provided.'}</p>
      `
    });

    // 2. Send Confirmation to User
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "We received your demo request - Wyre AI",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #FF701F;">Thanks for reaching out, ${name}!</h2>
          <p>We've received your request for a Wyre AI demo. Our team will review your details for <b>${company}</b> and get in touch shortly.</p>
          <p>In the meantime, feel free to check out our latest product updates.</p>
          <p>Best,<br><strong>The Wyre AI Team</strong></p>
        </div>
      `
    });

    res.status(200).json({ success: true, message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Failed to send emails:', error);
    res.status(500).json({ success: false, message: 'Failed to process request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
