// Global state for navigation indicator
let navigationCallbacks: Array<
  (isNavigating: boolean, targetSection?: string) => void
> = [];

export function onNavigationStateChange(
  callback: (isNavigating: boolean, targetSection?: string) => void
) {
  navigationCallbacks.push(callback);
  return () => {
    navigationCallbacks = navigationCallbacks.filter(cb => cb !== callback);
  };
}

// Enhanced scroll animation with custom easing and visual feedback
export function handleMenuClick(section: string) {
  // Convert section names to appropriate IDs or scroll behavior
  const sectionMap: { [key: string]: string } = {
    HOME: 'home',
    'ABOUT ME': 'about',
    PROJECTS: 'projects',
    CAPABILITIES: 'capabilities',
    PROCESS: 'process',
    FEEDBACKS: 'feedbacks',
    CONTACT: 'contact',
    CONTATTAMI: 'contact',
  };

  const targetId =
    sectionMap[section] || section.toLowerCase().replace(' ', '-');

  // Notify about navigation start
  navigationCallbacks.forEach(callback => callback(true, targetId));

  // Add visual feedback during navigation
  document.body.style.cursor = 'wait';

  const onComplete = () => {
    document.body.style.cursor = 'auto';
    // Notify about navigation end
    navigationCallbacks.forEach(callback => callback(false));
  };

  if (targetId === 'home') {
    smoothScrollTo(0, () => {
      onComplete();
    });
    return;
  }

  const element = document.getElementById(targetId);
  if (element) {
    const rect = element.getBoundingClientRect();
    const offsetTop = window.pageYOffset + rect.top;

    // Calculate offset for navbar (adjust based on your navbar height)
    const navbarOffset = 100; // Adjust this value based on your navbar height
    const targetPosition = Math.max(0, offsetTop - navbarOffset);

    smoothScrollTo(targetPosition, () => {
      // Add a subtle highlight effect to the target section
      addSectionHighlight();
      onComplete();
    });
  } else {
    // If element not found, still notify completion
    onComplete();
  }
}

// Custom smooth scroll function with easing
function smoothScrollTo(targetY: number, callback?: () => void) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const duration = Math.max(800, Math.min(1500, Math.abs(distance) / 2)); // Dynamic duration based on distance

  let start: number;

  // Custom easing function (easeInOutCubic)
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  function animation(currentTime: number) {
    if (start === undefined) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);

    const easedProgress = easeInOutCubic(progress);
    const currentY = startY + distance * easedProgress;

    window.scrollTo(0, currentY);

    if (progress < 1) {
      requestAnimationFrame(animation);
    } else {
      callback?.();
    }
  }

  requestAnimationFrame(animation);
}

// Add subtle highlight effect to target section
function addSectionHighlight() {
  // Glow effect disabled for cleaner navigation experience
  return;
}

// Get current active section for navigation highlighting
export function getCurrentSection(): string | null {
  const sections = [
    'home',
    'about',
    'projects',
    'capabilities',
    'process',
    'feedbacks',
    'contact',
  ];
  const scrollY = window.pageYOffset;
  const windowHeight = window.innerHeight;

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i]);
    if (section) {
      const rect = section.getBoundingClientRect();
      const sectionTop = scrollY + rect.top;

      // Check if we're in the viewport range of this section
      if (scrollY >= sectionTop - windowHeight / 3) {
        return sections[i];
      }
    }
  }

  return 'home'; // Default to home if no section is active
}
