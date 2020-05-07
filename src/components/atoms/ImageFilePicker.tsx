import React from 'react';
import { Size } from '../../shared/types';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const sizes: { [key: string]: string } = {
  xs: '25px',
  sm: '50px',
  md: '100px',
  lg: '200px',
};

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      position: 'relative',
      width: (props: Props) => sizes[props.size],
      height: (props: Props) => sizes[props.size],
      borderRadius: '50%',
      backgroundColor: '#555'
    },
    button: {
      position: 'absolute',
      left: '0px',
      bottom: '0px'
    }
  })
)

function ImageFilePicker (props: Props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <IconButton className={classes.button} size="small">
        <CreateIcon 
          fontSize={props.size === 'lg' ? 'large' : 'default'}
        />
      </IconButton>
    </div>
  );
}

interface Props {
  size: Size
}

ImageFilePicker.defaultProps = {
  size: 'md'
};

export default ImageFilePicker;