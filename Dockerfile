# Use the official Node.js LTS image
FROM node:22-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build


# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js server
CMD ["sh", "/app/start.sh"]
