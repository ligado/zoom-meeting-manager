import { IpcMainEvent } from 'electron'
import channels from '../../constants/channels.json'
import configService from '../service/ConfigService'
import { Meeting } from '../model/Configuration'

export default (event: IpcMainEvent, meeting: Meeting) => {
  console.log(`Save meeting: ${JSON.stringify(meeting)}`)

  const instance = configService.getInstance()
  instance.saveMeeting(meeting)

  event.sender.send(channels.SAVE_MEETING, {
    status: 'success'
  })
}
