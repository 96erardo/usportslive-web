import React, { useState, useCallback, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router-dom';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Switch, Route } from 'react-router-dom';
import AppsIcon from '@material-ui/icons/Apps';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DropdownMenu from './../organisms/DropdownMenu';

import AdminSports from '../pages/AdminSports';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      // flexGrow: 1,
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

  useEffect(() => {
    const unsubscribe = props.history.listen(() => {
      if (isMenuOpen) {
        setMenuOpen(false);
      }
    })

    return () => unsubscribe();
  }, [props.history, isMenuOpen])

  return (
    <div className={classes.root}>
      <DropdownMenu 
        isOpen={isMenuOpen}
      />
      <AppBar position="sticky" color="default">
        <Toolbar>
          <Grid container alignItems="center" justify="space-between">
            <IconButton 
              onClick={toggle}
              aria-label="menu"
            >
              <AppsIcon />
            </IconButton>
            <Typography align="center" className={classes.title} variant="h5">
              Inicio
            </Typography>
            <IconButton
              aria-label="menu"
            >
              <SearchIcon />
            </IconButton>
          </Grid>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/admin/sports" component={AdminSports} />
      </Switch>
    </div>
  );
}

interface Props extends RouteComponentProps {};

export default Admin;