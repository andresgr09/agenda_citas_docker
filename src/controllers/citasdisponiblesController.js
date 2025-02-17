import CitaDisponible from '../models/citasdisponiblesModel.js';
import { Op, literal } from 'sequelize';

export const consultarCitas = async (req, res) => {
    const { ciudad, tramite, fecha_cita } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!ciudad || !tramite || !fecha_cita) {
        return res.status(400).json({ message: 'Todos los campos (ciudad, tramite, fecha_cita) son obligatorios' });
    }

    try {
        // console.log('Consultando citas con los siguientes parámetros:', { ciudad, tramite, fecha_cita });

        const citas = await CitaDisponible.findAll({
            where: {
                [Op.and]: [
                    { ciudad: { [Op.like]: `%${ciudad}%` } },
                    { tramite: { [Op.like]: `%${tramite}%` } },
                    literal(`DATE(fecha_cita) = '${fecha_cita}'`),
                    { estado_agenda: { [Op.eq]: 'disponible' } } 
                ]
            },
            attributes: ['id_cita_dispo', 'hora_cita_i', 'fecha_cita', 'ciudad', 'direccion', 'tramite', 'estado_agenda']
        });

        // Verificar si hay resultados
        if (citas.length === 0) {
            console.log('No se encontraron citas disponibles');
            return res.status(200).json({ success: false, message: 'No se encontraron citas disponibles' });
        }

        // Devolver las citas encontradas
        // console.log('Citas encontradas:', citas);
        res.status(200).json({success : true , data: citas});
    } catch (error) {
        console.error('Error al consultar citas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};