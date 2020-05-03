import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { NavLink } from 'react-router-dom';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    active: {
      color: '#1976D2'
    }
  })
)

function MenuButton (props: Props) {
  const classes = useStyles();
  const Icon: React.ComponentType<SvgIconProps> = props.icon;

  return (
    <ButtonBase 
      className={classes.root}
      component={NavLink}
      to={props.to}
      exact={props.exact}
      activeClassName={classes.active}
    >
      <Box lineHeight="normal" fontSize={48} textAlign="center" width="100%">
        <Icon color="inherit" fontSize="inherit"/>
      </Box>
      <Box lineHeight="normal" textAlign="center" width="100%">
        <Typography 
          variant="caption"
          display="block"
          color="inherit"
        >
          {props.label}
        </Typography>
      </Box>
    </ButtonBase>
  );
}

interface Props {
  icon: React.ComponentType<SvgIconProps>,
  label: string,
  to: string,
  exact?: boolean
}

MenuButton.defaultProps = {
  exact: false
}

export default MenuButton;