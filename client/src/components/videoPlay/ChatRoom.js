import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import '../../App.css';
import AuthService from '../../service/auth_service';

function ChatRoom(props) {
    const currentUser = AuthService.getCurrentUser();
    const [state, setState] = useState({ message: '', name: '' });
    const [chat, setChat] = useState([]);
    const [room, setRoom] = useState(props.videoId);
    const [name, setName] = useState(currentUser.username);

    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io('/');
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        socketRef.current.on('message', ({ name, message }) => {
            setChat([...chat, { name, message }]);
        });
        socketRef.current.on('user_join', function (data) {
            setChat([
                ...chat,
                { name: 'ChatBot', message: `${data} has joined the chat` },
            ]);
        });
    }, [chat]);

    const userjoin = (name, room) => {
        socketRef.current.emit('user_join', name, room);
        setRoom(room);
        setName(name);
    };

    const onMessageSubmit = (e) => {
        e.preventDefault();
        let msgEle = document.getElementById('message');
        if (msgEle.value.length === 0) return;
        console.log([msgEle.name], msgEle.value);
        setState({ ...state, [msgEle.name]: msgEle.value });
        socketRef.current.emit('message', {
            name: state.name,
            message: msgEle.value,
        });

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

    return (
        <div>
            {state.name && (
                <div className="card col-6">
                    <div className="render-chat card-header">
                        <h2>Chat Room:</h2>
                    </div>
                    <br />
                    <div className="card-body">
                        {renderChat()}
                        <form onSubmit={onMessageSubmit}>
                            {/* <h1>Messenger: {name}</h1> */}
                            <div className="row">
                                <div className="col-md-auto">
                                    <label htmlFor="message">Message:</label>
                                    <input
                                        name="message"
                                        id="message"
                                        variant="outlined"
                                        label="Message"
                                    />
                                </div>
                                &nbsp;&nbsp;
                                <button className="btn btn-primary col-md-auto">
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {!state.name && (
                <div>
                    <h3>Chatting room:</h3>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            setState({ name: name });
                            userjoin(name, room);
                            // userName.value = '';
                        }}
                    >
                        Join
                    </button>
                </div>
            )}
        </div>
    );
}

export default ChatRoom;
