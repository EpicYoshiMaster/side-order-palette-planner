import styled, { css } from "styled-components";
import dots from "../assets/gradients/dots.svg";

export const textGlow = css`
	text-shadow: 
    0px 0px 30px var(--text-glow), 
    0px 0px 30px var(--text-glow), 
    0px 0px 30px var(--text-glow), 
    0px 0px 30px var(--text-glow);
`;

export const buttonGlow = css`
    background-color: var(--button-highlight-background);
    border-color: var(--button-highlight-border);
    ${textGlow};
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

export const GlowButton = styled.button`
    position: relative;
    padding: 5px 20px;

    border: 3px transparent solid;
    border-radius: 5rem;
    
    background-color: var(--button-background);

    text-align: left;
    font-family: Splatoon;
    font-size: var(--text-size);
    color: var(--text);

    ${ ({disabled}) => disabled ? css`
        color: var(--disabled-text);
        background-color: var(--button-disabled-background);

        &:hover, &:active {
            background-color: var(--button-disabled-highlight-background);
            border-color: var(--button-disabled-highlight-border);
            text-shadow: none;
        }
    ` : css`
        &:hover {
            ${buttonGlow}
        }
    `}

    @media (max-width: 1350px) {
		padding: 5px 10px;
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
		0px 0px 20px var(--text-glow), 
		0px 0px 20px var(--text-glow), 
		0px 0px 20px var(--text-glow), 
		0px 0px 20px var(--text-glow);
	}
`;