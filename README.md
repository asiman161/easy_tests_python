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
10) python manage.py createsuperuser
11) change user field(role) from 0 to 3 in db
12) python manage.py runserver
13) open browser on http://localhost:4200

- optional
14) close frontend server
15) cd ~/%project_folder%/frontend
16) npm run build:prod:aot
17) cd ~/%project_folder%/backend
18) open browser on http://localhost:8000

This project in the initial stage and doesn't have full api for frontend.

You can see this project on https://easy-tests.herokuapp.com
and https://github.com/asiman161/easy-tests
