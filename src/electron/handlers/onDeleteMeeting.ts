import { IpcMainEvent } from 'electron'
import channels from '../../constants/channels.json'
import configService from '../service/ConfigService'

export default (event: IpcMainEvent, id: number) => {

  const instance = configService.getInstance()
  instance.deleteMeeting(id)

  event.sender.send(channels.DELETE_MEETING, {
    status: 'success'
  })
}
