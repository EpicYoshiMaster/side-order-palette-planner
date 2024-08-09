import styled, { css } from "styled-components";
import dots from "../assets/gradients/dots.svg";

export const textGlow = css`
	text-shadow: 0px 0px 30px ${props => props.theme.glow}, 0px 0px 30px ${props => props.theme.glow}, 0px 0px 30px ${props => props.theme.glow}, 0px 0px 30px ${props => props.theme.glow};
`;

export const buttonGlow = css`
    background-color: ${props => props.theme.glow_background};
    border-color: ${props => props.theme.glow_border};
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
    
    background-color: rgba(0, 0, 0, 0.35);

    text-align: left;
    font-family: Splatoon;
    font-size: 1.75rem;
    color: ${props => props.theme.text};

    ${ ({disabled}) => disabled ? css`
    color: ${props => props.theme.disabled_text};
    background-color: rgba(22, 22, 22, 0.35);
    &:hover, &:active {
        background-color: ${props => props.theme.disabled_background};
        border-color: ${props => props.theme.disabled_border};
        text-shadow: none;
    }

    ` : css`
    &:hover, &:active {
        ${buttonGlow}
    }
    `}
`;

export const GlowSelect = styled.select`
    position: relative;
    padding: 5px;

    border: 3px transparent solid;
    
    background-color: rgba(0, 0, 0, 0.35);

    text-align: center;
    font-family: Splatoon, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 1.75rem;
    color: ${props => props.theme.text};

    &:hover {
        ${buttonGlow}
    }
`;

export const GlowOption = styled.option`
    font-weight: bold;
    text-shadow: none;
    font-size: 1.75rem;
`;

export const GlowInput = styled.input`
    position: relative;
    padding: 5px;

    border: 3px transparent solid;
    
    background-color: rgba(0, 0, 0, 0.35);

    text-align: center;
    font-family: Splatoon, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 1.75rem;
    color: ${props => props.theme.text};

    &:hover {
        ${buttonGlow}
    }
`

export const ActiveGlowButton = styled(GlowButton)<{ $active: boolean }>`
    ${({ $active }) => $active ? buttonGlow : css``};
`;