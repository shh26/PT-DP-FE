// src/HelpPage.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography, Box } from '@mui/material';

interface Guide {
  title: string;
  content: string;
}

const guides: Guide[] = [
  {
    title: 'Getting Started',
    content: `
## What is a SIB
A SIB is a Service Information Bulletin. It is a document that contains information on how to fix a problem or issue with a product or service. It is usually created by the manufacturer or service provider and is used to inform stakeholders about the issue and how to fix it.
`,
  },
  {
    title: 'Creating an Account',
    content: `
## Getting Started
To create an account, click on the sign-up button on the top right corner and fill in the required details...
`,
  },
  {
    title: 'Navigating the Dashboard',
    content: `
## Navigating the Dashboard
The dashboard contains all your main activities. You can find an overview of your projects here...
`,
  },
  {
    title: 'Settings and Preferences',
    content: `
## Settings and Preferences
You can update your settings by going to the settings page. Here you can change your preferences...

`,
  },
];

const Docs: React.FC = () => {
  return (
    <div>
  
      {guides.map((guide, index) => (
        <Box key={index} mb={4}>
          <Typography variant="h5" gutterBottom>
            {guide.title}
          </Typography>
          <ReactMarkdown>{guide.content}</ReactMarkdown>
        </Box>
      ))}
    </div>
  );
};

export default Docs;
