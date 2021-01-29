import { ActionType } from '../action-types'
import { Action } from '../actions'
import { Meeting } from '../../../electron/model/Configuration'

export interface EditMeetingState {
  meeting: Meeting
}

// Default our initial state to an empty meeting
const initialState = {
  meeting: {
    id: 0,
    name: '',
    abbreviation: '',
    url: ''
  }
}

const reducer = (state: EditMeetingState = initialState, action: Action): EditMeetingState => {
  switch(action.type) {
    case ActionType.UPDATE_MEETING:
    case ActionType.FETCH_MEETING:
      return { meeting: action.payload}
    default:
      return state
  }
}

export default reducer
