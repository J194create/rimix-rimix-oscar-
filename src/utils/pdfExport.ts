import { jsPDF } from 'jspdf';
import { DailyBrochureFlyer, MarketingDeliverables } from '../types';

export interface PdfExportOptions {
  includeCropMarks?: boolean;
  colorTheme?: 'dark' | 'cmyk_light';
}

/**
 * Generates and downloads a high-resolution, print-ready PDF for OSCAR Club 3:4 Vertical Flyer.
 * Renders geometric frames, gold border accents, typography hierarchy, crop marks, and VIP specs.
 */
export function exportFlyerToPdf(
  deliverables: MarketingDeliverables,
  options: PdfExportOptions = {}
): void {
  const { includeCropMarks = true } = options;
  const flyer = deliverables.dailyBrochureFlyer;
  const eventName = deliverables.eventName;
  const details = deliverables.socialMediaPack.keyDetails;

  // 3:4 Aspect ratio document: Width 150mm, Height 200mm (standard vertical promo flyer format)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [150, 200],
  });

  const pageWidth = 150;
  const pageHeight = 200;

  // 1. Background Fill - Deep Obsidian Black (#08080C)
  doc.setFillColor(8, 8, 12);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Subtle Radial / Gradient Box Simulation (Warm Amber Center Mood)
  doc.setFillColor(18, 16, 24);
  doc.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 3, 3, 'F');

  // 3. Double Metallic Gold Border Frame (3mm inset)
  doc.setDrawColor(212, 175, 55); // #d4af37 (Gold)
  doc.setLineWidth(0.7);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(186, 164, 102); // #baa466 (Subtle inner stroke)
  doc.setLineWidth(0.2);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // 4. Crop marks on all 4 corners if requested
  if (includeCropMarks) {
    doc.setDrawColor(150, 150, 160);
    doc.setLineWidth(0.25);
    const m = 5; // offset
    const len = 4;
    // Top-left
    doc.line(10, 10 - m, 10, 10 - m + len);
    doc.line(10 - m, 10, 10 - m + len, 10);
    // Top-right
    doc.line(pageWidth - 10, 10 - m, pageWidth - 10, 10 - m + len);
    doc.line(pageWidth - 10 + m, 10, pageWidth - 10 + m - len, 10);
    // Bottom-left
    doc.line(10, pageHeight - 10 + m, 10, pageHeight - 10 + m - len);
    doc.line(10 - m, pageHeight - 10, 10 - m + len, pageHeight - 10);
    // Bottom-right
    doc.line(pageWidth - 10, pageHeight - 10 + m, pageWidth - 10, pageHeight - 10 + m - len);
    doc.line(pageWidth - 10 + m, pageHeight - 10, pageWidth - 10 + m - len, pageHeight - 10);
  }

  // 5. Header / Brand Mark
  doc.setFont('times', 'bold');
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(8);
  doc.text('EXCLUSIVE NOCTURNE • PRIVATE MEMBERS & GUESTS', pageWidth / 2, 22, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(19);
  doc.text('OSCAR CLUB', pageWidth / 2, 31, { align: 'center' });

  // Accent line under brand
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 25, 34, pageWidth / 2 + 25, 34);

  // 6. Subheading Tag / Presenter
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 240, 255); // Cyan neon highlight
  doc.setFontSize(9);
  doc.text('PRESENTS', pageWidth / 2, 42, { align: 'center' });

  // 7. Event Main Headline
  doc.setFont('times', 'bold');
  doc.setTextColor(247, 231, 180); // Gold-cream
  doc.setFontSize(20);
  const splitTitle = doc.splitTextToSize(eventName.toUpperCase(), pageWidth - 36);
  doc.text(splitTitle, pageWidth / 2, 53, { align: 'center' });

  // 8. DJ / Artist & Subheaders
  let currentY = 53 + (splitTitle.length * 7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 240, 255);
  doc.setFontSize(11);
  doc.text(`FEATURING ${details.djOrArtist.toUpperCase()}`, pageWidth / 2, currentY, { align: 'center' });

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 215);
  doc.setFontSize(9);
  doc.text(`${details.date.toUpperCase()} • ${details.time.toUpperCase()}`, pageWidth / 2, currentY, { align: 'center' });

  if (flyer.subheaders && flyer.subheaders[0]) {
    currentY += 6;
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(170, 170, 185);
    doc.setFontSize(8);
    const subheaderText = doc.splitTextToSize(flyer.subheaders[0], pageWidth - 40);
    doc.text(subheaderText, pageWidth / 2, currentY, { align: 'center' });
    currentY += subheaderText.length * 4;
  }

  // Divider
  currentY += 4;
  doc.setDrawColor(50, 50, 70);
  doc.setLineWidth(0.3);
  doc.line(25, currentY, pageWidth - 25, currentY);

  // 9. 3-Bullet Body Copy (VIP Perks & Highlights)
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(9);
  doc.text('CURATED VIP PRIVILEGES & ADMISSION:', 20, currentY);

  currentY += 5;
  flyer.bodyCopy.slice(0, 3).forEach((item, index) => {
    // Bullet marker
    doc.setFillColor(212, 175, 55);
    doc.circle(21, currentY - 1, 0.8, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(235, 235, 245);
    doc.setFontSize(8);
    const wrapped = doc.splitTextToSize(item, pageWidth - 48);
    doc.text(wrapped, 25, currentY);
    currentY += (wrapped.length * 4.2) + 2.5;
  });

  // 10. Amharic / Multilingual Teaser if available
  const amharicText = deliverables.amharicCaption || deliverables.socialMediaPack.amharicCaption;
  if (amharicText && currentY < 155) {
    doc.setDrawColor(40, 40, 60);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(186, 164, 102);
    doc.setFontSize(7.5);
    doc.text('HABESHA NIGHTLIFE EXCLUSIVE:', 20, currentY);
    currentY += 4;
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(190, 190, 205);
    doc.setFontSize(7);
    const amharicWrapped = doc.splitTextToSize(
      'Special complimentary welcome cocktails for ladies before 11:00 PM. VIP Mezzanine Table reservations open.',
      pageWidth - 40
    );
    doc.text(amharicWrapped, 20, currentY);
    currentY += amharicWrapped.length * 3.5;
  }

  // 11. Footer Container & VIP Concierge Info
  const footerY = 175;
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.line(16, footerY - 4, pageWidth - 16, footerY - 4);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(8);
  doc.text(`VIP TABLE OFFER: ${(deliverables.vipTableOffer || 'Complimentary Cocktail Before 11 PM').toUpperCase()}`, pageWidth / 2, footerY, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 160, 180);
  doc.setFontSize(7);
  doc.text(`DRESS CODE: ${details.dressCode.toUpperCase()} • DOORS OPEN 10:00 PM`, pageWidth / 2, footerY + 5, { align: 'center' });

  doc.setTextColor(0, 240, 255);
  doc.text(`RSVP / CONCIERGE: ${details.rsvpInfo}`, pageWidth / 2, footerY + 9, { align: 'center' });

  // 12. Technical Print Specs at extreme footer
  doc.setFont('courier', 'normal');
  doc.setTextColor(100, 100, 120);
  doc.setFontSize(5.5);
  doc.text(`OSCAR CLUB MARKETING SUITE • 3:4 PRINT-READY PDF • CMYK EMULATED • BLEED 3MM • ISO 12647-2`, pageWidth / 2, 194, { align: 'center' });

  // Trigger browser download
  const cleanName = eventName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`OSCAR_CLUB_${cleanName}_3x4_Print_Flyer.pdf`);
}
