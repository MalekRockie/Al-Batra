import { useRouter } from 'next/router';

export default function LanguageSwitch() {
  const router = useRouter();
  const { locale, locales, asPath } = router;

  const changeLanguage = (e) => {
    const locale = e.target.value;
    router.push(asPath, asPath, { locale });
  };

  return (
    <select onChange={changeLanguage} defaultValue={locale}>
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc === 'en' ? 'English' : 'عربى'}
        </option>
      ))}
    </select>
  );
}
