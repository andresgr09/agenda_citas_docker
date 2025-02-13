import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  Usuario  from '../models/usuariosModel.js'; // Importa el modelo Usuario



export const registrarUsuario = async (req, res) => {
  const { nombre_usuario, password_hash } = req.body;

  try {
    if (!nombre_usuario || !password_hash) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    // Crear el usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      nombre_usuario,
      password_hash: hashedPassword,
    });

    res.status(201).json({ 
      message: 'Usuario registrado con éxito', 
      usuario: {
        id: nuevoUsuario.id,
        nombre_usuario: nuevoUsuario.nombre_usuario,
        created_at: nuevoUsuario.created_at,
      } 
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};




// Función para login de usuario
export const loginUsuario = async (req, res) => {
  const { nombre_usuario, password } = req.body;

  try {
      const usuario = await Usuario.findOne({ where: { nombre_usuario } });

      if (!usuario) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const isMatch = await bcrypt.compare(password, usuario.password_hash);
      
      if (!isMatch) {
          return res.status(400).json({ error: 'Contraseña incorrecta' });
      }

      const token = jwt.sign(
          { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error en el servidor' });
  }
};