import styled, { css } from "styled-components";
import dots from "../assets/gradients/dots.svg";

export const textGlow = css`
	text-shadow: 
    0px 0px 30px var(--text-glow), 
    0px 0px 30px var(--text-glow), 
    0px 0px 30px var(--text-glow), 
    0px 0px 30px var(--text-glow);
`;

export const textGlowSmall = css`
	text-shadow: 
    0px 0px 10px var(--text-glow), 
    0px 0px 10px var(--text-glow), 
    0px 0px 10px var(--text-glow), 
    0px 0px 10px var(--text-glow);
`;

export const buttonGlow = css`
    background-color: var(--button-highlight-background);
    border-color: var(--button-highlight-border);
    ${textGlow};
`;

export const hacksTextGlow = css`
	text-shadow: 
    0px 0px 30px var(--hacks-text-glow), 
    0px 0px 30px var(--hacks-text-glow), 
    0px 0px 30px var(--hacks-text-glow), 
    0px 0px 30px var(--hacks-text-glow);    
`;

export const hacksTextGlowSmall = css`
	text-shadow: 
    0px 0px 10px var(--hacks-text-glow), 
    0px 0px 10px var(--hacks-text-glow), 
    0px 0px 10px var(--hacks-text-glow), 
    0px 0px 10px var(--hacks-text-glow);    
`;

export const hacksButtonGlow = css`
    background-color: var(--hacks-button-highlight-background);
    border-color: var(--hacks-button-highlight-border);
    ${hacksTextGlow};   
`;

export const Dots = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;

	background-image: url(${dots});
	background-size: 9px;
	mix-blend-mode: soft-light;
	opacity: 0.3;
`;

export const GlowButton = styled.button<{ $hacks?: boolean }>`
    position: relative;
    padding: 5px 20px;

    border: 3px transparent solid;
    border-radius: 5rem;

    ${({ $hacks }) => $hacks ? css`width: 100%;` : css``}
    
    background-color: ${({ $hacks }) => `var(--${$hacks ? 'hacks-' : ''}button-background)`};

    text-align: left;
    font-family: Splatoon;
    font-size: var(--text-size);
    color: var(--text);

    ${ ({disabled, $hacks }) => disabled ? css`
        color: var(--${$hacks ? 'hacks-' : ''}disabled-text);
        background-color: var(--${$hacks ? 'hacks-' : ''}button-disabled-background);

        &:hover, &:active {
            background-color: var(--${$hacks ? 'hacks-' : ''}button-disabled-highlight-background);
            border-color: var(--${$hacks ? 'hacks-' : ''}button-disabled-highlight-border);
            text-shadow: none;
        }
    ` : css`
        &:hover {
            ${$hacks ? hacksButtonGlow : buttonGlow}
        }

        &:active {
            background-color: var(--${$hacks ? 'hacks-' : ''}button-active-background);
        }
    `}

    @media (max-width: 2200px) {
        padding: 5px 15px;
    }

    @media (max-width: 1400px) {
		padding: 5px 10px;
	}

    @media (max-width: 450px) {
        padding: 3px;
    }
`;

export const GlowSelect = styled.select`
    position: relative;
    padding: 5px;

    border: 3px transparent solid;
    
    background-color: var(--button-background);

    text-align: center;
    font-family: Splatoon, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: var(--text-size);
    color: var(--text);

    &:hover {
        ${buttonGlow}
    }
`;

export const GlowOption = styled.option`
    font-weight: bold;
    text-shadow: none;
    font-size: var(--text-size);
`;

export const GlowInput = styled.input`
    position: relative;
    padding: 5px;

    border: 3px transparent solid;
    
    background-color: var(--button-background);

    text-align: center;
    font-family: Splatoon, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: var(--text-size);
    color: var(--text);

    &:hover {
        ${buttonGlow}
    }
`;

export const ActiveGlowButton = styled(GlowButton)<{ $active: boolean }>`
    ${({ $active }) => $active ? buttonGlow : css``};
`;

export const SquareGlowButton = styled(ActiveGlowButton)`
	border-radius: 0;
	text-align: center;
`;

export const IconGlowButton = styled(SquareGlowButton)`
	padding: 2px 15px;
	font-size: var(--text-size);

	svg {
		box-shadow: inset 
		0px 0px 25px var(--text-glow), 
		0px 0px 25px var(--text-glow), 
		0px 0px 25px var(--text-glow), 
		0px 0px 25px var(--text-glow);
	}
`;