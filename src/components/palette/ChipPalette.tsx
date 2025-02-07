import React from "react";
import styled from "styled-components";
import { Dashboard } from "./Dashboard";
import { ChipSlot } from "./ChipSlot";
import { ColorChipMode, LabelsSetting, Settings } from "../../types/types";
import { isChipLimited } from "utils/utils";

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
				const isLimited = settings.chips === ColorChipMode.Chips_Limited && isChipLimited(value, index, paletteIndex, chips, remainingChips);

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

	@media (max-width: 1350px) {
		padding: 15px;
		padding-bottom: 0;
	}

	@media (max-width: 1000px) {
		padding: 8px;
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

	@media (max-width: 1920px) {
		row-gap: 20px;
		column-gap: 15px;
	}

	@media (max-width: 1350px) {
		row-gap: 12px;
		column-gap: 8px;
		padding: 15px;
	}

	@media (max-width: 1000px) {
		row-gap: 8px;
		column-gap: 5px;
		padding: 8px;
	}
`;