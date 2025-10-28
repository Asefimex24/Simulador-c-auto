document.addEventListener('DOMContentLoaded', function () {

    // Inicializar la fecha de validez
    fecha_validezcotizacion();

    // Elementos del DOM
    const form = document.getElementById('loan-form');
    const resultsSummary = document.getElementById('results-summary');
    const paymentTableContainer = document.getElementById('payment-table-container');
    const noResults = document.getElementById('no-results');
    const exportPdfBtn = document.getElementById('export-pdf');
    const printResultsBtn = document.getElementById('print-results');

    // Variables para almacenar datos del cálculo
    let loanData = {};

    // Elementos del resumen
    const summaryCarValue = document.getElementById('summary-car-value');
    const summaryDownPayment = document.getElementById('summary-down-payment');
    const summaryLoanAmount = document.getElementById('summary-loan-amount');
    const summaryLoanTerm = document.getElementById('summary-loan-term');
    const summaryPaymentFrequency = document.getElementById('summary-payment-frequency');
    const summaryInterestRate = document.getElementById('summary-interest-rate');
    const summaryPaymentAmount = document.getElementById('summary-payment-amount');
    const summaryTotalPayment = document.getElementById('summary-total-payment');
    const summaryTotalInterest = document.getElementById('summary-total-interest');
    const summaryTotalCost = document.getElementById('summary-total-cost');

    // Elementos de la tabla
    const paymentTableBody = document.getElementById('payment-table-body');

    // Manejar el envío del formulario
    form.addEventListener('submit', function (e) {
        
        e.preventDefault();
        e.stopPropagation();

        

        //valor del vehiculo
        const carValue = parseFloat(document.getElementById('car-value').value);
        //valor del enganche
        const downPayment = parseFloat(document.getElementById('down-payment').value);
        //etiqueta de error para enganche
        const downPaymentError = document.getElementById('down-payment-error');

        if (downPayment > carValue) {
            downPaymentError.style.display = 'block';
            document.getElementById('down-payment').classList.add('is-invalid');
            return;
        } else {
            downPaymentError.style.display = 'none';
            document.getElementById('down-payment').classList.remove('is-invalid');
        }

        if (form.checkValidity()) {
            calculateLoan();
        }

        form.classList.add('was-validated');
    });


    // Manejar exportación a PDF
    exportPdfBtn.addEventListener('click', function () {
        exportToPDF();
    });

    // Manejar impresión
    printResultsBtn.addEventListener('click', function () {
        window.print();
    });

    // Establecer la fecha de validez de la cotización  
    function fecha_validezcotizacion() {
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 15);
        document.getElementById('valid-until').textContent = validUntil.toLocaleDateString('es-MX');
    }


    // Calcular el crédito
    function calculateLoan() {

        // Obtener valores del formulario
        //tipo de vehiculo
        const carType = document.getElementById('car-type').value;
        //valor del vehiculo
        const carValue = parseFloat(document.getElementById('car-value').value);
        //valor del enganche
        const downPayment = parseFloat(document.getElementById('down-payment').value);
        //plazo del credito
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        //frecuencia de pago
        const paymentFrequency = document.getElementById('payment-frequency').value;
        
        //tasa de interes anual
        const annualInterestRate = parseFloat(document.getElementById('interest-rate').value) / 100;

        // Calcular monto a financiar
        const loanAmount = carValue - downPayment;

        // Determinar número de pagos por año según frecuencia
        let paymentsPerYear;
        switch (paymentFrequency) {
            case 'semanal':
                paymentsPerYear = 52;
                break;
            case 'quincenal':
                paymentsPerYear = 24;
                break;
            case 'mensual':
                paymentsPerYear = 12;
                break;
            case 'trimestral':
                paymentsPerYear = 4;
                break;
                case 'semestral':
                paymentsPerYear = 2;
                break;
                case 'anual':
                paymentsPerYear = 1;
                break;  
            default:
                paymentsPerYear = 12;
        }

        // Calcular tasa de interés por periodo
        const periodicInterestRate = annualInterestRate / paymentsPerYear;

        // Calcular número total de pagos
        const totalPayments = loanTerm * (paymentsPerYear / 12);

        // Calcular pago periódico usando la fórmula de anualidades
        let paymentAmount;

        if (periodicInterestRate === 0) {
            paymentAmount = loanAmount / totalPayments;
        } else {

            paymentAmount = (loanAmount * periodicInterestRate / (1 - Math.pow(1 + periodicInterestRate, -totalPayments)));
            switch (loanTerm) {
                case 12:
                    paymentAmount = paymentAmount*1.005146;
                    break;
                case 24:
                    paymentAmount = paymentAmount*1.00718;
                    break;
                case 36:
                    paymentAmount = paymentAmount*1.00918;
                    break;
                case 48:
                    paymentAmount = paymentAmount*1.0108;
                    break;
                case 60:
                    paymentAmount = paymentAmount*1.01219;
                    break;
            }
        
        }

        // Guardar datos para exportación
        loanData = {
            carType: carType,
            carValue: carValue,
            downPayment: downPayment,
            loanAmount: loanAmount,
            loanTerm: loanTerm,
            paymentFrequency: paymentFrequency,
            annualInterestRate: annualInterestRate * 100,
            paymentAmount: paymentAmount,
            totalPayments: totalPayments,
            totalPayment: paymentAmount * totalPayments,
            totalInterest: (paymentAmount * totalPayments) - loanAmount,
            totalCost: carValue + ((paymentAmount * totalPayments) - loanAmount)
        };

        // Actualizar resumen
        updateSummary();

        // Generar tabla de amortización
        generateAmortizationTable(
            loanAmount,
            paymentAmount,
            periodicInterestRate,
            totalPayments,
            paymentFrequency
        );

        // Mostrar resultados
        resultsSummary.style.display = 'block';
        paymentTableContainer.style.display = 'block';
        noResults.style.display = 'none';
    }


    // Actualizar el resumen
    function updateSummary() {
        summaryCarValue.textContent = formatCurrency(loanData.carValue);
        summaryDownPayment.textContent = formatCurrency(loanData.downPayment);
        summaryLoanAmount.textContent = formatCurrency(loanData.loanAmount);
        summaryLoanTerm.textContent = `${loanData.loanTerm} meses`;
        summaryPaymentFrequency.textContent = getFrequencyText(loanData.paymentFrequency);
        summaryInterestRate.textContent = `${loanData.annualInterestRate.toFixed(2)}%`;
        summaryPaymentAmount.textContent = formatCurrency(loanData.paymentAmount);
        summaryTotalPayment.textContent = formatCurrency(loanData.totalPayment);
        summaryTotalInterest.textContent = formatCurrency(loanData.totalInterest);
        summaryTotalCost.textContent = formatCurrency(loanData.totalCost);
    }



    // Generar tabla de amortización
    function generateAmortizationTable(loanAmount, paymentAmount, periodicInterestRate, totalPayments, paymentFrequency) {
        // Limpiar tabla existente
        paymentTableBody.innerHTML = '';

        let balance = loanAmount;
        let today = new Date();

        for (let i = 1; i <= totalPayments; i++) {
            // Calcular interés para este periodo
            const interest = balance * periodicInterestRate;

            // Calcular pago a capital
            const principal = paymentAmount - interest;

            // Actualizar saldo
            balance -= principal;

            // Si es el último pago, ajustar para evitar saldo negativo por redondeo
            if (i === totalPayments) {
                balance = 0;
            }

            // Calcular fecha de pago
            const paymentDate = calculateNextPaymentDate(today, i, paymentFrequency);

            // Crear fila de la tabla
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${i}</td>
                        <td>${formatDate(paymentDate)}</td>
                        <td>${formatCurrency(paymentAmount)}</td>
                        <td>${formatCurrency(interest)}</td>
                        <td>${formatCurrency(principal)}</td>
                        <td>${formatCurrency(balance)}</td>
                    `;

            paymentTableBody.appendChild(row);
        }
    }

    // Calcular fecha del siguiente pago
    function calculateNextPaymentDate(startDate, paymentNumber, frequency) {
        const date = new Date(startDate);

        switch (frequency) {
            case 'semanal':
                date.setDate(date.getDate() + (paymentNumber * 7));
                break;
            case 'quincenal':
                date.setDate(date.getDate() + (paymentNumber * 15));
                break;
            case 'mensual':
                date.setMonth(date.getMonth() + paymentNumber);
                break;
            case 'trimestral':
                date.setMonth(date.getMonth() + (paymentNumber * 3));
                break;
            case 'semestral':
                date.setMonth(date.getMonth() + (paymentNumber * 6));
                break;
        }

        return date;
    }

    // Formatear moneda
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // Formatear fecha
    function formatDate(date) {
        return date.toLocaleDateString('es-MX');
    }

    // Obtener texto de frecuencia
    function getFrequencyText(frequency) {
        const frequencies = {
            'semanal': 'Semanal',
            'quincenal': 'Quincenal',
            'mensual': 'Mensual',
            'trimestral': 'Trimestral'
        };

        return frequencies[frequency] || frequency;
    }

    
// Exportar a PDF - Versión Mejorada
function exportToPDF() {
    if (!loanData.carType) {
        alert('Primero debes calcular un crédito para poder exportar a PDF');
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

    function highlightCurrentRow(y, paymentNumber) {
        // Resaltar cada 5 filas para mejor lectura
        if (paymentNumber % 5 === 0) {
            doc.setFillColor(250, 250, 250);
            doc.rect(margin, y - 3, pageWidth - (2 * margin), 4, 'F');
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

    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;

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
        
        totalInterestPaid += interest;
        totalPrincipalPaid += principal;

        // Ajuste para el último pago
        if (i === loanData.totalPayments) {
            balance = 0;
        }

        const paymentDate = calculateNextPaymentDate(today, i, loanData.paymentFrequency);
        
        // Resaltar fila cada 5 pagos
        highlightCurrentRow(y, i);
        
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

    // Resumen final en la última página
    if (y < pageHeight - 40) {
        y += 10;
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y, pageWidth - (2 * margin), 20, 'F');
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('RESUMEN EJECUTIVO:', margin + 5, y + 8);
        
        doc.setFont(undefined, 'normal');
        doc.text(`Total intereses pagados: ${formatCurrency(totalInterestPaid)}`, margin + 5, y + 15);
        doc.text(`Total capital pagado: ${formatCurrency(totalPrincipalPaid)}`, margin + 100, y + 15);
    }

    // Agregar footer final
    addFooter();

    // Guardar el PDF con nombre más descriptivo
    const fileName = `Cotización_Crédito_${getCarTypeText(loanData.carType).replace(/\s+/g, '_')}_${loanData.loanTerm}meses_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    
    // Opcional: Mostrar mensaje de éxito
    setTimeout(() => {
        alert('PDF generado exitosamente con todos los pagos');
    }, 500);
}
    // Obtener texto del tipo de auto
    function getCarTypeText(carType) {
        const carTypes = {
            'compacto': 'Compacto',
            'sedan': 'Sedán',
            'suv': 'SUV',
            'pickup': 'Pickup',
            'lujo': 'Lujo'
        };

        return carTypes[carType] || carType;
    }
});