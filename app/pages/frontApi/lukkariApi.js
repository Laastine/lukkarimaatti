import axios from 'axios'
import {serverAddr} from '../../utils'

const lukkariApi = axios.create({
  timeout: 5000 //5sec
})

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data
  } else {
    return response
  }
}

export const searchCourses = (courseName) =>
  lukkariApi.get(`${serverAddr}/course/course`, {
    params: {
      name: courseName
    }
  })
    .then(checkStatus)

export const loadCourses = (param) => ({
  type: 'LOAD_COURSES',
  promise: lukkariApi.get(`${serverAddr}/course/courses`, {
    params: {
      courses: param.courses
    }
  })
    .then(checkStatus)
})

export const loadCourseByCode = (courseCode) =>
  lukkariApi.get(`${serverAddr}/course/code`, {
    params: {
      courseCode
    }
  })
    .then(checkStatus)

export const loadCourseByCodeAndGroup = (courseCode, groupName) =>
  lukkariApi.get(`${serverAddr}/course/codeAndGroup`, {
    params: {
      courseCode,
      groupName
    }
  })
    .then(checkStatus)

export const loadCoursesByDepartment = (param) => {
  return {
    type: 'LOAD_COURSES_BY_DEPARTMENT',
    promise: lukkariApi.get(`${serverAddr}/course/byDepartment/${param.department}`)
      .then(checkStatus)
      .then((data) => ({
        data,
        department: param.department
      }))
  }
}
