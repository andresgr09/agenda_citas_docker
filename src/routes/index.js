import express from 'express';
import { 
  obtenerCiudades, 
  obtenerCitaAgendada, 
  obtenerTramite 
} from '../controllers/controller.js';
import { consultarCitas } from '../controllers/citasdisponiblesController.js';
import { insertarCita } from '../controllers/agendarcitaController.js';
import { confirmarCita } from '../controllers/confirmacionController.js';
import { registrarUsuario, loginUsuario } from '../controllers/usuariosController.js';
import { obtenerCitasAgendadas } from '../controllers/descargarcitasController.js';
import { verificarToken } from '../middleware/auth.js'; // Middleware para protección
import {validarCorreoDocumento} from '../controllers/validarCorreoController.js'; // Asegúrate de que la ruta y el nombre del archivo sean correctos
// import {verificarDocumento,verificarCorreo} from '../controllers/verficacionesController.js'; // Asegúrate de que la ruta y el nombre del archivo sean correctos
const router = express.Router();

// Rutas públicas
router.get('/ciudades', obtenerCiudades);
router.get('/citas', obtenerCitaAgendada);
router.get('/tramites', obtenerTramite);
router.post('/consultar-citas', consultarCitas);
router.post('/guardar-cita', insertarCita);
router.get('/confirmar-cita/:token',  confirmarCita);
router.post('/usuarios/register', registrarUsuario);
router.post('/usuarios/login', loginUsuario);
// router.post('/verificar-documento', verificarDocumento);
// router.post('/verificar-correo', verificarCorreo);
router.post('/validar-correo-documento', validarCorreoDocumento);



// Rutas protegidas
router.get('/citas-agendadas', verificarToken, obtenerCitasAgendadas);

router.get('/ruta-protegida', verificarToken, (req, res) => {
  res.json({ message: 'Acceso autorizado', usuario: req.usuario });
});

export default router;
