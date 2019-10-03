import React from 'react'

export const QRIcon = props => (
  <svg width={60} height={60} viewBox="0 0 60 60" fill="none" {...props}>
    <g filter="url(#prefix__filter0_dd)">
      <rect x={10} y={8} width={40} height={40} rx={10} fill="url(#prefix__paint0_linear)" />
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26.571 17.714h-6.857v6.857h6.857v-6.857zM19.714 16H18v10.286h10.286V16H19.714zm3.429 3.429h-1.714v3.428h3.428V19.43h-1.714zm-3.429 18.857v-6.857h6.857v6.857h-6.857zM18 29.714h10.286V40H18V29.714zm5.143 3.429h-1.714v3.428h3.428v-3.428h-1.714zm10.286-15.429h6.857v6.857h-6.857v-6.857zM31.714 16H42v10.286H31.714V16zm5.143 3.429h-1.714v3.428h3.428V19.43h-1.714zm0 10.285h-5.143V40h1.715v-5.143h1.714v1.714H42v-6.857h-1.714v1.715h-3.429v-1.715zm1.714 8.572h-1.714V40h1.714v-1.714zm1.715 0H42V40h-1.714v-1.714z"
      fill="#fff"
    />
    <defs>
      <linearGradient id="prefix__paint0_linear" x1={10} y1={28} x2={50} y2={28} gradientUnits="userSpaceOnUse">
        <stop stopColor="#FE6DDE" />
        <stop offset={1} stopColor="#FE6D6D" />
      </linearGradient>
      <filter
        id="prefix__filter0_dd"
        x={0}
        y={0}
        width={60}
        height={60}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={5} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={5} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
        <feBlend in2="effect1_dropShadow" result="effect2_dropShadow" />
        <feBlend in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
      </filter>
    </defs>
  </svg>
)

export const CopyIcon = props => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
    <path fill="none" d="M0 0h16v16H0z" />
    <path
      d="M13.333 6h-6C6.597 6 6 6.597 6 7.333v6c0 .737.597 1.334 1.333 1.334h6c.737 0 1.334-.597 1.334-1.334v-6c0-.736-.597-1.333-1.334-1.333z"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.333 10h-.666a1.333 1.333 0 01-1.334-1.334v-6a1.333 1.333 0 011.334-1.333h6A1.333 1.333 0 0110 2.666v.667"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
