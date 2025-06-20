import React, { useMemo } from 'react';
import { styled, css } from 'styled-components'
import { getColorChipByIndex, getPalettes, getSamePitchChips, getSameToneChips, NO_CHIP, NONE_CHIP } from 'utils/utils';
import { Dots, GlowButton, hacksTextGlowSmall, textGlowSmall } from './Layout';
import { HacksIndicator } from './HacksIndicator';
import { ColorChip, DisplayState } from 'types/types';
import { getHacks } from 'utils/hacks';
import PackageJson from '../../package.json'

interface PaletteDetailsProps {
	placedChips: number[];
	playIndex: number;
	hacks: number[];
	selectedChip: number;
	selectedTone: number;
	displayState: DisplayState;
}

const palettes = getPalettes();
const hacksList = getHacks();

export const PaletteDetails: React.FC<PaletteDetailsProps> = ({ placedChips, playIndex, hacks, selectedChip, selectedTone, displayState }) => {

	const activeChip: ColorChip = useMemo(() => {
		if(playIndex !== -1) {
			if(placedChips[playIndex] !== NO_CHIP) {
				return getColorChipByIndex(placedChips[playIndex]);
			}
			else {
				return NONE_CHIP;
			}
		}

		if(displayState === DisplayState.DS_ColorChips) {
			if(selectedChip !== NO_CHIP) {
				return getColorChipByIndex(selectedChip);
			}
		}
		else {
			if(selectedTone !== NO_CHIP) {
				return getColorChipByIndex(selectedTone);
			}
		}

		return NONE_CHIP;
	}, [placedChips, playIndex, selectedChip, selectedTone, displayState]);

	const chipsOfTone: ColorChip[] = useMemo(() => {
		if(!activeChip) return [];

		return getSameToneChips(activeChip, false);
	}, [activeChip]);

	const chipsOfPitch: ColorChip[] = useMemo(() => {
		if(!activeChip) return [];

		return getSamePitchChips(activeChip, true, false);
	}, [activeChip]);

	return (
		<Details>
			{activeChip && (
				<Section>
					<SectionHeader>Selected Chip</SectionHeader>
					<SelectedChipDetails>
						<ChipName>
							<ChipIcon alt="" src={require(`assets/abilityicons/${activeChip.name}.png`)} />
							{activeChip.name}
						</ChipName>
					</SelectedChipDetails>
				</Section>
			)}
			{activeChip && !activeChip.isTone && activeChip.index !== NO_CHIP && (<Section>
				<SectionHeader>
					Compatible Palettes
				</SectionHeader>
				<Row>
					{palettes.map((palette, index) => (
						<ChipIcon 
						alt={`${palette.name} (${activeChip.exclusive.length > 0 && !activeChip.exclusive.includes(palette.index) ? 'Not Compatible' : 'Compatible'})`} 
						key={index} 
						$fade={activeChip.exclusive.length > 0 && !activeChip.exclusive.includes(palette.index)} 
						src={require(`assets/npcs/${palette.icon}`)} />
					))}
				</Row>
			</Section>)}
			{activeChip && activeChip.isTone && chipsOfTone.length > 0 && (<Section>
				<SectionHeader>
					Color Chips of Tone
				</SectionHeader>
				{chipsOfTone.map((chip, index) => (
					<ChipName key={index}>
						<ChipIcon alt="" src={require(`assets/abilityicons/${chip.name}.png`)} />
						{chip.name}
					</ChipName>
				))}
			</Section>)}
			{activeChip && chipsOfPitch.length > 0 && (<Section>
				<SectionHeader>{`Matching Sound Type (${activeChip.pitch})`}</SectionHeader>
				{chipsOfPitch.map((chip, index) => (
					<ChipName key={index}>
						<ChipIcon alt="" src={require(`assets/abilityicons/${chip.name}.png`)} />
						{chip.name}
					</ChipName>
				))}
			</Section>)}
			<HacksSection>
				<Dots />
				<HacksColumn>
					<SectionHeaderHacks>Minimum Hacks</SectionHeaderHacks>
					{hacksList.map((hack, index) => {
						return (
							<GlowButton key={index} $hacks>
								<SplitRow>
									<ChipName>
										<ChipIcon alt="" src={require(`assets/hacks/${hack.name}.png`)} />
										{hack.name}
									</ChipName>
									<HacksIndicator current={hacks[index]} max={hack.max} />
								</SplitRow>
							</GlowButton>
						)
					})}
				</HacksColumn>
			</HacksSection>
			<Section>
				<SectionHeader>Credits</SectionHeader>
				<Row><ChipIcon alt="" src={require(`assets/npcs/IconNPCFleaMarketSdodr.png`)} /><span>Created by <CreditsLink target="_blank" href="https://bsky.app/profile/epicyoshimaster.bsky.social">EpicYoshiMaster</CreditsLink>!</span></Row>
				<Row><ChipIcon alt="" src={require(`assets/enemy/Escape.png`)} /> <CreditsLink target="_blank" href="https://github.com/EpicYoshiMaster/side-order-palette-planner">View the source code on GitHub!</CreditsLink></Row>
				<Row><ChipIcon alt="" src={require(`assets/npcs/IconNPCPhaseBoss02Sdodr.png`)} /><CreditsLink target="_blank" href="https://ko-fi.com/epicyoshimaster">Support me on ko-fi!</CreditsLink></Row>
				<Row><ChipIcon alt="" src={require(`assets/npcs/IconNPCMizutaSdodr.png`)} /> Version {PackageJson.version}</Row>
			</Section>
		</Details>
	)
}

const Details = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 10px;
	overflow: auto;
	height: 100vh;
	padding: 10px 5px;

	& > div {
		flex-shrink: 0;
	}
`;

const SelectedChipDetails = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 10px;
`;

const ChipIcon = styled.img<{ $fade?: boolean }>`
	height: 3rem;

	@media (max-width: 2200px) {
		height: 2.6rem;
	}

	${({ $fade }) => $fade ? css`opacity: 0.3;` : css`opacity: 1;`}
`;

const ChipName = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 5px;
`;

const Section = styled.div`
	position: relative;

	background: var(--button-background);
	
	border-radius: 2rem 0.5rem;
	overflow: hidden;

	& > div {
		padding: 8px;
	}
`;

const SectionHeader = styled.h3`
	padding: 8px;
	margin: 0;
	font-size: var(--header-size);

	${textGlowSmall}

	& > img {
		margin: auto 0;
	}
`;

const SectionHeaderHacks = styled(SectionHeader)`
	${hacksTextGlowSmall}
`;

const HacksSection = styled.div`
	position: relative;
	background: linear-gradient(to right, var(--hacks-gradient-start), var(--hacks-gradient-end));
	border-radius: 2rem 0.5rem;

	border: 3px solid var(--hacks-gradient-start);

	overflow: hidden;

	& > div {
		padding: 8px;
	}
`;

const HacksColumn = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;	
	gap: 5px;
`;

const Row = styled.div<{ $maxWidth?: number }>`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 5px;
	flex-wrap: wrap;

	${({ $maxWidth }) => $maxWidth ? css`max-width: ${$maxWidth}px;` : css``}
`;

const SplitRow = styled.div`
	position: relative;
	display: flex;	
	align-items: center;
	justify-content: space-between;
`;

const CreditsLink = styled.a`
	color: var(--credits-link);	
`;