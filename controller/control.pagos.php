<?php
Class Control_Pagos{
    
/*** Calcula el pago periódico de un préstamo (equivalente a la función PAGO de Excel)
 * $tasa Tasa de interés por período
 * $nper Número total de períodos de pago
 * $va Valor actual (monto del préstamo)
 * $vf Valor futuro (saldo después del último pago, normalmente 0)
 * $tipo Tipo de pago (0 = fin de período, 1 = inicio de período)
 * return float Pago periódico
 */

    static public function pago($tasa, $nper, $va, $vf = 0, $tipo = 1)
    {
        // Validaciones básicas
        if ($tasa <= 0 || $nper <= 0) {
            return 0;
        }

        // Si la tasa es 0, es un préstamo sin interés
        if ($tasa == 0) {
            return (-$va - $vf) / $nper;
        }

        // Fórmula del pago periódico
        $factor = pow(1 + $tasa, $nper);
        $pago = ($va * $factor - $vf) / (($factor - 1) / $tasa);

        // Ajustar si el pago es al inicio del período
        if ($tipo == 1) {
            $pago = $pago / (1 + $tasa);
        }

        return $pago;
    }



}