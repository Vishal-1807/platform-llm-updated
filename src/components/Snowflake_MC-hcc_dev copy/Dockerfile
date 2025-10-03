# Step 1: Build the React app
FROM node:18-alpine AS builder
 
WORKDIR /app
 
COPY package.json package-lock.json ./
RUN npm install
 
COPY . .
#RUN npm run start
 
# Step 2: Serve the app using Nginx
#FROM nginx:alpine
 
# Copy the build output to Nginx's public folder
#COPY --from=builder /app/dist /usr/share/nginx/html
 
# Optional: Replace default Nginx config
# COPY nginx.conf /etc/nginx/nginx.conf
 
EXPOSE 8080
 
#CMD ["nginx", "-g", "daemon off;"]
CMD ["npm", "run", "dev"]