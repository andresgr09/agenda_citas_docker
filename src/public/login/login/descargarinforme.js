document.addEventListener('DOMContentLoaded', () => {
    const descargarInformeBtn = document.getElementById('descargarInforme');
    const cerrarSesionBtn = document.getElementById('cerrarSesion');

    // Descargar informe completo
    descargarInformeBtn.addEventListener('click', async () => {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
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
            const response = await fetch(`http://localhost:8080/api/informe-completo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 404) {
                Swal.fire({
                    icon: 'info',
                    title: 'No encontrado',
                    text: 'No se encontraron datos en el rango de fechas seleccionadas.',
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
            a.download = `informe-completo_${fechaInicio}_al_${fechaFin}.xlsx`;
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