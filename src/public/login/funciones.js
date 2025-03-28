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

    const descargarPorCiudadesBtn = document.getElementById('descargarPorCiudades');
    const descargarInformeCompletoBtn = document.getElementById('descargarInformeCompleto');
    const cerrarSesionBtn = document.getElementById('cerrarSesion');
    const historialCitasBtn = document.getElementById('historicoCitas');
    

    // Verificar si los elementos existen antes de agregar los eventos
    if (descargarPorCiudadesBtn) {
        descargarPorCiudadesBtn.addEventListener('click', () => {
            window.location.href = 'descargarcitas.html';
        });
    }

    if (descargarInformeCompletoBtn) {
        descargarInformeCompletoBtn.addEventListener('click', () => {
            window.location.href = 'descargarinforme.html';
        });
    }

    if (historialCitasBtn) {
        historialCitasBtn.addEventListener('click', () => {
            window.location.href = 'historico_citas.html';
        });
    }

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
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
    }
});