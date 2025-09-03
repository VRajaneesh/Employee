FROM node:20-alpine

WORKDIR /app
COPY . /app/
RUN npm install --legacy-peer-deps

EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
