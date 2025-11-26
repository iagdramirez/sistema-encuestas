FROM node:23.7-alpine

# Instalar Bash y otras dependiencias
RUN apk add --no-cache bash tzdata

WORKDIR /app/src

# Copiar archivos de npm
COPY package.json .
COPY package-lock.json .

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Establecer la zona horaria de El Salvador y Host local
ENV TZ=America/El_Salvador HOST=0.0.0.0 FORCE_COLOR=1

# Generar los archivos estáticos para producción
RUN npm run generate

# Iniciar servicio
CMD [ "npm", "start" ]