import CitaDispoPrueba from '../models/citasdispoPrueba.js';

export const importarCitas = async (req, res) => {
    try {
        const citas = req.body;
        console.log('Citas recibidas:', citas.slice(0, 5)); // Mostrar solo los primeros 5 registros

        // Validar los datos antes de insertarlos
        for (const [index, cita] of citas.entries()) {
            // console.log(`Validando cita ${index + 1}:`, cita);

            if (!cita.fecha_cita || !cita.hora_cita_i || !cita.hora_cita_f || !cita.ciudad || !cita.direccion || !cita.tramite || !cita.estado_agenda) {
                // console.log('Campos faltantes en la cita:', cita);
                return res.status(400).json({ message: 'Todos los campos son obligatorios', cita });
            }

            // Validar formato de fecha y hora
            if (isNaN(Date.parse(cita.fecha_cita))) {
                console.log('Formato de fecha inválido:', cita.fecha_cita);
                return res.status(400).json({ message: 'Formato de fecha inválido', cita });
            }
            if (!/^\d{2}:\d{2}:\d{2}$/.test(cita.hora_cita_i) || !/^\d{2}:\d{2}:\d{2}$/.test(cita.hora_cita_f)) {
                // console.log('Formato de hora inválido:', cita.hora_cita_i, cita.hora_cita_f);
                return res.status(400).json({ message: 'Formato de hora inválido', cita });
            }
        }

        // Insertar las citas en la base de datos en lotes
        const batchSize = 100; // Tamaño del lote
        for (let i = 0; i < citas.length; i += batchSize) {
            const batch = citas.slice(i, i + batchSize);
            // console.log(`Insertando lote de citas ${i + 1} a ${i + batch.length} en la base de datos`);
            await CitaDispoPrueba.bulkCreate(batch);
        }

        console.log('Citas importadas exitosamente');
        res.status(200).json({ message: 'Citas importadas exitosamente' });
    } catch (error) {
        console.error('Error al importar citas:', error);
        res.status(500).json({ message: 'Hubo un error al importar las citas' });
    }
};