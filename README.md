<h1>Lukkarimaatti RESTful backend</h1>

Hobby project to offer course data easily usable scheduling tool over simple REST interface.<br>
Information is retrieved from [the official LUT teaching schedule info site] (https://uni.lut.fi/fi/web/guest/lukujarjestykset).<br>

<b>[Test beta version!](http://54.194.116.194:8085/lukkarimaatti)</b>

<h3>Back-end</h3>
* [Spring 4.x](http://spring.io/)
* [Hibernate 4.x](http://hibernate.org/)
* [Jsoup 1.7.x](http://jsoup.org/)
* [Jersey 1.8](https://jersey.java.net/)
* [SonarQube 4.1.2](http://www.sonarqube.org/)<br>
 
<h3>Front-end</h3>
* [jQuery](http://jquery.com/)
* [underscore.js](http://underscorejs.org/)
* [typeahead.js](http://twitter.github.io/typeahead.js/)
* [require.js](http://requirejs.org/)
* [JSLint](http://www.jslint.com/)
* [Bower](http://bower.io/)<br>

<h2>Requirements & Build</h2>
Requires Java 8 and Maven 3.x.<br>
Maven for building a package.<br>
mvn clean package

<h2>REST</h2>
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

<h2>Copyright and license</h2>
Copyright &copy; 2013 Mikko Kaistinen, laastine@kapsi.fi

The MIT License
