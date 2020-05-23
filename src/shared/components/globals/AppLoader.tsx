import React from 'react';

function AppLoader (props: Props) {
  if (props.loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }  
  
  if (props.error) {
    return (
      <div>
        Something Happened :(
      </div>
    );
  }  

  return (
    <>
      {props.children}
    </>
  )
}

type Props = { 
  error: boolean,
  loading: boolean,
  children: React.ReactNode
};

export default AppLoader;