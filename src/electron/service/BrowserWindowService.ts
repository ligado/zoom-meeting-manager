import { BrowserWindow } from 'electron'

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
