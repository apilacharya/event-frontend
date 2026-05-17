import { Container } from '@mui/material';
import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <Container maxWidth="lg" className="py-6">
      {children}
    </Container>
  );
}
