import { ActionType } from '../action-types'
import { Meeting } from '../../../electron/model/Configuration'

interface GetOperatingSystemAction {
  type: ActionType.GET_OS
  payload: string
}

interface LaunchZoomMeetingAction {
  type: ActionType.LAUNCH_ZOOM_MEETING
  payload: string
}

interface FetchMeetingsAction {
  type: ActionType.FETCH_MEETINGS
  payload: Meeting[]
}

interface FetchMeetingAction {
  type: ActionType.FETCH_MEETING
  payload: Meeting
}

interface UpdateMeetingAction {
  type: ActionType.UPDATE_MEETING,
  payload: Meeting
}

export type Action = GetOperatingSystemAction | LaunchZoomMeetingAction | FetchMeetingsAction | FetchMeetingAction | UpdateMeetingAction
