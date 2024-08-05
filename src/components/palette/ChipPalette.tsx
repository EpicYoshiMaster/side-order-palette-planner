import React from "react";
import styled from "styled-components";
import { Dashboard } from "./Dashboard";
import { ChipSlot } from "./ChipSlot";
import { LabelsSetting, Palette } from "../../types/types";

interface ChipPaletteProps {
	chips: number[];
	playIndex: number;
	palette: Palette;
	openSlots: number;
	onClickChip: (chip: number, index: number) => void;
	labelsSetting: LabelsSetting;
}

export const ChipPalette: React.FC<ChipPaletteProps> = ({ chips, playIndex, palette, openSlots, labelsSetting, onClickChip }) => {

	return (
		<Background>
			<DashboardArea>
				<Dashboard palette={palette} />
			</DashboardArea>
			<ChipArea>
			{
			chips.map((value, index) => {
				return (
					<ChipSlot 
					chip={value} 
					index={index} 
					key={index} 
					selected={index === playIndex} 
					locked={index + 1 > openSlots}
					labeled={labelsSetting === LabelsSetting.Labels_On}
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