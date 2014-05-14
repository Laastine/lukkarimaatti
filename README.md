<h1>Lukkarimaatti</h1>

Hobby project to offer course data easily usable scheduling tool over simple REST interface.<br>
Information is retrieved from [the official LUT teaching schedule info site] (https://uni.lut.fi/fi/web/guest/lukujarjestykset).<br>

Supported web browser are newest Firefox and Google Chrome.<br>
Plays well enough in older browser, but those aren't officially supported.

<b>[Test dev version!](http://54.194.116.194:8085/lukkarimaatti)</b>

<h3>Back-end</h3>
* [Spring 4.x](http://spring.io/)
* [Hibernate 4.x](http://hibernate.org/)
* [Jsoup 1.7.x](http://jsoup.org/)
* [Jersey 1.8](https://jersey.java.net/)
* [SonarQube 4.1.2](http://www.sonarqube.org/)<br>
 
<h3>Front-end</h3>
* [jQuery 1.10](http://jquery.com/)
* [Bootstrap3](http://getbootstrap.com/)
* [underscore.js 1.6.x](http://underscorejs.org/)
* [Backbone.js 1.1.x](http://backbonejs.org/)
* [typeahead.js 0.10.x](http://twitter.github.io/typeahead.js/)
* [FullCalendar 1.6.x](http://arshaw.com/fullcalendar/)
* [Jasmine 2.0.x](http://jasmine.github.io/)
* [PhantomJS 1.9](http://phantomjs.org/)
* [Karma](http://karma-runner.github.io/)
* [JSHint](http://www.jshint.com/)
* [Bower](http://bower.io/)<br>

<h2>Requirements & Build</h2>
Compiles with Java 8 and Gradle 1.10<br>
Gradle for building a package.<br>
gradle war - for building (release) package<br>
gradle clean runJetty - for quick browser testing

<h3>Testing</h3>
<b>Front end</b> testing with Karma+Jasmine+Node.js.<br>
Requires: Node.js with modules:<br>
karma, karma-cli, karma-junit-reporter karma-phantomjs-launcher, phantomjs<br>
<b>Back end:</b><br>
gradle test - for running unit tests<br>
gradle integrationTest - for running integration tests

<h2>REST interface</h2>
<b>Course code like-search</b><br>
hostname:port/lukkarimaatti/rest/codes/code<br>
e.g. hostname:port/lukkarimaatti/rest/codes/CT

<b>Course name like-search</b><br>
hostname:port/lukkarimaatti/rest/names/name<br>
e.g. hostname:port/lukkarimaatti/rest/names/pattern (provide at least 4 characters)

<b>Course course name search</b><br>
hostname:port/lukkarimaatti/rest/name/courseName<br>
e.g. hostname:port/lukkarimaatti/rest/name/Pattern Recognition

<b>All Course course names search</b><br>
hostname:port/lukkarimaatti/rest/all<br>
e.g. hostname:port/lukkarimaatti/rest/all

<b>Course code search</b><br>
hostname:port/lukkarimaatti/rest/code/code<br>
e.g. hostname:port/lukkarimaatti/rest/code/CT50A6000

<b>Course department search</b><br>
hostname:port/lukkarimaatti/rest/department/<department><br>
e.g. hostname:port/lukkarimaatti/rest/department/tite<br>
(ente/ymte/kete/kote/sate/tite/tuta/kati/mafy/kike/kv)<br>

<b>Exam search</b><br>
hostname:port/lukkarimaatti/lukkarimaatti/rest/examname/<courseName><br>
e.g. hostname:port/lukkarimaatti/rest/examname/mate

<b>Exam like-search</b><br>
hostname:port/lukkarimaatti/lukkarimaatti/rest/examnames/<courseName><br>
e.g. hostname:port/lukkarimaatti/rest/examnames/mikroteoria

<h2>Copyright and license</h2>
Copyright &copy; 2013 Mikko Kaistinen, laastine@kapsi.fi

The MIT License
