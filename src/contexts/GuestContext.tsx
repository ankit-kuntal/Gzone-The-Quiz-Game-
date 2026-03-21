"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GuestContextType {
  isGuest: boolean;
  guestId: string | null;
  initializeGuestMode: () => void;
  exitGuestMode: () => void;
  fetchWithGuestId: (url: string, options?: RequestInit) => Promise<Response>;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};

interface GuestProviderProps {
  children: ReactNode;
}

export const GuestProvider: React.FC<GuestProviderProps> = ({ children }) => {
  const [isGuest, setIsGuest] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);

  const initializeGuestMode = () => {
    const existingGuestId = localStorage.getItem('guestId');
    if (existingGuestId) {
      setGuestId(existingGuestId);
      setIsGuest(true);
    } else {
      const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem('guestId', newGuestId);
      setGuestId(newGuestId);
      setIsGuest(true);
    }
  };

  const exitGuestMode = () => {
    localStorage.removeItem('guestId');
    setGuestId(null);
    setIsGuest(false);
  };

  const fetchWithGuestId = async (url: string, options?: RequestInit): Promise<Response> => {
    const headers = new Headers(options?.headers || {});
    const currentGuestId = localStorage.getItem('guestId');

    if (currentGuestId) {
      headers.set('x-guest-id', currentGuestId);
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedGuestId = localStorage.getItem('guestId');

    if (!token && storedGuestId) {
      setIsGuest(true);
      setGuestId(storedGuestId);
    }
  }, []);

  const value = {
    isGuest,
    guestId,
    initializeGuestMode,
    exitGuestMode,
    fetchWithGuestId,
  };

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
};