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
    console.log(currentUser);

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
                <div className="container">
                    <div className="render-chat">
                        <h2>Live chat:</h2>
                    </div>
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
                        {renderChat()}
                    </div>
                    <form onSubmit={onMessageSubmit}>
                        <div className="col-md-auto border-top">
                            <label htmlFor="message">{name}</label>
                            &nbsp;
                            <input
                                style={{ width: '100%', marginBottom: '10px' }}
                                name="message"
                                id="message"
                                variant="outlined"
                                label="Message"
                                placeholder="Say something..."
                            />
                        </div>
                        <div className="d-flex flex-row-reverse">
                            <button className="btn btn-primary  p-2">Send</button>
                        </div>
                        <br />
                    </form>
                </div>
            )}

            {!state.name && (
                <div className="container">
                    <h2 className="border-bottom">Live chat:</h2>
                    <br />
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
                    <br />
                    <br />
                </div>
            )}
        </div>
    );
}

export default ChatRoom;
