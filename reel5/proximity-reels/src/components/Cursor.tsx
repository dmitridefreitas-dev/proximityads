export const Cursor: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <svg
    width={40 * scale}
    height={48 * scale}
    viewBox="0 0 24 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#shadow)">
      <path
        d="M5 2L5 21.5L9.5 17.5L13.5 25L17 23.5L13 15.5L19 15.5L5 2Z"
        fill="white"
        stroke="black"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <filter id="shadow" x="0" y="0" width="28" height="32" filterUnits="userSpaceOnUse">
        <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity="0.3" />
      </filter>
    </defs>
  </svg>
);
