const PDFDocument = require('pdfkit');
const Rental = require('../models/Rental');

const parseHtml = html => {
  const blocks = [];

  const imgRegex =
    /<img[^>]+src="data:image\/(png|jpeg|jpg);base64,([^"]+)"[^>]*>/gi;

  let lastIndex = 0;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const text = html
      .slice(lastIndex, match.index)
      .replace(/<[^>]+>/g, '')
      .trim();

    if (text) {
      blocks.push({ type: 'text', value: text });
    }

    blocks.push({
      type: 'image',
      value: match[2], 
    });

    lastIndex = imgRegex.lastIndex;
  }

  const rest = html
    .slice(lastIndex)
    .replace(/<[^>]+>/g, '')
    .trim();

  if (rest) {
    blocks.push({ type: 'text', value: rest });
  }

  return blocks;
};

const exportPdf = async (req, res) => {
  try {
    const { workId } = req.params;

    const rental = await Rental.findOne({
      user: req.user.id,
      work: workId,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    }).populate('work');

    if (!rental || !rental.work) {
      return res
        .status(403)
        .json({ message: 'No access to this article' });
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${rental.work.title}.pdf"`
    );
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(22).text(rental.work.title, {
      align: 'center',
    });
    doc.moveDown(2);

    const blocks = parseHtml(rental.work.content);

    for (const block of blocks) {
      if (block.type === 'text') {
        doc
          .fontSize(12)
          .text(block.value, {
            align: 'left',
          })
          .moveDown();
      }

      if (block.type === 'image') {
        const buffer = Buffer.from(block.value, 'base64');

        doc.image(buffer, {
          fit: [450, 400],
          align: 'center',
        });

        doc.moveDown(2);
      }
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'PDF failed' });
  }
};

module.exports = { exportPdf };
