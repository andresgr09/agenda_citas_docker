import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Asegúrate de configurar tu conexión en este archivo

const Tramite = sequelize.define('Tramite', {
  id_tramite: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  tramite: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: false
  }
}, {
  tableName: 'tramites',
  timestamps: false // Si no tienes columnas como createdAt o updatedAt
});

export default Tramite; // Exportación adaptada para ESM
