import { styled } from '@8base/boost';

export const FluentItem = styled.div`
  padding: ${(props: Props) => props.padding || '0px'};
  flex-grow: ${(props: Props) => props.grow || 1};
  flex-shrink: ${(props: Props) => props.shrink || 1};
  flex-basis: ${(props: Props) => props.basis || 'auto'};
`;

type Props = {
  padding?: string,
  grow?: number,
  shrink?: number,
  basis?: number,
}