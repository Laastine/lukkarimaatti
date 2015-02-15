<h1>Lukkarimaatti++</h1>

Hobby project to offer course data easily usable scheduling tool over simple REST interface.<br>
Information is retrieved from [the official LUT teaching schedule info site] (https://uni.lut.fi/fi/web/guest/lukujarjestykset).<br>

<b>[Test beta version!](http://83.136.252.198/lukkarimaatti/)</b>

Compatible with IE10+ and newest Firefox and Chrome


<h5>Back-end</h5>
* [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [Spring 4.x](http://spring.io/)
* [Hibernate 4.x](http://hibernate.org/)
* [Jsoup 1.7.x](http://jsoup.org/)
* [Jetty 9](http://www.eclipse.org/jetty/)
* [PostgreSQL 9.3](http://www.postgresql.org/)
* [Selenium](http://www.seleniumhq.org/)<br>
 
<h5>Front-end</h5>
* [jQuery 2.1.1](http://jquery.com/)
* [Bootstrap 3](http://getbootstrap.com/)
* [underscore.js 1.6.x](http://underscorejs.org/)
* [Backbone.js 1.1.x](http://backbonejs.org/)
* [typeahead.js 0.10.x](http://twitter.github.io/typeahead.js/)
* [FullCalendar 2.0.2](http://arshaw.com/fullcalendar/)
* [RequireJS](http://requirejs.org/)
* [JSHint](http://www.jshint.com/)
* [Bower](http://bower.io/)<br>

<h2>Requirements & Build</h2>
Compiles with Java 8 and Gradle 1.10<br>
Gradle for building a package.<br>
<i>bower install</i> - for JS stuff<br>
<i>r.js -o build.js</i> - Compile JS to bundle<br>
<i>gradle war</i> - for building (release) package<br>
For quick browser testing run EmbeddedJetty class
and open http://localhost/lukkarimaatti in your web browser

<h3>Testing</h3>
<i>gradle test</i> - for running unit tests and selenium E2E tests<br>

<h2>Copyright and license</h2>
Copyright &copy; 2013 Mikko Kaistinen, mikko.kaistinen@kapsi.fi
