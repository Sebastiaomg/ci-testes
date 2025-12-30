FROM node:24.12.0-alpine AS build

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN corepack prepare pnpm --activate
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

FROM node:24.12.0-alpine

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json ./package.json
RUN corepack enable \
 && corepack prepare pnpm --activate
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD ["sh", "-c", "exec pnpm run start"]