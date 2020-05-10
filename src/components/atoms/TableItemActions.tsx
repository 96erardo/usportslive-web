import React, { useState, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    delete: {
      color: theme.palette.error.main,
      '& .MuiListItemIcon-root': {
        color: theme.palette.error.main
      },
      '&:hover': {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.common.white,
        '& .MuiListItemIcon-root': {
          color: theme.palette.common.white
        },
      }
    },
    update: {
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '& .MuiListItemIcon-root': {
          color: theme.palette.common.white
        },
      }
    }
  })
)

function TableItemActions (props: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, [setAnchorEl]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleDelete = useCallback(() => {
    props.onDelete(props.id);
  }, [props]);

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem className={classes.update} onClick={() => console.log('update')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Update</Typography>
        </MenuItem>
        <MenuItem className={classes.delete} onClick={handleDelete}>
          <ListItemIcon>
            <DeleteOutlinedIcon color="inherit" fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Delete</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}

interface Props {
  id: number,
  onDelete (id: number): void,
}

export default TableItemActions;