import axios, { Axios } from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
import { Grid,Box,Pagination } from '@mui/material';
import OneVideo from './OneVideo';
function ShowSearchVideo(){
   const {searchTerm} = useParams();
    const [videoData, setVideoData] = useState();
    const [page,setPage] = useState();
    const [totalPage,setTotalPage] = useState();
    const [curData,setCurData] = useState([]);
    const group = (array = [], subGroupLength = 0) => {
        let index = 0;
        const newArray = [];
        while (index < array.length) {
            newArray.push(array.slice(index, index += subGroupLength));
        }
        return newArray;
    }
    const handChangePage = (event, value)=> {
        event.preventDefault();
        setPage(value);
        setCurData(videoData[value - 1]);
    }
   useEffect(() => {
         async function fetchData() {
            try {
               let {data} = await axios(
                  {
                     method: 'POST',
                     url: '/videos/search',
                     data:{
                           searchTerm: searchTerm
                     }
                  }
               );
            setVideoData(group(data,1));
            setCurData(group(data,1)[0]);
            let pageNum = (data.length % 1)=== 0 ? parseInt(data.length / 1) :parseInt( data.length / 1 )+ 1;
            setTotalPage(pageNum);
            setPage(1);
            } catch (e) {
               console.log(e);
            }
         }
         fetchData();
   },[searchTerm]);
    return videoData ? (
         <Box> 
              <Pagination className='pagination' count={totalPage} page={+page} showFirstButton showLastButton onChange={handChangePage}/>
            <Grid container className="allVideo" spacing={2}>
                {curData && curData.map((video) => {return <OneVideo video={video} />})}
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

export default ShowSearchVideo;