FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/

# Install dependencies
RUN npm install -g yarn && yarn install

# Copy source code
COPY backend backend/
COPY frontend frontend/

# Build backend
WORKDIR /app/backend
RUN yarn build

# Build frontend
WORKDIR /app/frontend
RUN yarn build

# Final stage
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=0 /app/backend/dist /app/backend/dist
COPY --from=0 /app/backend/node_modules /app/backend/node_modules
COPY --from=0 /app/backend/package.json /app/backend/

COPY --from=0 /app/frontend/dist /app/frontend/dist

# Expose port
EXPOSE 3000

WORKDIR /app/backend

CMD ["node", "dist/main.js"]
