## ___English___
# First attempts at Yii2, [Pastebin](https://pastebin.com/) analogue, using MongoDB as database.

## Installation
```
  git clone https://github.com/bckr75/coderepo.git
  cd coderepo
```
__Or simply clone this repo in your desired folder, then `cd path/to/this/repo`, and after that:__
```
  composer install
```
__Specify path to running MongoDB server in `config/web.php`__
Find `mongodb` and set `dsn` to (e.g.):
```
  'dsn' => 'mongodb://developer:password@localhost:27017/coderepo',
```
__You need to specify `coderepo` at the end of path to server.__

## Initialize DB
___You may skip this step and use the site as is, creating users and adding code snippets.___

There is some scripts for init in `init` folder.
If your MongoDB server is running locally, just run `init-db.bat` in that folder.
Otherwise, run `initDb.js` commands on the server you want to use.

## Running

### Remote MongoDB server
Run in root folder:
```
  php yii serve
```

### Local MongoDB server
___Warning! You need to put the path to your MongoDB executable files in system's `PATH` environment variable for batch file to work properly.___

As example, my path to MongoDB executable files is:
```
C:\Program Files\MongoDB\Server\3.4\bin
```
__And after that, run__
```
  start.bat
```
## Test user accounts, will work only if you initialized the database.
```
[{
  login: 'firstUser'
  password: 'firstUser'
},{
  login: 'secondUser'
  password: 'secondUser'
}]
```

## ___Русский___

# Первое знакомство с Yii, аналог [Pastebin](https://pastebin.com/)

## Как развернуть
```
  git clone https://github.com/bckr75/coderepo.git
  cd coderepo
```
__Либо просто клонируете в выбранную папку, затем:__
```
  composer install
```
__Вам необходимо указать путь к серверу с mongodb, файл конфигурации находится по пути `config/web.php`__
В нём вам необходимо найти `mongodb` и отредактировать строку `dsn`, например:
```
  'dsn' => 'mongodb://developer:password@localhost:27017/coderepo',
```
__`coderepo` в конце обязателен!__

## Наполнение базы
___Данный шаг можете пропустить и пользоваться сайтом как есть, создавая пользователей и добавляя код.___

В папке `init` находятся скрипты для наполнения.
Если у вас сервер MongoDB запущен на локальную сеть, тогда просто перейдите в эту папку и запустите `init-db.bat`.
Если нет, то нужно выполнить команды из `initDb.js` на сервере, который вы будете использовать.

## Как запустить

### Удалённый сервер MongoDB
Просто выполните в папке
```
  php yii serve
```

### Локальный сервер MongoDB
___Внимание! Для корректной работы пакетных скриптов необходимо добавить путь к исполняемым файлам MongoDB в переменную среды PATH.___

Например, у меня путь такой:
```
C:\Program Files\MongoDB\Server\3.4\bin
```
__Затем__
```
  start.bat
```
## Тестовые аккаунты для входа
__Будут работать только в том случае, если вы делали наполнение базы__
```
[{
  login: 'firstUser'
  password: 'firstUser'
},{
  login: 'secondUser'
  password: 'secondUser'
}]
```
