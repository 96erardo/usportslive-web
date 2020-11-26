export const DATE_FORMAT = 'DD/MM/YYYY';

export const DATE_TIME_FORMAT = 'DD/MM/YYYY hh:mm a';

export const GENDERS = {
  MALE: 'Masculino',
  FEMALE: 'Femenino',
  OTHER: 'Otro'
};

export const GENDER_OPTIONS = [
  { label: 'Masculino', value: GENDERS.MALE },
  { label: 'Femenino', value: GENDERS.FEMALE },
  { label: 'Otro', value: GENDERS.OTHER },
];

/**
 * Configuration options
 */
export const APP_LOGO = 'APP_LOGO';
export const APP_TITLE = 'APP_TITLE';
export const ABOUT_US_LINK = 'ABOUT_US_LINK';
export const MISION_LINK = 'MISION_LINK';
export const VISION_LINK = 'VISION_LINK';
export const GOALS_LINK = 'GOALS_LINK';
export const CONTACT_EMAIL = 'CONTACT_EMAIL'; 
export const CONTACT_PHONE = 'CONTACT_PHONE';
export const FACEBOOK = 'FACEBOOK';
export const TWITTER = 'TWITTER';
export const INSTAGRAM = 'INSTAGRAM';

export const INITIAL_LIST_STATE = {
  items: [],
  count: 0,
  loading: true,
  error: null
}

export const COMPETITION_STATUS = {
  'SOON': {
    label: 'Empieza pronto',
    color: 'WARNING'
  },
  'IN_PROGRESS': {
    label: 'En curso',
    color: 'SECONDARY'
  },
  'FINISHED': {
    label: 'Terminado',
    color: 'PRIMARY',
  },
  'CANCELLED': {
    label: 'Cancelado',
    color: 'DANGER_DARK',
  },
}