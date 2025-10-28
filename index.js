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

    
// Exportar a PDF - Versión Completa con Todos los Pagos
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
    let totalPages = 1;

    // Calcular cuántas páginas necesitaremos para la tabla
    const rowsPerPage = Math.floor((pageHeight - 120) / 8); // Aprox 8px por fila
    totalPages = Math.ceil(loanData.totalPayments / rowsPerPage);

    function addHeader(y) {
        // Título
        doc.setFontSize(16);
        doc.setTextColor(44, 62, 80);
        doc.text('Cotización de Crédito para Auto', margin, y);
        y += 5;
        
        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
        
        return y;
    }

    function addCreditInfo(y) {
        // Información del crédito (solo en primera página)
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        // Datos generales
        doc.setFont(undefined, 'bold');
        doc.text('DATOS DEL CRÉDITO', margin, y);
        y += 6;

        doc.setFont(undefined, 'normal');
        const leftColumn = [
            `Tipo de Auto: ${getCarTypeText(loanData.carType)}`,
            `Valor del Auto: ${formatCurrency(loanData.carValue)}`,
            `Enganche: ${formatCurrency(loanData.downPayment)}`,
            `Monto a Financiar: ${formatCurrency(loanData.loanAmount)}`
        ];

        const rightColumn = [
            `Plazo: ${loanData.loanTerm} meses`,
            `Frecuencia: ${getFrequencyText(loanData.paymentFrequency)}`,
            `Tasa Anual: ${loanData.annualInterestRate.toFixed(2)}%`,
            `Total a Pagar: ${formatCurrency(loanData.totalPayment)}`
        ];

        // Información en dos columnas
        leftColumn.forEach((text, index) => {
            doc.text(text, margin, y);
            if (rightColumn[index]) {
                doc.text(rightColumn[index], pageWidth / 2, y);
            }
            y += 5;
        });

        y += 8;
        
        // Resumen financiero
        doc.setFont(undefined, 'bold');
        doc.text('RESUMEN FINANCIERO', margin, y);
        y += 6;

        doc.setFont(undefined, 'normal');
        const financialData = [
            `Pago por Periodo: ${formatCurrency(loanData.paymentAmount)}`,
            `Intereses Totales: ${formatCurrency(loanData.totalInterest)}`,
            `Coste Total del Auto: ${formatCurrency(loanData.totalCost)}`
        ];

        financialData.forEach(text => {
            doc.text(text, margin, y);
            y += 5;
        });

        return y + 10;
    }

    function addTableHeader(y) {
        // Encabezados de la tabla
        doc.setFont(undefined, 'bold');
        doc.setFontSize(8);
        
        doc.text('No.', margin, y);
        doc.text('Fecha', margin + 15, y);
        doc.text('Pago', margin + 45, y);
        doc.text('Interés', margin + 65, y);
        doc.text('Capital', margin + 85, y);
        doc.text('Saldo Restante', margin + 105, y);
        
        // Línea debajo del encabezado
        doc.setDrawColor(100, 100, 100);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        
        return y + 5;
    }

    function addFooter(pageNum) {
        const footerY = pageHeight - 15;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        
        // Fecha de generación
        doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, margin, footerY);
        
        // Número de página
        doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin - 20, footerY);
    }

    // PRIMERA PÁGINA
    let y = 25;
    y = addHeader(y);
    y = addCreditInfo(y);
    
    // Título de la tabla
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('TABLA DE AMORTIZACIÓN COMPLETA', margin, y);
    y += 8;
    
    y = addTableHeader(y);
    
    // Generar datos de amortización
    let balance = loanData.loanAmount;
    let today = new Date();
    const periodicInterestRate = loanData.annualInterestRate / 100 / (loanData.paymentFrequency === 'semanal' ? 52 :
        loanData.paymentFrequency === 'quincenal' ? 24 :
        loanData.paymentFrequency === 'mensual' ? 12 : 4);

    // Mostrar TODOS los pagos
    for (let i = 1; i <= loanData.totalPayments; i++) {
        // Verificar si necesitamos nueva página
        if (y > pageHeight - 20) {
            addFooter(currentPage);
            doc.addPage();
            currentPage++;
            y = 25;
            y = addHeader(y);
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
        
        doc.text(i.toString(), margin, y);
        doc.text(formatDate(paymentDate), margin + 15, y);
        doc.text(formatCurrency(loanData.paymentAmount), margin + 45, y);
        doc.text(formatCurrency(interest), margin + 65, y);
        doc.text(formatCurrency(principal), margin + 85, y);
        doc.text(formatCurrency(balance), margin + 105, y);
        
        y += 4;
        
        // Línea separadora entre filas
        if (i < loanData.totalPayments) {
            doc.setDrawColor(240, 240, 240);
            doc.line(margin, y + 1, pageWidth - margin, y + 1);
            y += 3;
        }
    }

    // Agregar footer a la última página
    addFooter(currentPage);

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