document.addEventListener('DOMContentLoaded', () => {
// Dispaly Name from last session
  if (localStorage.getItem('displayName')){
    document.querySelector(".displayNameShow").innerHTML = localStorage.getItem('displayName');
    document.querySelector(".promptDisplayName").style.display = "none";
      }
  else{
      document.querySelector(".error_display").innerHTML = "Create a display Name to chat";
      document.querySelector(".channelNameButton").disabled=true;
      document.querySelector(".display_channel_list").style.display = "none";
      document.querySelector(".channel_message_area").style.display = "none";
  }
  if(!(localStorage.getItem('channel_visit') || localStorage.getItem('channel_visit') =='undefined')){
    document.querySelector(".channel_message_area").style.display = "none";
    document.querySelector(".error_channel_display").innerHTML ="Create a channel to chat";

  }
      // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons and display
    socket.on('connect', () => {
      //Showing the chat messages of the last visited channel
      var channel_name = localStorage.getItem('channel_visit');

      socket.emit("get channel messages", {'channel_name':channel_name});
      //Assign display Name with mouse click
        document.querySelector('.displayNameButton').onclick= ()=>{
        const displayName = document.querySelector(".displayName").value;
        document.querySelector(".promptDisplayName").style.display = "none";
        socket.emit ("assign display name",{'displayName':displayName});
        };
          //Assign display Name with Enter button
        document.querySelector('.displayName').addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.querySelector(".displayNameButton").click();
        }
      });

        //Creating a new  channel with enter button
        document.querySelector('.newChannelName').addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.querySelector(".channelNameButton").click();
        }
      });
      //Creating a new  channel with mouse click
        document.querySelector('.channelNameButton').onclick =()=>{
          const channelName = document.querySelector('.newChannelName').value;
          document.querySelector('.newChannelName').value ="";
          socket.emit("create channel",{'channelName':channelName});
        }

//Button to send a message
        document.querySelector('.message').addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
          if (event.keyCode === 13) {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.querySelector(".sendMessage").click();
          }
        });
      document.querySelector('.sendMessage').onclick = () =>{
        var d = new Date();
        const message={
        name: localStorage.getItem('displayName'),
        text: document.querySelector(".message").value,
        time: d.getHours()+':'+d.getMinutes()+" "+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
      };
        document.querySelector(".message").value ="";
        const channel_visit = localStorage.getItem('channel_visit');
        console.log(channel_visit);
        socket.emit("send message",{'message':message}, {'channel_visit':channel_visit});
      }

      if(document.querySelector('#channelName')){
        document.querySelectorAll('#channelName').forEach(function(button){
          button.onclick= () =>{
            var channel_name = event.srcElement.name;
            console.log("Inside click of channel name")
            console.log(channel_name);
            document.querySelector(".current_channel_name_display").innerHTML = channel_name;
            socket.emit("get channel messages", {'channel_name':channel_name});
          }
        });

      }


    });
  socket.on ('message broadcast', data=>{
    var channel_name=data.channelName;
    var message = data.message;
    if(localStorage.getItem('channel_visit')==channel_name){
      console.log("broadcast"+channel_name+"  "+message)
      var chatTabl = document.createElement("table");
      chatTabl.setAttribute("id","chatTable");
      var chatrow = document.createElement("tr");
      chatrow.setAttribute("id","chatrow");
      chatTabl.appendChild(chatrow);
      var dataChat_name = document.createElement("td");
      dataChat_name.innerHTML =message.name+"  says:";
      dataChat_name.setAttribute("id","chat_table_name");
      chatrow.appendChild(dataChat_name);
      var dataChat_text = document.createElement("td");
      dataChat_text.innerHTML =message.text;
      dataChat_text.setAttribute("id","chat_table_text")
      chatrow.appendChild(dataChat_text);
      var dataChat_time = document.createElement("td");
      dataChat_time.innerHTML =message.time;
      dataChat_time.setAttribute("id","chat_table_time");
      chatrow.appendChild(dataChat_time);
      document.querySelector(".channel_chat").append(chatTabl);
      //to focus at bottom of scroll
      chatWindow = document.querySelector(".channel_chat");
      var xH = chatWindow.scrollHeight;
      chatWindow.scrollTo(0, xH);
    }
  });


    socket.on ('Update Display Name', data=>{
      localStorage.setItem('displayName', data);
      document.querySelector(".displayNameShow").innerHTML = data;
      document.querySelector(".error_display").style.display  = "none";
      document.querySelector(".display_channel_list").style.display = "block";
      document.querySelector(".channelNameButton").disabled=false;
      if(localStorage.getItem('channel_visit')!="undefined" && localStorage.getItem('channel_visit') ){
        document.querySelector(".channel_message_area").style.display = "block";
      }else{
        document.querySelector(".channel_message_area").style.display  = "none";
      }

    });


    socket.on('name already exists error',()=>{
      // document.querySelector('.error_display').innerHTML="Name already exists";
      alert("Name already exists");
    });

    socket.on('update channel list display', channel_visit =>{
      document.querySelector(".error_channel_display").style.display = "none";
      document.querySelector(".channel_message_area").style.display = "block";
      //Appending the channel name to the messageList
      var br = document.createElement('br');
      document.querySelector('.display_channel_list').appendChild(br);
      var hr = document.createElement('hr');
      document.querySelector('.display_channel_list').appendChild(hr);
      var button =document.createElement('button');
      button.innerHTML=channel_visit;
      var id = document.createAttribute('id');
      button.attributes.setNamedItem(id);
      id.value = "channelName";
      var ne = document.createAttribute('name');
      ne.value = channel_visit;
      button.attributes.setNamedItem(ne);
      var onclick = document.createAttribute('onclick');
      onclick.value = 'showChannelMessages("'+channel_visit+'")';
      // onclick.value = 'socket.emit("get channel messages", {\'channel_name\':'+channel_visit+'});';
      console.log(onclick.value);
      button.attributes.setNamedItem(onclick);
      document.querySelector('.display_channel_list').append(button);
      });

    socket.on('enter new channel', channel_visit =>{
      localStorage.setItem('channel_visit',channel_visit);
      document.querySelector(".error_channel_display").style.display = "none";
      document.querySelector(".channel_message_area").style.display = "block"
      document.querySelector('.current_channel_name_display').innerHTML=channel_visit;
      document.querySelector('.channel_chat').innerHTML ="";
      // //Appending the channel name to the messageList
      // var br = document.createElement('br');
      // document.querySelector('.display_channel_list').appendChild(br);
      // var hr = document.createElement('hr');
      // document.querySelector('.display_channel_list').appendChild(hr);
      // var button =document.createElement('button');
      // button.innerHTML=channel_visit;
      // var id = document.createAttribute('id');
      // button.attributes.setNamedItem(id);
      // id.value = "channelName";
      // var ne = document.createAttribute('name');
      // ne.value = channel_visit;
      // button.attributes.setNamedItem(ne);
      // var onclick = document.createAttribute('onclick');
      // onclick.value = 'showChannelMessages("'+channel_visit+'")';
      // // onclick.value = 'socket.emit("get channel messages", {\'channel_name\':'+channel_visit+'});';
      // console.log(onclick.value);
      // button.attributes.setNamedItem(onclick);
      // document.querySelector('.display_channel_list').append(button);
      });

      socket.on('enter channel', channel_visit =>{
        localStorage.setItem('channel_visit',channel_visit);
        document.querySelector('.current_channel_name_display').innerHTML=channel_visit;
        document.querySelector('.channel_chat').innerHTML ="";
        });

    socket.on('update conversation', channelObj =>{
      // for message in channelObj.messageList
        document.querySelector('.channel_message_area').innerHTML;
    });

    socket.on('show channel messages',channelMsgs =>{
      console.log("Inside show channel messages");
      if(localStorage.getItem('channel_visit')!="undefined"){
        document.querySelector(".channel_message_area").style.display = "block";
      }
      for (message in channelMsgs){
        var chatTabl = document.createElement("table");
        chatTabl.setAttribute("id","chatTable");
        var chatrow = document.createElement("tr");
        chatrow.setAttribute("id","chatrow");
        chatTabl.appendChild(chatrow);
        var dataChat_name = document.createElement("td");
        dataChat_name.innerHTML =channelMsgs[message].name+"  says:";
        dataChat_name.setAttribute("id","chat_table_name");
        chatrow.appendChild(dataChat_name);
        var dataChat_text = document.createElement("td");
        dataChat_text.innerHTML =channelMsgs[message].text;
        dataChat_text.setAttribute("id","chat_table_text")
        chatrow.appendChild(dataChat_text);
        var dataChat_time = document.createElement("td");
        dataChat_time.innerHTML =channelMsgs[message].time;
        dataChat_time.setAttribute("id","chat_table_time");
        chatrow.appendChild(dataChat_time);
        document.querySelector(".channel_chat").append(chatTabl);
      }

    });

});
// called from html when channel name is clicked from the list
function showChannelMessages(channel_name){
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  console.log("Inside show  Channel messages")
  console.log(event.srcElement.name);
  console.log(channel_name);
  socket.emit("get channel messages", {'channel_name':channel_name});
  }
