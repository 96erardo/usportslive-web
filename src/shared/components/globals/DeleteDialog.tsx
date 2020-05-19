import React, { useState, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { useCloseModal } from '../../hooks';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    delete: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: '#b34f4f'
      }
    }
  })
)

const DeleteDialog: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const cancel = useCloseModal();

  const handleClick = useCallback(() => {
    setLoading(true);

    props.onAccept()
      .then(() => setLoading(false))
      .then(() => cancel());

  }, [props, cancel, setLoading]);

  return (
    <div>
      <Grid container direction="column" spacing={2}>
        {loading &&
          <LinearProgress color="primary" />
        }
        <Grid item>
          <Box my={2}>
            <Typography variant="body1">
              {props.text}
            </Typography>
          </Box>
        </Grid>
        <Grid item container spacing={2} justify="flex-end" alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              disabled={loading}
              onClick={cancel}
              disableElevation
            >
              {props.negativeText}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              className={classes.delete}
              disabled={loading}
              onClick={handleClick}
              disableElevation
            >
              {props.positiveText}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

interface Props {
  text: string,
  negativeText: string,
  positiveText: string,
  onAccept (): Promise<void>,
}

DeleteDialog.defaultProps = {
  negativeText: 'Cancelar',
  positiveText: 'Si, Eliminar'
}

export default DeleteDialog;