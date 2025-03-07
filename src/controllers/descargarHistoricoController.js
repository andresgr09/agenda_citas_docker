import XLSX from 'xlsx';
import { Op } from 'sequelize';
import  HistoricoCitaAgendada  from '../models/historicoCitasAgendadasModel.js';

export const historicoCita = async (req, res) => {
    const { fechaInicio, fechaFin, formato } = req.query;

    try {
        // Construir el filtro de búsqueda
        const where = {
            fecha_cita: {
                [Op.gte]: fechaInicio || new Date(),
                [Op.lte]: fechaFin || new Date(),
            }
        };

        // Consultar todas las citas agendadas en el rango de fechas
        const citas = await HistoricoCitaAgendada.findAll({ where });

        if (citas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron citas en ese rango de fechas.' });
        }

        // Si el formato solicitado es Excel
        if (formato === 'excel') {
            const citasJSON = citas.map(cita => {
                const { id_cita, id_cita_dispo_fk, ...rest } = cita.toJSON();
                return rest;
            });
            const worksheet = XLSX.utils.json_to_sheet(citasJSON);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Citas Agendadas');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.attachment(`informe-completo_${fechaInicio}_al_${fechaFin}.xlsx`);
            return res.send(excelBuffer);
        }

        // Devolver datos en JSON por defecto
        res.status(200).json(citas);

    } catch (error) {
        console.error('Error al obtener el informe completo:', error);
        res.status(500).json({ error: 'Error al obtener el informe completo' });
    }
};