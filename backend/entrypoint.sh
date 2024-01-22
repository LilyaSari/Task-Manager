#!/bin/sh

python manage.py makemigrations base
python manage.py migrate
python manage.py collectstatic --noinput

exec "$@"