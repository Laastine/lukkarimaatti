"use strict"

const cheerio = require('cheerio')
const Promise = require('bluebird')
const R = require('ramda')
const config = require('./config')
const DB = require('./db')
const request = Promise.promisify(require('request'))

let links = []

const updateCourseData = function () {
    request({url: config.uniUrl, json: true})
        .then(function (res) {
            var $ = cheerio.load(res[1])
            $($(".portlet-body .journal-content-article").children()[2])
                .find('a')
                .each(function () {
                    var link = $(this).attr('href')
                    console.log('link', link)
                    if (link.substring(0, 34) === '/c/document_library/get_file?uuid=') {
                        links.push(link)
                    }
                })
            links.forEach(function (link) {
                parseCourseData(link)
            })
        }).catch((err) => console.error('Failed to parse links', err.stack))
}

const parseBasicData = (course) => {
    let data = {
        code: '',
        name: '',
        group: '',
        type: ''
    }
    const nameAndCode = course.split(' - ')
    const type = course.split('/')
    const group = course.split(': ')
    if (nameAndCode.length >= 2) {
        data.code = nameAndCode[0]
        if (data.code.substr(0, 2) === 'FV') {
            data.name = nameAndCode[1]
        } else {
            data.name = nameAndCode[1].substr(0, nameAndCode[1].indexOf('/'))
        }
    }
    if (type.length >= 2) {
        data.type = type[type.length - 1]
    }
    if (group.length >= 2) {
        data.group = group[group.length - 1]
    }
    return data
}

const parseWeeks = (weeks) => {
    var weekSequence = []
    if (R.contains('-', weeks)) {
        weeks.match(/[0-9]{1,2}-[0-9]{1,2}/g).map((m) =>
            R.range(
                parseInt(m.substring(0, m.indexOf('-')), 10),
                parseInt(m.substring(m.indexOf('-') + 1), 10) + 1
            )).map((r) => {
            weekSequence = R.concat(weekSequence, r)
        })
    }
    if (R.contains(',', weeks)) {
        weeks.match(/[0-9]+/g).forEach((w) => {
            let num = parseInt(w, 10)
            if (!R.contains(num, weekSequence)) {
                weekSequence = R.concat(weekSequence, [num])
            }
        })
    }
    if (/^[0-9]{1,2}$/.test(weeks)) {
        weekSequence = R.concat(weekSequence, weeks.match(/^[0-9]{1,2}$/))
    }
    return weekSequence.join()
}

const getDepartment = (input) => {
    if (input.substring(0, 1) === 'A') {
        return 'kati'
    } else {
        switch (input.substring(0, 2)) {
            case 'BH':
                return 'ente/ymte'
                break
            case 'BJ':
                return 'kete'
                break
            case 'FV':
                return 'kike'
                break
            case 'BH':
                return 'ente/ymte'
                break
            case 'BK':
                return 'kote'
                break
            case 'BM':
                return 'mafy'
                break
            case 'BL':
                return 'sate'
                break
            case 'CT':
                return 'tite'
                break
            case 'CS':
                return 'tuta'
                break
            default:
                return 'UNKNOWN'
        }
    }
}

const sanitizeInput = (input) => input ? input.trim()
    .replace(/'/g, "")
    .replace(/(\r\n|\n|\r)/g, '') : ''

function parseCourseData(url) {
    request({url: 'https://uni.lut.fi' + url})
        .then(function (html) {
            var dataBatch = []
            var data = {}
            var $ = cheerio.load(html[1])
            $('table.spreadsheet')
                .each(function () {
                    $(this).find('tr:not(.columnTitles)').map(function () {
                        var courseData = []
                        var tds = $(this).find('td')
                        if (tds.length === 9) {
                            tds.each(function () {
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
                            tds.each(function () {
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
        }).catch((err) => console.error('Failed to parse HTML', err.stack)
    )
}

module.exports = {
    updateCourseData: (req, res) => {
        console.log('Update course data from IP', req.client.remoteAddress)
        if (req.query['secret'] === config.appSecret) {
            Promise.all([DB.cleanCourseTable()]).then((res) => updateCourseData())
            res.status(200).json({status: 'ok'})
        } else {
            res.status(403).json({error: 'Unauthorized'})
        }
    },

    workerUpdateData: () => {
        console.log('Update course data by worker')
        Promise.all([DB.cleanCourseTable()])
            .then((res) => updateCourseData())
            .catch((err) => console.error("Error while updating DB data", err.stack))
    }
}

