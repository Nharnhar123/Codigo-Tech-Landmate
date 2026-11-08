FROM node:24-alpine AS build

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

COPY . .
RUN pnpm install --frozen-lockfile

ENV PORT=4173
ENV BASE_PATH=/
RUN pnpm --filter @workspace/landmate run build

FROM nginx:1.27-alpine

COPY artifacts/landmate/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/artifacts/landmate/dist/public /usr/share/nginx/html

EXPOSE 4173
