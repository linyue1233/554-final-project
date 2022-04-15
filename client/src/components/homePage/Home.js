import React from 'react';
import '../../App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from './Carousel';

function Home() {
    return (
        <div className="container-sm">
            <Carousel />
        </div>
    );
}

export default Home;
