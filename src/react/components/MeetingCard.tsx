import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import { IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import { makeStyles } from '@material-ui/core/styles'
import { useActions } from '../hooks/useAction'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  avatar: {
    backgroundColor: '#1976d2'
  }
}))

/**
 * MeetingProps: properties required to create a MeetingCard.
 */
interface MeetingProps {
  meetingId: number
  name: string
  abbreviation: string
  url: string
}

/**
 * Creates a new MeetingCard. This is a card that displays a meeting and provides buttons to launch a meeting,
 * edit a meeting, or delete a meeting
 *
 * @param meetingId     The ID of the meeting
 * @param name          The name of the meeting
 * @param abbreviation  The abbreviation of the meeting (the characters displayed next to the meeting)
 * @param url           The URL of the Zoom meeting
 * @constructor         Creates a new MeetingCard with the specified MeetingProps
 */
const MeetingCard: React.FC<MeetingProps> = ({meetingId, name, abbreviation, url}) => {

  // Get the history object so we can navigate around the app
  const history = useHistory()

  // Load our actions
  const { launchZoomMeeting, deleteMeeting, fetchMeetings } = useActions()

  /**
   * Deletes the meeting with the specified ID. Triggers the fetchMeetings action to reload the current
   * list of meetings.
   */
  const onDelete = () => {
    // Delete this meeting
    deleteMeeting(meetingId)

    // Fetch the new list of meetings so the Homepage will refresh the display
    fetchMeetings()
  }

  /**
   * Redirect to that AddEditMeeting component, passing it the ID of the meeting to edit, in the form /edit/{id}
   */
  const onEdit = () => {
    history.push(`/edit/${meetingId}`)
  }

  // Create our CSS-in-JS object
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {abbreviation}
          </Avatar>
        }
        action={
          <div>
            <IconButton aria-label="Delete" onClick={onDelete}>
              <DeleteIcon/>
            </IconButton>
            <IconButton aria-label="Edit" onClick={onEdit}>
              <EditIcon/>
            </IconButton>
            <IconButton aria-label="Launch" onClick={() => launchZoomMeeting(url)}>
              <PlayArrowIcon/>
            </IconButton>
          </div>
        }
        title={name}
        // subheader="Last Accessed: September 14, 2016"
      />
    </Card>)
}

export default MeetingCard
