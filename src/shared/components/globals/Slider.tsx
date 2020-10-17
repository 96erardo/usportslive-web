import React from 'react';
import ReactSlider, { ReactSliderProps } from 'react-slider';
import { COLORS, styled } from '@8base/boost';

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 8px;
  border-radius: .5rem;
  border: 1px solid #CFD7DE;
`;

const StyledThumb = styled.div`
  height: 16px;
  width: 16px;
  top: -6px;
  line-height: 8px;
  text-align: center;
  background-color: #fff;
  border: 2px solid ${COLORS.BLACK};
  border-radius: 50%;
  cursor: grab;
  outline: none;
`;

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${(props: any) => props.index === 1 ? COLORS.GRAY : COLORS.PRIMARY};
  border-radius: 999px;
`;


const Thumb = (props: any) => <StyledThumb {...props} />;

const Track = (props: any, state: any) => <StyledTrack {...props} index={state.index} />;


export const Slider: React.FC<Omit<ReactSliderProps, "renderTrack" | "renderThumb">> = (props) => {
  return (
    <StyledSlider
      renderTrack={Track}
      renderThumb={Thumb}
      {...props}
    />
  );
}