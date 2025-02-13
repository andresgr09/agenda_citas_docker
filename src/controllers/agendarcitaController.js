import CitaDisponible from '../models/citasdisponiblesModel.js';
import CitaAgendada from '../models/citasagendadasModel.js';
import moment from 'moment-timezone';
import { body, validationResult } from 'express-validator';
import { enviarCorreoConfirmacion } from '../controllers/mailer.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js'; // Asegúrate de importar tu instancia de Sequelize

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

        const { tipoDoc, nombres, numIdentificacion, correo, citaId, fechaNacimiento, genero, telefono, ciudad, tramite, fecha_cita, direccion } = req.body;

        const transaction = await sequelize.transaction();
        try {
            const [correoExistente, citaExistente, citaMismaFecha, citaSeleccionada, citasMismoTramiteMes, citaMismoTramiteNoPasada] = await Promise.all([
                CitaAgendada.findOne({ where: { correo, documento: { [Op.ne]: numIdentificacion } }, transaction }),
                CitaAgendada.findOne({ where: { documento: numIdentificacion, tipo_documento: tipoDoc, estado_agenda: 'confirmada' }, order: [['fecha_solicitud', 'DESC']], transaction }),
                CitaAgendada.findOne({ where: { fecha_cita, estado_agenda: 'confirmada' }, transaction }),
                CitaDisponible.findOne({ where: { id_cita_dispo: citaId }, transaction }),
                CitaAgendada.count({ where: { documento: numIdentificacion, tipo_documento: tipoDoc, cita_tramite: tramite, fecha_cita: { [Op.gte]: moment().startOf('month').format('YYYY-MM-DD'), [Op.lte]: moment().endOf('month').format('YYYY-MM-DD') } }, transaction }),
                CitaAgendada.findOne({ where: { documento: numIdentificacion, tipo_documento: tipoDoc, cita_tramite: tramite, fecha_cita: { [Op.gte]: moment().format('YYYY-MM-DD') }, estado_agenda: 'confirmada' }, order: [['fecha_cita', 'ASC']], transaction })
            ]);

            if (correoExistente) {
                await transaction.rollback();
                return res.status(200).json({ success: false, message: 'El correo ya está asociado a otro número de documento.' });
            }
            if (citaMismaFecha) {
                await transaction.rollback();
                return res.status(200).json({ success: false, message: 'No puede agendar una nueva cita para la misma fecha.' });
            }
            if (!citaSeleccionada) {
                await transaction.rollback();
                return res.status(200).json({ success: false, message: 'Cita no encontrada.' });
            }

            const tramiteSeleccionado = citaSeleccionada.tramite;

            if (citaExistente) {
                const fechaSolicitudExistente = moment(citaExistente.fecha_solicitud).startOf('day').format('YYYY-MM-DD');
                const fechaSolicitudActual = moment().startOf('day').format('YYYY-MM-DD');

                console.log('fechaSolicitudExistente:', fechaSolicitudExistente);
                console.log('fechaSolicitudActual:', fechaSolicitudActual);

                // Verificar si ya existe una cita programada para el mismo día
                if (fechaSolicitudExistente === fechaSolicitudActual) {
                    console.log('Validación: Solo puede tener una cita programada por día.');
                    await transaction.rollback();
                    return res.status(200).json({ success: false, message: 'Solo puede tener una cita programada por día.' });
                }

                const fechaCitaExistente = moment(citaExistente.fecha_cita).format('YYYY-MM-DD');
                const fechaHoy = moment().format('YYYY-MM-DD');

                console.log('fechaCitaExistente:', fechaCitaExistente);
                console.log('fechaHoy:', fechaHoy);

                if (moment(fechaCitaExistente).isAfter(fechaHoy) && citaExistente.cita_tramite === tramiteSeleccionado) {
                    console.log('Validación: No puede agendar una nueva cita para el mismo trámite hasta que la cita existente haya pasado.');
                    await transaction.rollback();
                    return res.status(200).json({ success: false, message: 'No puede agendar una nueva cita para el mismo trámite hasta que la cita existente haya pasado.' });
                }
            }

            // Validación: No puede agendar más de 3 citas para el mismo trámite al mes
            if (citasMismoTramiteMes >= 3) {
                console.log('Validación: No puede agendar más de 3 citas para el mismo trámite al mes.');
                await transaction.rollback();
                return res.status(200).json({ success: false, message: 'No puede agendar más de 3 citas para el mismo trámite al mes.' });
            }

            // Validación: No puede agendar una nueva cita para el mismo trámite si ya existe una cita para ese trámite que no ha pasado
            if (citaMismoTramiteNoPasada) {
                const fechaCitaMismoTramiteNoPasada = moment(citaMismoTramiteNoPasada.fecha_cita).format('YYYY-MM-DD');
                if (moment(fechaCitaMismoTramiteNoPasada).isAfter(moment().format('YYYY-MM-DD'))) {
                    console.log('Validación: No puede agendar una nueva cita para el mismo trámite hasta que la cita existente haya pasado.');
                    await transaction.rollback();
                    return res.status(200).json({ success: false, message: 'No puede agendar una nueva cita para el mismo trámite hasta que la cita existente haya pasado.' });
                }
            }

            const fechaCreacion = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
            await CitaDisponible.update({ fecha_creacion: fechaCreacion }, { where: { id_cita_dispo: citaId }, transaction });

            const asunto = 'CONFIRMACIÓN DE CITA - MIGRACIÓN COLOMBIA';
            const mensaje = `
                <p>Hola ${nombres},</p>
                <p>Le confirmamos que su cita está programada para el ${moment(fecha_cita).format('dddd, D [de] MMMM [de] YYYY')} a las ${citaSeleccionada.hora_cita_i}. A continuación, le recordamos los detalles:</p>
                <p><strong>Fecha y hora:</strong> ${moment(fecha_cita).format('D [de] MMMM [de] YYYY')} a las ${citaSeleccionada.hora_cita_i}</p>
                <p><strong>Dirección de la sede:</strong> ${direccion}, ${ciudad}</p>
                <p><strong>Motivo de la cita:</strong> ${tramiteSeleccionado}</p>
                <p>Para confirmar su cita, por favor haga clic en el siguiente enlace:</p>
                <p><a href="http://localhost:8080/api/confirmar-cita/${citaId}?tipoDoc=${tipoDoc}&nombres=${nombres}&numIdentificacion=${numIdentificacion}&fechaNacimiento=${fechaNacimiento}&genero=${genero}&correo=${correo}&telefono=${telefono}&ciudad=${ciudad}&tramite=${tramite}&fecha_cita=${fecha_cita}&direccion=${direccion}">Confirmar Cita</a></p>
                <p>NOTA: Recuerde que debe confirmar su cita en los próximos 5 minutos. De no hacerlo, tendrá que realizar un nuevo agendamiento.</p>
                <p>Saludos cordiales,<br>MIGRACIÓN COLOMBIA MINISTERIO DE RELACIONES EXTERIORES</p>
            `;
            enviarCorreoConfirmacion(correo, asunto, mensaje);

            await transaction.commit();

            console.log('Cita guardada. Revise su correo para confirmar.');
            return res.status(200).json({ success: true, message: 'Cita guardada. Revise su correo para confirmar.' });
        } catch (error) {
            await transaction.rollback();
            console.error('Error al insertar cita:', error);
            return res.status(200).json({ success: false, message: 'Error al guardar la cita', error: error.message });
        }
    }
];