<?php
class Control_calcular
{

    static public function ctrCalcular()
    {
        if (isset($_POST["calcular"])) {

            $marcaUnidad = $_POST["marca-unidad"];
            $tipoUnidad = $_POST["tipo-unidad"];
            $valorUnidad = $_POST["valor-unidad"];
            $valorEnganche = $_POST["valor-enganche"];
            $valorPlazo = $_POST["valor-plazo"];
            $valorFrecuencia = $_POST["valor-frecuencia"];
            $tasaAnual = $_POST["tasa-anual"];
            $fechaInicio = $_POST["fecha-inicio"];



            $cuotaPeriodica = Control_Pagos::pago(38, $valorPlazo,12, ($valorUnidad-$valorEnganche), 0, 0);
            

            $data = array(
                "marcaUnidad" => $marcaUnidad,
                "tipoUnidad" => $tipoUnidad,
                "valorUnidad" => $valorUnidad,
                "valorEnganche" => $valorEnganche,
                "valorPlazo" => $valorPlazo,
                "valorFrecuencia" => $valorFrecuencia,
                "tasaAnual" => $tasaAnual,
                "fechaInicio" => $fechaInicio,
                "cuotaPeriodica" => ($cuotaPeriodica *1.003)
            );

            return $data;
        }
    }

}
