<h1>Lukkarimaatti++</h1>

Hobby project to offer course data easily usable scheduling tool over simple REST interface.<br>
Information is retrieved from [the official LUT teaching schedule info site] (https://uni.lut.fi/fi/web/guest/lukujarjestykset).<br>

<b>[Test beta version!](http://83.136.252.198/lukkarimaatti/)</b> (Currently on holiday, will be back in fall 2015)

Compatible with IE10+ and newest Firefox and Chrome


<h5>Back-end</h5>
* [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [Spring 4.x](http://spring.io/)
* [Hibernate 4.x](http://hibernate.org/)
* [Jsoup 1.7.x](http://jsoup.org/)
* [Jetty 9](http://www.eclipse.org/jetty/)
* [PostgreSQL 9.1](http://www.postgresql.org/)
 
<h5>Front-end</h5>
* [jQuery 2.1.x](http://jquery.com/)
* [Bootstrap 3.3.x](http://getbootstrap.com/)
* [underscore.js 1.8.x](http://underscorejs.org/)
* [Backbone.js 1.2.x](http://backbonejs.org/)
* [Select2 4.0.0](https://select2.github.io/)
* [FullCalendar 2.3.2](http://arshaw.com/fullcalendar/)
* [Moment.js 2.10.x](http://momentjs.com/)
* [Handlebars 3.0.x](http://handlebarsjs.com/)
* [JSHint](http://www.jshint.com/)
* [Mocha](http://mochajs.org/)
* [PhantomJS](http://phantomjs.org/)
* [Browserify](http://browserify.org/)
* [Gulp](http://gulpjs.com/)<br>

<h2>Requirements & Build</h2>
Compiles with Java 8 and Gradle 1.10<br>
Gradle for building a package.<br>
```
npm install -g gulp - if you don't have it yet
npm install - download JS stuff
gulp - Compile JS & CSS to bundles
gradle war - for building (release) package
```
For quick browser testing run EmbeddedJetty class
and open http://localhost:8080/lukkarimaatti in your web browser

<h3>Testing</h3>
```
gradle test - for running unit tests and mocha tests
```
<h2>Copyright and license</h2>
Copyright &copy; 2013 Mikko Kaistinen, mikko.kaistinen@kapsi.fi
