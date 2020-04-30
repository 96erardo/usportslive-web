import { createMuiTheme } from '@material-ui/core/styles';
import { muli } from '../shared/assets/fonts';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Muli, Arial',
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#1976D2',
      dark: '#1976D2'
    },
    error: {
      main: '#DA6161',
      dark: '#DA6161'
    },
    success: {
      main: '#2C7233',
      dark: '#2C7233',
    },
    background: {
      default: '#111'
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [...muli]
      }
    }
  }
});

export default theme;