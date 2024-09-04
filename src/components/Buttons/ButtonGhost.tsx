import React from 'react';

interface ButtonGhostProps {
  text: string;
  url: string;
}

export const ButtonGhost: React.FC<ButtonGhostProps> = ({ text, url }) => {
  return (
    <div>
      <a href={url}>
        <button type="button"
        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          {text}
        </button>   
      </a>
    </div>
  )
}

