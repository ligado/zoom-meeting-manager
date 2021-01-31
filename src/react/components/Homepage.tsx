import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { useActions } from '../hooks/useAction'
import { IconButton } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import SettingsIcon from '@material-ui/icons/Settings'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import MeetingCard from './MeetingCard'
import { Meeting } from '../../electron/model/Configuration'

// CSS-in-JS styles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    fontSize: '16px'
  },
  icons: {
    color: 'white'
  },
  appBar: {
    // borderBottom: `1px solid ${theme.palette.divider}`,
    marginTop: 0,
    backgroundColor: '#1976d2'
  }
}))

/**
 * The Homepage component. This component displays an AppBar and a list of MeetingCards
 * for all current meetings
 * @constructor
 */
const Homepage: React.FC = () => {
  // Load our actions
  const { fetchMeetings, getOs, exitApp } = useActions()

  // Get our redux state
  const { meetings } = useTypedSelector((state: any) => state.meetings)
  const { operatingSystem } = useTypedSelector((state: any) => state.operatingSystem)

  // Load our meetings from redux when the component is first loaded
  useEffect(() => {
    getOs()
    fetchMeetings()
  }, [])

  // Access history so that we can push to the AddEditMeeting whenever the user
  // presses the Add button in the AppBar
  const history = useHistory()

  /**
   * Returns a list of MeetingCards
   */
  const renderMeetingCards = () => {
    if (!meetings) {
      return <div/>
    }
    return meetings.map((meeting: Meeting) => {
      return (
        <MeetingCard
          key={meeting.id}
          meetingId={meeting.id}
          name={meeting.name}
          abbreviation={meeting.abbreviation}
          url={meeting.url}/>
      )
    })
  }

  // Create our CSS-in-JS classes
  const classes = useStyles()
  console.log(`OS: ${operatingSystem}`)
  const isMacOs = (): boolean => {
    return operatingSystem === 'darwin'
  }

  const renderExitButton = () => {
    if (isMacOs()) {
      return <IconButton onClick={() => exitApp()}><ClearIcon className={classes.icons}/></IconButton>
    }
    return <div></div>
  }

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar variant="dense">
            <Typography variant="h6" className={classes.title}>
              Zoom Meeting Manager
            </Typography>
            <IconButton onClick={() => history.push('/edit')}><AddIcon className={classes.icons}/></IconButton>
            <IconButton><SettingsIcon className={classes.icons}/></IconButton>
            {renderExitButton()}
          </Toolbar>
        </AppBar>
      </div>

      {renderMeetingCards()}
    </div>
  )
}

export default Homepage
