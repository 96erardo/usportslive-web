import { check } from '../../../modules/user/utils';
import rules from '../../config/rbac-rules';
import { useAuthStore } from '../../../modules/auth/auth-store';

function Can ({ perform, data, onYes, onNo, ...rest}: Props) {
  const user = useAuthStore(state => state.user);
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

