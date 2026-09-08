/** Flag SVG sprite — emoji flags banned (Windows text fallback). Use via <use href="#f-kr" /> */
export function FlagSprite() {
  return (
    <svg
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden="true"
    >
      <symbol id="f-kr" viewBox="0 0 36 36">
        <path
          fill="#EEE"
          d="M36 27c0 2.209-1.791 4-4 4H4c-2.209 0-4-1.791-4-4V9c0-2.209 1.791-4 4-4h28c2.209 0 4 1.791 4 4v18z"
        />
        <circle fill="#C60C30" cx="18" cy="14" r="4.2" />
        <circle fill="#003478" cx="18" cy="22" r="4.2" />
      </symbol>
      <symbol id="f-us" viewBox="0 0 36 36">
        <path
          fill="#B22334"
          d="M0 9c0-2.209 1.791-4 4-4h28c2.209 0 4 1.791 4 4v18c0 2.209-1.791 4-4 4H4c-2.209 0-4-1.791-4-4V9z"
        />
        <path
          fill="#EEE"
          d="M0 9.9h36v2.8H0zm0 5.6h36v2.8H0zm0 5.6h36v2.8H0zm0 5.6h36v1.5c0 .5-.05.99-.14 1.3H.14A6 6 0 010 27.3v-.6z"
        />
        <path fill="#3C3B6E" d="M18 5H4c-2.209 0-4 1.791-4 4v10h18V5z" />
      </symbol>
      <symbol id="f-gb" viewBox="0 0 36 36">
        <path
          fill="#00247D"
          d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"
        />
        <path
          fill="#CF1B2B"
          d="M25.14 23L34.85 29.8c.4-.5.7-1.1.9-1.8L28.7 23zM13 25.164L4.66 31h2.7l7.64-5.3zM23 10.837L31.337 5h-2.7L23 9.1zM10.86 13L1.15 6.2c-.4.5-.7 1.1-.9 1.8L7.3 13z"
        />
        <path fill="#EEE" d="M14.5 5H21.5V31H14.5z" />
        <path fill="#EEE" d="M0 14.5H36V21.5H0z" />
        <path fill="#CF1B2B" d="M16 5H20V31H16z" />
        <path fill="#CF1B2B" d="M0 16H36V20H0z" />
      </symbol>
      <symbol id="f-ca" viewBox="0 0 36 36">
        <path
          fill="#D52B1E"
          d="M4 5C1.791 5 0 6.791 0 9v18c0 2.209 1.791 4 4 4h6V5H4zm28 0h-6v26h6c2.209 0 4-1.791 4-4V9c0-2.209-1.791-4-4-4z"
        />
        <path fill="#EEE" d="M10 5h16v26H10z" />
        <path
          fill="#D52B1E"
          d="M18 12l1.8 3.6 3.9-1-1.4 3.8 3.7 1.6-3.7 1.6 1.4 3.8-3.9-1L18 28l-1.8-3.6-3.9 1 1.4-3.8-3.7-1.6 3.7-1.6-1.4-3.8 3.9 1z"
        />
      </symbol>
      <symbol id="f-au" viewBox="0 0 36 36">
        <path
          fill="#00247D"
          d="M0 9c0-2.209 1.791-4 4-4h28c2.209 0 4 1.791 4 4v18c0 2.209-1.791 4-4 4H4c-2.209 0-4-1.791-4-4V9z"
        />
        <g fill="#FFF">
          <circle cx="27" cy="10" r="1.1" />
          <circle cx="30" cy="15" r="1.3" />
          <circle cx="27" cy="21" r="1.5" />
          <circle cx="22" cy="19" r="1" />
          <circle cx="30.5" cy="24" r="1" />
        </g>
        <path fill="#EEE" d="M4 5h14v11H4z" />
        <path fill="#CF1B2B" d="M4 5h14v2H4zm0 4.5h14v2H4z" />
        <path fill="#CF1B2B" d="M9 5h4v11H9z" />
      </symbol>
      <symbol id="f-jp" viewBox="0 0 36 36">
        <path
          fill="#EEE"
          d="M36 27c0 2.209-1.791 4-4 4H4c-2.209 0-4-1.791-4-4V9c0-2.209 1.791-4 4-4h28c2.209 0 4 1.791 4 4v18z"
        />
        <circle fill="#ED1B2F" cx="18" cy="18" r="7" />
      </symbol>
      <symbol id="f-de" viewBox="0 0 36 36">
        <path
          fill="#FFCD05"
          d="M0 27c0 2.209 1.791 4 4 4h28c2.209 0 4-1.791 4-4v-4H0v4z"
        />
        <path fill="#ED1F24" d="M0 14h36v9H0z" />
        <path
          fill="#141414"
          d="M32 5H4C1.791 5 0 6.791 0 9v5h36V9c0-2.209-1.791-4-4-4z"
        />
      </symbol>
    </svg>
  );
}
