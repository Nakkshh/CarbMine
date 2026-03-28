import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useFirebase } from '../context/Firebase';

export const usePDFExport = () => {
    const { uploadPDFToFirebase } = useFirebase();
    const [pdfLoading, setPdfLoading] = useState(false);
    const [pdfSuccess, setPdfSuccess] = useState(false);

    const exportAndSave = useCallback(async (refOrElement) => {
        // accepts both formRef and formRef.current
        const target = refOrElement?.current ?? refOrElement;

        if (!target || !(target instanceof HTMLElement)) {
            console.error('exportAndSave: invalid element. Got:', target);
            alert('PDF capture failed — try again after results load.');
            return;
        }

        setPdfLoading(true);
        setPdfSuccess(false);

        try {
            const canvas = await html2canvas(target, {
                scale:                  1.5,
                useCORS:                true,
                allowTaint:             true,
                logging:                false,
                foreignObjectRendering: false,
                ignoreElements:         (el) => el.tagName === 'BUTTON',
            });

            const imgData    = canvas.toDataURL('image/jpeg', 0.7);
            const pdf        = new jsPDF('p', 'mm', 'a4');
            const imgWidth   = pdf.internal.pageSize.getWidth();
            const imgHeight  = (canvas.height * imgWidth) / canvas.width;
            const pageHeight = pdf.internal.pageSize.getHeight();

            let yOffset = 0;
            while (yOffset < imgHeight) {
                if (yOffset > 0) pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, -yOffset, imgWidth, imgHeight);
                yOffset += pageHeight;
            }

            const pdfBlob = pdf.output('blob');
            await uploadPDFToFirebase(pdfBlob);

            setPdfSuccess(true);
            setTimeout(() => setPdfSuccess(false), 3000);
            return true;
        } catch (err) {
            console.error('PDF export error:', err);
            alert('PDF generation failed: ' + err.message);
            throw err;
        } finally {
            setPdfLoading(false);
        }
    }, [uploadPDFToFirebase]);

    return { exportAndSave, pdfLoading, pdfSuccess };
    // ← exportRef removed — EstimatePage uses its own formRef
};