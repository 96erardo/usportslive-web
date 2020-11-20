import React from 'react';
import { Card, Table } from '@8base/boost';
import { Heading } from '../../../shared/components/globals';
import { FooterConfigItem } from './FooterConfigItem';
import {
  ABOUT_US_LINK,
  MISION_LINK,
  VISION_LINK,
  GOALS_LINK,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FACEBOOK,
  TWITTER,
  INSTAGRAM
} from '../../../shared/constants';

const items = [
  { id: 1, label: 'Acerca de Nosotros', setting: ABOUT_US_LINK, link: true },
  { id: 2, label: 'Misión', setting: MISION_LINK, link: true },
  { id: 3, label: 'Visión', setting: VISION_LINK, link: true },
  { id: 4, label: 'Objetivos', setting: GOALS_LINK, link: true },
  { id: 5, label: 'Correo Electrónico', setting: CONTACT_EMAIL, link: false },
  { id: 6, label: 'Teléfono', setting: CONTACT_PHONE, link: false },
  { id: 7, label: 'Facebook', setting: FACEBOOK, link: true },
  { id: 8, label: 'Twitter', setting: TWITTER, link: true },
  { id: 9, label: 'Instagram', setting: INSTAGRAM, link: true },
]

export const FooterConfig: React.FC = () => {
  return (
    <Card className="w-100">
      <div className="p-4">
        <Heading type="h2">
          Configuración de Footer
        </Heading>
      </div>
      <Card.Body padding="none">
        <Table>
          <Table.Body data={items}>
            {({ id, ...props }: { id: number, label: string, setting: string, link: boolean }) => (
              <FooterConfigItem key={id} {...props} />
            )}
          </Table.Body>
        </Table>
      </Card.Body>
    </Card>
  );
}