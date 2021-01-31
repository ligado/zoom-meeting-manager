import { BrowserWindow, Tray, app } from 'electron'

export enum EventType {
  BLUR, TRAY_CLICK
}

interface Event {
  type: EventType
  timestamp: number
}

class BrowserWindowService {
  private static instance: BrowserWindowService;
  private browserWindow: BrowserWindow | undefined = undefined
  private xPosition = 0
  private tray: Tray | undefined = undefined
  private events: Event[] = []

  private constructor() {
  }

  public static getInstance() : BrowserWindowService {
    if (!BrowserWindowService.instance) {
      BrowserWindowService.instance = new BrowserWindowService()
    }
    return BrowserWindowService.instance
  }

  public setBrowserWindow(browserWindow: BrowserWindow): void {
    this.browserWindow = browserWindow
  }

  public getBrowserWindow(): BrowserWindow | undefined {
    return this.browserWindow
  }

  public setTray(tray: Tray): void {
    this.tray = tray
  }

  public getTray(): Tray | undefined {
    return this.tray
  }

  public setXPosition(xPosition: number): void {
    this.xPosition = xPosition
  }

  public exitApp(): void {
    if (this.browserWindow) this.browserWindow.destroy()
    if (this.tray) this.tray.destroy()
    app.exit(0)
  }

  public event(type: EventType) {
    this.events.push({
      type: type,
      timestamp: Date.now()
    })

    // console.log(`Events: ${JSON.stringify(this.events)}`)

    this.processEvents()
  }

  private processEvents(): void {
    const lastEvent = this.events[this.events.length - 1]
    switch(lastEvent?.type) {
      case EventType.BLUR:
        this.browserWindow?.hide()
        break
      case EventType.TRAY_CLICK:
        if (this.events.length >= 2) {
          const previousEvent = this.events[this.events.length - 2]
          // If the previous event was a BLUR and it occurred within the last 200ms then skip the TRAY_CLICK
          // const msBetweenEvents = lastEvent.timestamp - previousEvent.timestamp
          // console.log(`Milliseconds between events: ${msBetweenEvents}`)
          if (previousEvent.type === EventType.BLUR && lastEvent.timestamp - previousEvent.timestamp < 200) {
            // Do nothing
            return
          }
        }

        // Update the xPosition
        if (this.browserWindow && this.xPosition !== 0) {
          const bounds = this.browserWindow.getBounds()
          bounds.x = this.xPosition
          this.browserWindow.setBounds(bounds)
        }

        // Flip the visibility
        if (this.browserWindow && this.browserWindow.isVisible()) {
          this.browserWindow.hide()
        } else {
          this.browserWindow?.show()
        }
    }

    // Leave the last event in the array
    if (this.events.length >= 2) {
      this.events = [lastEvent]
    }
  }

}

export default BrowserWindowService
