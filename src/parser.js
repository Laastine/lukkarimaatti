var cheerio = require('cheerio'),
    fs = require('fs'),
    Promise = require('bluebird'),
    request = require('request'),
    R = require('ramda'),
    config = require('./config'),
    DB = require('./db')

var links = []

module.exports = {
    updateCourseData: function(req, res) {
        console.log('updateCourseData', req.params['secret'])
        if (req.query['secret'] === config.appSecret) {
            DB.cleanTable()
            updateCourseData()
            res.status(200).json({status: 'ok'})
        } else {
            res.status(403).json({error: 'Unauthorized'})
        }
    }
}

var updateCourseData = function() {
    Promise.promisify(request)({url: config.uniUrl, json: true})
        .then(function(res) {
            var $ = cheerio.load(res[1])
            $($(".portlet-body .journal-content-article").children()[2])
                .find('a')
                .each(function() {
                    var link = $(this).attr('href')
                    console.log('link', link)
                    if (link.substring(0, 34) === '/c/document_library/get_file?uuid=') {
                        links.push(link)
                    }
                })
            links.forEach(function(link) {
                parseCourseData(link)
            })
        }).catch(function() {
            console.log('Failed to parse links')
        })
}

function parseCourseData(url) {
    Promise.promisify(request)({url: 'https://uni.lut.fi' + url})
        .then(function(html) {
            var dataBatch = []
            var data = {}
            var $ = cheerio.load(html[1])
            $('table.spreadsheet')
                .each(function() {
                    $(this).find('tr:not(.columnTitles)').map(function() {
                        var courseData = []
                        var tds = $(this).find('td')
                        if (tds.length === 9) {
                            tds.each(function() {
                                courseData.push($(this).text())
                            })
                            var args = parseBasicData(courseData[0])
                            data = {
                                course_code: sanitizeInput(args.code),
                                course_name: sanitizeInput(args.name),
                                week: parseWeeks(courseData[3]),
                                week_day: sanitizeInput(courseData[4]),
                                time_of_day: sanitizeInput(courseData[5]) + '-' + sanitizeInput(courseData[6]),
                                classroom: sanitizeInput(courseData[7]),
                                type: sanitizeInput(args.type),
                                department: getDepartment(args.code),
                                teacher: '',
                                misc: sanitizeInput(courseData[8]),
                                group_name: sanitizeInput(args.group)
                            }
                        } else if (tds.length === 8) {
                            tds.each(function() {
                                courseData.push($(this).text())
                            })
                            var args = parseBasicData(courseData[0])
                            data = {
                                course_code: sanitizeInput(args.code),
                                course_name: sanitizeInput(args.name),
                                week: parseWeeks(courseData[2] || ''),
                                week_day: sanitizeInput(courseData[3]),
                                time_of_day: sanitizeInput(courseData[4]) + '-' + sanitizeInput(courseData[5]),
                                classroom: sanitizeInput(courseData[6]),
                                type: sanitizeInput(args.type),
                                department: getDepartment(args.code),
                                teacher: '',
                                misc: sanitizeInput(courseData[7]),
                                group_name: sanitizeInput(args.group)
                            }
                        }
                        if (data.course_code
                            && data.course_name
                            && data.time_of_day
                            && data.week
                            && data.classroom) {
                            dataBatch.push(data)
                        }
                    })
                })
            if (dataBatch.length > 0) {
                DB.insertCourse(dataBatch)
            }
        }).catch(function(error) {
            console.log('Failed to parse HTML', error)
        })
}

var sanitizeInput = function(input) {
    return input ? input.trim().replace(/(\r\n|\n|\r)/g, '') : ''
}

var getDepartment = function(input) {
    if (input.substring(0, 1) === 'A') {
        return 'kati'
    } else {
        switch (input.substring(0, 2)) {
            case 'BH':
                return 'ente/ymte'
                break;
            case 'BJ':
                return 'kete'
                break;
            case 'FV':
                return 'kike'
                break;
            case 'BH':
                return 'ente/ymte'
                break;
            case 'BK':
                return 'kote'
                break;
            case 'BM':
                return 'mafy'
                break;
            case 'BL':
                return 'sate'
                break;
            case 'CT':
                return 'tite'
                break;
            case 'CS':
                return 'tuta'
                break;
            default:
                return 'UNKNOWN'
        }
    }
}

var parseBasicData = function(course) {
    var nameAndCode = course.split(' - ')
    if (nameAndCode.length < 2) {
        return {
            code: '',
            name: '',
            group: '',
            type: ''
        }
    }
    var nameAndGroup = nameAndCode[1].split('/')
    if (nameAndGroup.length < 2) {
        return {
            code: nameAndCode[0],
            name: nameAndCode[1],
            group: nameAndCode[1].split(': ')[1] || '',
            type: ''
        }
    }
    return {
        code: nameAndCode[0],
        name: nameAndGroup[0],
        group: nameAndCode[1].split(': ')[1] || '',
        type: nameAndGroup[nameAndGroup.length - 1]
    }
}

function parseWeeks(weeks) {
    var weekSequence = []
    if (R.contains('-', weeks)) {
        weeks.match(/[0-9]{1,2}-[0-9]{1,2}/g).map(function(m) {
            return R.range(
                parseInt(m.substring(0, m.indexOf('-')), 10),
                parseInt(m.substring(m.indexOf('-') + 1), 10) + 1
            )
        }).map(function(r) {
            weekSequence = R.concat(weekSequence, r)
        })
    }
    if (R.contains(',', weeks)) {
        weeks.match(/[0-9]+/g).forEach(function(w) {
            var num = parseInt(w, 10)
            if (!R.contains(num, weekSequence)) {
                weekSequence = R.concat(weekSequence, [num])
            }
        })
    }
    return R.sort(function(a, b) {
        return a - b
    }, weekSequence).join()
}
