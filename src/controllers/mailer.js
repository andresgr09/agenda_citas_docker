import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'felipecano09@gmail.com',
      pass: 'toor cxxc kcdr xrwl'
    }
  });
  

export const enviarCorreoConfirmacion = (destinatario, asunto, mensaje) => {
  const mailOptions = {
    from: 'aplicaciones@migracioncolombia.gov.co',
    to: destinatario,
    subject: asunto,
    html: mensaje,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });
};
