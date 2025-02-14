import nodemailer from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: 'relay.migracioncolombia.gov.co',
  port: 25,
  secure: false, // Cambia a true si usas un puerto seguro (por ejemplo, 465)
  tls: {
    rejectUnauthorized: false // Deshabilita la verificación del certificado
  },
  auth: {
    // user: 'felipecano09@gmail.com',
    // pass: 'toor cxxc kcdr xrwl'
  }
});

export const enviarCorreoConfirmacion = (destinatario, asunto, mensaje) => {
  // Ruta absoluta de la imagen en el servidor
  const imagePath = path.resolve('src/public/images/logo-migracion-colombia.png');

  const mailOptions = {
    from: 'citas@migracioncolombia.gov.co',
    to: destinatario,
    subject: asunto,
    html: mensaje,
    attachments: [
      {
        filename: 'logo-migracion-colombia.png',
        path: imagePath,
        cid: 'logoMigracion' // Identificador del CID para usar en el HTML
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });
};