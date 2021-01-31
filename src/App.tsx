import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './react/state'
import TitleBar from 'frameless-titlebar/dist'
import { remote } from 'electron'
import { Platform } from 'frameless-titlebar/dist/title-bar/typings'

import Homepage from './react/components/Homepage'
import AddEditMeeting  from './react/components/AddEditMeeting'

const icon = '../assets/icon.png'
const currentWindow = remote.getCurrentWindow()

const App = () => {
  // useHistory()
  const renderTitleBar = () => {
    if (process.platform !== 'darwin') {
      return (
        <TitleBar title="Zoom Meeting Manager"
                  iconSrc={icon}
                  currentWindow={currentWindow}
                  platform={process.platform as Platform}
                  onClose={() => currentWindow.close()}
                  onMinimize={() => currentWindow.minimize()}
                  onMaximize={() => currentWindow.isMaximized() ? currentWindow.restore() : currentWindow.maximize()}
                  onDoubleClick={() => currentWindow.isMaximized() ? currentWindow.restore() : currentWindow.maximize()}/>
      )
    }
    return <div></div>
  }
  return (
    <Provider store={store}>
      <Router>
        {/*<TitleBar title="Zoom Meeting Manager"*/}
        {/*          iconSrc={icon}*/}
        {/*          currentWindow={currentWindow}*/}
        {/*          platform={process.platform as Platform}*/}
        {/*          onClose={() => currentWindow.close()}*/}
        {/*          onMinimize={() => currentWindow.minimize()}*/}
        {/*          onMaximize={() => currentWindow.isMaximized() ? currentWindow.restore() : currentWindow.maximize()}*/}
        {/*          onDoubleClick={() => currentWindow.isMaximized() ? currentWindow.restore() : currentWindow.maximize()}/>*/}
        {renderTitleBar()}
        <Switch>
          <Route path="/edit" component={AddEditMeeting}/>
          <Route path="/" component={Homepage}/>
        </Switch>
      </Router>
    </Provider>
  )
}

export default App
