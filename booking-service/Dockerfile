FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3003
ENV MONGO_URI=mongodb+srv://khadijakhalid2557:2QF6L4XfEqNsOz5d@booking-service.4g0igbh.mongodb.net/?retryWrites=true&w=majority&appName=booking-service
EXPOSE 3003
CMD ["node", "server.js"]