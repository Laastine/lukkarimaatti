const cheerio = require('cheerio')
const Promise = require('bluebird')
const rp = require('request-promise')
const moment = require('moment')
const {assoc, concat, contains, dissoc, drop, merge, range, values} = require('ramda')
const config = require('./config')
const DB = require('./db')
const Logger = require('./logger')
const {formData, dlObject} = require('./formData')
const CSV = require('csvtojson')

require('tough-cookie')
const cookieJar = rp.jar()
const UPDATE_THRESHOLD = 100

const updateCourseData = () => {
  const startTime = new Date()
  const url = 'https://forms.lut.fi'
  const pathDefault = '/scientia/sws/sylla1819/default.aspx'
  const pathShowTimetable = '/scientia/sws/sylla1819/showtimetable.aspx'
  return rp({
    method: 'GET',
    uri: url + pathDefault,
    jar: cookieJar,
    resolveWithFullResponse: true
  })
    .then(res => {
      const $ = cheerio.load(res.body)
      const r = rp({
        method: 'POST',
        uri: url + pathDefault,
        headers: [
          {name: 'Content-Type', value: 'application/x-www-form-urlencoded'},
          {name: 'Host', value: 'forms.lut.fi'},
          {name: 'Origin', value: 'https://forms.lut.fi'},
          {name: 'Referer', value: 'https://forms.lut.fi/scientia/sws/sylla1819/default.aspx'},
          {name: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'}
        ],
        timeout: 25000,
        jar: cookieJar,
        preambleCRLF: true,
        postambleCRLF: true,
        followAllRedirects: true,
        followOriginalHttpMethod: true,
        resolveWithFullResponse: true,
        removeRefererHeader: true
      })

      const form = r.form()
      dlObject.map(e => {
        form.append('dlObject', e)
      })
      Object.keys(formData).forEach(key => {
        form.append(key, formData[key])
      })
      form.append('__VIEWSTATE', $('#__VIEWSTATE').attr('value'))
      form.append('__VIEWSTATEGENERATOR', $('#__VIEWSTATEGENERATOR').attr('value'))
      form.append('__EVENTVALIDATION', $('#__EVENTVALIDATION').attr('value'))
      return r
    })
    .then(() => rp({
      headers: [
        {name: 'Referer', value: 'https://forms.lut.fi/scientia/sws/sylla1819/default.aspx'},
        {name: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/60.1'}
      ],
      method: 'GET',
      uri: url + pathShowTimetable,
      timeout: 30000,
      jar: cookieJar,
      maxRedirects: 20,
      followAllRedirects: true,
      followOriginalHttpMethod: true,
      resolveWithFullResponse: true,
      removeRefererHeader: true
    }))
    .then(res => {
      Logger.info('Parsing HTML', res.statusCode)
      return parseHtml(res.body)
    })
    .then(dataBatch => {
      if (dataBatch.length > UPDATE_THRESHOLD) {
        new Promise.resolve(DB.cleanCourseTable())
          .then(() => {
            Logger.info('DB cleaned')
            Logger.info(`Inserting ${dataBatch.length}pcs courses`)
            return DB.insertCourse(dataBatch)
          })
          .then(() => {
            const endTime = new Date()
            Logger.info(`UpdateCourseData finished in ${(endTime.getTime() - startTime.getTime()) / 1000} seconds`)
          })
      } else {
        throw Error(`No courses inserted, dataBatch size ${dataBatch.length}`)
      }
    })
    .catch(err => {
      Logger.error('Failed to parse links', err.message)
    })
}

const enToFi = {
  Mon: 'ma',
  Tue: 'ti',
  Wed: 'ke',
  Thu: 'to',
  Fri: 'pe',
  Sat: 'la',
  Sun: 'su'
}

const handleCourseCodeSuffixes = course => {
  if (course.course_code && /^[A-Z0-9]+\s\([A-Z0-9]+\)+$/gi.test(course.course_code)) {
    const [suffix] = (course.course_code.match(/\([A-Z]+\)$/gi))
    return merge(course, {
      course_code: course.course_code.replace(/\s+/, ''),
      course_name: `${course.course_name}${suffix}`
    })
  }
  return course
}

const parseHtml = data => {
  const $ = cheerio.load(data)
  const courses = $('td.object-cell-border').map(function () {
    let weekDay = $(this).siblings('td.row-label-one').text()
    if (!weekDay) {
      const days = $(this).parent().prevAll().find('td.row-label-one').first()
      weekDay = days.text()
    }
    return assoc('week_day', enToFi[weekDay], parseBasicData(sanitizeInput($(this).text())))
  }).get()
    .map(c => Object.assign(handleCourseCodeSuffixes(c),
      {week: parseWeeks(c.text)},
      {'time_of_day': parseTimeOfDay(c.text)},
      {'classroom': parseClassRoom(c.text)},
      {'department': getDepartment(c.course_code)},
      {teacher: '', misc: '', group_name: ''}))
    .map(c => dissoc('text', c))
    .filter(c => c.course_code && c.course_name && c.time_of_day)
  return courses
}

const parseBasicData = course => {
  const data = {
    course_code: '',
    course_name: '',
    type: '',
    text: ''
  }
  const nameAndCode = course.split(' - ')
  const type = parseType(nameAndCode)
  const text = drop(1, course.split(/\s{2,}/).filter(e => e)).join('    ')
  if (nameAndCode.length >= 2) {
    const [code, name] = nameAndCode
    data.course_code = code
    if (data.course_code.substr(0, 2) === 'FV') {
      data.course_name = name
    } else {
      data.course_name = nameAndCode[1].substr(0, nameAndCode[1].indexOf('/'))
    }
  }
  if (type) {
    data.type = type
  }
  if (data) {
    data.text = text
  }
  return data
}

const parseTimeOfDay = input => {
  const groups = /([0-9]{1,2}):([0]{2})\s+([0-9]{1,2}):([0]{2})/.exec(input)
  if (groups && groups.length > 4) {
    const times = groups.map(e => parseInt(e, 10))
      .filter(e => e > 0)
      .map(e => String(e).padStart(2, 0))
    if (times[1] < 24 && times[2] < 24) {
      return `${times[1]}-${times[2]}`
    }
  }
  return ''
}

const parseClassRoom = input => {
  const capture = input
    .split(/([0-9]{1,2}):([0]{2})\s+([0-9]{1,2}):([0]{2})/)[0]
    .split(/\s/)
    .filter(e => e)
    .join(' ')
  return capture
}

const parseType = input => {
  const captures = input.join(' ').split('/')
  if (captures && captures.length > 1) {
    return captures[1].match(/[A-Z0-9]/)[0]
  }
  return ''
}

const parseWeeks = input => {
  const capture = input.split(/\s{2,}/)
  const weekData = capture && capture.length > 0 ? capture : ''
  const weeks = weekData[weekData.length - 1]
  let weekSequence = []
  if (contains('-', weeks)) {
    weeks.match(/[0-9]{1,2}-[0-9]{1,2}/g).map(m =>
      range(
        parseInt(m.substring(0, m.indexOf('-')), 10),
        parseInt(m.substring(m.indexOf('-') + 1), 10) + 1
      ))
      .forEach(r => {
        weekSequence = concat(weekSequence, r)
      })
  }
  if (contains(',', weeks)) {
    weeks.match(/[0-9]{1,2}/g).forEach(w => {
      const num = parseInt(w, 10)
      if (!contains(num, weekSequence)) {
        weekSequence = concat(weekSequence, [num])
      }
    })
  }
  if (/^[0-9]{1,2}$/.test(weeks)) {
    weekSequence = concat(weekSequence, weeks.match(/^[0-9]{1,2}$/))
  }
  return weekSequence.join()
}

const getDepartment = input => {
  if (input.substring(0, 1) === 'A') {
    return 'kati'
  } else {
    switch (input.substring(0, 2)) {
      case 'BH':
        return 'ente/ymte'
      case 'BJ':
        return 'kete'
      case 'FV':
        return 'kike'
      case 'BK':
        return 'kote'
      case 'BM':
        return 'mafy'
      case 'BL':
        return 'sate'
      case 'CT':
        return 'tite'
      case 'CS':
        return 'tuta'
      case 'LM':
        if (input.indexOf('tuta') > 0) {
          return 'tuta'
        } else if (input.indexOf('tite') > 0) {
          return 'tite'
        } else if (input.indexOf('kati') > 0) {
          return 'kati'
        } else {
          return 'tuta'
        }
      default:
        Logger.warn('Unknown course code', input)
        return 'UNKNOWN'
    }
  }
}

const sanitizeInput = input => input ? input.trim()
  .replace(/(\r\n|\n|\r)/g, '') : ''

const kikeCourseCodeParser = () => {
  const url = 'https://ops.saimia.fi/opsnet/disp/fi/ops_KoulOhjOps/tab/tab/sea?valkiel=fi&ryhma_id=20448973&koulohj_id=20448943'
  const startTime = new Date()
  const separator = '#%#'
  return rp({
    method: 'GET',
    uri: url,
    resolveWithFullResponse: true,
    timeout: 10000
  })
    .then(result => {
      const $ = cheerio.load(result.body)
      return $('tr.datatable2').map(function () {
        return `${$(this).find('td:nth-child(2)').text().split('\n')[0]}${separator}${$(this).find('td:nth-child(3)').text()}`
      }).get()
    })
    .then(coursesWithCodes =>
      coursesWithCodes
        .map(c => {
          const [courseName, courseCode] = c.split(separator)
          if (courseName && courseCode && /[\s ,.\-0-9]+/) {
            return {courseName, courseCode}
          }
          return null
        })
        .filter(e => e))
    .then(data => Promise.all(data.map(d => DB.updateKikeCourseCode(d.courseCode, d.courseName))))
    .then(() => {
      const endTime = new Date()
      Logger.info(`kikeCourseCodeParser finished in ${(endTime.getTime() - startTime.getTime()) / 1000} seconds`)
    })
    .catch(e => {
      Logger.error('Failed to update kike course codes', e.message)
    })
}

const kikeCourseParser = () => {
  const url = 'https://fi.timeedit.net/web/saimia/db1/public/ri65Z997X71Z07Q5Z56g6100y50Y6YQ5n07gQY5Q575730Q91.csv'
  const startTime = new Date()
  let dbData = []
  return rp({
    method: 'GET',
    uri: url,
    resolveWithFullResponse: true,
    timeout: 10000
  })
    .then(result => {
      const asCommaSeparated = result.body.replace(/;/g, ',')

      return new Promise((resolve, reject) => {
        CSV({noheader: true})
          .fromString(asCommaSeparated, (err, csvRows) => {
            if (err) {
              Logger.error('Failed to fetch kike data', err.message)
              reject()
            }
            dbData = csvRows.map(csvRow => {
              const stripMinutes = input => input ? input.replace(/:[0-9]+/g, '') : ''
              const timeOfDay = `${stripMinutes(sanitizeInput(csvRow.field2))}-${stripMinutes(sanitizeInput(csvRow.field4))}`
              const day = moment(csvRow.field1, 'YYYY-MM-DD')
              const courseName = sanitizeInput(csvRow.field5)
              const courseCode = `FV${courseName.replace(/[^\x00-\x7F]/g, '').replace(/\s/, '')}`
              return {
                classroom: `${sanitizeInput(csvRow.field7)}`,
                course_code: courseCode,
                course_name: courseName,
                department: 'kike',
                group_name: `${sanitizeInput(csvRow.field6)}`,
                misc: '',
                period: null,
                teacher: '',
                time_of_day: timeOfDay,
                type: '',
                week: day.week(),
                week_day: values(enToFi)[day.weekday()]
              }
            })
              .filter(courseData => courseData.course_name && courseData.course_code && courseData.week && courseData.week_day && courseData.classroom)
          })
          .on('end', () => {
            Logger.info('Parsed kike CSV file')
            resolve()
          })
      })
    })
    .then(() => {
      if (dbData.length > UPDATE_THRESHOLD) {
        DB.cleanKikeCourseTable()
          .then(() => {
            Logger.info('DB cleaned (kike courses)')
            Logger.info(`Inserting ${dbData.length}pcs kike courses`)
            new Promise.resolve(DB.insertCourse(dbData))
              .then(() => {
                const endTime = new Date()
                Logger.info(`kikeCourseParser finished in ${(endTime.getTime() - startTime.getTime()) / 1000} seconds`)
              })
              .catch(e => {
                Logger.error('Failed to update kike courses', e.message)
              })
          })
      } else {
        throw Error(`No kike courses inserted, dataBatch size ${dbData.length}`)
      }
    })
    .catch(e => {
      Logger.error('Failed to fetch kike courses', e.message)
    })
}

module.exports = {
  updateCourseData: (req, res) => {
    Logger.info('Update course data from IP', req.client.remoteAddress)
    if (req.query.secret === config.appSecret) {
      Promise.resolve(updateCourseData())
        .then(kikeCourseParser)
        .then(kikeCourseCodeParser)
      res.status(200).json({status: 'ok'})
    } else {
      Logger.warn('Unauthorized update attempt from IP', req.client.remoteAddress)
      res.status(403).json({error: 'Unauthorized'})
    }
  },

  workerUpdateData: () => {
    Logger.info('Update course data by worker')
    Promise.resolve(updateCourseData())
      .then(kikeCourseParser)
      .then(kikeCourseCodeParser)
      .catch(err => Logger.error('Error while updating DB data', err.stack))
  },
  parseHtml
}
