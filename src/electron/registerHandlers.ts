import { ipcMain } from 'electron'
import channels from '../constants/channels.json'

import onGetOs from './handlers/onGetOS'
import onLaunchZoomMeeting from './handlers/onLaunchZoomMeeting'
import onFetchMeetings from './handlers/onFetchMeetings'
import onAddMeeting from './handlers/onAddMeeting'
import onDeleteMeeting from './handlers/onDeleteMeeting'
import onFetchMeeting from './handlers/onFetchMeeting'
import onSaveMeeting from './handlers/onSaveMeeting'
import onExitApp from './handlers/onExitApp'

export default () => {
  ipcMain.on(channels.GET_OS, onGetOs)
  ipcMain.on(channels.LAUNCH_ZOOM_MEETING, onLaunchZoomMeeting)
  ipcMain.on(channels.FETCH_MEETINGS, onFetchMeetings)
  ipcMain.on(channels.ADD_MEETING, onAddMeeting)
  ipcMain.on(channels.DELETE_MEETING, onDeleteMeeting)
  ipcMain.on(channels.FETCH_MEETING, onFetchMeeting)
  ipcMain.on(channels.SAVE_MEETING, onSaveMeeting)
  ipcMain.on(channels.EXIT_APP, onExitApp)
}
