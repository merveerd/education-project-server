FROM node:10.11.0
WORKDIR /app
COPY package.json /app
RUN npm uninstall
RUN npm install
RUN npm uninstall bcrypt
RUN npm rebuild bcrypt --build-from-source 
COPY . /app
COPY wait-for-it.sh /app
RUN chmod +x .
CMD ["npm", "start"]
