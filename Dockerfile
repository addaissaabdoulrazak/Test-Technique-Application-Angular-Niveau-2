# Étape 1 : Construire l'application Angular
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --configuration production

# Étape 2 : Servir l’application avec Nginx
FROM nginx:alpine
COPY --from=build /app/dist/employee-app /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]