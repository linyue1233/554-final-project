import React, {useEffect, useState} from 'react';
import '../../App.css';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import { Avatar } from '@mui/material';

function User () {

    const [userData, setUserData] = useState();
    const [error, setError] = useState();
    const { id } = useParams();

    useEffect(() => {
        async function fetchData() {
            try{
                const {data} = await axios.get(`http://localhost:3000/users/${id}`);
                setUserData(data);
            }catch(e) {
                setError(e);
            }
        }

        fetchData();
    }, [id]);// eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return <div>{e}</div>
    } else if (userData) {
        return <div>
            <Avatar alt={userData.name} src={userData.avatar} />
            <p>{userData.name}</p>
        </div>
    }
    
}

export default User;