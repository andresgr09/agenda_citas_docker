import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Necesario para obtener la ruta actual en ESM
import sequelize from './config/database.js';
import router from './routes/index.js'; // Importar las rutas de ciudades
import {obtenerCitasAgendadas}  from './controllers/descargarcitasController.js';
import  {verificarToken}  from './middleware/auth.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT ;

// Obtener el directorio actual en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar CORS para denegar todas las solicitudes de orígenes cruzados
const corsOptions = {
    origin: false,  // Deniega cualquier origen cruzado
};

app.use(cors(corsOptions));  // Usa la configuración de CORS con la opción para denegar

// Middlewares
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('src/public'));
app.use('/images', express.static('src/public/images'));

// Ruta para servir el archivo 'index.html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Usa las rutas con el prefijo "/api/ciudades"
app.use('/api', router);

const Server = process.env.SERVER 

router.get('/citas-agendadas', verificarToken, obtenerCitasAgendadas);


// Sincronizar la base de datos y luego iniciar el servidor
sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en ${Server}:${PORT}`);
        });
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

    