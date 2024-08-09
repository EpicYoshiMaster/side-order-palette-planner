import React from "react";
import styled from "styled-components";
import { Dashboard } from "./Dashboard";
import { ChipSlot } from "./ChipSlot";
import { ColorChip, ColorChipMode, LabelsSetting, Palette, Settings } from "../../types/types";
import { getColorChipByIndex, isChipIndexExclusive, MAX_DRONE_ABILITIES, NO_CHIP } from "utils/utils";

interface ChipPaletteProps {
	chips: number[];
	playIndex: number;
	paletteIndex: number;
	openSlots: number;
	settings: Settings;
	onClickChip: (chip: number, index: number) => void;
	remainingChips: number[];
}

export const ChipPalette: React.FC<ChipPaletteProps> = ({ chips, playIndex, paletteIndex, openSlots, settings, onClickChip, remainingChips }) => {

	return (
		<Background>
			<DashboardArea>
				<Dashboard paletteIndex={paletteIndex} />
			</DashboardArea>
			<ChipArea>
			{
			chips.map((value, index, chips) => {

				const isChipCountExceeded = (chip: ColorChip, chipIndex: number, index: number): boolean => {
					if(!chip) return false;
					if(chip.isTone) return false;
					if(remainingChips[chipIndex] >= 0) return false;

					const chipNumber = chips.filter((itemChipIndex, itemIndex) => itemIndex <= index && itemChipIndex === chipIndex).length;

					return chipNumber > chip.max;
				}

				const isDroneAbilitiesExceeded = (chip: ColorChip, chipIndex: number, index: number): boolean => {
					if(!chip) return false;
					if(!chip.drone) return false;
					if(chip.isTone) return false;

					const abilities = chips.filter((itemChipIndex, itemIndex, array) => {
						if(itemChipIndex === NO_CHIP) return false;

						const itemChip = getColorChipByIndex(itemChipIndex)

						return itemIndex <= index && itemChip.drone && array.indexOf(itemChipIndex) === itemIndex;
					});

					return abilities.indexOf(chipIndex) + 1 > MAX_DRONE_ABILITIES;
				}

				const isLimited = value !== NO_CHIP 
					&& settings.chips === ColorChipMode.Chips_Limited 
					&& (isChipIndexExclusive(value, paletteIndex) 
					|| isChipCountExceeded(getColorChipByIndex(value), value, index)
					|| isDroneAbilitiesExceeded(getColorChipByIndex(value), value, index));

				return (
					<ChipSlot 
					chip={value} 
					index={index} 
					key={index} 
					selected={index === playIndex} 
					locked={index + 1 > openSlots}
					labeled={settings.labels === LabelsSetting.Labels_On}
					limited={isLimited}
					onClickChip={onClickChip} />
				)
			})
			}
			</ChipArea>
		</Background>
	);
};

const Background = styled.div`
	position: relative;
	border-radius: 0.25rem;

	width: max(1400px, min(100%, calc(58vh * 9.0/4.0)));

	display: grid;
	grid-template-rows: 0.2fr 1fr;

	align-items: center;

	background-color: ${props => props.theme.palette.background};
	filter: drop-shadow(0px 0px 5px ${props => props.theme.palette.background});
`;

const DashboardArea = styled.div`
	position: relative;
	height: 100%;
	padding: 0 25px;
	padding-top: 25px;
`;

const ChipArea = styled.div`
	position: relative;
	display: grid;
	padding: 25px;

	grid-template-columns: repeat(9, 1fr);

	row-gap: 30px;
	column-gap: 20px; 
`;