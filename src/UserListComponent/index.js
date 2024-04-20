import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

// export default function MouseOverPopover() {

// }
const UserListComponent = ({ users }) => {
//   return (
       
//   );
const [anchorEl, setAnchorEl] = React.useState(null);

const handlePopoverOpen = (event) => {
  setAnchorEl(event.currentTarget);
};

const handlePopoverClose = () => {
  setAnchorEl(null);
};

const open = Boolean(anchorEl);

return (
    <>
    <div className='user-card'>
    {users.map(user => (
    <div key={user.id} className='user-card-2'>
    <Typography
      aria-owns={open ? 'mouse-over-popover' : undefined}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <Link to={`/user/${user.id}`} className="user-link">
          {user.name}
       </Link>
    </Typography>
    <Typography
      aria-owns={open ? 'mouse-over-popover' : undefined}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
          {user.email}
    </Typography>    <Popover
      id="mouse-over-popover"
      sx={{
        pointerEvents: 'none',
      }}
      open={open}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
      disableRestoreFocus
    >
      <Typography sx={{ p: 1 }}>          {`User Email : ${user.email}`}
</Typography>
      <Typography sx={{ p: 1 }}> {`User Name: ${user.name}`}</Typography>
    </Popover>
  </div>
    ))}
    </div>
  </>
);
};

export default UserListComponent;
