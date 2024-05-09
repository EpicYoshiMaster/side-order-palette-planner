import React from "react"
import styled from "styled-components"
import { ActiveGlowButton } from "./Layout"

interface ItemSelectionRowProps {
	items: string[];
	selected: number;
	setSelected: React.Dispatch<React.SetStateAction<number>>;
}

export const ItemSelectionRow: React.FC<ItemSelectionRowProps> = ({ items, selected, setSelected }) => {

	return (
		<ButtonRow $numItems={items.length}>
		{
			items.map((value, index) => (
				<ActiveItem key={index} $active={index === selected} onClick={() => { setSelected(index); }}>
					{value}
				</ActiveItem>
			))
		}
		</ButtonRow>
	)
}

const ButtonRow = styled.div<{ $numItems: number }>`
    position: relative;
    display: grid;
    grid-template-columns: repeat(${({$numItems}) => $numItems}, 1fr);
`;

const ActiveItem = styled(ActiveGlowButton)`
    border-radius: 0;
    text-align: center;
`;