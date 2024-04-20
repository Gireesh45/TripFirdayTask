import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import "./index.css";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


const UserDetailComponent = () => {
    const [open, setOpen] = React.useState(false);
    const [imageOpen, setImageOpen] = React.useState(false);

    const handleClickOpen = (post) => {
        setActivePostId(post.id)
        setOpen(true);
        setDescription("");
        setNewTitle("");
    };

    const handleClose = () => {
        setOpen(false);
        setImageOpen(false);
    };
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);

    const [activePostId, setActivePostId] = useState();
    const handleClickOpenAlbum = (album) => {
        setImageOpen(true)
        setFilteredImages(images.filter(el => el.albumId === album.id))
    }
    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error('Error fetching user details:', error));

        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching user posts:', error));

        fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`)
            .then(response => response.json())
            .then(data => setAlbums(data))
            .catch(error => console.error('Error fetching user albums:', error));

        fetch(`https://jsonplaceholder.typicode.com/posts/${userId}/comments`)
            .then(response => response.json())
            .then(data => setComments(data))
            .catch(error => console.error('Error fetching comments:', error));
        fetch(`https://jsonplaceholder.typicode.com/photos`)
            .then(resposne => resposne.json())
            .then(data => setImages(data))
            .catch(error => console.log('Error fecthing albums', error));
    }, [userId]);

    const handleDeletePost = postId => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
                } else {
                    console.error('Error deleting post:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting post:', error));
    };

    const handleCreateComment = postId => {
        if (newComment.trim() === '') {
            alert('Please enter a comment.');
            return;
        }

        const newCommentObj = {
            body: newComment,
            postId: postId,
        };

        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify(newCommentObj),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(response => response.json())
            .then(data => {
                setComments(prevComments => [...prevComments, data]);
                setNewComment('');
                alert('Comment created successfully.');
            })
            .catch(error => console.error('Error creating comment:', error));
    };


    const handleUpdatePost = postId => {
        console.log(postId, 'gk');
        const newCommentObj = {
            body: description,
            title: newTitle,
        };
        fetch(`https://jsonplaceholder.typicode.com/posts/${activePostId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                newCommentObj
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((json) => { setPosts(posts.map((item) => item?.id === activePostId ? { ...item, title: json?.newCommentObj?.title, body: json?.newCommentObj?.body } : item)) });
        handleClose();
    };

    return (
        <div>
            {user ? (
                <div className='user-card'>
                    <div className="user-profile">
                        <h1>User Profile :-</h1>
                        <h2>{`User Name : ${user.name}`}</h2>
                        <p>{`Email : ${user.email}`}</p>
                    </div>
                    <div className='user-card'>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            Posts
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                />
                                <button onClick={() => handleCreateComment(userId)}>Create Comment</button>
                                <ul>
                                    {posts.map(post => (
                                        <li key={post.id}>
                                            <h3>{post.title}</h3>
                                            <p>{post.body}</p>
                                            <React.Fragment>
                                                <Button sx={{ ml: 1, }} variant="outlined" onClick={() => handleClickOpen(post)}>
                                                    Edit
                                                </Button>
                                                <BootstrapDialog
                                                    onClose={handleClose}
                                                    sx={{
                                                        width: 'md',
                                                        padding: '5px'
                                                    }}
                                                    fullWidth={true}
                                                    aria-labelledby="customized-dialog-title"
                                                    open={open}
                                                >
                                                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                                                        Edit Details
                                                    </DialogTitle>
                                                    <IconButton
                                                        aria-label="close"
                                                        onClick={handleClose}
                                                        sx={{
                                                            position: 'absolute',
                                                            right: 8,
                                                            top: 8,
                                                            color: (theme) => theme.palette.grey[500],
                                                        }}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                    <input
                                                        type="text"
                                                        value={newTitle}
                                                        className='inputs'
                                                        onChange={e => setNewTitle(e.target.value)}
                                                        placeholder="Enter Title"
                                                    />
                                                    <input
                                                        type="text"
                                                        className='inputs'
                                                        value={description}
                                                        onChange={e => setDescription(e.target.value)}
                                                        placeholder="Enter Description"
                                                    />

                                                    <Button onClick={() => { handleUpdatePost(post) }}>
                                                        Save changes
                                                    </Button>
                                                </BootstrapDialog>
                                            </React.Fragment>
                                            <Button sx={{ ml: 1, }} variant="contained" onClick={() => handleDeletePost(post.id)}>
                                                Delete
                                            </Button>
                                            <ul>
                                                {comments
                                                    .map(comment => (
                                                        <li key={comment.id}>
                                                            <p>{comment.body}</p>
                                                        </li>
                                                    ))}
                                            </ul>

                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    </div>
                    <div className='user-card'>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            Albums
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <ul>
                                    {albums.map(album => (
                                        <li key={album.id} onClick={() => handleClickOpenAlbum(album)}>
                                            <h3>{album.title}</h3>
                                        </li>

                                    ))}

                                </ul>
                                </div>
                                <BootstrapDialog
                                    onClose={handleClose}
                                    sx={{
                                        width: 'md',
                                        padding: '5px'
                                    }}
                                    fullWidth={true}
                                    aria-labelledby="customized-dialog-title"
                                    open={imageOpen}
                                >
                                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                                        Images
                                    </DialogTitle>
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleClose}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            color: (theme) => theme.palette.grey[500],
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <ul>
                                        {filteredImages?.length ? filteredImages.map(image => (
                                            <li key={image.id} onClick={() => handleClickOpenAlbum}>
                                                <p>{image.albumId}</p>
                                                <img src={image.url} alt={image.id} />
                                            </li>
                                        )) : images.map(image => (
                                            <li key={image.id} onClick={() => handleClickOpenAlbum}>
                                                <p>{image.albumId}</p>
                                                <img src={image.url} alt={image.id} />
                                            </li>
                                        ))}
                                    </ul>
                                </BootstrapDialog>
                           
                        </AccordionDetails>
                    </Accordion>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserDetailComponent;

