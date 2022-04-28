import React, { useEffect, useState, useMemo } from 'react';
import { Avatar, Container } from '@mui/material';


const Comment = ({comment}) => {
    return (
        <div className="comment">
            <div className="comment-image-container">
                <Avatar alt={comment.userName} src ={comment.avatar} ></Avatar>
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">
                        {comment.userName}
                    </div>
                    <div>{comment.date.year}-{comment.date.month}-{comment.date.day}</div>
                </div>
                <div className="comment-text">
                    {comment.content}
                </div>
            </div>
        </div>
    )
}

export default Comment;