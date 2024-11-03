import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../../../resources/styles/App.css';
import '../../../resources/styles/CustomStyleHost.scss'

const TextWobble = (props: any) => {
  const NewText = props.value;

  return (
    <span>
      {/* Filters for the wobble effect */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="wobble1">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" seed="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="wobble2">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="wobble3">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="wobble4">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="wobble5">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Wobbly text container */}
      <span className="wobbly-animation">
        <span className="wobbly-text-container">
          {NewText}
        </span>
      </span>
    </span>
  );
}

export default TextWobble;
