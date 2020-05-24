import MuiPagination from '@material-ui/lab/Pagination';
import { withStyles } from '@material-ui/styles';

const Pagination = withStyles({
  ul: {
    justifyContent: 'center'
  }
})(MuiPagination);

export default Pagination;