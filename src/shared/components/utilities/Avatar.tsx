import { Avatar as BoostAvatar, styled } from '@8base/boost';

export default styled(BoostAvatar)`
  background-color: ${(props: Props) => props.background} !important;
`;

type Props = {
  background: string
}