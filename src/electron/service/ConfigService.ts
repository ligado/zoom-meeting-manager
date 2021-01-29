import { Configuration, Meeting } from '../model/Configuration'
import * as fs from 'fs'
import * as path from 'path'
import { PathLike } from 'fs'

/**
 * Singleton class that manages interactions with the configuration file. Access it as follows:
 *
 * import configService from '../service/ConfigService'
 * const instance = configService.getInstance()
 */
class ConfigService {
  /**
   * Single instance of the ConfigService
   */
  private static instance: ConfigService

  /**
   * Our home directory.
   */
  private readonly homeDir: string

  /**
   * The path to our configuration file.
   */
  private readonly appConfigPath: string

  /**
   * The application configuration.
   */
  appConfig: Configuration

  private constructor() {
    // Derive the path to our configuration file
    this.homeDir = process.cwd()
    this.appConfigPath = path.join(this.homeDir, 'config.json')

    if (!fs.existsSync(this.appConfigPath)) {
      const zoomExe = this.findZoomExe()
      console.log(`Zoom.exe = ${zoomExe}`)

      // Create a new app configuration
      this.appConfig = {
        // zoomExecutable: '',
        zoomExecutable: zoomExe ? zoomExe : 'NOT_FOUND',
        meetings: []
      }

      // Save the configuration to the filesystem
      this.saveConfig()
    } else {
      // The configuration file exists, so load it
      this.appConfig = this.loadConfig()
    }
  }

  /**
   * Finds the path to the zoom executable. If not found then returns undefined.
   */
  private findZoomExe(): string | undefined {
    if (process.platform === 'win32') {
      return this.findZoomExeOnWindows()
    } else if (process.platform === 'darwin') {
      return this.findZoomExeOnMac()
    } else if (process.platform === 'linux') {

    }
    return undefined
  }

  /**
   * Finds the path to the zoom executable on Windows. It retrieves the APPDATA
   * environment variable and scans all files under that directory until it finds
   * Zoom.exe. As an optimization it only examines directories named 'Zoom' or 'bin'.
   */
  private findZoomExeOnWindows(): string | undefined {
    // Zoom is installed in a subdirectory under APPDATA
    if(process.env.APPDATA) {
      const rootDir = process.env.APPDATA
      console.log(`APPDATA = ${rootDir}`)

      // Iterate over all files and subdirectories in the APPDATA directory and
      // search for ZOOM.EXE (note that the findZoomInDir function compares uppercase
      return this.findZoomInDir(rootDir, 'ZOOM.EXE')
    }

    // We didn't find the zoom executable
    return undefined
  }

  private findZoomExeOnMac(): string | undefined {
    const zoomExe = '/Applications/zoom.us.app/Contents/MacOS/zoom.us'
    if (!fs.existsSync(zoomExe)) {
      return undefined
    }
    return zoomExe
  }

  private findZoomInDir(dir: string, filename: string) : string | undefined {
    let zoomExe: string | undefined = undefined

    const files = fs.readdirSync(dir as PathLike)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      console.log(`Scanning file: ${filePath}`)
      const fileStats = fs.statSync(filePath)

      if (fileStats.isDirectory() && (file.toUpperCase() === 'ZOOM' || file.toUpperCase() === 'BIN')) {
        const found = this.findZoomInDir(filePath, filename)
        if (found) {
          zoomExe = found
        }
      } else {
        if (file.toUpperCase() === filename) {
          zoomExe = filePath
        }
      }
    })

    return zoomExe
  }

  /**
   * Returns the singleton instance of hte ConfigService.
   */
  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService()
    }

    return ConfigService.instance
  }

  /**
   * Returns the application configuration.
   */
  public getConfig(): Configuration {
    return this.appConfig
  }

  public addMeeting(name: string, abbreviation: string, url: string): void {
    // Get an ID for the meeting
    const maxId = this.appConfig.meetings.length > 0 ?
      Math.max.apply(Math, this.appConfig.meetings.map(meeting => meeting.id)) :
      0

    // let maxId = 0
    // if(this.appConfig.meetings.length > 0) {
    //   maxId = Math.max.apply(Math, this.appConfig.meetings.map(meeting => meeting.id))
    // }

    // Create a new meeting object
    const meeting: Meeting = {
      id: maxId + 1,
      name: name,
      abbreviation: abbreviation,
      url: url
    }

    // Add the meeting to the list of meetings
    this.appConfig.meetings.push(meeting)

    // Save the configuration
    this.saveConfig()
  }

  public deleteMeeting(id: number): void {
    // Filter out the meeting with the specified ID
    this.appConfig.meetings = this.appConfig.meetings.filter(m => m.id !== id)

    // Save the configuration
    this.saveConfig()
  }

  public saveMeeting(meeting: Meeting): void {
    for (let i = 0; i < this.appConfig.meetings.length; i++) {
      if (this.appConfig.meetings[i].id === meeting.id) {
        this.appConfig.meetings[i].name = meeting.name
        this.appConfig.meetings[i].abbreviation = meeting.abbreviation
        this.appConfig.meetings[i].url = meeting.url
      }
    }
    this.saveConfig()
  }

  /**
   * Loads the configuration from the config file.
   */
  private loadConfig(): Configuration {
    return JSON.parse(fs.readFileSync(this.appConfigPath, 'utf8')) as Configuration
  }

  /**
   * Saves the configuration to the config file.
   */
  private saveConfig(): void {
    fs.writeFileSync(this.appConfigPath, JSON.stringify(this.appConfig, null, 4))
  }
}

export default ConfigService
