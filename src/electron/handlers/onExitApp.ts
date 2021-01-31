import { IpcMainEvent } from 'electron'
import browserWindowService from '../service/BrowserWindowService'

export default (_: IpcMainEvent) => {
  browserWindowService.getInstance().exitApp()
}
