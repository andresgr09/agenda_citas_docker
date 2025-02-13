document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-modal-form');
    const tipoDocInput = document.getElementById('tipoDoc');
    const numIdentificacionInput = document.getElementById('numIdentificacion');
    const correoInput = document.getElementById('correo');
    const errorMessage = document.getElementById('error-message');

    document.getElementById('form-modal-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const tipoDoc = tipoDocInput.value;
        const numIdentificacion = numIdentificacionInput.value;
        const correo = correoInput.value;

        try {
            const response = await fetch('/api/validar-correo-documento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tipoDoc, numIdentificacion, correo })
            });

            const result = await response.json();

            console.log('**result:', result);
            if (!response.ok || !result?.success ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message,
                    confirmButtonColor: '#337ab7',
                    confirmButtonText: 'Aceptar',
                });
            } else {
                
                form.submit();
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
        }
    });
});