document.addEventListener('DOMContentLoaded', function () {

    // Establecer fecha de validez (30 días desde hoy)
    // const validUntil = new Date();
    // validUntil.setDate(validUntil.getDate() + 30);
    // document.getElementById('valid-until').textContent = validUntil.toLocaleDateString('es-MX');
    fecha_validezcotizacion();

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

        // Validación personalizada para el enganche
        const carValue = parseFloat(document.getElementById('car-value').value);
        const downPayment = parseFloat(document.getElementById('down-payment').value);
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

    function fecha_validezcotizacion() {
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 15);
        document.getElementById('valid-until').textContent = validUntil.toLocaleDateString('es-MX');

    }


    // Calcular el crédito
    function calculateLoan() {
        // Obtener valores del formulario
        const carType = document.getElementById('car-type').value;
        const carValue = parseFloat(document.getElementById('car-value').value);
        const downPayment = parseFloat(document.getElementById('down-payment').value);
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        const paymentFrequency = document.getElementById('payment-frequency').value;
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
            paymentAmount = loanAmount * periodicInterestRate / (1 - Math.pow(1 + periodicInterestRate, -totalPayments));
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

    // Exportar a PDF
    function exportToPDF() {
        // Verificar que hay datos para exportar
        if (!loanData.carType) {
            alert('Primero debes calcular un crédito para poder exportar a PDF');
            return;
        }

        // Crear instancia de jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configuración del documento
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        const contentWidth = pageWidth - (2 * margin);

        // Título
        doc.setFontSize(20);
        doc.setTextColor(44, 62, 80); // Color primario
        doc.text('Cotización de Crédito para Auto', margin, 20);

        // Información del crédito
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        let yPosition = 40;

        // Datos generales
        doc.setFont(undefined, 'bold');
        doc.text('Datos del Crédito', margin, yPosition);
        yPosition += 10;

        doc.setFont(undefined, 'normal');
        doc.text(`Tipo de Auto: ${getCarTypeText(loanData.carType)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Valor del Auto: ${formatCurrency(loanData.carValue)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Enganche: ${formatCurrency(loanData.downPayment)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Monto a Financiar: ${formatCurrency(loanData.loanAmount)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Plazo: ${loanData.loanTerm} meses`, margin, yPosition);
        yPosition += 7;
        doc.text(`Frecuencia de Pagos: ${getFrequencyText(loanData.paymentFrequency)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Tasa de Interés Anual: ${loanData.annualInterestRate.toFixed(2)}%`, margin, yPosition);
        yPosition += 10;

        // Resumen financiero
        doc.setFont(undefined, 'bold');
        doc.text('Resumen Financiero', margin, yPosition);
        yPosition += 10;

        doc.setFont(undefined, 'normal');
        doc.text(`Pago por Periodo: ${formatCurrency(loanData.paymentAmount)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Total a Pagar: ${formatCurrency(loanData.totalPayment)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Intereses Totales: ${formatCurrency(loanData.totalInterest)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Coste Total del Auto: ${formatCurrency(loanData.totalCost)}`, margin, yPosition);
        yPosition += 15;

        // Tabla de amortización
        doc.setFont(undefined, 'bold');
        doc.text('Tabla de Amortización', margin, yPosition);
        yPosition += 10;

        // Preparar datos para la tabla
        const tableHeaders = [['No. Pago', 'Fecha', 'Pago', 'Interés', 'Capital', 'Saldo Restante']];
        const tableRows = [];

        let balance = loanData.loanAmount;
        let today = new Date();
        const periodicInterestRate = loanData.annualInterestRate / 100 / (loanData.paymentFrequency === 'semanal' ? 52 :
            loanData.paymentFrequency === 'quincenal' ? 24 :
                loanData.paymentFrequency === 'mensual' ? 12 : 4);

        for (let i = 1; i <= loanData.totalPayments; i++) {
            const interest = balance * periodicInterestRate;
            const principal = loanData.paymentAmount - interest;
            balance -= principal;

            if (i === loanData.totalPayments) {
                balance = 0;
            }

            const paymentDate = calculateNextPaymentDate(today, i, loanData.paymentFrequency);

            tableRows.push([
                i.toString(),
                formatDate(paymentDate),
                formatCurrency(loanData.paymentAmount),
                formatCurrency(interest),
                formatCurrency(principal),
                formatCurrency(balance)
            ]);
        }

        // Generar la tabla
        doc.autoTable({
            startY: yPosition,
            head: tableHeaders,
            body: tableRows,
            margin: { left: margin, right: margin },
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [44, 62, 80] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            tableLineColor: [200, 200, 200],
            tableLineWidth: 0.1
        });

        // Pie de página
        const finalY = doc.lastAutoTable.finalY + 10;
        if (finalY < 280) {
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('Documento generado el ' + new Date().toLocaleDateString('es-MX'), margin, finalY);
            doc.text('Cotización válida hasta: ' + validUntil.toLocaleDateString('es-MX'), margin, finalY + 5);
        }

        // Guardar el PDF
        doc.save(`cotizacion_credito_auto_${new Date().toISOString().slice(0, 10)}.pdf`);
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