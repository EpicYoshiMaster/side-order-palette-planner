import React from "react";
import styled, { css, keyframes } from "styled-components";
import { PlacedChip } from "../../types/types";

//Border
//Little dip where it plugs in
//Noise Texture

const getFullBackground = (placed: boolean, image: string, defaultColor: string) => {
	if(placed && image !== "") {
		return `url(${require(`assets/chips/${image}`)})`;
	}

	return `linear-gradient(${defaultColor}, ${defaultColor})`;
}

interface ChipSlotProps {
	chip: PlacedChip;
	index: number;
	selected: boolean;
	onClickChip: (index: number) => void;
}

export const ChipSlot: React.FC<ChipSlotProps> = ({ chip, index, selected, onClickChip }) => {

	return (
		<Background onClick={() => { onClickChip(index); }} $placed={chip.placed} $image={chip.image} $selected={selected}>
			<ChipSlotAttachment $placed={chip.placed} />
		</Background>
	)
}

const Place = keyframes`
	from {
		transform: scale(1.3, 1.3);
	}

	to {
		transform: scale(1, 1);
	}
`;

const Background = styled.div<{ $placed: boolean, $image: string, $selected: boolean } >`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;

	${({$placed}) => $placed ? 
	css`
		animation: ${Place} 0.75s;
		z-index: 1000;
	` : css``}

	aspect-ratio: 1;
	border-radius: 0.25rem;

	background: ${({ $placed, $image, theme }) => getFullBackground($placed, $image, theme.chipslot.background)};
	background-repeat: no-repeat;
	background-size: contain;
`;

const ChipSlotAttachment = styled.div<{ $placed: boolean }>`
	position: absolute;
	display: ${({$placed}) => $placed ? 'block' : 'none'};

	width: 30%;
	height: 15%;	
	border-radius: 3px;
	transform: translate(0, 50%);
	background: linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,.2) 49.37%,transparent 49.38%);
	box-shadow: inset 0 0 5px 0 rgba(0,0,0,.2);
	mix-blend-mode: multiply;

`;