<h2>Lukkarimaatti RESTful backend</h2>

Hobby project to offer course data easily usable scheduling tool over simple REST interface.

<b>[Test BETA version!](http://54.194.116.194:8085/lukkarimaatti)</b>

<h3>Dependencies:</h3>
Information is retrieved from uni.lut.fi, [the official LUT teaching schedule info site] (https://uni.lut.fi/fi/web/guest/lukujarjestykset).<br>
Maven for building a package.

<h3>Main libraries used:</h3>
* [Spring 3.x](http://spring.io/)
* [Hibernate 3.x](http://hibernate.org/)
* [Jsoup 1.7.x](http://jsoup.org/)
* [Jersey 1.8](https://jersey.java.net/)<br>
and few handy Apache libs

<h3>Build:</h3>
mvn clean package

<h3>REST:</h3>
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

<h3>Copyright and license:</h3>
Copyright &copy; 2013 Mikko Kaistinen, laastine@kapsi.fi

The MIT License
