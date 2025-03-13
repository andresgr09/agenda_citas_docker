const dominiosValidos = [
    'gmail.com', 'migracioncolombia.gov.co', 'yahoo.com', 'yahoo.es', 'outlook.com', 'hotmail.com', 'live.com', 'icloud.com', 'aol.com', 'msn.com',
    'comcast.net', 'me.com', 'bell.net', 'shaw.ca', 'yandex.com', 'protonmail.com', 'zoho.com', 'mail.com',
    'gmx.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.es', 'yahoo.it', 'yahoo.ca', 'yahoo.com.au'
];

export const validarEdad = (fechaNacimiento) => {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();

    if (fechaNac > hoy) {
        return -1; // Indicador de fecha futura
    }

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    const dia = hoy.getDate() - fechaNac.getDate();

    if (mes < 0 || (mes === 0 && dia < 0)) {
        edad--;
    }

    return edad;
};

export const validarCorreos = (correo, confirmarCorreo) => {
    return correo === confirmarCorreo;
};

export const validarDominioCorreo = (correo) => {
    const dominioCorreo = correo.split('@')[1];
    return dominiosValidos.includes(dominioCorreo);
};

export const validateFormData = (data) => {
    const errors = [];
    const edad = validarEdad(data.fechaNacimiento);

    if (edad === -1) {
        errors.push('La fecha de nacimiento no puede ser una fecha futura.');
    } else if (edad < 18) {
        errors.push('Debe estar acompañado por su padre, madre o representante legal al momento de la cita.');
    }

    if (!validarCorreos(data.correo, data.confirmarCorreo)) {
        errors.push('Los correos electrónicos no coinciden.');
    }

    if (!validarDominioCorreo(data.correo)) {
        errors.push('El dominio del correo electrónico no es válido.');
    }

    const nombresRegex = /^[a-zA-Z\s]+$/;
    if (!nombresRegex.test(data.nombres)) {
        errors.push('Los nombres solo pueden contener letras y espacios.');
    }

    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(data.telefono)) {
        errors.push('El teléfono debe contener 10 dígitos y solo números.');
    }

    const numIdentificacionRegex = /^[A-Z0-9]+$/;
    if (!numIdentificacionRegex.test(data.numIdentificacion)) {
        errors.push('El número de identificación solo puede contener letras mayúsculas y números.');
    }
    return errors;
};