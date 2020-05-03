import muliRegular from './Muli-Regular.ttf';
import muliItalic from './Muli-Italic.ttf';
import muliExtraBold from './Muli-ExtraBold.ttf';
import muliExtraBoldItalic from './Muli-ExtraBoldItalic.ttf';

export const muli = [
  {
    fontFamily: 'Muli',
    fontStyle: 'normal',
    fontWeight: 400,
    src: `url(${muliRegular}) format('truetype')`,
  },
  {
    fontFamily: 'Muli',
    fontStyle: 'italic',
    fontWeight: 400,
    src: `url(${muliItalic}) format('truetype')`,
  },
  {
    fontFamily: 'Muli',
    fontStyle: 'normal',
    fontWeight: 700,
    src: `url(${muliExtraBold}) format('truetype')`,
  },
  {
    fontFamily: 'Muli',
    fontStyle: 'italic',
    fontWeight: 700,
    src: `url(${muliExtraBoldItalic})  format('truetype')`,
  }
];