FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3002
ENV MONGO_URI=mongodb+srv://khadijakhalid2557:ZkIRjS9CAI4XbvLh@carservice.sqnzm6n.mongodb.net/?retryWrites=true&w=majority&appName=CarService
EXPOSE 3002
CMD ["node", "server.js"]