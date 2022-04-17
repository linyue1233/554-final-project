import React from 'react';
import '../../App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from './Carousel';
import Classification from './Classification';

function Home() {
    return (
        <div className="container">
            <div className="text-center">
                <Carousel />
            </div>
            <br />
            <br />
            <div>
                <Classification tag={'action'} />
            </div>
        </div>
    );
}

export default Home;
