import React from 'react';
import AuthButton from '../../auth/components/AuthButton';
import { Link as BoostLink, Row } from '@8base/boost';
import { Link } from 'react-router-dom';
import Can from '../../../shared/components/utilities/Can';

function Home (props: Props) {
  return (
    <Row stretch>
      <AuthButton />
      <Can
        perform="admin-page:visit"
        onYes={() => (
          <Link 
            to="/admin"
            color="neutral"
            children="Admin"
            component={BoostLink}
          />
        )}
      />
    </Row>
  );
}

type Props = {};

export default Home;