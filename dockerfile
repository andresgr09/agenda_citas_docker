# Usa una imagen de Node.js basada en Linux
FROM node:18-slim

# Instala netcat-traditional
RUN apt-get update && apt-get install -y netcat-traditional

# Establece la zona horaria
ENV TZ=America/Bogota

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente al contenedor
COPY . .

# Copia el script wait-for-it.sh y dale permisos de ejecución
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Expone el puerto en el que corre el servidor
EXPOSE 3001

# Comando por defecto para ejecutar la aplicación
CMD ["npm", "start"]