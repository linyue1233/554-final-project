import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../../App.css';
import AuthService from '../../service/auth_service';
import axios from 'axios';
function Chat() {
    const [chat, setChat] = useState([]);
    const [room, setRoom] = useState();
    const [name, setName] = useState();
    const [roomList, setRoomList] = useState([]);
    const navigate = useNavigate();
    const socketRef = useRef();
    const [ifSelectChatroom, setIfSelectChatroom] = useState(true);
    const [currentSelect, setCurrentSelect] = useState(false);
    const [emptyChatroom, setEmptyChatroom] = useState(false);
    // const ifSelectChatroom = false;
    const user = AuthService.getCurrentUser();
    const [state, setState] = useState({ message: '', name: '' });
    useEffect(() => {
        // socketRef.current = io('http://localhost:3001', {
        //     transports: ['websocket', 'polling'],
        // });
        socketRef.current = io('/');
        async function fetchData() {
            try{
                if (user.username !== 'admin') {
                    //如果不是admin直接链接到chatroom
                    socketRef.current.emit('userJoin', user.username, user.username);
                    await axios.post(`/chatroom/${user.username}`);
                    setRoom(user.username);
                    setName(user.username);
                    setState({ message: '', name: user.username });
                    let tempList = localStorage.getItem('roomList');
                    if (tempList === null) {
                        let roomName = user.username;
                        localStorage.setItem('roomList', roomName);
                        tempList = localStorage.getItem('roomList');
                        setRoomList(roomName);
                    } else {
                        let roomName = user.username;
                        tempList = tempList + ',' + roomName;
                        localStorage.removeItem('roomList');
                        localStorage.setItem('roomList', tempList);
                    }
                } else if (user.username === 'admin') {
                    //如果是admin并且没有选择chatroom
                    setCurrentSelect(true);
                    setName(state.name);
                    setState({ message: '', name: user.username });
                    let tempList =await axios.get(`/chatroom`);
                    console.log(tempList);
                    if (tempList.data.length === 0) {
                        setEmptyChatroom(true);
                        setRoomList([]);
                    } else {
                        setEmptyChatroom(false);
                        setRoomList(tempList.data);
                    }
                }
            }catch(err){
                console.log(err);
            }

            return () => {
                socketRef.current.disconnect();
            };
        }
        fetchData();
    }, [currentSelect, ifSelectChatroom]);

    useEffect(() => {
        socketRef?.current?.on('messageClient', ({ name, message, timestamp }) => {
            setChat((preVal) => {
                const exist = preVal.some((item) => item.timestamp === timestamp);
                return exist ? preVal : [...preVal, { name, message, timestamp }];
            });
        });
        socketRef.current.on('userJoin', function (data) {
            setChat([...chat, { name: 'ChatBot', message: `${data} has joined the chat` }]);
        });
    }, [socketRef.current]);
    const onMessageSubmit = (e) => {
        let msgEle = document.getElementById('message');
        setState({ ...state, [msgEle.name]: msgEle.value });
        socketRef.current.emit('messageClient', {
            name: state.name,
            message: msgEle.value,
            room: room,
        });
        e.preventDefault();
        setState({ message: '', name: state.name });
        msgEle.value = '';
        msgEle.focus();
    };

    const renderChat = () => {
        return chat.map(({ name, message }, index) => (
            <div key={index}>
                <h3>
                    {name}: <span>{message}</span>
                </h3>
            </div>
        ));
    };
    const handleSelectChatroom = (room) => {
        setRoom(room);
        setChat([]);
        setName(user.username);
        setIfSelectChatroom(false);
        socketRef.current.emit('userJoin', user.username, room);
    };
    const handleDeleteChatRoom = (room) => {
        axios.delete(`/chatroom/${room}`);
        let tempList = roomList;
        let newList =[]
        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i] !== room) {
                newList.push(tempList[i]);
            }
        }
        setRoomList(newList);
        navigate('/');
    };
    return currentSelect ? (
        ifSelectChatroom ? (
            <div>
                {emptyChatroom ? (
                    <div>
                        <h1>No chatroom yet</h1>
                        </div>
                        ) : (
                <ul>{}
                    {roomList &&
                        roomList.map((room) => (
                            <li key={room}>
                                <button onClick={() => handleSelectChatroom(room)}>{room}</button>
                            </li>
                        ))}
                </ul>
                )}
            </div>
        ) : (
            <div>
                {state.name && (
                    <div className="card">
                        <div className="render-chat">
                            <h1>Chat Room:{room}</h1>
                            {renderChat()}
                        </div>

                        <form onSubmit={onMessageSubmit}>
                            <h1>Messenger: {name}</h1>
                            <div>
                                <label for="message"></label>
                                <input name="message" id="message" variant="outlined" label="Message" />
                            </div>
                            <button>Send Message</button>
                        </form>
                        <button
                            onClick={() => {
                                setIfSelectChatroom(true);
                            }}
                        >
                            select room
                        </button>
                    </div>
                )}
            </div>
        )
    ) : (
        <div>
            {state.name && (
                <div className="card">
                    <div className="render-chat">
                        <h1>Chat Room:{room}</h1>
                        {renderChat()}
                    </div>
                    <form onSubmit={onMessageSubmit}>
                        <h1>Messenger: {name}</h1>
                        <div>
                            <label for="message"></label>
                            <input name="message" id="message" variant="outlined" label="Message" />
                        </div>
                        <button>Send Message</button>
                    </form>
                    <button
                        onClick={() => {
                            handleDeleteChatRoom(room);
                        }}
                    >
                        quit chatroom
                    </button>
                </div>
            )}
        </div>
    );
}

export default Chat;
