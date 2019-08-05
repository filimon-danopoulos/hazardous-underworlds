import { createMuiTheme } from '@material-ui/core/styles';


export default () => {
  return createMuiTheme({
    palette: {
      primary: {
        main: '#424242'
      },
      secondary: {
        main: '#616161'
      }
    },
  });
};