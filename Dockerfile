FROM node:22.13.0-alpine AS build

WORKDIR /app

COPY package*.json ./

# in case if a certificate is needed for internet connection
COPY Unified_State_Internet_Access_Gateway.cer /app/kaguya.cer

# in case if a certificate is needed for internet connection
ENV NODE_EXTRA_CA_CERTS=/app/kaguya.cer

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
