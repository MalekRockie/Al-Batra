'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import homeStyle from '../scss/Home.module.scss';

// This only works if there are 2 langauges set for the site, adding more will require a different implementation which I already have in the file named LocaleSwitcherSelect just in case it is needed in the future.
export default function CustomerLocaleSwitcher() {
    // this should track if the component is mounted on the client or nut
    const [isClient, setIsClient] = useState(false); 
    const router = useRouter();
    const pathname = usePathname(); 
    const locale = useLocale();

    const langSwitcherClass = locale === "ar" ? homeStyle['langSwitcher-ar'] : homeStyle.langSwitcher;

    useEffect(() => {
        setIsClient(true);
    }, []);

  if (!isClient) {
    return null;
  }

  const switchToLocale = locale === 'ar' ? 'en' : 'ar';
  const languageLabel = switchToLocale === 'ar' ? 'العربية' : 'English';

  
  const handleLangSwitch = () => {
    
    let newPath = pathname;

    // If the current URL starts with the locale (either 'en' or 'ar'), replace it
    if (newPath.startsWith(`/${locale}`)) {
      newPath = newPath.replace(`/${locale}`, `/${switchToLocale}`);
    } else {
      // If no locale is found at the start, prepend the new locale to the path
      newPath = `/${switchToLocale}${newPath}`;
    }

    
    router.push(newPath);
  };

  return (
    <a className={langSwitcherClass} onClick={handleLangSwitch}>
      <img src="intl100.png" alt="lang" className={homeStyle.globalIcon}/>
      {languageLabel}
    </a>
  );
}

