'use client';

import React, { useState, useEffect } from 'react';
import { onNavigationStateChange } from '@/lib/scroll-utils';
import NavigationIndicator from '@/components/ui/navigation-indicator';
import ScrollToTop from '@/components/ui/scroll-to-top';
import SectionDots from '@/components/ui/section-dots';

export default function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetSection, setTargetSection] = useState<string>();

  useEffect(() => {
    const unsubscribe = onNavigationStateChange((navigating, section) => {
      setIsNavigating(navigating);
      setTargetSection(section);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {children}
      <NavigationIndicator
        isVisible={isNavigating}
        targetSection={targetSection}
      />
      <SectionDots />
      <ScrollToTop />
    </>
  );
}
