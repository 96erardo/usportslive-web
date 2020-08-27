import { Card, styled } from '@8base/boost';

Card.Header.Left = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;

  & > *:not(:last-child) {
    margin-right: ${(props: any) => {
      switch (props.gap) {
        case 'xs':
          return '4px;';
        case 'sm':
          return '8px;';
        case 'md':
          return '16px;';
        case 'lg':
          return '24px;';
        case 'xl':
          return '32px;';
        default:
          return '16px';
      }
    }}
  } 
`;

Card.Header.Right = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;

  & > *:not(:last-child) {
    margin-right: ${(props: any) => {
      switch (props.gap) {
        case 'xs':
          return '4px;';
        case 'sm':
          return '8px;';
        case 'md':
          return '16px;';
        case 'lg':
          return '24px;';
        case 'xl':
          return '32px;';
        default:
          return '16px';
      }
    }}
  }
`;

export default Card;