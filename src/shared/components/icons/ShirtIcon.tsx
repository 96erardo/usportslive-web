import React from 'react';

export default function ShirtIcon (props: Props) {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={props.width} height={props.height} viewBox={`0 0 172 172`}>
      <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}>
        <path d="M0,172v-172h172v172z" fill="none"></path>
        <g id="Layer_1">
          <path d="M87.34375,10.61563c-0.26875,0 -1.075,0 -1.34375,0c-10.2125,0 -20.425,3.09062 -29.025,9.40625c0,15.99063 21.63438,33.8625 29.025,33.8625c7.39063,0 29.025,-17.87187 29.025,-33.8625c-8.33125,-6.04688 -18.00625,-9.1375 -27.68125,-9.40625z" fill={props.neckColor}></path>
          <path d="M166.625,84.52188c0,-28.75625 -18.67812,-54.15312 -46.225,-62.75312l-5.375,-1.74687c0,15.99063 -21.63437,33.8625 -29.025,33.8625c-7.39062,0 -29.025,-17.87187 -29.025,-33.8625l-5.375,1.74687c-27.54688,8.46562 -46.225,33.99688 -46.225,62.75313h32.25v82.50625h96.75v-82.50625z" fill={props.shirtColor}></path>
          <path d="M121.60938,17.87188l-4.8375,-1.47812c-12.9,-9.00313 -28.89062,-11.95937 -44.20937,-8.0625c-1.88125,0.5375 -3.35937,2.28438 -3.225,4.16563c0.13438,2.55312 2.6875,4.3 5.10625,3.62812c12.22812,-3.225 24.99375,-1.20937 35.60938,5.375c0.40312,0.26875 0.67188,0.80625 0.67188,1.34375c-2.41875,13.16875 -20.02188,26.875 -24.725,26.875c-4.97187,0 -24.99375,-15.85625 -24.99375,-29.83125c0,-1.34375 -0.67187,-2.55312 -1.6125,-3.225c-1.075,-0.80625 -2.41875,-0.94063 -3.62813,-0.5375l-5.375,1.74687c-29.29375,9.1375 -49.04687,35.87812 -49.04687,66.65c0,2.28437 1.74687,4.03125 4.03125,4.03125h26.875c0.80625,0 1.34375,0.5375 1.34375,1.34375v77.13125c0,2.28438 1.74688,4.03125 4.03125,4.03125h96.75c2.28438,0 4.03125,-1.74687 4.03125,-4.03125v-77.13125c0,-0.80625 0.5375,-1.34375 1.34375,-1.34375h26.875c2.28438,0 4.03125,-1.74688 4.03125,-4.03125c0,-30.77188 -19.75313,-57.5125 -49.04687,-66.65zM138.40625,79.14687v-10.61562c0,-2.01562 -1.34375,-3.7625 -3.225,-4.16563c-2.55312,-0.40312 -4.8375,1.47813 -4.8375,4.03125v93.25625c0,0.80625 -0.5375,1.34375 -1.34375,1.34375h-86c-0.80625,0 -1.34375,-0.5375 -1.34375,-1.34375v-93.12188c0,-2.01562 -1.34375,-3.7625 -3.225,-4.16563c-2.55313,-0.40312 -4.8375,1.47813 -4.8375,4.03125v10.75c0,0.80625 -0.5375,1.34375 -1.34375,1.34375h-21.23125c-0.80625,0 -1.47812,-0.67187 -1.34375,-1.47812c2.15,-24.85938 18.94687,-45.95625 43.13438,-53.48125l0.80625,-0.26875c3.7625,16.39375 23.51562,32.65313 32.38438,32.65313c8.86875,0 28.62188,-16.125 32.38437,-32.65313l0.80625,0.26875c24.1875,7.525 40.98438,28.62187 43.13438,53.48125c0.13437,0.80625 -0.5375,1.47812 -1.34375,1.47812h-21.23125c-0.80625,0 -1.34375,-0.67187 -1.34375,-1.34375z" fill={props.bordersColor}></path>
          <path d="M110.1875,78.07188c-3.56224,0 -6.45,2.88776 -6.45,6.45c0,3.56224 2.88776,6.45 6.45,6.45c3.56224,0 6.45,-2.88776 6.45,-6.45c0,-3.56224 -2.88776,-6.45 -6.45,-6.45z" fill={props.shieldColor}></path>
        </g>
      </g>
    </svg>
  );
}

type Props = {
  width: number,
  height: number,
  neckColor: string,
  shirtColor: string,
  shieldColor: string,
  bordersColor: string,
}