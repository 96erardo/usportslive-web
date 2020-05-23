import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Transition } from 'react-transition-group';
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined'
import SportsHandball from '@material-ui/icons/SportsHandball'
import MenuButton from '../buttons/MenuButton';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import uneg from '../../assets/images/logo_uneg.png';

interface Props {
  isOpen: boolean
}

function DropdownMenu (props: Props) {
  const classes = useStyles(props);
  
  return (
    <Transition in={props.isOpen} timeout={duration}>
      {(state: 'entering' | 'entered' | 'exiting' | 'exited') => {
        return (
          <div className={clsx(classes.root, classes[state])}>
            <Container maxWidth="md">
              <Grid container alignItems="center" justify="center">
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton
                    exact
                    to="/admin"
                    label="Inicio" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton 
                    to="/admin/profile/" 
                    label="Perfil" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton 
                    to="/admin/sports" 
                    label="Deportes" 
                    icon={SportsHandball}
                  />
                </Grid>
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton 
                    to="/admin/tournament" 
                    label="Torneos" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton 
                    to="/admin/agenda" 
                    label="Agenda" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton 
                    to="/admin/data" 
                    label="Estadísticas" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton 
                    to="/admin/colleges" 
                    label="Universidades" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton 
                    to="/admin/users" 
                    label="Usuarios" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
              </Grid>
              <Box width="100%" textAlign="center" mt={2} mb={3}>
                <Typography className={classes.subtitle} variant="h5">
                  Deportes
                </Typography>
              </Box>
              <Grid container alignItems="center" justify="center">
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton
                    exact
                    to="/admin/sports/1"
                    label="Futbol" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton
                    exact
                    to="/admin/sports/2"
                    label="Basketball" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton
                    exact
                    to="/admin/sports/3"
                    label="Boleiball" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="center" justify="center">
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton
                    exact
                    to="/admin/sports/4"
                    label="Kickinball" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
                <Grid className={classes.item} item xs={3} container alignContent="center" direction="column">
                  <MenuButton
                    exact
                    to="/admin/sports/5"
                    label="Tenis de mesa" 
                    icon={AccountCircleOutlined} 
                  />
                </Grid>
              </Grid>
            </Container>
            <Box mt={10} textAlign="center" width="100%">
              <img 
                src={uneg}
                height="60px"
                alt="college-logo" 
              />
            </Box>
          </div>
        )
      }}
    </Transition>
  )
}

const duration= 500;

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      backgroundColor: '#111',
      position: 'fixed',
      bottom: 'calc(100vh - 56px)',
      height: 'calc(100vh - 56px)',
      width: '100%',
      padding: '24px',
      transition: `transform ${duration}ms ease-in-out`,
      zIndex: 900,
      overflow: 'auto',
      [theme.breakpoints.up('sm')]: {
        bottom: 'calc(100vh - 64px)',
        height: 'calc(100vh - 64px)'
      }
    },
    item: {
      marginBottom: '20px',
    },
    subtitle: {
      fontWeight: 700
    },
    entering: {
      transform: 'translateY(calc(100vh - 56px))',
      [theme.breakpoints.up('sm')]: {
        transform: 'translateY(calc(100vh - 64px))',
      }
    },
    entered: {
      transform: 'translateY(calc(100vh - 56px))',
      [theme.breakpoints.up('sm')]: {
        transform: 'translateY(calc(100vh - 64px))',
      }
    },
    exiting: { transform: 'translateY(0)' },
    exited: { transform: 'translateY(0)' },
  })
);

DropdownMenu.defaultProps = {
  isOpen: false,
}

export default DropdownMenu;