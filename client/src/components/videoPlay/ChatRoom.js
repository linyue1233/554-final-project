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
        let msgEle = document.getElementById('message');
        console.log([msgEle.name], msgEle.value);
        setState({ ...state, [msgEle.name]: msgEle.value });
        socketRef.current.emit('message', {
            name: state.name,
            message: msgEle.value,
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

    return (
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
                            <input
                                name="message"
                                id="message"
                                variant="outlined"
                                label="Message"
                            />
                        </div>
                        <button>Send Message</button>
                    </form>
                </div>
            )}

            {!state.name && (
                <form
                    className="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setState({ name: name });
                        userjoin(name, room);
                        // userName.value = '';
                    }}
                >
                    {/* <div className="form-group">
                        <label>
                            User Name:
                            <br />
                            <input id="username_input" />
                            <br />
                        </label>
                        <label>
                            Room:
                            <br />
                            <input id="room_input" />
                        </label>
                    </div> */}
                    <br />

                    <br />
                    <br />
                    <button type="submit"> Click to join</button>
                </form>
            )}
        </div>
    );
}

export default ChatRoom;
