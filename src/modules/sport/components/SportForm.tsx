import React, { useState, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { createSport, updateSport } from '../actions';
import ImageFilePicker from '../../../shared/components/utilities/ImageFilePicker';
import { Sport } from '../../../shared/types';
import { useSnackbar } from 'notistack';
 
const initialForm = {
  name: '',
  teamId: null
};

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      minWidth: '300px'
    }
  })
)

function SportForm (props: Props) {
  const { enqueueSnackbar: pushSnack } = useSnackbar();
  const [form, setForm] = useState(props.sport ? {
    id: props.sport.id,
    name: props.sport.name,
    teamId: props.sport.team ? props.sport.team.id : null,
  } : initialForm);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleChange = useCallback((e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }, [form, setForm]);

  const onDone = useCallback(() => {
    setLoading(false);

    props.onDone();
  }, [setLoading, props]);
  
  const onError = useCallback((e) => {
    setLoading(false);

    pushSnack(e.message, { variant: 'error' });
  }, [pushSnack, setLoading]);

  const onSubmit = useCallback(() => {
    setLoading(true);

    if (props.sport) {
      updateSport({
        id: props.sport.id,
        name: form.name,
        teamId: form.teamId
      })
      .then(() => pushSnack('Deporte editado correctamente', { variant: 'success' }))
      .then(onDone)
      .catch(onError);

    } else {
      createSport(form)
      .then(() => pushSnack('Deporte creado correctamente', { variant: 'success' }))
      .then(onDone)
      .catch(onError);
    }
  }, [form, props, pushSnack, onDone, onError]);

  return (
    <div className={classes.root}>
      {loading &&
        <LinearProgress color="primary" />
      }
      <Grid container direction="column" spacing={2}>
        <Grid item container alignItems="center" justify="center">
          <Box my={2}>
            <ImageFilePicker 
              size="md"
            />
          </Box>
        </Grid>
        <Grid item>
          <TextField 
            name="name"
            label="Nombre"
            value={form.name}
            variant="filled"
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item container spacing={2} justify="flex-end" alignItems="center">
          <Grid item>
            <Button 
              onClick={props.onCancel}
              variant="contained" 
              disabled={loading}
              disableElevation
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary"
              onClick={onSubmit}
              disabled={loading}
              disableElevation
            >
              {props.sport ? 'Editar' : 'Crear'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

interface Props {
  sport?: Sport,
  onDone (): void,
  onCancel (): void
}

export default SportForm;