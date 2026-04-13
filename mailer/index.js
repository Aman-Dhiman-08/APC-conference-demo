import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * CONFIGURATION
 * Throttling: 1 email every 3 seconds (20 emails per minute)
 * This stays safely under Microsoft's 30/min limit.
 */
const DELAY_MS = 3000; 

async function sendBatch() {
  // Check for credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('ERROR: Missing credentials in mailer/.env');
    console.log('Please copy .env.example to .env and fill in your details.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Load recipients from CSV (simple newline separated or common format)
  // For this demo, we'll look for a file named 'list.txt' in the same folder
  const listPath = path.join(__dirname, 'list.txt');
  
  if (!fs.existsSync(listPath)) {
    console.error(`ERROR: list.txt not found at ${listPath}`);
    console.log('Please create a list.txt file with one email per line.');
    return;
  }

  const emails = fs.readFileSync(listPath, 'utf8')
    .split('\n')
    .map(email => email.trim())
    .filter(email => email.length > 5 && email.includes('@'));

  console.log(`Starting campaign for ${emails.length} recipients...`);

  for (let i = 0; i < emails.length; i++) {
    const targetEmail = emails[i];
    
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: targetEmail,
        subject: "Wyre AI - Demo Follow-up", // Change your subject here
        text: `Hi there,\n\nThis is a follow-up regarding our recent demo. Let us know if you have any questions.\n\nBest,\nThe Wyre AI Team`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #FF701F;">Hello!</h2>
            <p>This is a follow-up regarding our recent demo. Let us know if you have any questions.</p>
            <p>Best,<br><strong>The Wyre AI Team</strong></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888;">If you'd like to unsubscribe, please reply with "Unsubscribe".</p>
          </div>
        `
      });

      console.log(`[${i + 1}/${emails.length}] ✅ Sent to: ${targetEmail}`);
    } catch (error) {
      console.error(`[${i + 1}/${emails.length}] ❌ Failed for: ${targetEmail}`, error.message);
    }

    // Wait if not the last one
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log('--- Campaign Finished ---');
}

sendBatch().catch(console.error);
