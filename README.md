# Chat-Room
Chat Room web application using Flask and JavaScript.This project was done as a part of an online course at https://docs.cs50.net/ocw/web/projects/2/project2.html 
The features of the project are as follows:
Display Name: When a user visits the web application for the first time, they are prompted to type in a display name that will eventually be associated with every message the user sends. If a user closes the page and returns to the app later, the display name will still be remembered. This was acheived by using the global variables and local storage variables in the browser.
Channel Creation: Any user is able to create a new channel, so long as its name doesn’t conflict with the name of an existing channel.
Channel List: Users will be able to see a list of all current channels, and selecting one allows the user to view the channel. 
Messages View: Once a channel is selected, the user should can see any messages that have already been sent in that channel, up to a maximum of 100 messages. The app will only store the 100 most recent messages per channel in server-side memory.
Sending Messages: Once in a channel, users will be able to send text messages to others on the channel. When a user sends a message, their display name and the timestamp of the message will be associated with the message. All users in the channel will then see the new message (with display name and timestamp) appear on their channel page. Sending and receiving messages should NOT require reloading the page.
Remembering the Channel: If a user is on a channel page, closes the web browser window, and goes back to the web application, application remembers what channel the user was on previously and takes the user back to that channel.
