# Lukkarimaatti++

[![CircleCI](https://circleci.com/bb/laastine-ci/lukkarimaatti/tree/master.svg?style=svg&circle-token=7b36babd077a7ee08258f02d55ad7d2aa4b35eca)](https://circleci.com/bb/laastine-ci/lukkarimaatti/tree/master)

Hobby project which offers course data in easy to use scheduling tool.<br>
Information is retrieved from [the official LUT teaching schedule info site] (https://uni.lut.fi/fi/web/guest/lukujarjestykset1).

**Lukkarimaatti is currently hosted by LTKY, please contact LTKY's admin in case of problems.**

**[https://lukkarimaatti.ltky.fi](https://lukkarimaatti.ltky.fi)**

Compatible with newest Firefox and Chrome

#### History

Originally (late 2012) started as Java+Spring boilerplate + Backbone/jQuery project.<br>
Later converted to pure JavaScript project with Node.js server.<br>
Today it's implemented with universal JavaScript (Node/React/Bacon) using "megablob" architecture.

## Requirements
Node.js 6 LTS

#### Local setup DB on OSX
- OSX users use virtualbox or any other virtual machine provider for Docker
- Linux users can skip docker-machine commands

Install docker-machine and docker:
`brew install docker docker-machine`

Create lukkarimaatti virtualbox image:
`docker-machine create --driver virtualbox lukkarimaatti`

Add env variable to your shell where you run docker cmds:
`eval "$(docker-machine env lukkarimaatti)"`

Install postgres DB to docker:
 `docker pull postgres:9.6`

Start postgres in docker: `docker run --name lukkarimaatti-db -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -d postgres:9.6`

Set up config variables:
```
echo -e export DATABASE_URL=postgresql://postgres:postgres@`docker-machine ip lukkarimaatti`:5432/postgres >> .env
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
- Download course data with http://localhost:8080/api/update?secret=my-very-hard-app-secret
- Shutdown docker with `docker-machine stop lukkarimaatti`
- Start docker postgres `docker-machine start lukkarimaatti ; eval "$(docker-machine env lukkarimaatti)" ; docker start lukkarimaatti-db` after initial setup is done

## Tests

`npm test`
