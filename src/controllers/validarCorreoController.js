import CitaAgendada from '../models/citasagendadasModel.js';
import HistoricoCitaAgendada from '../models/historicoCitasAgendadasModel.js';
import { body, validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const validarCorreoDocumento = [
    // Validaciones
    body('tipoDoc').notEmpty().withMessage('El tipo de documento es obligatorio'),
    body('numIdentificacion').notEmpty().withMessage('El número de identificación es obligatorio'),
    body('correo').notEmpty().withMessage('El correo es obligatorio').isEmail().withMessage('Debe ser un correo válido'),

    // Controlador
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ success: false, errors: errors.array() });
        }

        const { tipoDoc, numIdentificacion, correo } = req.body;

        try {
            // Verificar en la tabla citas_agendadas
            const citaExistente = await CitaAgendada.findOne({
                where: {
                    tipo_documento: tipoDoc,
                    documento: numIdentificacion,
                    correo: { [Op.ne]: correo }
                }
            });

            if (citaExistente) {
                return res.status(200).json({ success: false, message: 'El número de documento  ya está asociado a otro correo en la plataforma.' });
            }

            // Verificar en la tabla historico_citas_agendadas
            const historicoExistente = await HistoricoCitaAgendada.findOne({
                where: {
                    tipo_documento: tipoDoc,
                    documento: numIdentificacion,
                    correo: { [Op.ne]: correo }
                }
            });

            if (historicoExistente) {
                return res.status(200).json({ success: false,message: 'El número de documento y tipo de documento ya están asociados a otro correo en el histórico de citas agendadas.' });
            }

            res.status(200).json({ success: true, message: 'El documento y correo son válidos.' });
        } catch (error) {
            console.error('Error al validar el documento:', error);
            res.status(200).json({ success: false , message: 'Error al validar el documento', error: error.message });
        }
    }
];

export default validarCorreoDocumento;