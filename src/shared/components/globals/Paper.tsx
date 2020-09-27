import { Paper as BoostPaper, styled } from '@8base/boost';

export const Paper = styled(BoostPaper)`
  box-shadow: none;
  ${(props: Props) => props.background && `background-color: ${props.background};`}
`;

type Props = {
  background?: string,
}