import 'styled-components';

declare module 'styled-components' {
	export interface DefaultTheme {
		text: string;
		glow: string;
		glow_border: string;
		glow_background: string;
		gradient_background: string;

		dot: string;
		background_from: string;
		background_to: string;

		palette: {
			text: string;
			background: string;

			dashboard_dot: string;
			dashboard_background: string;
		}

		chipslot: {
			background: string;
		}
	}
}