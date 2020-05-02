import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

const duration= 500;

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      backgroundColor: 'orange',
      position: 'fixed',
      bottom: 'calc(100vh - 56px)',
      height: 'calc(100vh - 56px)',
      width: '100%',
      transition: `transform ${duration}ms ease-in-out`,
      [theme.breakpoints.up('sm')]: {
        bottom: 'calc(100vh - 64px)',
        height: 'calc(100vh - 64px)'
      }
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
    exited: { transform: 'translateY(0)' }
  })
);


function DropdownMenu (props: Props) {
  const classes = useStyles(props);
  
  return (
    <Transition in={props.isOpen} timeout={duration}>
      {(state: 'entering' | 'entered' | 'exiting' | 'exited') => {
        return (
          <div className={clsx(classes.root, classes[state])}>
          </div>
        )
      }}
    </Transition>
  )
}

interface Props {
  isOpen: boolean
}

DropdownMenu.defaultProps = {
  isOpen: false,
}

export default DropdownMenu;