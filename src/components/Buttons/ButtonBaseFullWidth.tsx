import React from 'react';

interface ButtonBaseProps {
  text: string;
  url?: string;
  onClick?: ()=> void;
}

export const ButtonBaseFullWidth: React.FC<ButtonBaseProps> = ({ text,url,onClick }) => {
  return (
    <div className="w-11/12 justify-center items-center">
      <a href={url}>
        <button type="button" onClick={onClick}
          className="rounded-md w-11/12 bg-ac-teal px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-ac-teal-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ac-teal"
        >
          {text}
        </button>   
      </a>
    </div>
  )
}