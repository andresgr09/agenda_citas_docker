import CitaDisponible from '../models/citasdisponiblesModel.js';
import CitaAgendada from '../models/citasagendadasModel.js';
import moment from 'moment-timezone';
import { body, validationResult } from 'express-validator';
import { enviarCorreoCita } from '../utils/correocita.js';
import sequelize from 'sequelize';
import {Op} from 'sequelize';
moment.locale('es');

export const insertarCita = [
    // Validaciones
    body('tipoDoc').notEmpty().withMessage('El tipo de documento es obligatorio'),
    body('nombres').notEmpty().withMessage('Los nombres son obligatorios').isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo se permiten letras y espacios'),
    body('numIdentificacion').notEmpty().withMessage('El número de identificación es obligatorio').matches(/^[A-Z0-9]+$/).withMessage('Solo se permiten letras mayúsculas y números'),
    body('fechaNacimiento').notEmpty().withMessage('La fecha de nacimiento es obligatoria').isDate().withMessage('Debe ser una fecha válida'),
    body('genero').notEmpty().withMessage('El género es obligatorio'),
    body('correo').notEmpty().withMessage('El correo es obligatorio').isEmail().withMessage('Debe ser un correo válido'),
    body('confirmarCorreo').custom((value, { req }) => value === req.body.correo).withMessage('Los correos no coinciden'),
    body('telefono').notEmpty().withMessage('El teléfono es obligatorio').isLength({ min: 10, max: 10 }).isNumeric().withMessage('Debe contener 10 dígitos numéricos'),
    body('citaId').notEmpty().withMessage('El ID de la cita es obligatorio'),
    body('ciudad').notEmpty().withMessage('La ciudad es obligatoria'),
    body('tramite').notEmpty().withMessage('El trámite es obligatorio'),
    body('fecha_cita').notEmpty().withMessage('La fecha de la cita es obligatoria').isDate().withMessage('Debe ser una fecha válida'),
    body('direccion').notEmpty().withMessage('La dirección es obligatoria'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ success: false, message: errors.array()[0].msg });
        }

        const { tipoDoc, nombres, numIdentificacion, fechaNacimiento, genero, correo, confirmarCorreo, telefono, citaId, ciudad, tramite, fecha_cita, direccion } = req.body;
        try {
            const [correoExistente, citaExistente, citaMismaFecha, citaSeleccionada] = await Promise.all([
                CitaAgendada.findOne({ where: { correo, documento: { [Op.ne]: numIdentificacion } }, raw: true }),
                CitaAgendada.findOne({ where: { documento: numIdentificacion, tipo_documento: tipoDoc, estado_agenda: 'confirmada' }, order: [['fecha_solicitud', 'DESC']], raw: true }),
                CitaAgendada.findOne({ where: { fecha_cita, estado_agenda: 'confirmada' }, raw: true }),
                CitaDisponible.findOne({ where: { id_cita_dispo: citaId }, raw: true })
            ]);

            if (correoExistente) return res.status(200).json({ success: false, message: 'El correo ya está asociado a otro número de documento.' });
            if (citaMismaFecha) return res.status(200).json({ success: false, message: 'No puede agendar una nueva cita para la misma fecha.' });
            if (!citaSeleccionada) return res.status(200).json({ success: false, message: 'Cita no encontrada.' });

            const tramiteSeleccionado = citaSeleccionada.tramite;

            if (citaExistente) {
                const fechaSolicitudExistente = moment(citaExistente.fecha_solicitud).startOf('day').format('YYYY-MM-DD');
                const fechaSolicitudActual = moment().startOf('day').format('YYYY-MM-DD');

                console.log('fechaSolicitudExistente:', fechaSolicitudExistente);
                console.log('fechaSolicitudActual:', fechaSolicitudActual);

                // Verificar si ya existe una cita programada para el mismo día
                if (fechaSolicitudExistente === fechaSolicitudActual) {
                    console.log('Validación: Solo puede tener una cita programada por día.');
                    return res.status(200).json({ success: false, message: 'Solo puede tener una cita programada por día.' });
                }

                const fechaCitaExistente = moment(citaExistente.fecha_cita).format('YYYY-MM-DD');
                const fechaHoy = moment().format('YYYY-MM-DD');

                console.log('fechaCitaExistente:', fechaCitaExistente);
                console.log('fechaHoy:', fechaHoy);

                if (moment(fechaCitaExistente).isAfter(fechaHoy)) {
                    console.log('Validación: No puede agendar una nueva cita hasta que la cita actual haya pasado.');
                    return res.status(200).json({ success: false, message: 'No puede agendar una nueva cita hasta que la cita actual haya pasado.' });
                }
            
                if (citaExistente.cita_tramite === tramiteSeleccionado) {
                    console.log('Validación: No puede agendar una nueva cita para el mismo trámite hasta que la cita existente haya pasado.');
                    return res.status(200).json({ success: false, message: 'No puede agendar una nueva cita para el mismo trámite hasta que la cita existente haya pasado.' });
                }
            }

            const fechaCreacion = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
            await CitaDisponible.update({ fecha_creacion: fechaCreacion }, { where: { id_cita_dispo: citaId } });

            await enviarCorreoCita(nombres, fecha_cita, citaSeleccionada, direccion, ciudad, tramiteSeleccionado, citaId, tipoDoc, numIdentificacion, fechaNacimiento, genero, correo, telefono);

            console.log('Cita guardada. Revise su correo para confirmar.');
            return res.status(200).json({ success: true, message: 'Cita guardada. Revise su correo para confirmar.' });
        } catch (error) {
            console.error('Error al insertar cita:', error);
            return res.status(200).json({ success: false, message: 'Error al guardar la cita', error: error.message });
        }
    }
];