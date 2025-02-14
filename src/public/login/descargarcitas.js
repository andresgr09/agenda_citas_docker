


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No has iniciado sesión.',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = 'index.html';  // Redirige al login si no hay token
        });
    }
});

// Descargar Excel
document.getElementById('descargarCsv').addEventListener('click', async () => {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const ciudad = document.getElementById('ciudad').value;
    const token = localStorage.getItem('authToken'); // Verifica si el token está en localStorage

    if (!fechaInicio || !fechaFin) {
        Swal.fire({
            icon: 'warning',
            title: 'Fechas requeridas',
            text: 'Seleccione las fechas antes de descargar.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (!ciudad) {
        Swal.fire({
            icon: 'warning',
            title: 'Ciudad requerida',
            text: 'Seleccione la ciudad antes de descargar.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'No autenticado',
            text: 'No estás autenticado. Por favor, inicia sesión.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    try {
        const response = await fetch(`http://172.20.3.35:8080/api/citas-agendadas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&ciudad=${ciudad}&formato=excel`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 404) {
            Swal.fire({
                icon: 'info',
                title: 'No encontrado',
                text: 'No se encontraron citas en el rango de fechas y ciudad seleccionados.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        if (!response.ok) {
            throw new Error('Error al descargar el archivo Excel');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `citas-agendadas_${fechaInicio}_al_${fechaFin}_${ciudad}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar el archivo Excel:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al descargar el archivo Excel',
            confirmButtonText: 'Aceptar'
        });
    }
});

// Cerrar Sesión
document.getElementById('cerrarSesion').addEventListener('click', () => {
    Swal.fire({
        icon: 'warning',
        title: 'Cerrar Sesión',
        text: '¿Estás seguro de que deseas cerrar sesión?',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('authToken');
            Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión exitosamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = 'index.html';  // Redirige al login
            });
        }
    });
});