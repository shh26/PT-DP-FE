import React from 'react';

import { ReactNode } from 'react';

interface ButtonIconProps {
  text: string;
  url: string;
  icon: ReactNode;
}



export const ButtonIcon: React.FC<ButtonIconProps> = ({ text, url, icon }) => {
  return (
    <div>
      <a href={url}>
        <button type="button"
          className="rounded-md bg-ac-teal px-2.5 py-1.5 text-sm font-semibold text-white flex shadow-sm hover:bg-ac-teal-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ac-teal"
        >
          <div className="pe-2 flex-1">
          {icon}
          </div>
          <div>{text}</div>
          
        </button>   
      </a>
    </div>
  )
}