import React from "react"
import styled from "styled-components"
import { SquareGlowButton } from "./Layout"

interface ItemSelectionRowProps {
	items: string[];
	selected: number;
	setSelected: (newValue: number) => void;
}

export const ItemSelectionRow: React.FC<ItemSelectionRowProps> = ({ items, selected, setSelected }) => {

	return (
		<ButtonRow $numItems={items.length}>
		{
			items.map((value, index) => {
				return (

				<SquareGlowButton key={index} $active={index === selected} onClick={() => { setSelected(index); }}>
					{value}
				</SquareGlowButton>
			)})
		}
		</ButtonRow>
	)
}

const ButtonRow = styled.div<{ $numItems: number }>`
    position: relative;
    display: grid;
    grid-template-columns: repeat(${({$numItems}) => $numItems}, 1fr);
`;