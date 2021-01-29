import { IpcMainEvent } from 'electron'
import channels from '../../constants/channels.json'
import configService from '../service/ConfigService'

export default (event: IpcMainEvent) => {
  console.log(`Platform: ${process.platform}`)

  // Return the list of meetings from the ConfigService
  const instance = configService.getInstance()
  event.sender.send(channels.FETCH_MEETINGS, instance.getConfig().meetings)
}
