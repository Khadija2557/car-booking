FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3001
ENV MONGO_URI=mongodb+srv://khadijakhalid2557:S2PzwKZ99VAeBtUb@user-service.rtgv4kf.mongodb.net/?retryWrites=true&w=majority&appName=user-service
EXPOSE 3001
CMD ["node", "server.js"]