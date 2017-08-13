# Easy tests
### How to install

1) cd ~/%project_folder%
2) virtualenv .
3) source bin/activate
4) pip install -r requirements.txt
5) cd ~/%project_folder%/frontend
6) npm install
7) npm start
8) cd ~/%project_folder%/backend
9) python manage.py migrate
10) python manage.py runserver
11) open browser on http://localhost:4200

- optional
12) close frontend server
13) cd ~/%project_folder%/frontend
14) npm run build:prod:aot
15) cd ~/%project_folder%/backend
16) open browser on http://localhost:8000

This project in the initial stage and doesn't have full api for frontend.

You can see this project on https://easy-tests.herokuapp.com
and https://github.com/asiman161/easy-tests
