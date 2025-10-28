<!DOCTYPE html>
<html lang="es">
<head>
  <?php
    include "controller/control.calcular.php";
    include "controller/control.pagos.php";
    setlocale(LC_MONETARY,"en_US");
    include "modules/head.php";
    ?>
</head>

<body>
    <!-- Header -->
    <header class="bg-primary-custom text-white py-4 mb-4">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <h3 class="display-4 fw-bold">Cotizador de Créditos</h3>
                    <p class="lead">Calcula tu financiamiento y plan de pagos de forma rápida y sencilla</p>
                </div>
                <div class="col-md-4 text-md-end">
                    <div class="bg-light text-dark rounded p-3 d-inline-block">
                        <small class="text-muted d-block">Cotización válida hasta:</small>
                        <strong id="valid-until">--/--/----</strong>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div class="container">
        <div class="row g-4">

            <!-- Formulario -->
            <div class="col-lg-5">
              <?php include "modules/formulario.php"; ?>
                
                <!-- Información adicional -->
                <div class="card mt-4">
                    <div class="card-header bg-info text-white">
                        <h3 class="h5 mb-0"><i class="bi bi-info-circle me-2"></i>Información Importante</h3>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Los cálculos son estimados</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>La tasa de interés puede variar</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Consulte términos y condiciones</li>
                            <li><i class="bi bi-check-circle text-success me-2"></i>Exporte su cotización en PDF</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Resultados -->
           <?php
            $res = Control_calcular::ctrCalcular();
            if($res != null){
                include "modules/resultados.php"; 

            }
            ?>           
           
      
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5 class="mb-3">Cotizador de Créditos Asefimex</h5>
                    <!-- <p class="mb-0">Herramienta profesional para calcular financiamiento de vehículos</p> -->
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-1"><i class="bi bi-telephone me-2"></i>9615792121</p>
                    <p class="mb-0"><i class="bi bi-envelope me-2"></i>ventas@asefimex.com</p>
                </div>
            </div>
            <hr class="my-3">
            <div class="text-center">
                <p class="mb-0">&copy; 2023 Cotizador de Créditos para Autos. Asefimex Financiera.</p>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

    <!-- <script src="index.js"></script> -->

</body>
</html>