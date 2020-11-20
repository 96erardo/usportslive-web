import { Paper as BoostPaper, styled } from '@8base/boost';

export const Paper = styled(BoostPaper)`
  box-shadow: none;
  ${(props: Props) => props.background && `background-color: ${props.background};`}
  ${(props: Props) => props.maxHeight && `
    max-height: ${props.maxHeight}px;
    overflow: auto;
  `}
`;

type Props = {
  background?: string,
  maxHeight?: number,
}