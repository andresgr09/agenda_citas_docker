import { enviarCorreoConfirmacion } from '../controllers/mailer.js';
import moment from 'moment-timezone';
import fs from 'fs';

export const enviarCorreoCita = async (nombres, fecha_cita, citaSeleccionada, direccion, ciudad, tramiteSeleccionado, citaId, tipoDoc, numIdentificacion, fechaNacimiento, genero, correo, telefono) => {
    const asunto = 'CONFIRMACIÓN DE CITA - MIGRACIÓN COLOMBIA';

  
    const mensaje = `
    <p>
        <img src="cid:logoMigracion" alt="Logo Migración Colombia" style="width:100%; max-width:250px; display:block; margin:0 auto;">
    </p>


        
        <p>Estimado/a ${nombres},</p>
        <p>Ha recibido este mensaje con la información preliminar de su cita. Para completar su agendamiento y obtener el radicado correspondiente, es necesario que confirme la cita seleccionando la opción correspondiente en este correo.</p>
        <p>Una vez confirmada, se generará un mensaje pop-up con el número de radicado. En caso de no realizar la confirmación, la cita no quedará programada.</p>
        <p>Le recomendamos confirmar su cita a la mayor brevedad posible.</p>
        <p>A continuación, encontrará los detalles de la cita pendiente de confirmación:</p>
        <p><strong>Datos de la cita:</strong></p>
        <ul>
            <li>Trámite: ${tramiteSeleccionado}</li>
            <li>Centro facilitador: ${ciudad} / ${direccion}</li>
            <li>Fecha y hora: ${moment(fecha_cita).format('dddd, D [de] MMMM [de] YYYY')} ${citaSeleccionada.hora_cita_i}</li>
        </ul>
        <p><strong>Datos registrados:</strong></p>
        <ul>
            <li>Nombre completo: ${nombres}</li>
            <li>Tipo de documento: ${tipoDoc}</li>
            <li>Documento de identificación: ${numIdentificacion}</li>
            <li>Correo: ${correo}</li>
            <li>Teléfono: ${telefono}</li>
        </ul>
        <p><strong>¡IMPORTANTE!</strong></p>
        <p>Es indispensable diligenciar el Formulario Único de Trámites (FUT), ya que este será requerido al ingresar al Centro Facilitador de Servicios Migratorios. (No aplica para citas de Proceso Administrativo Persona Natural o Jurídica ni para Atención SIRE). Para completar el formulario, haga clic <a href="https://apps.migracioncolombia.gov.co/registro/public/formularioRegistro.jsf">aquí</a></p>
        <p>Por favor, recuerde presentarse con 15 minutos de anticipación.</p>
        <p>Consulte los requisitos del trámite a realizar <a href="https://www.migracioncolombia.gov.co/tramites/tramites-migracion-colombia">aquí</a></p>
        <p>NOTA: Recuerde que la cita programada debe coincidir con el trámite que va a realizar. De lo contrario, no podrá ser atendido.</p>
        <p><strong>Si desea CONFIRMAR SU CITA, haga clic <a href="http://localhost:8080/api/confirmar-cita/${citaId}?tipoDoc=${tipoDoc}&nombres=${nombres}&numIdentificacion=${numIdentificacion}&fechaNacimiento=${fechaNacimiento}&genero=${genero}&correo=${correo}&telefono=${telefono}&ciudad=${ciudad}&tramite=${tramiteSeleccionado}&fecha_cita=${fecha_cita}&direccion=${direccion}">AQUÍ</a></strong></p>
    `;

    await enviarCorreoConfirmacion(correo, asunto, mensaje);
};


// <p>Le confirmamos que su cita está programada para el ${moment(fecha_cita).format('dddd, D [de] MMMM [de] YYYY')} a las ${citaSeleccionada.hora_cita_i}. A continuación, le recordamos los detalles:</p>
//         <p><strong>Fecha y hora:</strong> ${moment(fecha_cita).format('D [de] MMMM [de] YYYY')} a las ${citaSeleccionada.hora_cita_i}</p>
//         <p><strong>Dirección de la sede:</strong> ${direccion}, ${ciudad}</p>
//         <p><strong>Motivo de la cita:</strong> ${tramiteSeleccionado}</p>
//         <p>Para confirmar su cita, por favor haga clic en el siguiente enlace:</p>
//         <p><a href="http://localhost:8080/api/confirmar-cita/${citaId}?tipoDoc=${tipoDoc}&nombres=${nombres}&numIdentificacion=${numIdentificacion}&fechaNacimiento=${fechaNacimiento}&genero=${genero}&correo=${correo}&telefono=${telefono}&ciudad=${ciudad}&tramite=${tramiteSeleccionado}&fecha_cita=${fecha_cita}&direccion=${direccion}">Confirmar Cita</a></p>
//         <p>NOTA: Recuerde que debe confirmar su cita en los próximos 5 minutos. De no hacerlo, tendrá que realizar un nuevo agendamiento.</p>
//         <p>Saludos cordiales,<br>MIGRACIÓN COLOMBIA MINISTERIO DE RELACIONES EXTERIORES</p>
//         <hr>
      