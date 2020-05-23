import { useTypedSelector } from '../../utils';
import { check } from '../../../modules/user/utils';
import rules from '../../config/rbac-rules';

function Can ({ perform, data, onYes, onNo, ...rest}: Props) {
  const user = useTypedSelector(state => state.auth.user);
  const role = user ? user.role.name : 'Visitor';

  return check(rules, role, perform, { user, ...data }) ? (
    onYes()
  ) : (
    onNo()
  )
}

interface Props {
  perform: string,
  data: any
  onYes(): any,
  onNo(): any,
}

Can.defaultProps = {
  data: {},
  onNo: () => null
};

export default Can;

