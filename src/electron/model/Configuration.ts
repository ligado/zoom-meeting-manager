export interface Meeting {
  id: number,
  name: string,
  abbreviation: string,
  url: string
}

export interface Configuration {
  zoomExecutable: string
  meetings: Meeting[]
}
