import React from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";

const theme: DefaultTheme = {
	text: "#ffffff",
	glow: "#ad5431",
	glow_border: "#988e85",
	glow_background: "#615755",
	gradient_background: "#5e4242",

	dot: "#2b1b2c",
	background_from: "#1d101d",
	background_to: "#381e2d",

	palette: {
		text: "#464644",
		background: "#ffffff",

		dashboard_dot: "#1e4b40",
		dashboard_background: "#2a5a4e"
	},

	chipslot: {
		locked: "#262626",
		background: "#d3d3d3"
	}
};

interface ThemeProps {
	children: React.ReactNode;
}

export const Theme: React.FC<ThemeProps> = ({ children }) => {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}