import styled from "styled-components";
import { GlowInput, ActiveGlowButton } from "./Layout";
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
				<GlowCopy />
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

const SquareGlowButton = styled(ActiveGlowButton)`
	border-radius: 0;
	text-align: center;
`;

const IconGlowButton = styled(SquareGlowButton)`
	padding: 2px 15px;
	font-size: 2rem;
`;

const GlowCopy = styled(Copy)`
	box-shadow: inset 0px 0px 30px ${props => props.theme.glow}, 0px 0px 20px ${props => props.theme.glow}, 0px 0px 20px ${props => props.theme.glow}, 0px 0px 20px ${props => props.theme.glow};
`;