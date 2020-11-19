import { Input, COLORS, styled } from '@8base/boost';

export default styled(Input)`
  & > input {
    cursor: pointer !important;
    background-color: ${COLORS.WHITE};
  }
`;