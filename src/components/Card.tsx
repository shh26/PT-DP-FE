import React from 'react';

interface CardProps {
  title: string;
  value: number;
  description: string;
}

const Card: React.FC<CardProps> = ({ title, value, description }) => {
  return (
    <div style={{ background: 'linear-gradient(to right, #054E5A, black)' }} className="p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-95 transition-all duration-200 text-white">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-4xl font-bold mb-2">{value}</p>
      <p className="text-gray-200">{description}</p>
    </div>
  );
};

export default Card;
