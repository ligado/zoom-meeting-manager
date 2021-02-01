# zoom-meeting-manager
Electron Tray App that launches Zoom meetings

This is a simple Electron application that launches Zoom meetings. The challenge that my kids faced was that they have multiple Zoom classes each day and, unlike me, they are not 
using Outlook with a calendar that they can easily access. So instead, they had been maintaining notepads with the Zoom URLs. To make their tasks easier, I built a simple GUI
to which they can add their zoom meetings and then launch directly into their zoom meeting without needing to open a browser window.

On a personal note, I got frustrated opening a meeting in Outlook, clicking on the meeting link, letting it open a browser windows, selecting "Open in Zoom", getting into the meeting, 
and then closing the browser tab. So this has simplified my daily meetings as well.

Technology
----------
Part of this project was simply that I wanted to apply my Typescript/React/Redux learning. I knew React and Redux well, as well as building Electron apps, but I am switching 
from JavaScript to TypeScript and React class components to React function components. The best way to solidify understanding of a technology is to use it, and this provided
an opportunity.

Building and Running
--------------------
I have tested this on both Windows and Mac. It runs as a system tray application - clicking on the tray icon shows the UI, clicking anywhere outside the app or on the tray
icon again, hides the application. To close on Windows right-click on the tray icon and choose "Exit". To close on Mac, I added an X button on the main window.

This app is built from the electron-react-boilerplate and thus uses Yarn. 

Installing dependencies:
```
yarn
```

Building and running locally:
```
yarn start
```

Packing the app into a DMG or Windows installation file:
```
yarn package
```

Known Issues
------------
- Scrolling scrolls the whole window
- The X button on Mac that closes the entire tray app is confusing. After my son added a meeting he instinctively clicked it and had to relaunch. This is not a bug, but I need to rethink how to exit the app rather than close the window
- The redux integration needs to be cleaned up. It works fine, but the Redux dev tools are not working and my feeble attempts to make it work (copying configuration from my Electron apps in which it is working) left the the ```store.ts``` file in need of cleanup
