import React, { useState, useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { RouteComponentProps  } from 'react-router';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import DropdownMenu from './../organisms/DropdownMenu';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1,
      fontWeight: 700,
    }
  })
)

function Admin (props: Props) {
  const classes = useStyles();
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const toggle = useCallback(() => {
    setMenuOpen(!isMenuOpen);
  }, [isMenuOpen, setMenuOpen])

  return (
    <div className={classes.root}>
      <AppBar color="default">
        <Toolbar>
          <IconButton 
            onClick={toggle}
            className={classes.menuButton} 
            edge="start" 
            aria-label="menu"
          >
          </IconButton>
          <Typography align="center" className={classes.title} variant="h5">
            Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <DropdownMenu 
        isOpen={isMenuOpen}
      />
    </div>
  );
}

interface Props extends RouteComponentProps {};

export default Admin;