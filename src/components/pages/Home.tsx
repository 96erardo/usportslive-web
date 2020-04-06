import React from 'react';
import LoginButton from '../atoms/LoginButton';

function Home (props: Props) {
  
  
  return (
    <div>
      <div>
        <LoginButton>
          Login
        </LoginButton>
      </div>
    </div>
  );
}

type Props = {};

export default Home;