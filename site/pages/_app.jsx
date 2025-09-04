// site/pages/_app.jsx
import { ThemeProvider } from 'nextra-theme-docs'
import '../styles.css' // 如果将来有全局样式，可以在这里引入

export default function Nextra({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
