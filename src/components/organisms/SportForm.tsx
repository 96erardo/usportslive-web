import React, { useState, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { createSport, updateSport } from '../../modules/sport/actions';
import { Sport } from '../../shared/types';
 
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
  const [form, setForm] = useState(initialForm);
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

    console.log(e);
  }, [setLoading]);

  const onSubmit = useCallback(() => {
    setLoading(true);

    if (props.sport) {
      updateSport({
        id: props.sport.id,
        name: form.name,
        teamId: form.teamId
      })
      .then(onDone)
      .catch(onError);

    } else {
      createSport(form)
      .then(onDone)
      .catch(onError);
    }
  }, [form, props, onDone, onError]);

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={2}>
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
              disableElevation
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            {loading ? (
              <CircularProgress size={20} color="primary"/>
            ) : (
              <Button 
                variant="contained" 
                color="primary"
                onClick={onSubmit}
                disableElevation
              >
                Crear
              </Button>
            )}
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