import '../styles/globals.css'
import { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { ThemeProvider } from 'styled-components'
// import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from '../src/theme'
import { GlobalStyles } from '../src/global'
import React, { useState } from 'react'
import Toggle from '../components/Toggle'

function getLibrary (provider: any, connector: any) {
  return new Web3Provider(provider)
}

function App ({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(darkTheme)

  const toggleTheme = () => {
    if (theme === lightTheme) {
      setTheme(darkTheme)
    } else {
      setTheme(lightTheme)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Toggle toggleTheme={toggleTheme} theme={theme}>Toggle theme</Toggle>
      {/* <CssBaseline /> */}
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </ThemeProvider>
  )
}

export default App
