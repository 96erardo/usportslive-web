import { createMuiTheme } from '@material-ui/core/styles';
import { muli } from '../assets/fonts';

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
    },
    MuiAppBar: {
      root: {
        boxShadow: 'none',
        borderBottom: '1px solid #fff'
      },
      colorDefault: {
        backgroundColor: '#111',
      }
    },
    MuiListItemIcon: {
      root: {
        minWidth: '35px'
      }
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: 'rgba(255, 255, 255, 0.9) !important',
        '& svg': {
          marginRight: '5px'
        }
      },
    }
  }
});

export default theme;