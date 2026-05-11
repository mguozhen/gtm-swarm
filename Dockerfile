FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json ./
COPY dashboard/package.json dashboard/pnpm-lock.yaml dashboard/
RUN npm install --omit=dev --no-package-lock --prefix /app && \
    cd /app/dashboard && pnpm install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/dashboard/node_modules dashboard/node_modules
COPY dashboard ./dashboard
RUN cd dashboard && pnpm build

FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dashboard/dist ./dashboard/dist
COPY package.json ./
COPY server ./server
COPY projects ./projects
COPY engines ./engines
COPY templates ./templates
COPY scripts ./scripts
ENV NODE_ENV=production
ENV PORT=8082
EXPOSE 8082
ENTRYPOINT ["/sbin/tini","--"]
CMD ["node","server/index.js"]
