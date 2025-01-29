# Stage 1: Build the Angular app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=development

# Stage 2: Serve the app and proxy using Nginx
FROM nginx:stable-alpine

# Copy the built Angular app to Nginx's HTML directory
COPY --from=build /app/dist/cryptoinsight_frontend/browser /usr/share/nginx/html

# Copy the Nginx configuration file (proxy + frontend serving)
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
