<h1>Lukkarimaatti++</h1>

Hobby project to offer course data easily usable scheduling tool over simple REST interface.<br>
Information is retrieved from [the official LUT teaching schedule info site] (https://uni.lut.fi/fi/web/guest/lukujarjestykset).<br>

Supported web browser are newest Firefox and Google Chrome.<br>
Plays well enough in older browser, but those aren't officially supported.

Compatible with IE9+ and newest Firefox and Chrome

<b>[Test dev version!](http://83.136.252.198/lukkarimaatti/)</b>

<h3>Back-end</h3>
* [Spring 4.x](http://spring.io/)
* [Hibernate 4.x](http://hibernate.org/)
* [Jsoup 1.7.x](http://jsoup.org/)
* [Jetty 9](http://www.eclipse.org/jetty/)
* [PostgreSQL 9.1](http://www.postgresql.org/)
* [SonarQube 4.1.2](http://www.sonarqube.org/)<br>
 
<h3>Front-end</h3>
* [jQuery 1.10](http://jquery.com/)
* [Bootstrap 3](http://getbootstrap.com/)
* [underscore.js 1.6.x](http://underscorejs.org/)
* [Backbone.js 1.1.x](http://backbonejs.org/)
* [typeahead.js 0.10.x](http://twitter.github.io/typeahead.js/)
* [FullCalendar 1.6.x](http://arshaw.com/fullcalendar/)
* [Jasmine 2.0.x](http://jasmine.github.io/)
* [PhantomJS 1.9](http://phantomjs.org/)
* [RequireJS](http://requirejs.org/)
* [Karma](http://karma-runner.github.io/)
* [JSHint](http://www.jshint.com/)
* [Bower](http://bower.io/)<br>

<h2>Requirements & Build</h2>
Compiles with Java 8 and Gradle 1.10<br>
Gradle for building a package.<br>
<i>gradle war</i> - for building (release) package<br>
<i>gradle clean jettyRun</i> - for quick browser testing

<h3>Testing</h3>
<b>Front end</b> testing with Karma+Jasmine+Node.js.<br>
Requires: Node.js with modules:<br>
karma, karma-cli, karma-junit-reporter karma-phantomjs-launcher, phantomjs<br>
<i>karma start karma.conf.js</i><br>
<b>Back end:</b><br>
<i>gradle test</i> - for running unit tests<br>
<i>gradle integrationTest</i> - for running integration tests

<h2>Copyright and license</h2>
Copyright &copy; 2013 Mikko Kaistinen, mikko.kaistinen@kapsi.fi

The MIT License
