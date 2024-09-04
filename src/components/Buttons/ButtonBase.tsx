import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonBaseProps {
  text: string;
  url: string;
}

export const ButtonBase: React.FC<ButtonBaseProps> = ({ text, url }) => {
  return (
    <Link
      to={url}
      className="rounded-md bg-ac-teal px-3 py-3 text-sm font-semibold text-white hover:text-ac-gold shadow-sm hover:bg-ac-teal-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-100 focus-visible:outline-ac-teal"
    >
      {text}
    </Link>
  );
};
