import React from 'react';
import { Column } from '@8base/boost';
import { Heading } from '../../../shared/components/globals';
import { LogoChanger } from './LogoChanger';
import { ConfigChanger } from './ConfigChanger';
import { APP_TITLE } from '../../../shared/constants';
import { FooterConfig } from './FooterConfig';

export const AdminDashboard: React.FC = () => {

  return (
    <div className="p-4">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-md-12">
            <Heading type="h1" fontWeight="700">
              Dashboard
            </Heading>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <Column className="w-100">
              <LogoChanger />
              <ConfigChanger 
                title="Título de la Aplicación"
                label="Título"
                setting={APP_TITLE}
              />
            </Column>
          </div>
          <div className="col-md-8">
            <FooterConfig />
          </div>
        </div>
      </div>
    </div>
  );
}