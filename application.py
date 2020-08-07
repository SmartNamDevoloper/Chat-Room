import os

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

displayName =''
channel_visit =""
channel_names = []
channelObjList = []
class Channel:
    def __init__(self, channelName):
        self.channelName = channelName
        self.messageList = []

@app.route("/")
def index():
    template_context= dict(displayName=displayName, channel_names=channel_names,channelObjList =channelObjList)
    return render_template("index.html",**template_context)

@socketio.on("assign display name")
def assignName(displayName):
    displayName = displayName['displayName']
    print(displayName)
    emit("Update Display Name", displayName)

@socketio.on("create channel")
def createChannel(channelName):
    channelName = channelName['channelName']
    print(f"channelName before appending,{{channelName}}")
    channelName=channelName.strip(':')
    print(f"channelName after stripping,{{channelName}}")
    if channel_names.count(channelName) > 0:
        print("NAMEerror")
        emit("name already exists error")
    else:
        channel_names.append(channelName)
        print (f"Appending channel to channel_names,{{channel_names}}")
        channel_visit=channelName
        # Create a Class in channel name to save Messages
        channelObj = Channel(channelName)
        print(channelObj.channelName)
        channelObjList.append(channelObj)
        for channelObj in channelObjList:
            print(f"Printing Object",channelObj.channelName)
        emit ("update channel list display", channel_visit, broadcast=True)
        emit("enter new channel", channel_visit)

@socketio.on('show channel list')
def showChannelList():
    print (channel_names)
    emit ("update channel list display", channel_names, broadcast=True)

@socketio.on("visit channel")
def vistChannel(channelName):
    channelName = channelName['channelName']
    channelName=channelName.strip(':')
    for channelObj in channelObjList:
        if(channelObj.channelName == channelName):
            emit('update conversation', channelObj)

@socketio.on('send message')
def sendMessage(message, channel_visit):
    message =message['message']
    print (channel_visit)
    channelName = channel_visit.get("channel_visit")
    for channelObj in channelObjList:
        if(channelObj.channelName == channelName):
            channelObj.messageList.append(message)
            if len(channelObj.messageList)>100:
                channelObj.messageList = channelObj.messageList[100:]
            print(f"channel Message appended",channelObj.channelName,channelObj.messageList)
            emit ('message broadcast',{"channelName":channelName,"message":message}, broadcast=True)

@socketio.on("get channel messages")
def showMessages(channel_name):
    print(f"Inside get channel messages and the channel name is,{{channel_name}}")
    channelName = channel_name.get("channel_name")
    print (f"Inside get channel messages,{{channelName}}")
    if (channel_names):
        emit("enter channel", channelName)
        for channelObj in channelObjList:
            if(channelObj.channelName == channelName):
                print(f"channel Message retrieved",channelObj.channelName,channelObj.messageList)
                emit("show channel messages",channelObj.messageList)
