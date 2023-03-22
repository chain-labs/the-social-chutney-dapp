import "../styles/globals.css";
import "../styles/Home-new.scss";
import "../styles/Toaster.scss";
import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import Toaster from "../src/components/Toaster";
import { ThemeProvider } from "styled-components";
import theme from "../src/styleguide/theme";
import Head from "next/head";
import { FAVICON_URL, WEBSITE_TITLE } from "../src/settings/constants";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <title>{WEBSITE_TITLE}</title>
        <link rel="shortcut icon" href={FAVICON_URL} />
      </Head>
      <ThemeProvider theme={theme}>
        <Toaster />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
}

export default MyApp;
