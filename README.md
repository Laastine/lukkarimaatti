<h2>Lukkarimaatti RESTful backend</h2>

Hobby project to offer course data to lukkarimaatti frontend.


<h3>Usage:</h3>
<b>Course code like-search</b><br>
hostname:port/lukkarimaatti/rest/codes/code<br>
e.g. hostname:port/lukkarimaatti/rest/codes/CT

<b>Course code search</b><br>
hostname:port/lukkarimaatti/rest/code/code<br>
e.g. hostname:port/lukkarimaatti/rest/code/CT50A6000

<b>Course department search</b><br>
hostname:port/lukkarimaatti/rest/department/<department><br>
e.g. hostname:port/lukkarimaatti/rest/department/tite<br>
(ente/ymte/kete/kote/sate/tite/tuta/kati/mafy/kike/kv)

<b>Course course name search</b><br>
hostname:port/lukkarimaatti/rest/name/courseName<br>
e.g. hostname:port/lukkarimaatti/rest/courseName/Pattern Recognition


<h3>Dependencies:</h3>
Information is retrieved from uni.lut.fi, the official LUT teaching schedule info site.
Maven for building a package.


<h3>Libraries used:</h3>
Spring 3.x,
JSTL 1.2,
Hibernate 3.x,
Quartz 1.8.x,
Jsoup 1.7.x,
Jersey 1.8
and few handy Apache libs


<h3>Build:</h3>
mvn clean package


<h3>Copyright and license:</h3>

Copyright &copy; 2013 Mikko Kaistinen, laastine@kapsi.fi

The MIT License
