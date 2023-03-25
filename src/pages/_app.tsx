import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import { useEffect, useState } from "react";
import { Button, GlobalStyles } from "@mui/joy";
import Sheet from "@mui/joy/Sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  // necessary for server-side rendering
  // because mode is undefined on the server
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    >
      {mode === "light" ? "Turn dark" : "Turn light"}
    </Button>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider>
        <GlobalStyles
          styles={{
            svg: {
              color: "var(--Icon-color)",
              margin: "var(--Icon-margin)",
              fontSize: "var(--Icon-fontSize, 20px)",
              width: "0.75em",
              height: "0.75em",
            },
          }}
        />
        <Sheet>
          <ModeToggle />
          <Component {...pageProps} />
        </Sheet>
      </CssVarsProvider>
    </QueryClientProvider>
  );
}
