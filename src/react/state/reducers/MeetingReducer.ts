import { ActionType } from '../action-types'
import { Action } from '../actions'
import { Meeting } from '../../../electron/model/Configuration'

export interface MeetingState {
  meetings: Meeting[]
}

const initialState = {
  meetings: []
}

const reducer = (state: MeetingState = initialState, action: Action): MeetingState => {
  switch(action.type) {
    case ActionType.FETCH_MEETINGS:
      return { meetings: action.payload}
    default:
      return state
  }
}

export default reducer
