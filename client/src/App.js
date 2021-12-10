import './app.css'
import {io} from 'socket.io-client';
import React, {useEffect, useRef, useState} from "react";
import ReactModal from 'react-modal';


// const socket = openSocket('localhost:8000/');
const localhost = "localhost"
const heroku = "https://lit-citadel-01156.herokuapp.com"
const socket = io(`${heroku}` )
// const socket = io(`${localhost}:${5000}`)

let ModalContent = (props) => {


    let {date, channel} = props
    date = new Date(date).toLocaleTimeString("ru-RU")

    return <div> {`[${date}] (${channel})`} </div>
}
let Modal = (props) => {
    let {modalPosition, showModal, setShowModal, chatElement} = props
    return <ReactModal
        style={{content: modalPosition}}
        isOpen={showModal}
        contentLabel="Minimal Modal Example"
        onRequestClose={() => setShowModal(false)}
        overlayClassName="Overlay"
        className="Modal"

    >
        <button onClick={() => setShowModal(false)}>Close Modal</button>
        <ModalContent date={chatElement.time} channel={chatElement.channel}/>
    </ReactModal>
}
let ChannelChat = (props) => {
    console.log(props)
    let {channelChat, setChatElement, setModalPosition, setShowModal, showModal} = props;
    return <div className="channelChat">
        {channelChat.map(chatElement => {
            return <Message
                setChatElement={setChatElement}
                setModalPosition={setModalPosition}
                showModal={showModal}
                setShowModal={setShowModal} chatElement={chatElement}/>
        })}
    </div>
}
let Message = (props) => {
    let {setModalPosition, setChatElement, setShowModal} = props
    let chatElement = props.chatElement
    let username = chatElement.userstate.username
    let text = chatElement.message
    let usernameColor = {
        color: chatElement.userstate.color
    }


    return <>
        <div>
    <span onClick={(event) => {
        console.log("onClick elemenet", chatElement)
        setModalPosition({left: event.clientX + "px", top: event.clientY + "px", right: "20px", bottom: "20px"})
        setShowModal(true)
        setChatElement(chatElement)

    }} style={usernameColor}> {username} : </span>
            <span> {text}</span>
        </div>
    </>
}

function App() {
    let chatTesting = [
        {userstate: {username: "test1", color: "black"}, message: "testing", channel: "1", time: new Date()},
        {userstate: {username: "test2", color: "black"}, message: "testing", channel: "2", time: new Date()},
        {userstate: {username: "test3", color: "black"}, message: "testing", channel: "3", time: new Date()},
        {userstate: {username: "test", color: "black"}, message: "testing", channel: "3", time: new Date()},
        {userstate: {username: "test", color: "black"}, message: "testing", channel: "testingChannel", time: new Date()}
    ]

    let [showModal, setShowModal] = useState(false)
    let [modalPosition, setModalPosition] = useState({left: "10px", top: "10px", right: "10px", bottom: "10px"})
    let [chat, setChat] = useState(chatTesting)
    let [chatElement, setChatElement] = useState(chat[0])

    function getChats(chat) {
        const chats = Array.from(new Set(chat.map(item => item.channel)));
        return chats.map(item => {
            const chats = item ? {name: item} : null;

            return {
                ...chats,
                chat: chat.filter(chatElement => chatElement.channel === item)
            };
        });
    }

    let chats = getChats(chat);
    console.log(getChats(chat))
    console.log("chat", chat)
    console.log("chatElement", chatElement)

    function subscribeToChat(cb) {
        socket.emit('subscribeToChat', 1000);
        socket.emit("get chat", null)
        socket.on('chat', chat => {
            console.log("receive chat", chat)
            cb(null, chat)
        });

    }

    useEffect(() => {
        subscribeToChat((err, chat) => {
            setChat(chat)
        })
    }, [])
    return <div>
        <Modal modalPosition={modalPosition} showModal={showModal} setShowModal={setShowModal} chatElement={chatElement}/>
        {chats.map(channel => {
            console.log(channel)
            return <div>
                {channel.name}
                <ChannelChat
                    setChatElement={setChatElement}
                    setModalPosition={setModalPosition}
                    setShowModal={setShowModal}
                    showModal={showModal}
                    channelChat={channel.chat}/>
            </div>
        })}
    </div>

}

export default App;
