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

    // Redirigir a descargarcitas.html al hacer clic en "Descargar Excel por ciudades"
    descargarPorCiudadesBtn.addEventListener('click', () => {
        window.location.href = 'descargarcitas.html';
    });

    // Redirigir a descargarinforme.html al hacer clic en "Descargar informe completo"
    descargarInformeCompletoBtn.addEventListener('click', () => {
        window.location.href = 'descargarinforme.html';
    });

    importarcitas.addEventListener('click', () => {
        window.location.href = 'importar_citas.html';
    });

    // Cerrar sesión
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
});