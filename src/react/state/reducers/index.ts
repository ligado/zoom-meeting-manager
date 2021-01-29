import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { HashHistory } from 'history'
import operatingSystemReducer from './osReducer'
import meetingReducer from './MeetingReducer'
import editMeetingReducer from './EditMeetingReducer'

// @ts-ignore
const createRootReducer = (history : HashHistory) => combineReducers({
  router: connectRouter(history),
  operatingSystem: operatingSystemReducer,
  meetings: meetingReducer,
  editMeeting: editMeetingReducer
})

export default createRootReducer

export type RootState = ReturnType<typeof createRootReducer>
