const cheerio = require('cheerio')
const Promise = require('bluebird')
const rp = require('request-promise')
const {assoc, contains, range, merge, concat, tail} = require('ramda')
const config = require('./config')
const DB = require('./db')
const Logger = require('./logger')
const {formData, dlObject} = require('./formData')

require('tough-cookie')
const cookieJar = rp.jar()

const updateCourseData = () => {
  const startTime = new Date()
  const url = 'https://forms.lut.fi'
  const pathDefault = '/scientia/sws/sylla1718/default.aspx'
  const pathShowTimetable = '/scientia/sws/sylla1718/showtimetable.aspx'
  rp({
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
          {name: 'Referer', value: 'https://forms.lut.fi/scientia/sws/sylla1718/default.aspx'},
          {name: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'}
        ],
        timeout: 20000,
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
    .then(() => {
      return rp({
        headers: [
          {name: 'Referer', value: 'https://forms.lut.fi/scientia/sws/sylla1718/default.aspx'},
          {name: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'}
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
      })
    })
    .then(res => {
      Logger.info('Parsing HTML', res.statusCode)
      return parseHtml(res.body)
    })
    .then(dataBatch => {
      if (dataBatch.length > 0) {
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

const parseHtml = (data) => {
  const $ = cheerio.load(data)
  const courses = $('td.object-cell-border').map(function () {
    const weekDay = $(this).siblings('td.row-label-one').text()
    return assoc('week_day', enToFi[weekDay], parseBasicData(sanitizeInput($(this).text())))
  }).get()
    .map(c => assoc('week', parseWeeks(c.type), c))
    .map(c => assoc('time_of_day', parseTimeOfDay(c.type), c))
    .map(c => assoc('classroom', parseClassRoom(c.type), c))
    .map(c => assoc('department', getDepartment(c.course_code), c))
    .map(c => merge(c, {teacher: '', misc: '', group_name: '', type: parseType(c.type)}))
  return courses
}

const parseBasicData = (course) => {
  const data = {
    course_code: '',
    course_name: '',
    type: ''
  }
  const nameAndCode = course.split(' - ')
  const type = course.split('/')
  if (nameAndCode.length >= 2) {
    data.course_code = nameAndCode[0]
    if (data.course_code.substr(0, 2) === 'FV') {
      data.course_name = nameAndCode[1]
    } else {
      data.course_name = nameAndCode[1].substr(0, nameAndCode[1].indexOf('/'))
    }
  }
  if (type.length >= 2) {
    data.type = type[type.length - 1]
  }
  return data
}

const parseTimeOfDay = (input) => {
  const groups = /([0-9]{1,2}):([0]{2})\s+([0-9]{1,2}):([0]{2})/.exec(input)
  if (groups && groups.length > 4) {
    const times = groups.map(e => parseInt(e, 10)).filter(e => e > 0)
    if (times[1] < 24 && times[2] < 24) {
      return `${times[1]}-${times[2]}`
    }
  }
  return ''
}

const parseClassRoom = (input) => {
  const capture = input
    .split(/([0-9]{1,2}):([0]{2})\s+([0-9]{1,2}):([0]{2})/)[0]
    .split(/\s/)
    .filter(e => e)
  return tail(capture).join(' ')
}

const parseType = (input) => {
  const capture = input.match(/^[0-9A-Z]+/)
  if (capture && capture.length > 0) {
    return capture[0].trim()
  }
  return ''
}

const parseWeeks = (input) => {
  const capture = input.split(/\s{2,}/)
  const weekData = capture && capture.length > 0 ? capture : ''
  const weeks = weekData[weekData.length - 1]
  let weekSequence = []
  if (contains('-', weeks)) {
    weeks.match(/[0-9]{1,2}-[0-9]{1,2}/g).map((m) =>
      range(
        parseInt(m.substring(0, m.indexOf('-')), 10),
        parseInt(m.substring(m.indexOf('-') + 1), 10) + 1
      ))
      .forEach((r) => {
        weekSequence = concat(weekSequence, r)
      })
  }
  if (contains(',', weeks)) {
    weeks.match(/[0-9]{1,2}/g).forEach((w) => {
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

const getDepartment = (input) => {
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
        }
      default:
        Logger.warn('Unknow course code', input ? input : 'EMPTY')
        return 'UNKNOWN'
    }
  }
}

const sanitizeInput = (input) => input ? input.trim()
  .replace(/'/g, '')
  .replace(/(\r\n|\n|\r)/g, '') : ''

module.exports = {
  updateCourseData: (req, res) => {
    Logger.info('Update course data from IP', req.client.remoteAddress)
    if (req.query.secret === config.appSecret) {
      updateCourseData()
      res.status(200).json({status: 'ok'})
    } else {
      Logger.warn('Unauthorized update attempt from IP', req.client.remoteAddress)
      res.status(403).json({error: 'Unauthorized'})
    }
  },

  workerUpdateData: () => {
    Logger.info('Update course data by worker')
    Promise.resolve(DB.cleanCourseTable())
      .then(() => updateCourseData())
      .catch((err) => Logger.error('Error while updating DB data', err.stack))
  },
  parseHtml
}
