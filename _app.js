import { appWithTranslation } from 'next-i18next';
import './app/global.scss'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);