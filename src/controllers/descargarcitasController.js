import CitaAgendada from '../models/citasagendadasModel.js';
import { Op } from 'sequelize';
import XLSX from 'xlsx'; // Importa la librería xlsx

export const obtenerCitasAgendadas = async (req, res) => {
    const { fechaInicio, fechaFin, ciudad, formato } = req.query;

    try {
        // Construir el filtro de búsqueda
        const where = {
            fecha_cita: {
                [Op.gte]: fechaInicio || new Date(),
                [Op.lte]: fechaFin || new Date(),
            }
        };

        if (ciudad) {
            // Normalizar la ciudad para eliminar tildes y otros caracteres diacríticos
            const normalizedCiudad = ciudad.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            where.cita_sede = {
                [Op.like]: `%${normalizedCiudad}%`
            };
        }

        // Consultar citas agendadas con filtro de fechas y ciudad
        const citas = await CitaAgendada.findAll({ where });

        if (citas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron citas en ese rango de fechas y ciudad.' });
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
            res.attachment(`citas-agendadas_${fechaInicio}_al_${fechaFin}.xlsx`);
            return res.send(excelBuffer);
        }

        // Devolver datos en JSON por defecto
        res.status(200).json(citas);

    } catch (error) {
        console.error('Error al obtener citas agendadas:', error);
        res.status(500).json({ error: 'Error al obtener citas agendadas' });
    }
};