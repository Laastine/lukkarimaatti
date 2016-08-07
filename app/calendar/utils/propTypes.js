import {PropTypes} from 'react'
import localizer from '../localizer'
import elementType from 'react-prop-types/lib/elementType'
import all from 'react-prop-types/lib/all'
import {views as Views} from './constants'
import {createChainableTypeChecker} from 'react-prop-types/lib/common'

export {elementType}

export const eventComponent = PropTypes.oneOfType([
  elementType,
  PropTypes.shape({
    month: elementType,
    week: elementType,
    day: elementType,
    agenda: elementType
  })
])

const viewNames = PropTypes.oneOf(
  Object.keys(Views).map(k => Views[k])
)

export const accessor = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.func
])

export const dateFormat = createChainableTypeChecker(
  (...args) => localizer.propType && localizer.propType(...args))

export const views = PropTypes.oneOfType([
  PropTypes.arrayOf(viewNames),
  all([
    PropTypes.object,
    (props, name, component)=> {
      const prop = props[name]
      let err

      Object.keys(prop).every(
        key => !(err = elementType(prop, key, component)))

      return err || null
    }
  ])
])
