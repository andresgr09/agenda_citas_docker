import CitaAgendada from '../models/citasagendadasModel.js';
import CitaDisponible from '../models/citasdisponiblesModel.js';
import moment from 'moment-timezone';
import jwt from 'jsonwebtoken';

export const confirmarCita = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, 'tu_secreto');
        const { citaId, tipoDoc, nombres, numIdentificacion, fechaNacimiento, genero, correo, telefono, ciudad, tramiteSeleccionado, fecha_cita, direccion } = decoded;

        const citaSeleccionada = await CitaDisponible.findOne({ where: { id_cita_dispo: citaId } });

        if (!citaSeleccionada) {
            return res.status(404).send(`
                <html>
                    <body>
                        <div id="modal" style="display: block; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);">
                            <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">
                                <img src="/citas/images/logo-migracion-colombia.png" alt="Logo" style="width: 250px; display: block; margin: 0 auto;">
                                <h1 style="color: red; text-align: center;">Cita no encontrada</h1>
                                <button onclick="window.close()" style="display: block; margin: 20px auto; padding: 10px 20px; background-color: #f44336; color: white; border: none; cursor: pointer;">Cerrar ventana</button>
                            </div>
                        </div>
                    </body>
                </html>
            `);
        }

        // Verificar si el enlace ha expirado (5 minutos)
        const fechaCreacion = moment(citaSeleccionada.fecha_creacion);
        const ahora = moment();
        const diferenciaMinutos = ahora.diff(fechaCreacion, 'minutes');

        if (diferenciaMinutos > 5) {
            return res.status(400).send(`
                <html>
                    <body>
                        <div id="modal" style="display: block; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);">
                            <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">
                                <img src="/citas/images/logo-migracion-colombia.png" alt="Logo" style="width: 250px; display: block; margin: 0 auto;">
                                <h1 style="color: red; text-align: center;">El enlace de confirmación ha expirado.</h1>
                                <button onclick="window.close()" style="display: block; margin: 20px auto; padding: 10px 20px; background-color: #f44336; color: white; border: none; cursor: pointer;">Cerrar ventana</button>
                            </div>
                        </div>
                    </body>
                </html>
            `);
        }

        // Verificar si la cita ya ha sido confirmada con el mismo id_cita_dispo_fk
        const citaExistente = await CitaAgendada.findOne({ 
            where: { 
                id_cita_dispo_fk: citaSeleccionada.id_cita_dispo, 
                estado_agenda: 'confirmada'
            } 
        });

        if (citaExistente) {
            const fechaSolicitudExistente = moment(citaExistente.fecha_solicitud).format('YYYY-MM-DD');
            const fechaSolicitudActual = moment().format('YYYY-MM-DD');

            if (fechaSolicitudExistente === fechaSolicitudActual) {
                return res.status(400).send(`
                    <html>
                        <body>
                            <div id="modal" style="display: block; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);">
                                <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">
                                    <img src="/citas/images/logo-migracion-colombia.png" alt="Logo" style="width: 250px; display: block; margin: 0 auto;">
                                    <h1 style="color: red; text-align: center;">Esta cita ya fue confirmada, intente nuevamente.
                                Nota: Recuerde que solo podrá tener una cita programada por día para el mismo trámite en la misma o diferente ciudad.</h1>
                                    <button onclick="window.close()" style="display: block; margin: 20px auto; padding: 10px 20px; background-color: #f44336; color: white; border: none; cursor: pointer;">Cerrar ventana</button>
                                </div>
                            </div>
                        </body>
                    </html>
                `);
            }
        }

        // Verificar si la cita en `CitaDisponible` está en "no disponible"
        if (citaSeleccionada.estado_agenda === 'no disponible') {
            return res.status(400).send(`
                <html>
                    <body>
                        <div id="modal" style="display: block; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);">
                            <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">
                                <img src="/citas/images/logo-migracion-colombia.png" alt="Logo" style="width: 250px; display: block; margin: 0 auto;">
                                <h1 style="color: red; text-align: center;">Esta cita ya ha sido agendada. Intente con otra hora o fecha.</h1>
                                <button onclick="window.close()" style="display: block; margin: 20px auto; padding: 10px 20px; background-color: #f44336; color: white; border: none; cursor: pointer;">Cerrar ventana</button>
                            </div>
                        </div>
                    </body>
                </html>
            `);
        }

        // Verificar si ya existe una cita confirmada para el mismo día
        const fechaCitaSeleccionada = moment(citaSeleccionada.fecha_cita).format('YYYY-MM-DD');
        const citaConfirmadaMismoDia = await CitaAgendada.findOne({
            where: {
                documento: numIdentificacion,
                fecha_cita: fechaCitaSeleccionada,
                tipo_documento: tipoDoc,
                estado_agenda: 'confirmada'
            }
        });

        if (citaConfirmadaMismoDia) {
            return res.status(400).send(`
                <html>
                    <body>
                        <div id="modal" style="display: block; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);">
                            <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">
                                <img src="/citas/images/logo-migracion-colombia.png" alt="Logo" style="width: 250px; display: block; margin: 0 auto;">
                                <h1 style="color: red; text-align: center;">Ya tiene una cita confirmada para este día.</h1>
                                <button onclick="window.close()" style="display: block; margin: 20px auto; padding: 10px 20px; background-color: #f44336; color: white; border: none; cursor: pointer;">Cerrar ventana</button>
                            </div>
                        </div>
                    </body>
                </html>
            `);
        }

        // Obtener la fecha y hora actual y restar 5 horas
        const fechaSolicitud = moment().subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss');

        // Registrar la cita en CitasAgendadas
        const nuevaCita = await CitaAgendada.create({
            fecha_solicitud: fechaSolicitud,
            fecha_cita: citaSeleccionada.fecha_cita,
            hora_cita_inicio: citaSeleccionada.hora_cita_i,
            hora_cita_fin: citaSeleccionada.hora_cita_f,
            documento: numIdentificacion,
            nombres,
            tipo_documento: tipoDoc,
            genero,
            correo,
            telefono,
            fecha_nacimiento: fechaNacimiento,
            cita_sede: ciudad,
            cita_tramite: tramiteSeleccionado,
            direccion,
            estado_agenda: 'confirmada',
            id_cita_dispo_fk: citaSeleccionada.id_cita_dispo // Guardar el id_cita_dispo en id_cita_dispo_fk
        });

        // console.log(`Cita agendada con id_cita_dispo_fk: ${nuevaCita.id_cita_dispo_fk}`);

        // Obtener el radicado de la cita agendada
        const citaAgendada = await CitaAgendada.findOne({ where: { id_cita: nuevaCita.id_cita } });
        const radicado = citaAgendada ? citaAgendada.radicado : 'N/A';

        // Cambiar el estado de la cita disponible a "no disponible"
        citaSeleccionada.estado_agenda = 'no disponible';
        await citaSeleccionada.save();

        return res.status(200).send(`
            <html>
                <body>
                    <div id="modal" style="display: block; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);">
                        <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">
                            <img src="/citas/images/logo-migracion-colombia.png" alt="Logo" style="width: 250px; display: block; margin: 0 auto;">
                            <h1 style="color: green; text-align: center;">Cita confirmada</h1>
                            <p style="text-align: center;">Radicado: ${radicado}</p>
                            <button onclick="window.close()" style="display: block; margin: 20px auto; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">Cerrar ventana</button>
                        </div>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error al confirmar la cita:', error);
        return res.status(500).send(`
            <html>
                <body>
                    <div id="modal" style="display: block; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);">
                        <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">
                            <img src="/citas/images/logo-migracion-colombia.png" alt="Logo" style="width: 250px; display: block; margin: 0 auto;">
                            <h1 style="color: red; text-align: center;">Error al confirmar la cita</h1>
                            <button onclick="window.close()" style="display: block; margin: 20px auto; padding: 10px 20px; background-color: #f44336; color: white; border: none; cursor: pointer;">Cerrar ventana</button>
                        </div>
                    </div>
                </body>
            </html>
        `);
    }
};