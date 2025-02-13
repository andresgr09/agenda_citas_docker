import Ciudad from '../models/ciudadesModel.js'; // Importa el modelo Ciudad
import Tramite from '../models/tramitesModel.js'; // Importa el modelo Tramite
import CitaAgendada from '../models/citasagendadasModel.js';

// Controlador para obtener todas las ciudades
export const obtenerCiudades = async (req, res) => {
  try {
    const { estado } = req.query; // Obtener el estado de los parámetros de consulta
    const ciudades = await Ciudad.findAll({
      where: { estado: estado || 'A' }, // Filtro dinámico, por defecto 'A'
      order: [['ciudad', 'ASC']], // Ordenar los resultados por la ciudad

    });
    res.status(200).json(ciudades);
  } catch (error) {
    console.error('Error al obtener las ciudades:', error);
    res.status(500).json({ error: 'Error al obtener las ciudades' });
  }
};


// Controlador para obtener todas las citas disponibles
export const obtenerCitaAgendada = async (req, res) => {
  try {
    const citas_disponibles = await CitaAgendada.findAll(); // Consulta todas las citas disponibles
    res.status(200).json(citas_disponibles); // Devuelve los resultados como JSON
  } catch (error) {
    console.error('Error al obtener citas disponibles:', error);
    res.status(500).json({ error: 'Error al obtener citas disponibles' });
  }
};



// Controlador para obtener todos los trámites
export const obtenerTramite = async (req, res) => {
  try {
    const { estado } = req.query;

    // Consulta todos los trámites con un filtro dinámico (por defecto 'A')
    const tramites = await Tramite.findAll({
      where: { estado: estado || 'A' }, // Filtro dinámico
      order: [['tramite', 'ASC']], // Ordenar los resultados por el campo 'tramite' de forma ascendente
    });

    // Devuelve los resultados como JSON
    res.status(200).json(tramites);
  } catch (error) {
    console.error('Error al obtener trámites:', error);
    res.status(500).json({ error: 'Error al obtener trámites' });
  }
};









