import { useTypedSelector } from '../../shared/utils';
import { check } from '../../modules/user/utils';
import rules from '../../config/rbac-rules';

function Can (props: Props) {
  const user = useTypedSelector(state => state.auth.user);
  const role = user ? user.role.name : 'Visitor';

  return check(rules, role, props.perform, { user, ...props.data }) ? (
    props.onYes()
  ) : (
    props.onNo()
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

