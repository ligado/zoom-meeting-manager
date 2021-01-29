import { IpcMainEvent } from 'electron'
import channels from '../../constants/channels.json'
import configService from '../service/ConfigService'

export default (event: IpcMainEvent, id: number) => {
  const instance = configService.getInstance()
  const meeting = instance.getConfig().meetings.filter(m => m.id === id)
  if (meeting.length > 0) {
    event.sender.send(channels.FETCH_MEETING, meeting[0])
  }
}
