
// Exportar e Imprimir PDF
function printPDF() {
    if (!loanData.carType) {
        alert('Primero debes calcular un crédito para poder imprimir');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentPage = 1;

    // Calcular total de páginas aproximado
    const rowsPerPage = Math.floor((pageHeight - 120) / 8);
    const totalPages = Math.ceil(loanData.totalPayments / rowsPerPage);

    function addHeader(y) {
        // Logo o título principal
        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.text('COTIZACIÓN DE CRÉDITO AUTOMOTRIZ', pageWidth / 2, y, { align: 'center' });
        y += 8;

        // Línea decorativa
        doc.setDrawColor(44, 62, 80);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 12;

        return y;
    }

    function addCreditSummary(y) {
        // Información resumida del crédito
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);

        // Panel izquierdo - Datos del vehículo
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, y, (pageWidth / 2) - margin - 5, 45, 'F');

        doc.setFont(undefined, 'bold');
        doc.text('DATOS DEL VEHÍCULO', margin + 5, y + 8);
        doc.setFont(undefined, 'normal');
        doc.text(`Tipo: ${getCarTypeText(loanData.carType)}`, margin + 5, y + 15);
        doc.text(`Valor: ${formatCurrency(loanData.carValue)}`, margin + 5, y + 22);
        doc.text(`Enganche: ${formatCurrency(loanData.downPayment)}`, margin + 5, y + 29);
        doc.text(`A financiar: ${formatCurrency(loanData.loanAmount)}`, margin + 5, y + 36);

        // Panel derecho - Términos del crédito
        doc.setFillColor(245, 245, 245);
        doc.rect(pageWidth / 2 + 5, y, (pageWidth / 2) - margin - 5, 45, 'F');

        doc.setFont(undefined, 'bold');
        doc.text('TÉRMINOS DEL CRÉDITO', pageWidth / 2 + 10, y + 8);
        doc.setFont(undefined, 'normal');
        doc.text(`Plazo: ${loanData.loanTerm} meses`, pageWidth / 2 + 10, y + 15);
        doc.text(`Frecuencia: ${getFrequencyText(loanData.paymentFrequency)}`, pageWidth / 2 + 10, y + 22);
        doc.text(`Tasa anual: ${loanData.annualInterestRate.toFixed(2)}%`, pageWidth / 2 + 10, y + 29);
        doc.text(`Total pagos: ${loanData.totalPayments}`, pageWidth / 2 + 10, y + 36);

        y += 50;

        // Resumen financiero en una sola línea
        doc.setFillColor(44, 62, 80);
        doc.rect(margin, y, pageWidth - (2 * margin), 12, 'F');

        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 255, 255);
        const summaryText = `PAGO ${getFrequencyText(loanData.paymentFrequency).toUpperCase()}: ${formatCurrency(loanData.paymentAmount)} | TOTAL A PAGAR: ${formatCurrency(loanData.totalPayment)} | INTERESES: ${formatCurrency(loanData.totalInterest)}`;
        doc.text(summaryText, pageWidth / 2, y + 8, { align: 'center' });

        return y + 20;
    }

    function addTableHeader(y) {
        // Encabezado de tabla mejorado
        doc.setFillColor(60, 80, 100);
        doc.rect(margin, y, pageWidth - (2 * margin), 8, 'F');

        doc.setFont(undefined, 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);

        const columns = [
            { text: 'PAGO', x: margin + 3 },
            { text: 'FECHA', x: margin + 20 },
            { text: 'PAGO', x: margin + 50 },
            { text: 'INTERÉS', x: margin + 75 },
            { text: 'CAPITAL', x: margin + 100 },
            { text: 'SALDO', x: margin + 125 }
        ];

        columns.forEach(col => {
            doc.text(col.text, col.x, y + 5);
        });

        return y + 10;
    }

    function addFooter() {
        const footerY = pageHeight - 15;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);

        // Información izquierda
        doc.text(`Documento generado el ${new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, margin, footerY);

        // Información derecha
        doc.text(`Página ${currentPage} de ${totalPages}`, pageWidth - margin - 20, footerY);

        // Leyenda importante
        if (currentPage === totalPages) {
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            doc.text('* Esta cotización es informativa y está sujeta a aprobación crediticia.', margin, footerY + 5);
        }
    }

    // ===== GENERACIÓN DEL DOCUMENTO =====

    let y = 25;
    y = addHeader(y);
    y = addCreditSummary(y);

    // Título de la tabla
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text('DETALLE DE PAGOS - TABLA DE AMORTIZACIÓN', pageWidth / 2, y, { align: 'center' });
    y += 8;

    y = addTableHeader(y);

    // Generar todos los pagos
    let balance = loanData.loanAmount;
    let today = new Date();
    const periodicInterestRate = loanData.annualInterestRate / 100 / (loanData.paymentFrequency === 'semanal' ? 52 :
        loanData.paymentFrequency === 'quincenal' ? 24 :
            loanData.paymentFrequency === 'mensual' ? 12 : 4);

    for (let i = 1; i <= loanData.totalPayments; i++) {
        // Verificar si necesitamos nueva página
        if (y > pageHeight - 25) {
            addFooter();
            doc.addPage();
            currentPage++;
            y = 25;
            y = addTableHeader(y);
        }

        const interest = balance * periodicInterestRate;
        const principal = loanData.paymentAmount - interest;
        balance -= principal;

        // Ajuste para el último pago
        if (i === loanData.totalPayments) {
            balance = 0;
        }

        const paymentDate = calculateNextPaymentDate(today, i, loanData.paymentFrequency);

        // Agregar fila de pago
        doc.setFont(undefined, 'normal');
        doc.setFontSize(7);
        doc.setTextColor(0, 0, 0);

        // Color diferente para el último pago
        if (i === loanData.totalPayments) {
            doc.setFont(undefined, 'bold');
            doc.setTextColor(44, 62, 80);
        }

        doc.text(i.toString(), margin + 3, y);
        doc.text(formatDate(paymentDate), margin + 20, y);
        doc.text(formatCurrency(loanData.paymentAmount), margin + 50, y);
        doc.text(formatCurrency(interest), margin + 75, y);
        doc.text(formatCurrency(principal), margin + 100, y);
        doc.text(formatCurrency(balance), margin + 125, y);

        y += 4;

        // Línea separadora sutil
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, y + 1, pageWidth - margin, y + 1);
        y += 3;
    }

    // Agregar footer final
    addFooter();

    // ===== IMPRIMIR PDF =====

    // Crear un blob con el PDF
    const pdfBlob = doc.output('blob');

    // Crear URL del objeto
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Crear iframe para imprimir
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfUrl;

    // Cuando el iframe esté cargado, imprimir
    iframe.onload = function () {
        try {
            // Esperar a que el PDF se cargue completamente
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                // Limpiar después de imprimir
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(pdfUrl);
                }, 1000);

            }, 500);
        } catch (error) {
            console.error('Error al imprimir:', error);
            alert('Error al intentar imprimir. Se descargará el PDF en su lugar.');

            // Fallback: descargar el PDF
            doc.save(`Cotización_Crédito_${getCarTypeText(loanData.carType).replace(/\s+/g, '_')}_${loanData.loanTerm}meses_${new Date().toISOString().slice(0, 10)}.pdf`);

            // Limpiar
            document.body.removeChild(iframe);
            URL.revokeObjectURL(pdfUrl);
        }
    };

    // Agregar el iframe al documento
    document.body.appendChild(iframe);
}

// Función para imprimir con diálogo de confirmación
function printPDFWithConfirmation() {
    if (!loanData.carType) {
        alert('Primero debes calcular un crédito para poder imprimir');
        return;
    }

    // Mostrar diálogo de confirmación
    const userConfirmed = confirm('¿Estás seguro de que quieres imprimir la cotización?\n\nSe abrirá el diálogo de impresión de tu navegador.');

    if (userConfirmed) {
        // Mostrar mensaje de carga
        const originalButton = event.target;
        const originalText = originalButton.innerHTML;
        originalButton.innerHTML = 'Generando PDF...';
        originalButton.disabled = true;

        // Ejecutar impresión después de un breve delay para que el usuario vea el feedback
        setTimeout(() => {
            printPDF();

            // Restaurar botón después de 2 segundos
            setTimeout(() => {
                originalButton.innerHTML = originalText;
                originalButton.disabled = false;
            }, 2000);

        }, 500);
    }
}
