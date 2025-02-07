import styled from "styled-components";
import { GlowInput, SquareGlowButton, IconGlowButton } from "./Layout";
import { Copy } from "@phosphor-icons/react"

interface ItemTextInputRowProps
{
	label: string;
	value: string;
	setValue: (newValue: string) => void;
}

export const ItemTextInputRow: React.FC<ItemTextInputRowProps> = ({ label, value, setValue }) => {
	return (
		<ButtonRow>
			<SquareGlowButton $active={true} as="div">{label}</SquareGlowButton>
			<GlowInput id="share-code" type="string" value={value} onChange={(event) => { setValue(event.target.value); }} />
			<IconGlowButton 
				onClick={() => { navigator.clipboard.writeText(value); }}
				$active={true}>
				<Copy />
			</IconGlowButton>
		</ButtonRow>
	)
}

const ButtonRow = styled.div`
    position: relative;
    display: flex;
	flex-direction: row;

	text-align: center;
`;