const handleApiResponse = async (response) => {
    try {
        const data = await response.json();
        return data; // Se confía en que el backend siempre devuelve status 200
    } catch (error) {
        return { success: false, message: 'Error al procesar la respuesta del servidor' };
    }
};


export async function consultarCitas(ciudad, tramite, fecha_cita) {
    try {
        const response = await fetch('http://172.20.3.35:8080/api/consultar-citas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ciudad, tramite, fecha_cita })
        });
        return await handleApiResponse(response);
    } catch (error) {
        return { success: false, message: `Error al enviar la solicitud: ${error.message}` };
    }
}

export async function guardarCita(data) {
    try {
        const response = await fetch('http://172.20.3.35:8080/api/guardar-cita', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json(); // Extraemos el JSON de la respuesta

        return result; // Devolvemos directamente la respuesta del backend
    } catch (error) {
        return { success: false, message: `Error al enviar la solicitud: ${error.message}` };
    }
}

