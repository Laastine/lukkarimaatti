Lukkarimaatti RESTful backend

Hobby project to offer course data to lukkarimaatti frontend.


Usage:
Course code like-search
hostname:port/lukkarimaatti/rest/codes/code
e.g. hostname:port/lukkarimaatti/rest/codes/CT

Course code search
hostname:port/lukkarimaatti/rest/code/code
e.g. hostname:port/lukkarimaatti/code/code/CT50A6000

Course department search
hostname:port/lukkarimaatti/rest/department/<department>
e.g. hostname:port/lukkarimaatti/rest/department/tite
(ente/ymte/kete/kote/sate/tite/tuta/kati/mafy/kike/kv)

Course course name search
hostname:port/lukkarimaatti/rest/name/courseName
e.g. hostname:port/lukkarimaatti/rest/courseName/Pattern Recognition


Dependencies:
Information is retrieved from uni.lut.fi, the official LUT teaching schedule info site.
Maven for building a package.


Libraries used:
Spring 3.x,
JSTL 1.2,
Hibernate 3.x,
Quartz 1.8.x,
Jsoup 1.7.x,
Jersey 1.8
and few handy Apache libs


Build:
mvn clean package


Copyright and license:

Copyright (c) 2013 Mikko Kaistinen, laastine@kapsi.fi

The MIT License
