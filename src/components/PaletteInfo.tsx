import React from "react";
import styled, { css } from "styled-components";
import { GlowSelect, GlowOption } from "./Layout";
import { getPalettes, MAX_DRONE_ABILITIES, formatWeaponName } from "utils/utils";
import { useMediaQuery } from "react-responsive";

interface PaletteInfoProps {
	colorBias: string;
	paletteIndex: number;
	droneAbilities: string[];
	setPaletteIndex: (newValue: number) => void;
}

const palettes = getPalettes();

export const PaletteInfo: React.FC<PaletteInfoProps> = ({colorBias, paletteIndex, droneAbilities, setPaletteIndex}) => {
	const shouldReduceText = useMediaQuery({ query: '(max-width: 1900px)'});

	return (
	<PaletteInfoWrapper $colorBias={colorBias}>
		<PaletteIconBackground alt="" src={require(`assets/npcs/${palettes[paletteIndex].icon}`)} />
		<GlowSelect id="palette-index" value={paletteIndex} onChange={(event) => { setPaletteIndex(Number(event.target.value)); }}>
			{
			palettes.map((value, index) => {
				return (
					<GlowOption value={index} key={index}>{value.name}</GlowOption>
				)
			})
			}
		</GlowSelect>
		<InfoSection>
			<PaletteIconBackground alt={formatWeaponName(palettes[paletteIndex].mainWeapon)} src={require(`assets/weapons/${palettes[paletteIndex].mainWeapon}`)} />
			<PaletteIconSlot>
				<PaletteMaskImage $colorBias={colorBias} $source={require(`assets/subs/Mask${palettes[paletteIndex].subWeapon}`)} />
				<PaletteBlendIcon alt={formatWeaponName(palettes[paletteIndex].subWeapon)} src={require(`assets/subs/${palettes[paletteIndex].subWeapon}`)} />
			</PaletteIconSlot>
			<PaletteIconSlot>
			<PaletteMaskImage $colorBias={colorBias} $source={require(`assets/specials/Mask${palettes[paletteIndex].specialWeapon}`)} />
				<PaletteBlendIcon alt={formatWeaponName(palettes[paletteIndex].specialWeapon)} src={require(`assets/specials/${palettes[paletteIndex].specialWeapon}`)} />
			</PaletteIconSlot>
		</InfoSection>
		<InfoSection>
			<TonesText>{shouldReduceText ? "" : "Common Tones"}</TonesText>
			<Tones>
				<PaletteIcon alt={`${palettes[paletteIndex].firstTone} Primary Tone`} src={require(`assets/tones/Category_${palettes[paletteIndex].firstTone}.png`)} />
				<SecondaryTone alt={`${palettes[paletteIndex].secondTone} Secondary Tone`} src={require(`assets/tones/Category_${palettes[paletteIndex].secondTone}.png`)} />
			</Tones>
		</InfoSection>
		<InfoSection>
			<PaletteIcon alt="Pearl Drone Abilities" src={require(`assets/npcs/IconNPCHimeDroneSdodr.png`)} />
			{droneAbilities.map((ability, index) => {
				return <AbilityCircle $overcapped={index > MAX_DRONE_ABILITIES - 1} key={index}>
					{ability === "" && (
						<AbilitySlot />
					)}
					{ability !== "" && (
						<AbilitySlot>
							<PaletteMaskImage $colorBias={colorBias} $source={require(`assets/droneicons/Mask${ability.replace(/\s/g, "")}.png`)} />
							<AbilityIcon alt={ability} src={require(`assets/droneicons/${ability.replace(/\s/g, "")}.png`)} />
						</AbilitySlot>
					)}
				</AbilityCircle>
			})
			}
		</InfoSection>
	</PaletteInfoWrapper>
	);
}

const PaletteInfoWrapper = styled.div<{ $colorBias: string }>`
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-evenly;
	flex-wrap: wrap;
	margin: 10px 0;

	row-gap: 10px;

	& > div, & > button {
		margin: 0 3px;
	}

	padding: 15px 0;
	background: linear-gradient(to bottom right, var(--bottom-row-background-start), var(--icon-${({$colorBias}) => $colorBias}));
	border-radius: 2rem 0.5rem;

	@media (max-width: 1800px) {
		padding: 10px 0;
	}
`;

const InfoSection = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center; 
	gap: 5px;
	height: 80px;
	padding: 5px 15px;

	background: var(--bottom-row-section-background);
	border-radius: 5rem;

	@media (max-width: 2200px) {
		height: 65px;
	}

	@media (max-width: 1800px) {
		padding: 5px 12px;
	}

	@media (max-width: 1400px) {
		height: 55px;
		padding: 5px 12px;
	}

	@media (max-width: 875px) {
		height: 45px;
		padding: 3px 8px;
	}
`;

const PaletteIcon = styled.img`
	position: relative;
	margin-right: 5px;
	height: 3.25rem;
	object-fit: contain;

	@media (max-width: 2200px) {
		height: 3rem;
	}

	@media (max-width: 1800px) {
		height: 2.5rem;
	}

	@media (max-width: 1400px) {
		height: 2rem;
	}

	@media (max-width: 1250px) {
		height: 1.9rem;
	}

	@media (max-width: 875px) {
		height: 1.75rem;
	}
`;

const PaletteBlendIcon = styled.img`
	position: relative;
	height: 100%;
	object-fit: contain;
`;

const PaletteIconSlot = styled.div`
	position: relative;
	margin-right: 10px;
	height: 3.5rem;
	object-fit: contain;

	@media (max-width: 2200px) {
		height: 3rem;
	}

	@media (max-width: 1800px) {
		height: 2.5rem;
		margin-right: 8px;
	}
	
	@media (max-width: 1400px) {
		height: 2rem;
		margin-right: 5px;
	}

	@media (max-width: 1250px) {
		height: 1.75rem;
		margin-right: 3px;
	}
`;

const PaletteMaskImage = styled.div<{ $colorBias: string, $source: string | undefined }>`
	position: absolute;
	height: 100%;
	width: 100%;

	${({ $colorBias, $source }) => $source ? css`
		background: var(--icon-${$colorBias});
		background-size: 100%;
		background-repeat: no-repeat;
		mask-image: url(${$source});
		mask-size: 100%;
		z-index: 1;
	` : css``}
`;

const AbilityCircle = styled.div<{ $overcapped: boolean }>`
	position: relative;
	aspect-ratio: 1/1;
	height: 3.5rem;
	width: 3.5rem;
	border-radius: 100%;
	padding: 8px;
	border: 2px solid var(--drone-ability-circle${({ $overcapped }) => $overcapped ? "-overcap" : ""});

	@media (max-width: 2200px) {
		height: 3.25rem;
		width: 3.25rem;
	}

	@media (max-width: 1800px) {
		height: 3rem;
		width: 3rem;
	}

	@media (max-width: 1400px) {
		height: 2.75rem;
		width: 2.75rem;
	}

	@media (max-width: 1250px) {
		height: 2.5rem;
		width: 2.5rem;
	}

	@media (max-width: 875px) {
		height: 2.25rem;
		width: 2.25rem;
		padding: 5px;
	}
`;

const AbilitySlot = styled.div`
	position: relative;
	width: 100%;
	height: 100%;	

	display: flex;
	justify-content: center;
	align-items: center;
`;

const AbilityIcon = styled.img`
	height: 100%;	
`;

const Tones = styled.div`
	display: flex;
	flex-direction: row;
	align-items: top;
	justify-content: flex-start;	
`;

const TonesText = styled.div`
	font-size: var(--label-size);
`;

const SecondaryTone = styled(PaletteIcon)`
	height: 2.75rem;

	@media (max-width: 2200px) {
		height: 2.5rem;
	}

	@media (max-width: 2200px) {
		height: 2.15rem;
	}

	@media (max-width: 1400px) {
		height: 1.75rem;
	}

	@media (max-width: 1250px) {
		height: 1.6rem;
		width: 1.6rem;
	}

	@media (max-width: 875px) {
		height: 1.4rem;
	}
`;

const PaletteIconBackground = styled(PaletteIcon)`
	height: 5rem;
	background: radial-gradient(circle, #fffefe34 0% 40%, transparent 60%);

	@media (max-width: 2200px) {
		height: 4rem;
	}

	@media (max-width: 1400px) {
		height: 3rem;
	}

	@media (max-width: 1250px) {
		height: 2.5rem;
	}
`;