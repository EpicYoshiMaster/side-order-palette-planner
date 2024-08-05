import React, { useCallback, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { NO_CHIP, getColorChipImage, getColorChipByIndex } from "utils/utils";

const getFullBackground = (showChip: boolean, image: string, defaultColor: string) => {
	if(showChip && image !== "") {
		return `url(${require(`assets/chips/${image}`)})`;
	}

	return `linear-gradient(${defaultColor}, ${defaultColor})`;
}

interface ChipSlotProps {
	chip: number;
	index: number;
	selected: boolean;
	locked: boolean;
	labeled: boolean;
	onClickChip: (chip: number, index: number) => void;
}

export const ChipSlot: React.FC<ChipSlotProps> = ({ chip, index, selected, locked, labeled, onClickChip }) => {

	const [ placed, setPlaced ] = useState(false);
	const [ clicked, setClicked ] = useState(false);

	let onClick = useCallback(() => {
		setClicked(true);

		if(!locked) {
			onClickChip(chip, index);
		}
	}, [index, chip, locked, onClickChip]);

	let onAnimEnd = useCallback((animName: string) => {
		if(animName === Place.getName()) {
			setPlaced(false);
		}
		else if(animName === Click.getName()) {
			setClicked(false);
		}

	}, []);

	useEffect(() => {
		if(chip !== NO_CHIP) {
			setPlaced(true);
		}
	}, [chip]);

	return (
		<Background 
		onMouseDown={(event) => { if(event.buttons === 1) { onClick(); } }} 
		onMouseEnter={(event) => { if(event.buttons === 1) { onClick(); }}}
		onDragStart={(event) => { event.preventDefault(); }}
		onAnimationEnd={(event) => { onAnimEnd(event.animationName); }}
		$placed={chip !== NO_CHIP}
		$image={chip !== NO_CHIP ? getColorChipImage(chip) : ""} 
		$selected={selected}
		$locked={locked}
		$clickAnim={clicked}
		$placeAnim={placed}>
			<ChipSlotAttachment 
			$placed={chip !== NO_CHIP} />
			{labeled && chip !== NO_CHIP && !locked && (
			<LabelText
			>
				{getColorChipByIndex(chip).name}
			</LabelText>
			)}
		</Background>
	)
}

const Place = keyframes`
	from {
		transform: scale(130%, 130%);
	}

	70% {
		transform: scale(100%, 100%);
	}

	85% {
		transform: scale(80%, 80%);
	}

	to {
		transform: scale(100%, 100%);
	}
`;

const Click = keyframes`
	50% {
		transform: scale(90%, 90%);
	}
`;

const Background = styled.div<{ $placed: boolean, $image: string, $selected: boolean, $locked: boolean, $clickAnim: boolean, $placeAnim: boolean }>`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;

	${({$clickAnim}) => $clickAnim ? 
	css`
		animation: ${Click} 0.1s;
	` : css``}

	${({$placeAnim}) => $placeAnim ? 
	css`
		animation: ${Place} 0.35s;
		z-index: 1000;
	` : css``}

	aspect-ratio: 1;
	border-radius: 0.25rem;

	background: ${({ $placed, $image, $locked, theme }) => getFullBackground($placed && !$locked, $image, $locked ? theme.chipslot.locked : theme.chipslot.background)};
	background-repeat: no-repeat;
	background-size: contain;

	transition: transform 0.1s linear;

	${({$selected}) => $selected ? 
	css`
		transform: scale(1.1, 1.1);
		filter: drop-shadow(0px 0px 10px #000000);
	`  : css``}

	&:hover {
		transform: scale(1.1, 1.1);
	}

	user-select: none;
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

const LabelText = styled.div`
	position: relative;
	margin: auto;

	text-align: center;
	font-size: 1.5rem;
	text-shadow: 0px 0px 5px #000000, 0px 0px 5px #000000, 0px 0px 5px #000000, 0px 0px 5px #000000;
`;