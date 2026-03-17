const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const nodemailer = require('nodemailer');

exports.handler = async (event) => {

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Parse form data
  const data = JSON.parse(event.body);
  const { name, phone, course, message } = data;
  const date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  try {

    /* ══ 1. SAVE TO GOOGLE SHEETS ══ */
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // Add row to sheet
    await sheet.addRow({
      Date: date,
      Name: name,
      Phone: phone,
      Course: course,
      Message: message || '—'
    });

    /* ══ 2. SEND EMAIL VIA GMAIL ══ */
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"Hidara Academy" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Enquiry — ${name} | ${course}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#1a56db,#0d1b3e);padding:28px 24px;">
            <h2 style="color:white;margin:0;font-size:1.3rem;">📩 New Enquiry Received!</h2>
            <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:0.85rem;">Hidara Academy — Student Enquiry Form</p>
          </div>

          <!-- Body -->
          <div style="padding:24px;background:#ffffff;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:12px 10px;font-weight:700;color:#0d1b3e;width:110px;border-bottom:1px solid #eef2ff;">Name</td>
                <td style="padding:12px 10px;color:#333;border-bottom:1px solid #eef2ff;">${name}</td>
              </tr>
              <tr style="background:#f8faff;">
                <td style="padding:12px 10px;font-weight:700;color:#0d1b3e;border-bottom:1px solid #eef2ff;">Phone</td>
                <td style="padding:12px 10px;color:#333;border-bottom:1px solid #eef2ff;">${phone}</td>
              </tr>
              <tr>
                <td style="padding:12px 10px;font-weight:700;color:#0d1b3e;border-bottom:1px solid #eef2ff;">Course</td>
                <td style="padding:12px 10px;color:#333;border-bottom:1px solid #eef2ff;">${course}</td>
              </tr>
              <tr style="background:#f8faff;">
                <td style="padding:12px 10px;font-weight:700;color:#0d1b3e;border-bottom:1px solid #eef2ff;">Message</td>
                <td style="padding:12px 10px;color:#333;border-bottom:1px solid #eef2ff;">${message || '—'}</td>
              </tr>
              <tr>
                <td style="padding:12px 10px;font-weight:700;color:#0d1b3e;">Date & Time</td>
                <td style="padding:12px 10px;color:#333;">${date} IST</td>
              </tr>
            </table>
          </div>

          <!-- Action button -->
          <div style="padding:16px 24px;background:#f8faff;text-align:center;">
            <a href="https://wa.me/918124089734?text=Hi ${encodeURIComponent(name)}, thank you for your enquiry about ${encodeURIComponent(course)} at Hidara Academy!"
               style="background:linear-gradient(135deg,#f0a500,#c07800);color:#0d1b3e;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.9rem;">
              Reply via WhatsApp
            </a>
          </div>

          <!-- Footer -->
          <div style="background:#0d1b3e;padding:14px;text-align:center;">
            <p style="margin:0;font-weight:700;color:#f0a500;font-size:0.85rem;">HIDARA ACADEMY</p>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.5);font-size:0.75rem;">LEARN · IMPROVE · SUCCEED</p>
          </div>

        </div>
      `
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error('Enquiry function error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }

};