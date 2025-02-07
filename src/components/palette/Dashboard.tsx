import React from "react";
import styled, { keyframes } from "styled-components";
import InfinityLogo from "../../assets/palette/InfinityLogoAndBackground.png"
import DialControl from "../../assets/palette/DialControl.png"
import PalettePlate from "../../assets/palette/PalettePlate.png"
import { Dots } from "components/Layout";
import { getPalettes } from "utils/utils";

interface DashboardProps {
	paletteIndex: number;
}

const palettes = getPalettes();

export const Dashboard: React.FC<DashboardProps> = ({ paletteIndex }) => {
	return (
		<Wrapper>
			<Controls>
				<Logo src={InfinityLogo} alt="Side Order Infinity Logo" />
				<Dials>
					<Knobs src={DialControl} alt="" />
					<Knobs src={DialControl} alt="" />
				</Dials>
			</Controls>
			<Screen $gradient={require(`assets/gradients/${palettes[paletteIndex].pixel}Gradient.svg`)}>
				<Dots />
				
				<PlateGlow src={PalettePlate} />
				<Icon src={PalettePlate} />
				
				<NpcIconWrapper>
					<FrameA>
						<IconGlow src={require(`assets/pixelnpcs/${palettes[paletteIndex].pixel}FrameA.png`)} />
						<Icon src={require(`assets/pixelnpcs/${palettes[paletteIndex].pixel}FrameA.png`)} />
					</FrameA>
					<FrameB>
						<IconGlow src={require(`assets/pixelnpcs/${palettes[paletteIndex].pixel}FrameB.png`)} />
						<Icon src={require(`assets/pixelnpcs/${palettes[paletteIndex].pixel}FrameB.png`)} />
					</FrameB>
				</NpcIconWrapper>
			</Screen>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	padding-left: 5px;
	width: 100%;
	height: 130px;
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	user-select: none;

	@media (max-width: 1920px) {
		height: 100px;
	}

	@media (max-width: 1350px) {
		height: 80px;
	}

	@media (max-width: 1000px) {
		height: 50px;
	}

	@media (max-width: 600px) {
		height: 30px;
	}
`;

const Controls = styled.div`
	position: relative;
	height: 100%;
	display: flex;
	flex-direction: row;
`;

const Dials = styled.div`
	position: relative;
	padding: 8px 4px;
	height: 100%;
	display: flex;
	flex-direction: column;
`;

const Logo = styled.img`
	height: 100%;
	object-fit: contain;
`;

const Knobs = styled.img`
	height: 50%;
	object-fit: contain;
`;

const NpcIconWrapper = styled.div`
	position: absolute;
	left: calc(100% - 130px);
	right: 0;

	height: 100%;

	@media (max-width: 1920px) {
		left: calc(100% - 100px);
	}

	@media (max-width: 1350px) {
		left: calc(100% - 80px);
	}

	@media (max-width: 1000px) {
		left: calc(100% - 50px);
	}

	@media (max-width: 600px) {
		left: calc(100% - 30px);
	}
`;

const Blink = keyframes`
	from {
		opacity: 0;
	}

	50% {
		opacity: 1;
	}

	to {
		opacity: 1;
	}
`;

const Screen = styled.div<{ $gradient: any }>`
	position: relative;
	height: 100%;
	//width: 100px;
	display: flex;
	flex-direction: row;
	align-items: center; 
	background: url(${({$gradient}) => $gradient}) repeat-x;
	background-size: contain;
	color: ${props => props.theme.text};
	border-radius: 0.5rem;
`;

const FrameA = styled.div`
	position: absolute;
	height: 100%;

	animation: ${Blink} 1s infinite;
	animation-delay: 0s;
	animation-timing-function: steps(1);
`;

const FrameB = styled(FrameA)`
	position: absolute;
	animation-delay: 0.5s;
`;

const Icon = styled.img`
	position: relative;
	height: 100%;
	object-fit: contain;
`;

const IconGlow = styled(Icon)`
	position: absolute;
	filter: blur(20px);
	opacity: 0.4;
`;

const PlateGlow = styled(IconGlow)`
	position: absolute;
	filter: blur(10px);
	opacity: 0.8;
`;