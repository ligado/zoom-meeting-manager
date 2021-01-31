import { IpcMainEvent } from 'electron'
import channels from '../../constants/channels.json'
import { exec } from 'child_process'
import configService from '../service/ConfigService'
import browserWindowService from '../service/BrowserWindowService'
import UrlParse from 'url-parse'

export default (event: IpcMainEvent, url: string) => {
  console.log(`Launch Zoom Meeting: ${url}`)

  if (process.platform === 'win32') {
    // Retrieve the path to the Zoom executable
    const zoomExecutable = configService.getInstance().getConfig().zoomExecutable

    // Launch Zoom with the specified URL
    exec(`${zoomExecutable} --url=${url}`).unref()
  } else if (process.platform === 'darwin') {
    // Original Format: https://turbonomic.zoom.us/j/4079289743?pwd=QXd0RUFueGN1bnpDenBseDdteGR6QT09
    // Change the URL format to: zoommtg://<base-url>/join?confno=<meeting-id>&pwd=<encrypted-or-plain-text-password>

    // Parse the URL
    const parsedUrl = UrlParse(url)

    // Base URL
    const baseUrl = parsedUrl.hostname

    // Extract the last segment of the pathname for the meeting ID
    const lastSlash = parsedUrl.pathname.lastIndexOf('/')
    const meetingId = parsedUrl.pathname.substr(lastSlash + 1)

    // Password
    const pwdIndex = parsedUrl.query.toString().lastIndexOf('pwd=')
    const password: string | undefined = pwdIndex === -1 ? undefined: parsedUrl.query.toString().substr(pwdIndex + 4)

    // Build the URL
    const zoomUrl = password ? `zoommtg://${baseUrl}/join?confno=${meetingId}&pwd=${password}` : `zoommtg://${baseUrl}/join?confno=${meetingId}`
    console.log(`zoomUrl = ${zoomUrl}`)

    exec(`open "${zoomUrl}"`)
  }

  // Return a status back to our caller. TODO: need to inspect the response of the exec command
  event.sender.send(channels.LAUNCH_ZOOM_MEETING, {
    status: 'success'
  })

  // Hide the window
  browserWindowService.getInstance().getBrowserWindow()?.hide()
}
