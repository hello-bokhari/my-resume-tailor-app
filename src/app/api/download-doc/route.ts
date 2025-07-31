import { NextRequest, NextResponse } from 'next/server';
import { Document, Paragraph, TextRun, Packer } from 'docx';

export async function POST(req: NextRequest) {
  try {
    const { tailoredResume } = await req.json();

    // Strip HTML tags to get plain text
    const plainTextResume = tailoredResume.replace(/<[^>]*>/g, '');

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun(plainTextResume),
            ],
          }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);

    const headers = new Headers();
    headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    headers.append('Content-Disposition', 'attachment; filename=tailored_resume.docx');

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error('Error generating DOCX:', error);
    return NextResponse.json({ message: 'Failed to generate DOCX.' }, { status: 500 });
  }
}
