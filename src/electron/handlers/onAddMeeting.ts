import { IpcMainEvent } from 'electron'
import channels from '../../constants/channels.json'
import configService from '../service/ConfigService'

export default (event: IpcMainEvent, name: string, abbreviation: string, url: string) => {
  console.log(`Add meeting: ${name}, abbreviation: ${abbreviation}, url: ${url}`)

  const instance = configService.getInstance()
  instance.addMeeting(name, abbreviation, url)

  event.sender.send(channels.ADD_MEETING, {
    status: 'success'
  })
}
