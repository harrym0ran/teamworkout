import { createTheme } from "@mui/material/styles";

export const shades = {
  primary: {
    500: "#7730A4",
  },

  secondary: {
    500: "#25A5A8",
  },
  neutral: {
    500: "#9D2715",
  },
};

const theme = createTheme({
  palette: {
    main: shades.primary[500],
  },
  secondary: {
    main: shades.secondary[500],
  },
  neutral: {
    main: shades.neutral[500],
  },
  // typography: {
  //   fontFamily: ["Fauna One", "sans-serif"].join(","),
  //   fontSize: 11,
  //   h1: {
  //     fontFamily: ["Cinzel", "sans-serif"].join(","),
  //     fontSize: 48,
  //   }
  // },
});

export default theme;