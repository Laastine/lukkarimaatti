# Lukkarimaatti++

[![Build Status](https://travis-ci.org/Laastine/lukkarimaatti.svg?branch=master)](https://travis-ci.org/Laastine/lukkarimaatti)

Hobby project which offers course data in easy to use scheduling tool.<br>
Information is retrieved from [the official LUT teaching schedule info site] (https://uni.lut.fi/fi/web/guest/lukujarjestykset1).

**[https://lukkarimaatti.ltky.fi](https://lukkarimaatti.ltky.fi)**

Compatible with newest Firefox and Chrome

#### History

Originally (late 2012) started as Java+Spring boilerplate + Backbone/jQuery project.<br>
Later converted to pure JavaScript project with Node.js server.<br>
Today it's implemented with universal JavaScript (Node/React/Bacon) using "megablob" architecture.

## Requirements
Node.js 8 LTS

#### Local setup DB on unix based OS
- Install PostgreSQL via homebrew `brew install postgresql` on Mac OS 

Start initialize PostgreSQL database: `npm run init-db`
Start and stop PostgreSQL after initialization `npm run start-db` and `npm run stop-db`

Set up config variables:
```
echo -e export DATABASE_URL=postgresql://localhost:5432/postgres >> .env
echo -e export APP_SECRET=my-very-hard-app-secret >> .env
echo -e export UNI_URL=https://uni.lut.fi/fi/web/guest/lukujarjestykset1 >> .env
source .env
```

#### Build application:
```
npm install
npm run build
```
- For quick browser testing `npm run watch` and `open http://localhost:8080` in your web browser.
- Download course data with HTTP POST to http://localhost:8080/api/update?secret=my-very-hard-app-secret

## Tests

`npm test`
