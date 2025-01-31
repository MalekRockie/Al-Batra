// hooks/useBookingReady.js
import { useEffect, useState } from 'react';

const useBookingReady = (dependencies = {}) => {
  const [isBookingReady, setIsBookingReady] = useState(false);
  const { isMobile, currentStep } = dependencies;

  useEffect(() => {
    const checkBookingElements = async () => {
      try {
        // Wait for critical booking components
        await Promise.all([
          waitForElement('.datePickerContainer', 3000),
          waitForElement('.roomTypeContainer', isMobile ? 0 : 3000), // Only wait on desktop
          waitForImages(),
          waitForInteractiveElements()
        ]);

        // Additional mobile-specific checks
        if (isMobile) {
          await waitForStepSpecificElements(currentStep);
        }

        setIsBookingReady(true);
      } catch (error) {
        console.error('Booking load error:', error);
        setIsBookingReady(true); // Fallback
      }
    };

    checkBookingElements();
  }, [isMobile, currentStep]);

  // Helper functions
  const waitForElement = (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) return resolve();

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => reject(`Element ${selector} timeout`), timeout);
    });
  };

  const waitForStepSpecificElements = (step) => {
    const selectors = {
      dateSelection: ['.CustomDateRangePicker', '.continueButton'],
      roomSelection: ['.RoomTypeSelection', '.BookingButton']
    };
    return Promise.all(selectors[step].map(s => waitForElement(s)));
  };

  const waitForInteractiveElements = () => {
    return Promise.all([
      waitForElement('.searchButton', 3000),
      waitForElement('.continueButton', isMobile ? 3000 : 0)
    ]);
  };

  return isBookingReady;
};

export default useBookingReady;