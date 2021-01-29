import { IpcMainEvent } from 'electron'
import channels from '../../constants/channels.json'

export default (event: IpcMainEvent) => {
  event.sender.send(channels.GET_OS, {
    operatingSystem: process.platform
  })
}
