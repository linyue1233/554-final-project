import React, { useEffect, useRef, useState } from 'react';
import { List, ListItemButton,ListItemText } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
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
    const user = AuthService.getCurrentUser();
    const [state, setState] = useState({ message: '', name: '' });
    useEffect(() => {
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
    }, [currentSelect, ifSelectChatroom,state.name,user.username]);

    useEffect(() => {
        socketRef?.current?.on('messageClient', ({ name, message, timestamp }) => {
            setChat((preVal) => {
                const exist = preVal.some((item) => item.timestamp === timestamp);
                return exist ? preVal : [...preVal, { name, message, timestamp }];
            });
        });
        socketRef?.current?.on('userJoin', function (data) {
            setChat([...chat, { name: 'ChatBot', message: `${data} has joined the chat` }]);
        });
        // // userDelete
        // socketRef?.current?.on('userDelete', function (data) {
        //     console.log(1111111);
        //     setChat([...chat, { name: 'ChatBot', message: `${data} has deleted the chat` }]);
        // });
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
                <h2>
                    {name}: <span>{message}</span>
                </h2>
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
        socketRef?.current?.on('userDelete', function (data) {
            setChat([...chat, { name: 'ChatBot', message: `${data} has joined the chat` }]);
        });
        setRoomList(newList);
        navigate('/');
    };
    return currentSelect ? (
        ifSelectChatroom ? (
            <div>
                {emptyChatroom ? (
                    <div>
                        <h1>No chatroom yet</h1>
                    </div>) : (
                    <div>
                        <h1>Chatroom List</h1>
                        <List>
                            {roomList &&roomList.map((room) => (
                                <ListItemButton onClick={() => handleSelectChatroom(room)}>
                                    <SupportAgentIcon />
                                    <ListItemText primary={room} />
                                </ListItemButton>))}
                        </List>
                    </div>
                )}
            </div>
        ) : (
            <div>
                {state.name && (
                    <div className="card">
                        <div
                        className="overflow-auto"
                        style={{
                            height: '350px',
                            width: '100%',
                            border: '1px solid #ccc',
                            padding: '10px',
                            'margin-bottom': '10px',
                        }}>
                            <h1>Chat Room:{room}</h1>
                            {renderChat()}
                        </div>

                        <form onSubmit={onMessageSubmit}>
                            <h1>Messenger: {name}</h1>
                            <div className="col-md-auto border-top">
                                <label for="message"></label>
                                <input 
                                    style={{ width: '100%', marginBottom: '10px' }}
                                    name="message"
                                    id="message"
                                    variant="outlined"
                                    label="Message"
                                    placeholder="Say something..." />
                            {/* </div>
                            <div className="d-flex flex-row-reverse"> */}
                                <button className="btn btn-primary  p-2">Send Message</button>
                            </div>
                        </form>
                        <button
                            className="btn btn-primary  p-2"
                            onClick={() => {
                                handleDeleteChatRoom(room);
                            }}>
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
                    <div
                        className="overflow-auto"
                        style={{
                            height: '350px',
                            width: '100%',
                            border: '1px solid #ccc',
                            padding: '10px',
                            'margin-bottom': '10px',
                        }}
                    >
                        <h1>Chat Room:{room}</h1>
                        {renderChat()}
                    </div>
                    <form onSubmit={onMessageSubmit}>
                        <h1>Messenger: {name}</h1>
                        <div className="col-md-auto border-top">
                            <label for="message"></label>
                            <input 
                                style={{ width: '100%', marginBottom: '10px' }}
                                name="message"
                                id="message"
                                variant="outlined"
                                label="Message"
                                placeholder="Say something..." />
                        {/* </div>
                        <div className="d-flex flex-row-reverse"> */}
                            <button className="btn btn-primary  p-2">Send Message</button>
                        </div>
                        
                    </form>
                    <button
                        className="btn btn-primary  p-2"
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
