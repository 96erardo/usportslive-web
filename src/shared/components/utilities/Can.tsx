import { check } from '../../../modules/user/utils';
import rules from '../../config/rbac-rules';
import { useAuthStore } from '../../../modules/auth/auth-store';

const Can: React.FC<Props> = ({ 
  perform, 
  data = {}, 
  onYes, 
  onNo = () => null
}: Props) => {
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
  data?: any
  onYes: () => any,
  onNo?: () => any,
}

export default Can;

