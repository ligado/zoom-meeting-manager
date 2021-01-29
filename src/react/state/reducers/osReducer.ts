import { ActionType } from '../action-types'
import { Action } from '../actions'

export interface OSState {
  operatingSystem: string
}

const initialState = {
  operatingSystem: ''
}

const reducer = (state: OSState = initialState, action: Action): OSState => {
  switch(action.type) {
    case ActionType.GET_OS:
      return { operatingSystem: action.payload}
    default:
      return state
  }
}

export default reducer
