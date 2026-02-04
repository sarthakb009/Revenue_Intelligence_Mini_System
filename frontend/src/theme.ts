import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0d5c2e" },
    secondary: { main: "#6b5a3b" },
    background: {
      default: "#f5f2ec",
      paper: "#fdfcfa",
    },
    text: {
      primary: "#1a1915",
      secondary: "#4a4842",
    },
    success: { main: "#2d6a3e" },
    warning: { main: "#9a7b2e" },
    error: { main: "#a32c2c" },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 600, letterSpacing: "-0.01em" },
    h3: { fontWeight: 600 },
    body1: { fontSize: "0.9375rem" },
    body2: { fontSize: "0.875rem", color: "#4a4842" },
    caption: { fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.75rem" },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", border: "1px solid #e8e4dc" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { border: "1px solid #e8e4dc" },
      },
    },
  },
});
