const puppeteer = require('puppeteer');
const Rental = require('../models/Rental');

const exportPdf = async (req, res) => {
  try {
    const rental = await Rental.findOne({
      user: req.user.id,
      work: req.params.workId,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    }).populate('work');

    if (!rental)
      return res.status(403).json({ message: 'No access' });

    const browser = await puppeteer.launch({
      headless: 'new',
    });

    const page = await browser.newPage();

    await page.setContent(`
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
            }
            img {
              max-width: 100%;
            }
            pre {
              background: #f4f4f4;
              padding: 10px;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <h1>${rental.work.title}</h1>
          ${rental.work.content}
        </body>
      </html>
    `);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${rental.work.title}.pdf"`
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'PDF failed' });
  }
};

module.exports = { exportPdf };
