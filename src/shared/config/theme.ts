import { createTheme } from '@8base/boost';

export const theme = createTheme({
  components: {
    modalOverlay: {
      root: {
        backdropFilter: 'blur(5px)'
      }
    }
  }
})