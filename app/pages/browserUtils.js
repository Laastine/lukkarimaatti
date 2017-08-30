import axios from 'axios'
import {forEach, pipe, uniqBy} from 'ramda'
import {appState} from '../store/lukkariStore'
import history from '../history'

const urlParamLength = 9

const sanitizeUrlParam = () => window.location.search.indexOf('courses=') < 0 ? '' : window.location.search

export const addUrlParameter = (courseCode) => {
  const params = sanitizeUrlParam()
  if (params.length > urlParamLength) {
    if (params.indexOf(courseCode) < 0) {
      history.replace({
        pathname: history.location.pathname,
        search: `?courses=${params.substring(urlParamLength, params.length)}+${courseCode}`
      })
    }
  } else if (params.indexOf('?courses=') < 0) {
    history.replace({pathname: history.location.pathname, search: `?courses=${params}${courseCode}`})
  } else {
    history.replace({pathname: history.location.pathname, search: `${params}${courseCode}`})
  }
}

export const updateUrlParams = (selectedCourses) => {
  pipe(
    uniqBy((c) => c.course_code),
    forEach((c) => addUrlParameter(c.course_code))
  )(selectedCourses)
}

export const removeUrlParameter = (courseCode) => {
  const params = sanitizeUrlParam()
  const updatedParams = params.substring(urlParamLength, params.length).split('+').filter((p) => {
    if (p.indexOf('-') > -1) {
      const groupLetterStripped = p.substring(0, p.indexOf('-'))
      return groupLetterStripped !== courseCode
    } else {
      return p !== courseCode
    }
  })
  if (updatedParams.length > 0) {
    history.replace({pathname: history.location.pathname, search: `?courses=${updatedParams.join('+')}`})
  } else {
    history.replace({pathname: history.location.pathname, search: '?courses='})
  }
}

export const sendEmail = (email) => {
  axios.post('api/save', {email, link: window.location.href.toString()})
    .then(() => {
      appState.dispatch({type: 'EMAIL_SEND_DONE', waitingAjax: false})
    })
    .catch(() => {
      appState.dispatch({type: 'EMAIL_SEND_FAILED', waitingAjax: false})
    })
}
