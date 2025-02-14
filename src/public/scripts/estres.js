import axios from 'axios';

const url = 'http://localhost:8080/api/guardar-cita'; // Cambia la URL según tu configuración
const numRequests = 2; // Número de solicitudes que deseas enviar
const delay = 10; // Retraso entre solicitudes en milisegundos

const citaData = {
    tipoDoc: 'cc',
    nombres: 'Juan Perez',
    numIdentificacion: '1234567890',
    fechaNacimiento: '1990-01-01',
    genero: 'masculino',
    correo: 'cristian.ars@hotmail.com',
    confirmarCorreo: 'cristian.ars@hotmail.com',
    telefono: '1234567890',
    citaId: '1',
    ciudad: 'BOGOTA DC',
    tramite: 'CÉDULA EXTRANJERÍA',
    fecha_cita: '2025-02-15',
    direccion: 'Calle Falsa 123'
};

const sendRequest = async () => {
    try {
        const response = await axios.post(url, citaData);
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

const runStressTest = async () => {
    for (let i = 0; i < numRequests; i++) {
        sendRequest();
        await new Promise(resolve => setTimeout(resolve, delay));
    }
};

runStressTest();