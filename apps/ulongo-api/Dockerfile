# ETAPA 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Compila apenas a API Core (e suas dependências)
RUN npx nx build api-core --prod

# ETAPA 2: Runner (Imagem leve)
FROM node:18-alpine
WORKDIR /app
# Instalar dependências de produção apenas
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar o build da etapa anterior
COPY --from=builder /app/dist/apps/api-core ./dist
COPY --from=builder /app/prisma ./prisma

# Variáveis de Ambiente Padrão
ENV NODE_ENV=production
EXPOSE 3000

# Script de inicialização (Roda migrações antes de iniciar)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
