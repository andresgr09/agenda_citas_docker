import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Ruta de tu configuración de conexión a la base de datos

const Ciudad = sequelize.define('Ciudad', {
  id_ciudad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  ciudad: {
    type: DataTypes.STRING(50),
    allowNull: false,
    collate: 'utf8_spanish_ci'
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: false
  }
}, {
  tableName: 'ciudades', // Nombre de la tabla en la base de datos
  timestamps: false // No incluye las columnas `createdAt` y `updatedAt`
});

export default Ciudad; // Exportación adaptada para ESM
