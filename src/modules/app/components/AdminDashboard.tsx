import React from 'react';
import { Heading } from '@8base/boost';
import { LogoChanger } from './LogoChanger';

export const AdminDashboard: React.FC = () => {

  return (
    <div className="p-4">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-md-12">
            <Heading type="h1" weight="bold">
              Dashboard
            </Heading>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <LogoChanger />
          </div>
        </div>
      </div>
    </div>
  );
}