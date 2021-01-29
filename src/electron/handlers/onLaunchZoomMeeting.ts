import { IpcMainEvent } from 'electron'
import channels from '../../constants/channels.json'
import { exec } from 'child_process'
import configService from '../service/ConfigService'
import browserWindowService from '../service/BrowserWindowService'

export default (event: IpcMainEvent, url: string) => {
  console.log(`Launch Zoom Meeting: ${url}`)

  if (process.platform === 'win32') {
    // Retrieve the path to the Zoom executable
    const zoomExecutable = configService.getInstance().getConfig().zoomExecutable

    // Launch Zoom with the specified URL
    exec(`${zoomExecutable} --url=${url}`).unref()
  } else if (process.platform === 'darwin') {
    // Change the URL format to: zoommtg://<base-url>/join?confno=<meeting-id>&pwd=<encrypted-or-plain-text-password>
    const baseUrl = 'zoom.us'
    const meetingId = ''
    const password = ''
    const zoomUrl = `zoommtg://${baseUrl}/join?confno=${meetingId}&pwd=${password}`

    exec(`open ${zoomUrl}`)
  }

  // Return a status back to our caller. TODO: need to inspect the response of the exec command
  event.sender.send(channels.LAUNCH_ZOOM_MEETING, {
    status: 'success'
  })

  // Hide the window
  browserWindowService.getInstance().getBrowserWindow()?.hide()
}
