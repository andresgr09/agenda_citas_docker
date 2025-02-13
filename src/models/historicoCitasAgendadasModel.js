import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Adaptación a ESM con extensión .js

const HistoricoCitaAgendada = sequelize.define('HistoricoCitaAgendada', {
  id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true // Asegúrate de que el ID se incremente automáticamente
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Usa DataTypes.NOW para el valor por defecto
  },
  fecha_cita: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora_cita_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_cita_fin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  radicado: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  tipo_documento: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  genero: {
    type: DataTypes.STRING(15),
    allowNull: false,
    collate: 'utf8_spanish_ci'
  },
  correo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    collate: 'utf8_spanish_ci'
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: false,
    collate: 'utf8_spanish_ci'
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  cita_sede: {
    type: DataTypes.STRING(50),
    allowNull: false,
    collate: 'utf8_spanish_ci'
  },
  cita_tramite: {
    type: DataTypes.STRING(70),
    allowNull: false,
    collate: 'utf8_spanish_ci'
  },
  direccion: {
    type: DataTypes.STRING(70),
    allowNull: false,
    collate: 'utf8_spanish_ci'
  },
  estado_agenda: {
    type: DataTypes.STRING(15),
    allowNull: false,
    collate: 'utf8_spanish_ci'
  },
  id_cita_dispo_fk: { // Cambiar el nombre del campo a id_cita_dispo_fk
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'historico_citas_agendadas', // Nombre de la tabla
  timestamps: false, // Indica que no usaremos `createdAt` y `updatedAt`
});

export default HistoricoCitaAgendada; // Exportación adaptada para ESM