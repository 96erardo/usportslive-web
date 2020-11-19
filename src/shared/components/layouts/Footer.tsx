import React from 'react';
import { Column, Link, COLORS, Text } from '@8base/boost';
import { Heading } from '../globals';
import { useAppStore } from '../../../modules/app/app-store';
import {
  ABOUT_US_LINK,
  MISION_LINK,
  VISION_LINK,
  GOALS_LINK,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FACEBOOK,
  TWITTER,
  INSTAGRAM,
} from '../../constants';

export const Footer: React.FC = () => {
  const settings = useAppStore(state => state.settings);

  return (
    <div style={{ background: COLORS.GRAY_70 }} className="w-100 mt-5 py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-5">
            <Heading className="mb-4" type="h3" fontWeight="700" color="#fff">
              Información
            </Heading>
            <Column className="w-100">
              <Link to={settings[ABOUT_US_LINK]}>
                Acerca de Nosotros
              </Link>
              <Link to={settings[MISION_LINK]}>
                Misión
              </Link>
              <Link to={settings[VISION_LINK]}>
                Visión
              </Link>
              <Link to={settings[GOALS_LINK]}>
                Objetivos
              </Link>
            </Column>
          </div>
          <div className="col-md-4 mb-5">
            <Heading className="mb-4" type="h3" fontWeight="700" color="#fff">
              Contacto
            </Heading>
            <Column className="w-100">
              <Text color="WHITE">
                Correo: {settings[CONTACT_EMAIL]}
              </Text>
              <Text color="WHITE">
                Tlf: {settings[CONTACT_PHONE]}
              </Text>
            </Column>
          </div>
          <div className="col-md-4 mb-5">
            <Heading className="mb-4" type="h3" fontWeight="700" color="#fff">
              Redes Sociales
            </Heading>
            <Column className="w-100">
              <Link to={settings[FACEBOOK]}>
                Facebook
              </Link>
              <Link to={settings[TWITTER]}>
                Twitter
              </Link>
              <Link to={settings[INSTAGRAM]}>
                Instagram
              </Link>
            </Column>
          </div>
        </div>
      </div>
    </div>
  );
}