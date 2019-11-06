# movie-api
Test task on node for movies. 


Инструкция:

Склонировать репозиторий.
В корневой папке movie-api создать файл <.env>
==============================================

В файле нужны 2 параметра (мой пароль от атласа и Ваш апи ключ)
=============================================================

BD_PASS=sahar123

API_KEY=cb4abcaa383d8dcc239745f0cbf9f7da

В корневой папке movie-api, ввести команду:
===========================================
npm i

После завершения установки зависимостей, там же запустить скрипт app.js
=======================================================================
node app.js

В консоли должно появиться следующее:
=====================================

Server for a blog started on port  5000

DB connected...

Genres restarted


Сервер запущен и работает!
==========================

api роуты для теста: (в случае если сервер запущен на localhost:5000)

localhost:5000/movies/id/:id (для киношек по id)

localhost:5000/movies/ (небольшая веб форма, для теста фильтров и сотрировок)

localhost:5000/movies/genre/:id (роут с подсчетом рейтинга для жанра)
