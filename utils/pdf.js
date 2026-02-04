const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");
async function generatePDF(receipt) {
  const invoiceDir = path.join(__dirname, "../invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);
  const filePath = path.join(invoiceDir, `invoice_${receipt.receiptId}.pdf`);
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    generateHeader(doc);
    generateCustomerInformation(doc, receipt);
    generateInvoiceTable(doc, receipt);
    generateFooter(doc);

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
}

function generateHeader(doc) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("POSH WORLD", 50, 57)
    .fontSize(10)
    .text("LAGOS", 200, 65, { align: "right" })
    .text("NIGERIA", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, receipt) {
  doc.fillColor("#444444").fontSize(20).text("Receipt", 50, 160);
  generateHr(doc, 185);

  const top = 200;
  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Order ID:", 50, top)
    .font("Helvetica-Bold")
    .text(receipt.orderId, 150, top)
    .font("Helvetica")
    .text("Date:", 50, top + 15)
    .text(new Date(receipt.date).toLocaleDateString(), 150, top + 15)
    .text("Method:", 50, top + 30)
    .text(receipt.paymentMethod, 150, top + 30)

    .font("Helvetica-Bold")
    .text(receipt.name, 300, top)
    .font("Helvetica")
    .text(receipt.email, 300, top + 15);

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, receipt) {
  const tableTop = 330;
  doc.font("Helvetica-Bold");
  generateTableRow(doc, tableTop, "Item", "Price", "Qty", "Total");
  generateHr(doc, tableTop + 20);
  doc.font("Helvetica");

  let i;
  for (i = 0; i < receipt.items.length; i++) {
    const item = receipt.items[i];
    const position = tableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.name,
      `NGN ${item.price.toFixed(2)}`,
      item.quantity,
      `NGN ${(item.price * item.quantity).toFixed(2)}`,
    );
    generateHr(doc, position + 20);
  }

  const subtotalPos = tableTop + (i + 1) * 30;
  doc.font("Helvetica-Bold");
  doc.text("Subtotal:", 350, subtotalPos);
  doc.text(`NGN ${receipt.subtotal.toFixed(2)}`, 0, subtotalPos, {
    align: "right",
  });

  doc.text("Tax:", 350, subtotalPos + 20);
  doc.text(`NGN ${receipt.tax.toFixed(2)}`, 0, subtotalPos + 20, {
    align: "right",
  });

  doc.text("Discount:", 350, subtotalPos + 40);
  doc.text(`NGN ${receipt.discount.toFixed(2)}`, 0, subtotalPos + 40, {
    align: "right",
  });

  generateHr(doc, subtotalPos + 60);
  doc.fontSize(14).text("Total Paid:", 350, subtotalPos + 70);
  doc.text(`NGN ${receipt.total.toFixed(2)}`, 0, subtotalPos + 70, {
    align: "right",
  });
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment received via Stripe. Thank you for your business.",
      50,
      700,
      { align: "center" },
    )
    .fillColor("blue")
    .text("Visit our website", 50, 715, {
      align: "center",
      link: "https://google.com",
    });
}

function generateTableRow(doc, y, item, price, qty, total) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(price, 280, y, { width: 90, align: "right" })
    .text(qty, 370, y, { width: 90, align: "right" })
    .text(total, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

module.exports = generatePDF;
