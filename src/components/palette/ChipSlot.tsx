import React, { useCallback, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { NO_CHIP, getColorChipImage, getColorChipByIndex } from "utils/utils";
import Marker from "assets/markers/purple_x.png"

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
	limited: boolean;
	showAttachment: boolean;
	chipNumber?: number;
	onClickChip: (chip: number, index: number) => void;
}

export const ChipSlot: React.FC<ChipSlotProps> = ({ chip, index, selected, locked, labeled, limited, onClickChip, showAttachment, chipNumber = -999 }) => {

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
		onTouchStart={() => { onClick(); }}
		onDragStart={(event) => { event.preventDefault(); }}
		onAnimationEnd={(event) => { onAnimEnd(event.animationName); }}
		$placed={chip !== NO_CHIP}
		$image={chip !== NO_CHIP ? getColorChipImage(chip) : ""} 
		$selected={selected}
		$locked={locked}
		$clickAnim={clicked}
		$placeAnim={placed}>
			{showAttachment && (
				<ChipSlotAttachment $placed={chip !== NO_CHIP} />
			)}

			{limited && !locked && (
				<XMarker src={Marker} />
			)}

			{labeled && chip !== NO_CHIP && !locked && (
			<LabelText>
				{`${getColorChipByIndex(chip).name} ${chipNumber !== -999 ? `(${chipNumber})` : ``}`}
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

	background: ${({ $placed, $image, $locked }) => getFullBackground($placed && !$locked, $image, $locked ? "var(--color-chip-slot-locked)" : "var(--color-chip-slot-background)")};
	background-repeat: no-repeat;
	background-size: contain;

	transition: transform 0.1s linear;

	${({$selected}) => $selected ? 
	css`
		transform: scale(1.1, 1.1);
		filter: drop-shadow(0px 0px 10px var(--color-chip-drop-shadow));
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

const XMarker = styled.img`
	position: absolute;
	padding: 10%;
	width: 100%;
	height: 100%;
`;

const LabelText = styled.div`
	position: relative;
	margin: auto;

	text-align: center;
	font-size: var(--label-size);
	text-shadow: 0px 0px 5px #000000, 0px 0px 5px #000000, 0px 0px 5px #000000, 0px 0px 5px #000000;
`;