import CitaDisponible from '../models/citasdisponiblesModel.js';
import { Op, literal } from 'sequelize';
import moment from 'moment'; // Instala con npm install moment si no lo tienes

export const consultarCitas = async (req, res) => {
    let { ciudad, tramite, fecha_cita } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!ciudad || !tramite || !fecha_cita) {
        return res.status(400).json({ message: 'Todos los campos (ciudad, tramite, fecha_cita) son obligatorios' });
    }

    try {
        // Asegúrate de que la fecha esté en formato YYYY-MM-DD
        fecha_cita = moment(fecha_cita, ['YYYY-MM-DD', 'MMMM D, YYYY', 'DD/MM/YYYY']).format('YYYY-MM-DD');

        const citas = await CitaDisponible.findAll({
            where: {
                [Op.and]: [
                    { ciudad: { [Op.like]: `%${ciudad}%` } },
                    { tramite: { [Op.like]: `%${tramite}%` } },
                    literal(`DATE(fecha_cita) = '${fecha_cita}'`),  // Fecha formateada correctamente
                    { estado_agenda: { [Op.eq]: 'disponible' } } 
                ]
            },
            attributes: ['id_cita_dispo', 'hora_cita_i', 'fecha_cita', 'ciudad', 'direccion', 'tramite', 'estado_agenda']
        });

        if (citas.length === 0) {
            console.log('No se encontraron citas disponibles');
            return res.status(200).json({ success: false, message: 'No se encontraron citas disponibles' });
        }

        res.status(200).json({ success: true, data: citas });
    } catch (error) {
        console.error('Error al consultar citas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
