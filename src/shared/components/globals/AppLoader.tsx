import React from 'react';
import { Loader } from '@8base/boost';
import { useAppStore } from '../../../modules/app/app-store';

const selectLoading = (state: any) => state.loading;
const selectError = (state: any) => state.error;

function AppLoader (props: Props) {
  const loading = useAppStore(selectLoading);
  const error = useAppStore(selectError);

  if (loading) {
    return (
      <Loader stretch color="primary" size="md" />
    );
  }
  
  if (error) {
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
  );
}

type Props = {
  children: React.ReactNode
};

export default AppLoader;