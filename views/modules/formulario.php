  <div class="card">
      <div class="card-header bg-primary text-white">
          <h2 class="h4 mb-0"><i class="bi bi-pencil-square me-2"></i>Datos del Crédito</h2>
      </div>
      <div class="card-body">
          <form id="loan-form"  method="POST" name="frmcalcular">
              <div class="mb-3">
                  <label for="car-type" class="form-label">Seleccine la Marca</label>
                  <select class="form-select" id="car-marc" name="marca-unidad" required>
                      <option value="" selected disabled>Selecciona una Marca</option>
                      <option value="shineray">Shineray</option>
                      <option value="foton">Foton</option>
                      <option value="king">King-long</option>
                  </select>
                  <div class="invalid-feedback">
                      Debes seleccionar un tipo de auto
                  </div>
              </div>
              <div class="mb-3">
                  <label for="car-type" class="form-label">Tipo de Auto</label>
                  <select class="form-select" id="car-type" name="tipo-unidad" required>
                      <option value="" selected disabled>Selecciona un tipo</option>
                      <option value="compacto">Compacto</option>
                      <option value="sedan">Sedán</option>
                      <option value="suv">SUV</option>
                      <option value="pickup">Pickup</option>
                      <option value="lujo">Lujo</option>
                  </select>
                  <div class="invalid-feedback">
                      Debes seleccionar un tipo de auto
                  </div>
              </div>

              <div class="mb-3">
                  <label for="car-value" class="form-label">Valor del Auto ($)</label>
                  <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input type="number" class="form-control" id="car-value" name="valor-unidad" min="50000" placeholder="Ej: 20000" required>
                  </div>
                  <div class="invalid-feedback">
                      El valor debe ser mayor a $10,000
                  </div>
              </div>

              <div class="mb-3">
                  <label for="down-payment" class="form-label">Enganche ($)</label>
                  <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input type="number" class="form-control" id="down-payment" name="valor-enganche" min="0" placeholder="Ej: 50000" required>
                  </div>
                  <div class="invalid-feedback" id="down-payment-error">
                      El enganche no puede ser mayor al valor del auto
                  </div>
              </div>

              <div class="mb-3">
                  <label for="loan-term" class="form-label">Plazo de Financiamiento</label>
                  <select class="form-select" id="loan-term" name="valor-plazo" required>
                      <option value="" selected disabled>Selecciona un plazo</option>
                      <option value="12">12 meses</option>
                      <option value="24">24 meses</option>
                      <!--
                                    <option value="36">36 meses</option>
                                    <option value="48">48 meses</option>
                                    <option value="60">60 meses</option>
                                    <option value="72">72 meses</option>
                                    <option value="84">84 meses</option>
                                    <option value="92">92 meses</option> -->
                  </select>
                  <div class="invalid-feedback">
                      Debes seleccionar un plazo
                  </div>
              </div>

              <div class="mb-3">
                  <label for="payment-frequency" class="form-label">Frecuencia de Pagos</label>
                  <select class="form-select" id="payment-frequency" name="valor-frecuencia" required>
                      <option value="" selected disabled>Selecciona una frecuencia</option>
                      <!-- <option value="semanal">Semanal</option> -->
                      <!-- <option value="quincenal">Quincenal</option> -->
                      <option value="mensual">Mensual</option>
                      <!-- <option value="trimestral">Trimestral</option>
                                    <option value="semestral">Semestral</option>
                                    <option value="anual">Anual</option> -->
                  </select>
                  <div class="invalid-feedback">
                      Debes seleccionar una frecuencia de pagos
                  </div>
              </div>

              <div class="mb-3">
                  <label for="interest-rate" class="form-label">Tasa de Interés Anual (%)</label>
                  <div class="input-group">
                      <input type="number" class="form-control" id="interest-rate" name="tasa-anual" min="1" max="76" step="0.1" value="12" required>
                      <span class="input-group-text">%</span>
                  </div>
                  <div class="invalid-feedback">
                      La tasa debe estar entre 1% y 30%
                  </div>
              </div>

              <div class="mb-4">
                  <label for="payment-frequency" class="form-label">Fecha de Inicio:</label>
                  <input type="date" class="form-control" id="fecha-inicio" name="fecha-inicio" required>
                  <div class="invalid-feedback">
                      Debes seleccionar una frecuencia de pagos
                  </div>
              </div>

              <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary-custom btn-lg" name="calcular">
                      <i class="bi bi-calculator me-2"></i>Simular Crédito
                  </button>
                  <button type="reset" class="btn btn-secondary btn-lg">
                      <i class="bi bi-arrow-clockwise me-2"></i>Limpiar Formulario
                  </button>
              </div>
          </form>
      </div>
  </div>