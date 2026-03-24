FROM node:20-alpine

WORKDIR /app

# Install Paperclip via npx (or clone and build)
RUN npm install -g paperclipai

EXPOSE 3100

CMD ["npx", "paperclipai", "start", "--port", "3100"]
