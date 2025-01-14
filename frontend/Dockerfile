# Stage 1: Build the Angular app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=development

# Stage 2: Serve the app using Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist/cryptoinsight_frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
