import axios from 'axios'
import {forEach, pipe, uniqBy} from 'ramda'
import {appState} from '../store/lukkariStore'

const urlParamLength = 9

export const addUrlParameter = (courseCode, groupName) => {
  const params = window.location.search
  const urlParam = courseCode.substring(0, 2) === 'FV' ? `${courseCode}-${groupName}` : courseCode
  if (params.length > urlParamLength) {
    if (params.indexOf(courseCode) < 0) {
      history.pushState({}, '', `?courses=${params.substring(urlParamLength, params.length)}+${urlParam}`)
    }
  } else if (params.indexOf('?courses=') < 0) {
    history.pushState({}, '', `?courses=${params}${urlParam}`)
  } else {
    history.pushState({}, '', `${params}${urlParam}`)
  }
}

export const updateUrlParams = (selectedCourses) => {
  pipe(
    uniqBy((c) => c.course_code),
    forEach((c) => addUrlParameter(c.course_code, c.group_name))
  )(selectedCourses)
}

export const removeUrlParameter = (courseCode) => {
  const params = window.location.search
  const updatedParams = params.substring(urlParamLength, params.length).split('+').filter((p) => {
    if (p.indexOf('-') > -1) {
      const groupLetterStripped = p.substring(0, p.indexOf('-'))
      return groupLetterStripped !== courseCode
    } else {
      return p !== courseCode
    }
  })
  if (updatedParams.length > 0) {
    history.pushState({}, '', `?courses=${updatedParams.join('+')}`)
  } else {
    history.pushState({}, '', '?courses=')
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
