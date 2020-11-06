import { 
  Heading as BoostHeading,
  Avatar as BoostAvatar,
  styled
} from '@8base/boost';

export const Heading = styled(BoostHeading)`
  ${(props: HeadingProps) => props.color && `color: ${props.color};`}
  ${(props: HeadingProps) => props.fontWeight && `font-weight: ${props.fontWeight};`}
  ${(props: HeadingProps) => props.clickable && `cursor: pointer;`}
`;

type HeadingProps = {
  color?: string,
  clickable?: boolean,
  fontWeight?: string,
}

export const Avatar = styled(BoostAvatar)`
  ${(props: AvatarProps) => props.src && 'background-color: transparent;'}
`;

type AvatarProps = {
  src: string
}