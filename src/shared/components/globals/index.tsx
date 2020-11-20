import { 
  Heading as BoostHeading,
  Avatar as BoostAvatar,
  Column as BoostColumn,
  styled
} from '@8base/boost';

export const Heading = styled(BoostHeading)`
  ${(props: HeadingProps) => props.color && `color: ${props.color};`}
  ${(props: HeadingProps) => props.fontWeight && `font-weight: ${props.fontWeight};`}
  ${(props: HeadingProps) => props.clickable && `cursor: pointer;`}
  ${(props: HeadingProps) => props.align && `text-align: ${props.align};`}
`;

type HeadingProps = {
  color?: string,
  clickable?: boolean,
  fontWeight?: string,
  align?: string,
}

export const Avatar = styled(BoostAvatar)`
  ${(props: AvatarProps) => props.src && 'background-color: transparent;'}
`;

type AvatarProps = {
  src: string
}

export const Column = styled(BoostColumn)`
  ${(props: ColumnProps) => props.height && `height: ${props.height}px;`}
  ${(props: ColumnProps) => props.maxHeight && `
    max-height: ${props.maxHeight}px;
    overflow: auto;
  `}
`;

type ColumnProps = {
  maxHeight: number,
  height: number,
}