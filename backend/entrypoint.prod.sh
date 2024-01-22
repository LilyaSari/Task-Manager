#!/bin/sh

python manage.py makemigrations base
python manage.py migrate --noinput
python manage.py collectstatic --no-input

exec "$@"