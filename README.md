<h1>Lukkarimaatti++</h1>

Hobby project which offers course data in easy to use scheduling tool.<br>
Information is retrieved from [the official LUT teaching schedule info site] (https://uni.lut.fi/fi/web/guest/lukujarjestykset1).<br>

<b>[http://lukkarimaatti.herokuapp.com/](http://lukkarimaatti.herokuapp.com/)</b>

Compatible with IE10+ and newest Firefox and Chrome


<h5>Ingredients</h5>
* [Node.js](https://nodejs.org)
* [Express](http://expressjs.com/)
* [Bluebird](https://github.com/petkaantonov/bluebird)
* [Ramda](http://ramdajs.com/)
* [cheerio](https://github.com/cheeriojs/cheerio)
* [jQuery 2.1.x](http://jquery.com/)
* [Bootstrap 3.3.x](http://getbootstrap.com/)
* [underscore.js 1.8.x](http://underscorejs.org/)
* [Backbone.js 1.2.x](http://backbonejs.org/)
* [Typeahead 0.11.1](https://twitter.github.io/typeahead.js/)
* [FullCalendar 2.3.2](http://arshaw.com/fullcalendar/)
* [Moment.js 2.10.x](http://momentjs.com/)
* [Handlebars 3.0.x](http://handlebarsjs.com/)
* [Mocha](http://mochajs.org/)
* [PhantomJS](http://phantomjs.org/)
* [Browserify](http://browserify.org/)<br>

<h2>Requirements & Build</h2>
Node.js 0.12.7 or newer<br>

Build application:
```
npm install
cd public
npm install
npm run build
```
For quick browser testing ```npm run start-dev```
and open http://localhost:8080/ in your web browser.

<h3>Testing</h3>
Run server
```npm run start-dev```
```
on other shell run: npm run test
```
<h2>Copyright and license</h2>
Copyright &copy; 2013 Mikko Kaistinen, mikko.kaistinen@kapsi.fi
