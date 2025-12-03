document.addEventListener('DOMContentLoaded', calculateLoan)
calculateLoan()   // Calcular el crédito
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
        
        //calcular la tasa de interes diaria

        const dailyInterestRate = (parseFloat(document.getElementById('interest-rate').value)) / 100 / 360;
        

        //tasa de interes anual
        const annualInterestRate = (parseFloat(document.getElementById('interest-rate').value)) / 100;

        // Calcular monto a financiar
        const loanAmount = carValue - downPayment;

        // Determinar número de pagos por año según frecuencia
        let paymentsPerYear= 12;


        // switch (paymentFrequency) {
        //     case 'semanal':
        //         paymentsPerYear = 52;
        //         break;
        //     case 'quincenal':
        //         paymentsPerYear = 24;
        //         break;
        //     case 'mensual':
        //         paymentsPerYear = 12;
        //         break;
        //     case 'trimestral':
        //         paymentsPerYear = 4;
        //         break;
        //         case 'semestral':
        //         paymentsPerYear = 2;
        //         break;
        //         case 'anual':
        //         paymentsPerYear = 1;
        //         break;
        //     default:
        //         paymentsPerYear = 12;
        // }

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
                    paymentAmount = paymentAmount;
                    break;
                case 24:
                    paymentAmount = paymentAmount;
                    break;
                case 36:
                    paymentAmount = paymentAmount;
                    break;
                case 48:
                    paymentAmount = paymentAmount;
                    break;
                case 60:
                    paymentAmount = paymentAmount;
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