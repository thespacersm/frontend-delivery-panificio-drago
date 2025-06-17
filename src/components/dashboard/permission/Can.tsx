import React, { ReactNode, useState, useEffect } from 'react';
import { useServices } from '@/servicesContext';

interface CanProps {
  permission: string;
  children: ReactNode;
}

const Can: React.FC<CanProps> = ({ permission, children }) => {
  const { userService } = useServices();
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    // Verifica se l'utente ha il permesso richiesto usando lo userService
    const checkPermission = async () => {
      try {
        const result = await userService.hasPermission(permission);
        setHasAccess(result);
      } catch (error) {
        console.error('Errore nel controllo dei permessi:', error);
        setHasAccess(false);
      }
    };
    
    checkPermission();
  }, [permission, userService]);

  // Renderizza i children solo se l'utente ha i permessi necessari
  return hasAccess ? <>{children}</> : null;
};

export default Can;
