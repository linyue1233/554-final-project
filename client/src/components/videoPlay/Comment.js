import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';


const Comment = ({comment}) => {
    return (
        <div className="comment">
            <div className="comment-image-container">
                <img src ={comment.avatar} ></img>
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