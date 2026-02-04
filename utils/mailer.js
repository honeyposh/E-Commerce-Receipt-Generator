const nodemailer = require("nodemailer");
const cloudinary = require("../config/cloudinary");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateSignedReceiptUrl(publicId) {
  return cloudinary.url(publicId, {
    resource_type: "image",
    type: "authenticated",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 10 * 60,
  });
}

async function sendReceiptEmail(receipt, pdfPath, cloudUploaded = true) {
  const downloadLink = cloudUploaded
    ? generateSignedReceiptUrl(receipt.pdfUrl)
    : null;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Hello ${receipt.name},</h2>
      
      <p>Thank you for your purchase! We’re excited to have you as a customer.</p>
      
      <p>Your order has been received and is being processed. Below are your order details:</p>
      
      <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
        <p><strong>Order ID:</strong> ${receipt.orderId}</p>
        <p><strong>Payment Method:</strong> ${receipt.paymentMethod}</p>
        <p><strong>Order Date:</strong> ${new Date(receipt.date).toLocaleString()}</p>
      </div>

      <p>Your receipt is attached to this email as a PDF for your records.</p>
      ${
        downloadLink
          ? `<p style="margin-top: 15px;">
              You can also download your receipt here: 
              <a href="${downloadLink}" style="color: #ffffff; background-color: #007bff; padding: 8px 12px; text-decoration: none; border-radius: 4px;">Download Receipt</a>
            </p>`
          : `<p><em>Download link is temporarily unavailable.</em></p>`
      }

      <p style="margin-top: 25px;">Thanks again for shopping with us!</p>
      <p style="color: #888; font-size: 12px;">If you have any questions, reply to this email or contact our support team.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"POSH WORLD" <${process.env.EMAIL_USER}>`,
    to: receipt.email,
    subject: "Your Payment Receipt & Order Details",
    text: `Hello ${receipt.name}, your receipt is attached. Order ID: ${receipt.orderId}`,
    html: htmlBody,
    attachments: [
      {
        filename: `receipt-${receipt.receiptId}.pdf`,
        path: pdfPath,
      },
    ],
  });
}
module.exports = sendReceiptEmail;
