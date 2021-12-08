import openSocket from 'socket.io-client';
import {useEffect, useState} from "react";
// const socket = openSocket('localhost:8000/');
const localhost = "localhost"
const heroku = "https://lit-citadel-01156.herokuapp.com"
const socket = openSocket(`${heroku}:${process.env.PORT}`);

    function subscribeToChat(cb) {
  socket.on('chat', chat => {
    console.log("receive chat" , chat)
    cb(null, chat)
  });
  socket.emit('subscribeToChat', 1000);
}
function App() {
  let [chat, setChat] = useState([])
  useEffect(() => {
    console.log("subscribe to chat")
    subscribeToChat((err, chat) => {
      setChat(chat)
    })
  }, [])
return <div>
  Chat
  {chat.map(el => {
 return <Message el={el} />
  } )}
</div>
}
let Message = (props) => {
  let el = props.el
  let date = new Date(el.time)
  date = date.toLocaleTimeString("ru-RU")
  // let seconds = date.getSeconds();
  // let minutes = date.getMinutes();
  // let hour = date.getHours();
  let channel = el.channel
  let username = el.userstate.username
  let text = el.message
  let usernameColor = {
    color: el.userstate.color
  }

  return <div>
    <span> [{date}]</span>
    <span> ({channel})</span>
    <span style={usernameColor}> {username} : </span>
    <span > {text}</span>
  </div>
}
export default App;
