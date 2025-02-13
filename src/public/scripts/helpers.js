// helpers.js
const Swal = window.Swal;

export const fetchOptions = async (url, selectElement) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.ciudad || item.tramite;
            option.textContent = item.ciudad || item.tramite;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error(`Error al cargar los datos de ${url}:`, error);
    }
};

export const mostrarHorasDisponibles = (citas, seleccionarHora) => {
    const horasDisponiblesDiv = document.getElementById('horas-disponibles');
    horasDisponiblesDiv.innerHTML = '';
    if (!Array.isArray(citas) || citas.length === 0) {
        Swal.fire({
            title: '¡NO HAY CITAS DISPONIBLES!',
            html: `
                <p>Apreciada ciudadanía, el agendamiento de citas para la atención de trámites y servicios en los Centros Facilitadores de Servicios Migratorios - CFSM y Puestos de Control Migratorio - PCM (con funciones de Extranjería) se habilita semanalmente, los días domingos a partir de las 5:00 p.m</p>
                <p>Por lo que, agradecemos estar atento e intentar nuevamente.</p>
                <p>Tenga en cuenta que, programar su cita no tiene costo y no requiere de intermediarios.</p>
                <p>Valide los requisitos del trámite que va a realizar antes de programar su cita <a href="https://www.migracioncolombia.gov.co/tramites/tramites-migracion-colombia" target="_blank">Aquí</a>.</p>
            `,
            imageUrl: './images/logo-migracion-colombia.png',
            imageWidth: 300,
            imageHeight: 100,
            imageAlt: 'Imagen de no citas disponibles',
            width: '600px',
            confirmButtonColor: '#337ab7',
            confirmButtonText: 'Aceptar',
        });
        horasDisponiblesDiv.innerHTML = '<p class="text-gray-500">No hay horas disponibles para esta fecha.</p>';
        return;
    }
    citas.forEach(cita => {
        const botonHora = document.createElement('button');
        botonHora.textContent = cita.hora_cita_i;
        botonHora.className = 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none';
        botonHora.addEventListener('click', () => {
            seleccionarHora(cita);
        });
        horasDisponiblesDiv.appendChild(botonHora);
    });
};

export const seleccionarHora = (cita) => {
    const formModal = document.getElementById('form-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const citaIdInput = document.getElementById('citaId');
    const ciudadInput = document.createElement('input');
    const tramiteInput = document.createElement('input');
    const fechaCitaInput = document.createElement('input');
    const direccionInput = document.createElement('input');
    const formModalForm = document.getElementById('form-modal-form');

    formModal.classList.add('visible');
    modalOverlay.classList.add('visible');
    citaIdInput.value = cita.id_cita_dispo;

    ciudadInput.type = 'hidden';
    ciudadInput.name = 'ciudad';
    ciudadInput.value = cita.ciudad;
    formModalForm.appendChild(ciudadInput);

    tramiteInput.type = 'hidden';
    tramiteInput.name = 'tramite';
    tramiteInput.value = cita.tramite;
    formModalForm.appendChild(tramiteInput);

    fechaCitaInput.type = 'hidden';
    fechaCitaInput.name = 'fecha_cita';
    fechaCitaInput.value = cita.fecha_cita;
    formModalForm.appendChild(fechaCitaInput);

    direccionInput.type = 'hidden';
    direccionInput.name = 'direccion';
    direccionInput.value = cita.direccion;
    formModalForm.appendChild(direccionInput);
};
