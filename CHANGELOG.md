Changelog
=========

Version numbering:

`<major>.<minor>.<patch>`

---
### 1.5.9, July 29, 2019
* Update project dependencies
* Update Node.js and npm versions
* Replace local docker database with locally installed PostgreSQL
* Replace winston logger with custom implementation

### 1.5.8, June 9, 2019
* Update project dependencies
* Update Node.js and npm versions
* Update course parser for fall 2019

### 1.5.7, February 7, 2018
* Update project dependencies
* Update Node.js version

### 1.5.6, December 30, 2017
* Improve DB API, handles single quotes like `Master's Thesis and Seminar`
* Display department in search result list
* Add semester filtering to catalog page

### 1.5.5, October 6, 2017
* Sort courses alphabetically in catalog view
* Fix `FV-` prefixed course selection bug

### 1.5.4, September 2, 2017
* Show course events on weekends

### 1.5.3, September 2, 2017
* Implement unselect course in catalog page
* Update catalog page styles
* Refine DB API

### 1.5.2, August 1, 2017
* Fix mobile layout bug
* Handle course code suffixes (tite/tuta/kati) properly. Fixes page reload with e.g. `LM10A2000 (tite)`

### 1.5.1, August 31, 2017
* Add language lab course codes. Fixes reloading bug when language lab course is selected.

### 1.5.0, August 30, 2017
* Language lab courses added without distinct course codes

### 1.4.5, August 28, 2017
* Fix single course event removal by mouse click bug

### 1.4.4, August 21, 2017
* Add HSTS and X-Frame-Options: DENY HTTP header

### 1.4.3, August 7, 2017
* Fix browser history (back/forward) issue

### 1.4.3 August 5, 2017
* Replace react-router with universal-router
* Update nodejs version

### 1.4.2 July 13, 2017
* Clean url params if `courses` value is not found

### 1.4.1 July 9, 2017
* Use work week default view instead whole week (monday-sunday)

### 1.4.0 July 2, 2017
* New course data parsing logic

### 1.3.8 March 11, 2017
* Improve mobile layout on timetable view

### 1.3.7 March 5, 2017
* Add email content and address validation

### 1.3.6 March 2, 2017
* Change database library

### 1.3.5 February 11, 2017
* Add HTTPS support
* Add browser error logging
* Add google analytics

### 1.3.4 January 8, 2017
* Update calendar styles

### 1.3.3 November 19, 2016
* Make course catalog page more mobile friendly
* Add CSS prefixes

### 1.3.2 October 29, 2016
* Update Node and dependencies
* Remove server request with no courses selected

### 1.3.1 August 8, 2016
* Fix KIKE course mouse selection

### 1.3.0 August 8, 2016
* Update architecture
* Add course catalog page
* New link format (old links are deprecated)

### 1.2.8 April 9, 2016
* React calendar component added to sources to fix server-side rendering problem

### 1.2.7 March 29, 2016
* Exercise removal added

### 1.2.6 March 28, 2016
* Winston logger added

### 1.2.5 March 9, 2016
* DB API refactor
* Bluebird updated to v3.x

### 1.2.4 February 20, 2016
* Simultaneous events render better
* Default font changed
* Agenda view added

### 1.2.3 February 19, 2016
* More mobile friendly layout

### 1.2.2 February 18, 2016
* Fix case issue

### 1.2.1 January 13, 2016
* Ajax spinner added to mail sending

### 1.2.0 January 12, 2016

* Dropped old IE-support https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support
* Front-end rewrite with react/bacon

### 1.1.0 September 25, 2015

* Node.js backend
* Project migrated to Heroku platform

### 1.0.4 September 20, 2015

* Typeahead search hacked back for autocompletion

### 1.0.3 September 6, 2015

* Kote, kete, mafy and kike HTML parsing fixed due to teacher column

### 1.0.2 August 30, 2015

* New languagelab parsing due HTML format change
* Year detection improved

### 1.0.1 July 19, 2015

* Selenium out, mocha-phantomjs in
* Courses with groupname are now returned correctly via url params

### 1.0.0 July 18, 2015

* Javascript converted to CommonJS style
* Using Gulp to build JS
* Typeahead replaced by Select2

### 0.9.8 July 5, 2015

* Encoding fix
* period entry removed
* new API method added rest/course/?name=

### 0.9.7 April 5, 2015

* Front-end refactor

### 0.9.6 April 4, 2015

* Language lab courses separated according group letter

### 0.9.5 March 5, 2015

* Parsing process update after uni.lut.fi update

### 0.9.4 March 3, 2015

* Selenium version update
* Skip update process if uni.lut.fi is down
* CHANGELOG file added
