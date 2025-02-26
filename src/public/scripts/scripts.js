import { mostrarHorasDisponibles, seleccionarHora } from './helpers.js';
import { validateFormData } from './validations.js';
import { consultarCitas, guardarCita } from './apiHandlers.js';

document.addEventListener('DOMContentLoaded', () => {
    const citySelect = document.getElementById('city');
    const tramiteSelect = document.getElementById('tramite');
    const dateInput = document.getElementById('fecha');
    const form = document.getElementById('consulta-form');
    const resultadosDiv = document.getElementById('resultados');
    const horasDisponiblesDiv = document.getElementById('horas-disponibles');
    const formModalForm = document.getElementById('form-modal-form');
    const modalOverlay = document.getElementById('modal-overlay');

    const tramitesConAdvertencia = [
        "CÉDULA DE EXTRANJERÍA",
        "REGISTRO DE VISA",
        "CERTIFICADO DE MOVIMIENTOS MIGRATORIOS",
        "SALVOCONDUCTO",
        "REEXPEDICIÓN DE PPT - CORRECCIÓN INFORMACIÓN",
        "DUPLICADO PPT - PÉRDIDA - HURTO",
    ];

    flatpickr(dateInput, {
        dateFormat: "Y-m-d",
        minDate: new Date().fp_incr(1),
        altInput: true,
        altFormat: "F j, Y",
        disable: [
            function(date) {
                // Deshabilitar sábados (6) y domingos (0)
                return date.getDay() === 0 || date.getDay() === 6;
            }
        ]
    });

    citySelect.addEventListener('change', () => {
        tramiteSelect.disabled = !citySelect.value;
    });

    tramiteSelect.addEventListener('change', () => {
        const tramiteSeleccionado = tramiteSelect.options[tramiteSelect.selectedIndex].text;
        if (tramitesConAdvertencia.includes(tramiteSeleccionado)) {
            Swal.fire({
                icon: 'info',
                title: 'Advertencia',
                text: 'Atención: Recuerde diligenciar el Formulario Único de Trámites (FUT) ya que es el documento obligatorio, exigido a la entrada del Centro Facilitador de Servicios Migratorios (No aplica para citas de Proceso Administrativo o Atención SIRE).',
                confirmButtonColor: '#337ab7',
                confirmButtonText: 'Aceptar',
            });
        }
    });

    document.getElementById('consulta-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const ciudad = citySelect.options[citySelect.selectedIndex].text;
        const tramite = tramiteSelect.options[tramiteSelect.selectedIndex].text;
        const fecha_cita = dateInput.value;

        if (!ciudad || !tramite || !fecha_cita) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Todos los campos (ciudad, trámite, fecha) son obligatorios.',
                confirmButtonColor: '#337ab7',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        try {
            const data = await consultarCitas(ciudad, tramite, fecha_cita);
            mostrarHorasDisponibles(data.data, seleccionarHora);
        } catch (error) {
            console.error(error);
            resultadosDiv.innerHTML = `<p class="text-red-500">${error.message}</p>`;
        }
    });

    document.getElementById('form-modal-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(formModalForm);
        const data = Object.fromEntries(formData.entries());

        // Validación de datos del formulario
        const errors = validateFormData(data);
        const isFutureDate = errors.includes('La fecha de nacimiento no puede ser una fecha futura.');
        const isMinor = errors.includes('Debe estar acompañado por su padre, madre o representante legal al momento de la cita.');

        if (errors.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                html: errors.join('<br>'),
                confirmButtonColor: '#337ab7',
                confirmButtonText: 'Aceptar',
            }).then(async () => {
                if (!isFutureDate) {
                    await proceedWithAppointment(data);
                }
            });
            return;
        }

        await proceedWithAppointment(data);
    });

    const proceedWithAppointment = async (data) => {
        // Validación de correo y documento
        const tipoDoc = data.tipoDoc;
        const numIdentificacion = data.numIdentificacion;
        const correo = data.correo;

        try {
            const response = await fetch('/citas/api/validar-correo-documento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tipoDoc, numIdentificacion, correo })
            });

            const result = await response.json();
            if (!response.ok || !result?.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message,
                    confirmButtonColor: '#337ab7',
                    confirmButtonText: 'Aceptar',
                });
                return; // Detener el proceso si la validación falla
            }
        } catch (error) {
            console.error('Error al validar el documento:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al validar el documento. Por favor, intente nuevamente.',
                confirmButtonColor: '#337ab7',
                confirmButtonText: 'Aceptar',
            });
            return; // Detener el proceso si hay un error en la validación
        }

        // Guardar la cita
        try {
            const result = await guardarCita(data);
            if (!result.success) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atención',
                    text: result.message,
                    confirmButtonColor: '#337ab7',
                    confirmButtonText: 'Aceptar',
                });
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'Cita guardada',
                html: 'Por favor, revise su correo electrónico para confirmar el agendamiento de su cita. <br><strong>NOTA: Recuerde que debe confirmar su cita en los próximos 5 minutos. De no hacerlo, tendrá que realizar un nuevo agendamiento.</strong>',
                confirmButtonColor: '#337ab7',
                confirmButtonText: 'Aceptar',
            }).then(() => location.reload());
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al guardar la cita: ${error.message}`,
            });
        }
    };

    modalOverlay.addEventListener('click', (event) => {
        // Verifica que el clic sea en el overlay, no dentro del modal
        if (event.target === modalOverlay) {
            document.getElementById('form-modal').classList.remove('visible');
            modalOverlay.classList.remove('visible');
        }
    });
});