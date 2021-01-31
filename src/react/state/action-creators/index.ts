import { Dispatch } from 'redux'
import { ActionType } from '../action-types'
import { Action } from '../actions'
import { ipcRenderer } from 'electron'
import channels from '../../../constants/channels.json'
import { Meeting } from '../../../electron/model/Configuration'

export const getOs = () => {
  return async (dispatch: Dispatch<Action>) => {
    ipcRenderer.send(channels.GET_OS)
    // ipcRenderer.on(channels.GET_OS, (event: Event, response) => {
    ipcRenderer.on(channels.GET_OS, (_, response) => {
      ipcRenderer.removeAllListeners(channels.GET_OS)

      dispatch({
        type: ActionType.GET_OS,
        payload: response.operatingSystem
      })
    })
  }
}

export const exitApp = () => {
  return async (_: Dispatch<Action>) => {
    ipcRenderer.send(channels.EXIT_APP)
  }
}

export const fetchMeetings = () => {
  return async (dispatch: Dispatch<Action>) => {
    ipcRenderer.send(channels.FETCH_MEETINGS)
    ipcRenderer.on(channels.FETCH_MEETINGS, (_, response) => {
      ipcRenderer.removeAllListeners(channels.FETCH_MEETINGS)

      dispatch({
        type: ActionType.FETCH_MEETINGS,
        payload: response
      })
    })
  }
}

export const launchZoomMeeting = (url: string) => {
  return async (dispatch: Dispatch<Action>) => {
    ipcRenderer.send(channels.LAUNCH_ZOOM_MEETING, url)
    // ipcRenderer.on(channels.GET_OS, (event: Event, response) => {
    ipcRenderer.on(channels.LAUNCH_ZOOM_MEETING, (_, response) => {
      ipcRenderer.removeAllListeners(channels.LAUNCH_ZOOM_MEETING)

      dispatch({
        type: ActionType.LAUNCH_ZOOM_MEETING,
        payload: response.status
      })
    })
  }
}

export const addMeeting = (name: string, abbreviation: string, url: string) => {
  // return async (dispatch: Dispatch<Action>) => {
  return async () => {
    ipcRenderer.send(channels.ADD_MEETING, name, abbreviation, url)
    ipcRenderer.on(channels.ADD_MEETING, (_) => {
      ipcRenderer.removeAllListeners(channels.ADD_MEETING)
    })
  }
}

export const saveMeeting = (id: number, name: string, abbreviation: string, url: string) => {
  // return async (dispatch: Dispatch<Action>) => {
  return async () => {
    ipcRenderer.send(channels.SAVE_MEETING, {
      id: id,
      name: name,
      abbreviation: abbreviation,
      url: url
    })
    ipcRenderer.on(channels.SAVE_MEETING, (_) => {
      ipcRenderer.removeAllListeners(channels.SAVE_MEETING)
    })
  }
}

export const deleteMeeting = (id: number) => {
  // return async (dispatch: Dispatch<Action>) => {
  return async () => {
    ipcRenderer.send(channels.DELETE_MEETING, id)
    ipcRenderer.on(channels.DELETE_MEETING, (_) => {
      ipcRenderer.removeAllListeners(channels.DELETE_MEETING)
    })
  }
}

export const fetchMeeting = (id: number) => {
  // return async (dispatch: Dispatch<Action>) => {
  return async (dispatch: Dispatch<Action>) => {
    ipcRenderer.send(channels.FETCH_MEETING, id)
    ipcRenderer.on(channels.FETCH_MEETING, (_, response) => {
      ipcRenderer.removeAllListeners(channels.FETCH_MEETING)

      dispatch({
        type: ActionType.FETCH_MEETING,
        payload: response
      })
    })

    // fetchMeetings()
  }
}

export const updateMeeting = (meeting: Meeting) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.UPDATE_MEETING,
      payload: meeting
    })
  }
}
