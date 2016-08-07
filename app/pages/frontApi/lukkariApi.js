import axios from "axios"
import {serverAddr} from "../../utils"

const lukkariApi = axios.create({
  timeout: 10000, //10sec
})

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data
  } else {
    return response
  }
}

export const searchCourses = (input) =>
  lukkariApi.get(`${serverAddr}/course/course`, {
    params: {
      name: input
    }
  })
    .then(checkStatus)

export const loadCourses = (param) => {
  return {
    type: 'LOAD_COURSES',
    promise: lukkariApi.get(`${serverAddr}/course/courses`, {
      params: {
        courses: param.courses
      }
    })
      .then(checkStatus)
  }
}