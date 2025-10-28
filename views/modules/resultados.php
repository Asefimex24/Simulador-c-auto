 <div class="col-lg-7">
     <div class="card">
         <div class="card-header bg-success text-white">
             <h2 class="h4 mb-0"><i class="bi bi-graph-up me-2"></i>Resultados de la Cotización</h2>
         </div>
         <div class="card-body">
             <!-- Resumen -->
             <div id="results-summary">
                 <div class="row g-3 mb-4">
                     <div class="col-md-6">
                         <div class="card summary-card h-100">
                             <div class="card-body">
                                 <h5 class="card-title text-primary">Resumen del Crédito</h5>
                                 <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                     <span>Valor del Auto:</span>
                                     <strong id="summary-car-value"> <?php echo '$' . number_format($res['valorUnidad'], 2);  ?></strong>
                                 </div>
                                 <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                     <span>Enganche:</span>
                                     <strong id="summary-down-payment"> <?php echo '$'.number_format($res['valorEnganche'],2);  ?></strong>
                                 </div>
                                 <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                     <span>Monto a Financiar:</span>
                                     <strong id="summary-loan-amount"><?php echo '$'.number_format($res['valorUnidad']-$res['valorEnganche'],2);  ?></strong>
                                 </div>
                                 <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                     <span>Plazo:</span>
                                     <strong id="summary-loan-term"><?php echo $res['valorPlazo'] ?> meses</strong>
                                 </div>
                                 <div class="d-flex justify-content-between">
                                     <span>Frecuencia:</span>
                                     <strong id="summary-payment-frequency">- <?php echo $res['valorFrecuencia']  ?></strong>
                                 </div>
                             </div>
                         </div>
                     </div>
                     <div class="col-md-6">
                         <div class="card summary-card h-100">
                             <div class="card-body">
                                 <h5 class="card-title text-primary">Detalles de Pago</h5>
                                 <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                     <span>Tasa de Interés:</span>
                                     <strong id="summary-interest-rate"><?php echo $res['tasaAnual']; ?>%</strong>
                                 </div>
                                 <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                     <span>Pago por Periodo:</span>
                                     <strong id="summary-payment-amount"><?php  echo '$'.number_format($res['cuotaPeriodica'],0)?></strong>
                                 </div>
                                 <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                     <span>Total a Pagar:</span>
                                     <strong id="summary-total-payment">$0</strong>
                                 </div>
                                 <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                     <span>Intereses Totales:</span>
                                     <strong id="summary-total-interest">$0</strong>
                                 </div>
                                 <div class="d-flex justify-content-between fw-bold text-success">
                                     <span>Coste Total:</span>
                                     <strong id="summary-total-cost">$0</strong>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>

                 <!-- Tabla de amortización -->
                 <div id="payment-table-container" style="display: none;">
                     <h3 class="h5 mb-3"><i class="bi bi-table me-2"></i>Tabla Pagos</h3>
                     <div class="table-responsive">
                         <table class="table table-striped table-hover table-sm" id="payment-table">
                             <thead class="sticky-top">
                                 <tr>
                                     <th>No. Pago</th>
                                     <th>Fecha</th>
                                     <th>Pago</th>
                                     <th>Interés</th>
                                     <th>Capital</th>
                                     <th>Saldo Restante</th>
                                 </tr>
                             </thead>
                             <tbody id="payment-table-body">
                                 <!-- Las filas se generarán dinámicamente -->
                             </tbody>
                         </table>
                     </div>

                     <!-- Exportación -->
                     <div class="export-section mt-4">
                         <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                             <button id="export-pdf" class="btn btn-danger-custom me-md-2">
                                 <i class="bi bi-file-earmark-pdf me-2"></i>Exportar a PDF
                             </button>
                             <button id="print-results" class="btn btn-outline-secondary">
                                 <i class="bi bi-printer me-2"></i>Imprimir
                             </button>
                         </div>
                     </div>
                 </div>
             </div>

             <!-- Estado inicial -->
             <div id="no-results" class="text-center py-5">
                 <i class="bi bi-calculator display-1 text-muted"></i>
                 <h3 class="h4 text-muted mt-3">Ingresa los datos del crédito</h3>
                 <p class="text-muted">Completa el formulario para ver la cotización</p>
             </div>
         </div>
     </div>

 </div>