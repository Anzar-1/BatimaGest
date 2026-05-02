#!/bin/bash

# Build the project
echo "Building the project..."
python3 -m pip install -r requirements.txt

echo "Make Migration..."
python3 BatimaGest/manage.py makemigrations --noinput
python3 BatimaGest/manage.py migrate --noinput

echo "Collect Static..."
python3 BatimaGest/manage.py collectstatic --noinput --clear