import { Person } from '../types';

// Declare CDN-loaded libraries to TypeScript
declare const jspdf: any;
declare const html2canvas: any;

/**
 * Generates and triggers a download for a PDF report based on the person's data.
 * It reads the content from specific DOM elements ('pdf-page-1', 'pdf-page-2').
 * @param person - The person object for whom the report is generated.
 * @throws An error if the required DOM elements are not found or if PDF generation fails.
 */
export const generateExamPdf = async (person: Person): Promise<void> => {
    // This is the main jsPDF object.
    const { jsPDF } = jspdf;
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    const page1 = document.getElementById('pdf-page-1');
    const page2 = document.getElementById('pdf-page-2');

    if (!page1 || !page2) {
        throw new Error('Could not find PDF content elements to generate the report.');
    }

    try {
        // Render Page 1
        const canvas1 = await html2canvas(page1, { scale: 2.5, useCORS: true });
        const imgData1 = canvas1.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData1, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Render Page 2
        pdf.addPage();
        const canvas2 = await html2canvas(page2, { scale: 2.5, useCORS: true });
        const imgData2 = canvas2.toDataURL('image/png');
        pdf.addImage(imgData2, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        const date = new Date().toISOString().split('T')[0];
        const filename = `Rikkes_Report_${person.name.replace(/\s/g, '_')}_${date}.pdf`;
        pdf.save(filename);
    } catch (error) {
        console.error("PDF Generation failed", error);
        // Re-throw the error to be handled by the calling component
        throw new Error('An error occurred while generating the canvas for the PDF.');
    }
};
