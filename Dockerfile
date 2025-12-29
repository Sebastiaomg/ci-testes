FROM node:24.12.0-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN corepack prepare pnpm@10.26.2 --activate
RUN pnpm install --frozen-lockfile
COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]

