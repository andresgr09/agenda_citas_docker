import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Asegúrate de que la ruta sea correcta

const RadicadoConsecutivo = sequelize.define('RadicadoConsecutivo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ultimo_consecutivo: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'radicado_consecutivo',
    timestamps: false
});

export default RadicadoConsecutivo;