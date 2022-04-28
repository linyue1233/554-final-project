import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
import OneVideo from './OneVideo';
import axios from 'axios';
import { Grid,Box,Button,ButtonGroup,Pagination } from '@mui/material';

function AllVideo() {
    const { tag } = useParams();
    const { tempType } = useParams();
    const [videoData, setVideoData] = useState();
    const [type,setType] = useState(tempType);
    const [page,setPage] = useState();
    const [totalPage,setTotalPage] = useState();
    const [curData,setCurData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const data = await axios.get(`/videos/getAllVideosByTag/${tag}/${type}`);
            setVideoData(group(data.data,2));
            setCurData(group(data.data,2)[0]);
            let pageNum = (data.data.length % 2)=== 0 ? parseInt(data.data.length / 2) :parseInt( data.data.length / 2 )+ 1;
            setTotalPage(pageNum);
            setPage(1);
        }
        fetchData();
    }, [tag,type]);
   const group = (array = [], subGroupLength = 0) => {
        let index = 0;
        const newArray = [];
        while (index < array.length) {
            newArray.push(array.slice(index, index += subGroupLength));
        }
        return newArray;
    }
    const setTypeHandler = (type) => {
        setType(type);
    }   
    const handChangePage = (event, value)=> {
        event.preventDefault();
        setPage(value);
        setCurData(videoData[value - 1]);
    }
    return videoData ? (
        <Box> 
            <ButtonGroup variant="text" aria-label="text button group">
                <Button
                    onClick={() => {
                        setTypeHandler('likeCount');
                    }}
                >
                    likeCount
                </Button>
                <Button
                    onClick={() => {
                        setTypeHandler('viewCount');
                    }}
                >
                    viewCount
                </Button>
                <Button
                    onClick={() => {
                        setTypeHandler('uploadDate');
                    }}
                >
                    uploadDate
                </Button>
            </ButtonGroup>
            <Pagination className='pagination' count={totalPage} page={+page} showFirstButton showLastButton onChange={handChangePage}/>
            <Grid container className="allVideo" spacing={2}>
                {curData &&
                curData.map((video) => {
            return <OneVideo video={video} />})}
            </Grid>
        </Box>  
    ):(
        <div className="card col">
            <p className="card-text">
                loading...
            </p>
        </div>
    );
}
export default AllVideo;
