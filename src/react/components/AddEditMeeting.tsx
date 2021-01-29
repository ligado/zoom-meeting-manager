// import React, { useEffect, useState } from 'react'
import React, { useEffect } from 'react'
import {withRouter, RouteComponentProps} from "react-router"
import { useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Button, FormControl, IconButton, TextField } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { Meeting } from '../../electron/model/Configuration'

// CSS-in-JS styles
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  },
  container: {
    paddingTop: '50px'
  },
  inputField: {
    flexGrow: 1
  },
  icons: {
    color: 'white'
  },
  appBar: {
    marginTop: 0,
    backgroundColor: '#1976d2'
  },
  formGrid: {
    paddingTop: '50px'
  },
  formGridRow: {
    textAlign: 'center',
    paddingTop: '20px'
  },
  formFormControl: {
    minWidth: '400px',
    textAlign: 'left'
  }
}))

/**
 * Add / Edit Meeting component. This component allows users to create new meetings or
 * edit existing meetings.
 *
 * @param props     RouterComponentProps, which are used to obtain the location pathname
 * @constructor    Create a new AddEditMeeting
 */
const AddEditMeeting: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  // Load our actions
  const { addMeeting, saveMeeting, fetchMeeting, updateMeeting } = useActions()

  // Figure out if we're editing an existing meeting or if we're adding a new one
  const pathName: string = props.location.pathname
  const addMode = pathName === '/edit'

  // If we're editing an existing meerting then fetch it
  useEffect(() => {
    if (!addMode) {
      // Fetch the meeting that we're editing
      const meetingId = parseInt(pathName.substr(6))
      fetchMeeting(meetingId)
    } else {
      // Create a new empty meeting
      updateMeeting({
        id: 0,
        name: '',
        abbreviation: '',
        url: ''
      })
    }
  }, [])

  // Load the existing meeting from the redux store
  const meeting: Meeting = useTypedSelector((state: any) => state.editMeeting.meeting)

  // Load history so that we can navigate back to the homepage
  const history = useHistory()

  /**
   * Save our meeting. If we are adding a new meeting then add it, otherwise save it to the correct id
   */
  const save = () => {
    if (addMode) {
      // Add a new meeting
      addMeeting(meeting.name, meeting.abbreviation, meeting.url)
    } else if (meeting) {
      // Save an existing meeting
      saveMeeting(meeting.id, meeting.name, meeting.abbreviation, meeting.url)
    }

    // Redirect back to the home page
    history.push('/')
  }

  /**
   * Returns the title to show in the app bar, either add or edit.
   */
  const getTitle = () => {
    if (addMode) {
      return "Add Meeting"
    }
    return "Edit Meeting"
  }

  /**
   * Updates the meeting in Redux with the new name.
   * @param name  The updated meeting name
   */
  const updateName = (name: string) => {
    updateMeeting({
      id: meeting.id,
      name: name,
      abbreviation: meeting.abbreviation,
      url: meeting.url
    })
  }

  /**
   * Updates the meeting in Redux with the new abbreviation.
   * @param abbreviation  The updated meeting abbreviation
   */
  const updateAbbreviation = (abbreviation: string) => {
    updateMeeting({
      id: meeting.id,
      name: meeting.name,
      abbreviation: abbreviation,
      url: meeting.url
    })
  }

  /**
   * Updates the meeting in Redux with the new URL.
   * @param url  The updated meeting URL
   */
  const updateUrl = (url: string) => {
    updateMeeting({
      id: meeting.id,
      name: meeting.name,
      abbreviation: meeting.abbreviation,
      url: url
    })
  }

  // Create our CSS-in-JS
  const classes = useStyles()

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton onClick={() => history.push('/')}><ArrowBackIosIcon className={classes.icons}/></IconButton>
            <Typography variant="h6" className={classes.title}>{getTitle()}</Typography>
          </Toolbar>
        </AppBar>
      </div>

      <Grid container spacing={0} className={classes.formGrid}>
        <Grid item xs={12} className={classes.formGridRow}>
          <FormControl className={classes.formFormControl}>
            <TextField id="outlined-basic"
                       label="Name"
                       variant="outlined"
                       value={meeting.name}
                       onChange={event => updateName(event.target.value)} />
          </FormControl>
        </Grid>

        <Grid item xs={12} className={classes.formGridRow}>
          <FormControl className={classes.formFormControl}>
            <TextField id="outlined-basic"
                       label="Abbreviation"
                       variant="outlined"
                       value={meeting.abbreviation}
                       onChange={event => updateAbbreviation(event.target.value)} />
          </FormControl>
        </Grid>

        <Grid item xs={12} className={classes.formGridRow}>
          <FormControl className={classes.formFormControl}>
            <TextField id="outlined-basic"
                       label="URL"
                       variant="outlined"
              value={meeting.url}
              onChange={event => updateUrl(event.target.value)} />
          </FormControl>
        </Grid>

        <Grid item xs={12} className={classes.formGridRow}>
          <Button variant="contained" color="primary" onClick={() => save()}>Save</Button>
        </Grid>

      </Grid>

    </div>
  )
}

export default withRouter(AddEditMeeting)
