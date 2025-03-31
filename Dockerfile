# 1. Usar una imagen base ligera de Node.js
FROM node:18-alpine

#2. Establecer el directorio de trabajo dentro del contenedor 
WORKDIR /app

#3. Copiar archivos del proyecto al contenedor 
COPY package*.json ./
RUN npm install && apk add --no-cache curl

#4. Copiar el resto del c�digo fuente de la MV al CONTENEDOR
COPY . . 

#5. Exponer el puerto en el que correr� la app
EXPOSE 3000

#6. Commando para ejecutar la aplicaci�n
CMD ["node", "server.js"]
