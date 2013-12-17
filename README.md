Lukkarimaatti RESTful backend

Hobby project to offer course data to lukkarimaatti frontend.

Usage:
Course code search
<hostname:port>/lukkarimaatti/rest/codes/<code>

Course department search
<hostname:port>/lukkarimaatti/rest/department/<department>
(ente/ymte/kete/kote/sate/tite/tuta/kati/mafy/kike/kv)

Course course name search
<hostname:port>/lukkarimaatti/rest/name/<courseName>

Course code search
<hostname:port>/lukkarimaatti/rest/code/<code>

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

Copyright and license

Copyright (c) 2013 Mikko Kaistinen, laastine@kapsi.fi

The MIT License
