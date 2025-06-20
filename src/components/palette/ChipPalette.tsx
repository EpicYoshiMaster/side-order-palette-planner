import React from "react";
import styled from "styled-components";
import { Dashboard } from "./Dashboard";
import { ChipSlot } from "./ChipSlot";
import { ColorChipMode, LabelsSetting, Settings } from "../../types/types";
import { getColorChipByIndex, isChipLimited } from "utils/utils";

interface ChipPaletteProps {
	placedChips: number[];
	playIndex: number;
	paletteIndex: number;
	openSlots: number;
	settings: Settings;
	onClickChip: (chip: number, index: number) => void;
}

export const ChipPalette: React.FC<ChipPaletteProps> = ({ placedChips, playIndex, paletteIndex, openSlots, settings, onClickChip }) => {

	return (
		<Background>
			<DashboardArea>
				<Dashboard paletteIndex={paletteIndex} />
			</DashboardArea>
			<ChipArea>
			{
			placedChips.map((value, index) => {
				const isLimited = settings.chips === ColorChipMode.Chips_Limited && isChipLimited(placedChips, getColorChipByIndex(value), paletteIndex, index);

				return (
					<ChipSlot 
					chip={value} 
					index={index} 
					key={index} 
					selected={index === playIndex} 
					locked={index + 1 > openSlots}
					labeled={settings.labels === LabelsSetting.Labels_On}
					limited={isLimited}
					showAttachment={true}
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

	display: grid;
	grid-template-rows: max-content 1fr;

	align-items: center;

	background-color: var(--palette-background);
	filter: drop-shadow(0px 0px 5px var(--palette-background));
`;

const DashboardArea = styled.div`
	position: relative;
	height: 100%;
	padding: 25px;
	padding-bottom: 0;

	@media (max-width: 2200px) {
		padding: 20px;
		padding-bottom: 0;
	}

	@media (max-width: 1400px) {
		padding: 15px;
		padding-bottom: 0;
	}

	@media (max-width: 875px) {
		padding: 10px;
		padding-bottom: 0;
	}

	@media (max-width: 600px) {
		padding: 8px;
		padding-bottom: 0;
	}

	@media (max-width: 450px) {
		padding: 5px;
		padding-bottom: 0;
	}
`;

const ChipArea = styled.div`
	position: relative;
	display: grid;
	padding: 25px;

	grid-template-columns: repeat(9, 1fr);

	row-gap: 30px;
	column-gap: 20px; 

	@media (max-width: 2200px) {
		row-gap: 20px;
		column-gap: 15px;
		padding: 20px;
	}

	@media (max-width: 1400px) {
		row-gap: 12px;
		column-gap: 8px;
		padding: 15px;
	}

	@media (max-width: 875px) {
		row-gap: 10px;
		column-gap: 7px;
		padding: 10px;
	}

	@media (max-width: 600px) {
		row-gap: 8px;
		column-gap: 5px;
		padding: 8px;
	}

	@media (max-width: 450px) {
		row-gap: 5px;
		column-gap: 3px;
		padding: 5px;
	}
`;