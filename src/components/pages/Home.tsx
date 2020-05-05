import React from 'react';
import AuthButton from '../atoms/AuthButton';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Can from '../atoms/Can';

function Home (props: Props) {
  return (
    <Grid container spacing={2}>
      <Grid item>
        <AuthButton />
      </Grid>
      <Can
        perform="admin-page:visit"
        onYes={() => (
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to="/admin"
            >
              Administrar
            </Button>
          </Grid>
        )}
      />
    </Grid>
  );
}

type Props = {};

export default Home;