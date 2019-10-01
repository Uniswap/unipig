import React from 'react'

export const QRIcon = props => (
  <svg width={60} height={60} viewBox="0 0 60 60" fill="none" {...props}>
    <g filter="url(#filter0_dd)">
      <rect x={10} y={8} width={40} height={40} rx={10} fill="#202124" />
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26.5714 17.7143L19.7143 17.7143L19.7143 24.5714L26.5714 24.5714L26.5714 17.7143ZM19.7143 16L18 16L18 17.7143L18 24.5714L18 26.2857L19.7143 26.2857L26.5714 26.2857L28.2857 26.2857L28.2857 24.5714L28.2857 17.7143L28.2857 16L26.5714 16L19.7143 16ZM23.1429 19.4286L21.4286 19.4286L21.4286 21.1429L21.4286 22.8571L23.1429 22.8571L24.8571 22.8571L24.8571 21.1429L24.8571 19.4286L23.1429 19.4286ZM19.7143 38.2857L19.7143 31.4286L26.5714 31.4286L26.5714 38.2857L19.7143 38.2857ZM18 29.7143L19.7143 29.7143L26.5714 29.7143L28.2857 29.7143L28.2857 31.4286L28.2857 38.2857L28.2857 40L26.5714 40L19.7143 40L18 40L18 38.2857L18 31.4286L18 29.7143ZM23.1429 33.1429L21.4286 33.1429L21.4286 34.8571L21.4286 36.5714L23.1429 36.5714L24.8571 36.5714L24.8571 34.8571L24.8571 33.1429L23.1429 33.1429ZM33.4286 17.7143L40.2857 17.7143L40.2857 24.5714L33.4286 24.5714L33.4286 17.7143ZM31.7143 16L33.4286 16L40.2857 16L42 16L42 17.7143L42 24.5714L42 26.2857L40.2857 26.2857L33.4286 26.2857L31.7143 26.2857L31.7143 24.5714L31.7143 17.7143L31.7143 16ZM36.8571 19.4286L35.1429 19.4286L35.1429 21.1429L35.1429 22.8571L36.8571 22.8571L38.5714 22.8571L38.5714 21.1429L38.5714 19.4286L36.8571 19.4286ZM36.8571 29.7143L31.7143 29.7143L31.7143 40L33.4286 40L33.4286 34.8571L35.1429 34.8571L35.1429 36.5714L42 36.5714L42 29.7143L40.2857 29.7143L40.2857 31.4286L36.8571 31.4286L36.8571 29.7143ZM38.5714 38.2857L36.8571 38.2857L36.8571 40L38.5714 40L38.5714 38.2857ZM40.2857 38.2857L42 38.2857L42 40L40.2857 40L40.2857 38.2857Z"
      fill="white"
    />
    <defs>
      <filter
        id="filter0_dd"
        x={0}
        y={0}
        width={60}
        height={60}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={5} />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={5} />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
        <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
      </filter>
    </defs>
  </svg>
)
