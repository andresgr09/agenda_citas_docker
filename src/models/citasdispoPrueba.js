import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CitaDispoPrueba = sequelize.define('CitaDispoPrueba', {
    id_cita_dispo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_cita: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_cita_i: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_cita_f: {
        type: DataTypes.TIME,
        allowNull: false
    },
    ciudad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tramite: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado_agenda: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Usa DataTypes.NOW para el valor por defecto
    },
}, {
    tableName: 'citas_disponibles_prueba',
    timestamps: false
});

export default CitaDispoPrueba;