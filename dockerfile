# Etapa de construcción
FROM composer:latest as build

COPY . /app/

# Instalar dependencias de PHP
RUN composer install --prefer-dist --no-dev --optimize-autoloader --no-interaction

# Etapa de construcción del frontend
FROM node:latest as frontend

WORKDIR /app

COPY . /app/

# Instalar dependencias de Node.js y compilar el frontend (ajusta según tu estructura)
RUN npm install
RUN npm run build

# Etapa de producción
FROM php:8.1-apache-buster as production

ENV APP_ENV=production
ENV APP_DEBUG=false

RUN docker-php-ext-configure opcache --enable-opcache && \
    docker-php-ext-install pdo pdo_mysql

COPY docker/php/conf.d/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

COPY --from=build /app /var/www/html
COPY --from=frontend /app/public /var/www/html/public

COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY .env.prod /var/www/html/.env

RUN php artisan config:cache && \
    php artisan route:cache && \
    chmod 770 -R /var/www/html/storage/ && \
    chown -R www-data:www-data /var/www/ && \
    a2enmod rewrite
