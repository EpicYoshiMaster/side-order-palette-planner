import React, { useCallback, useState, useMemo, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { ColorChip, PaletteMode, SoundSetting, ColorChipMode, DisplayState, LabelsSetting, Settings, AsideState } from './types/types';
import { ColorChipList } from './components/ColorChipList';
import { randRange, getLastBaseIndex, NO_CHIP, DEFAULT_PALETTE, EIGHTS_PALETTE, NUM_PALETTE_SLOTS, PALETTE_ROW_LENGTH, getColorChipByIndex, getColorGroup, getColorTones, generateShareCode, convertShareCode, getBiasedColorGroup, getDroneAbilities, MAX_DRONE_ABILITIES, getBaseChips, getRemainingValidChips, getWeightedRandomChip } from './utils/utils';
import { ChipPalette } from './components/palette/ChipPalette';
import { GlowButton, textGlow, Dots, GlowSelect, GlowOption, IconGlowButton } from 'components/Layout';
import { ItemSelectionRow } from 'components/ItemSelectionRow';
import { ItemTextInputRow } from 'components/ItemTextInputRow';
import { useKeyDown, useSearchParamNumber, useLocalStorage, usePlacedChips } from 'utils/hooks';
import { useMediaQuery } from 'react-responsive';
import { PaletteInfo } from 'components/PaletteInfo';
import { PaletteDetails } from 'components/PaletteDetails';
import { getHacksUsed } from 'utils/hacks';

const DEFAULT_SHARE_CODE = generateShareCode(DEFAULT_PALETTE);

function App() {
	const [ paletteMode, setPaletteMode ] = useState(PaletteMode.Palette_Draw);
	const [ displayState, setDisplayState ] = useState(DisplayState.DS_ColorChips);
	const [ numOpenSlots, setNumOpenSlots ] = useState(NUM_PALETTE_SLOTS);
	const [ selectedChip, setSelectedChip ] = useState(0);
	const [ selectedTone, setSelectedTone ] = useState(getLastBaseIndex() + 1);
	const [ playIndex, setPlayIndex ] = useState(0);
	const [ shareCode, setShareCode ] = useState(DEFAULT_SHARE_CODE);
	const [ aside, setAside] = useState(AsideState.Aside_None);

	const createShareCode = useCallback((chips: number[]) => {
		const newShareCode = generateShareCode(chips);

		setShareCode(newShareCode);
	}, [setShareCode]);
	
	//const [ placedChips, setPlacedChips ] = useLocalStorage<number[]>("palette", DEFAULT_PALETTE, (parsedValue: number[]) => {
	//	createShareCode(parsedValue);
	//});
	const [ placedChips, setPlacedChips ] = usePlacedChips("palette", DEFAULT_PALETTE, {replace: true}, (parsedValue: number[]) => {
		createShareCode(parsedValue);
	});
	const [ labelsSetting, setLabelsSetting ] = useLocalStorage("label", LabelsSetting.Labels_Off);
	const [ soundSetting, setSoundSetting ] = useLocalStorage("sound", SoundSetting.Sound_On);
	const [ paletteIndex, setPaletteIndex ] = useSearchParamNumber("index", 0, {replace: true});
	const [ colorChipMode, setColorChipMode ] = useSearchParamNumber("mode", ColorChipMode.Chips_Limited, {replace: true});

	const isSmallScreen = useMediaQuery({ query: '(max-width: 450px)'});
	const canCollapseLeftAside = useMediaQuery({ query: '(max-width: 1150px)'});
	const canCollapseRightAside = useMediaQuery({ query: '(max-width: 1700px)'});

	const settings: Settings = useMemo(() => {
		return {
			mode: paletteMode, 
			sound: soundSetting,
			labels: labelsSetting,
			chips: colorChipMode,
			display: displayState
		}
	}, [paletteMode, soundSetting, labelsSetting, colorChipMode, displayState]);

	const numFreeSlots = useMemo(() => {
		return paletteIndex === EIGHTS_PALETTE ? numOpenSlots : NUM_PALETTE_SLOTS;
	}, [paletteIndex, numOpenSlots]);

	const colorChipBias: string = useMemo(() => {
		return getBiasedColorGroup(placedChips);
	}, [placedChips]);

	const hacks = useMemo(() => {
		return getHacksUsed(placedChips, paletteIndex);
	}, [placedChips, paletteIndex]);

	//Will always be at least 5, if invalid chips are placed, allowed to go to 6 or more
	//(Designed to be detected by the UI to display)
	const droneAbilities = useMemo(() => {
		const abilities = getDroneAbilities(placedChips, paletteIndex);

		const emptySlots = MAX_DRONE_ABILITIES - abilities.length;

		if(emptySlots > 0) {
			return abilities.concat(Array(emptySlots).fill(""));
		}
		else {
			return abilities;
		}
	}, [placedChips, paletteIndex]);

	useEffect(() => {
		if(playIndex + 1 > numFreeSlots) {
			setPlayIndex(0);
		}
	}, [playIndex, numFreeSlots])

	const offsetPlayIndex = useCallback((offset: number) => {
		if(paletteMode !== PaletteMode.Palette_Play) return;

		let newIndex = (playIndex + offset);

		if(newIndex < 0) {
			newIndex = 0;
		}

		if(newIndex > numFreeSlots - 1) {
			newIndex = numFreeSlots - 1;
		}

		setPlayIndex(newIndex);
	}, [playIndex, setPlayIndex, numFreeSlots, paletteMode]);

	useKeyDown((event: KeyboardEvent) => {

		if(event.target && event.target instanceof HTMLInputElement) return;

		switch(event.key) {
			case "1":
				setPaletteMode(PaletteMode.Palette_Draw);
				break;

			case "2":
				setPaletteMode(PaletteMode.Palette_Erase);
				break;

			case "3":
				setPaletteMode(PaletteMode.Palette_Sound);
				break;

			case "4":
				setPaletteMode(PaletteMode.Palette_Draw);
				break;

			case "5":
				setLabelsSetting(LabelsSetting.Labels_On);
				break;
			
			case "6":
				setLabelsSetting(LabelsSetting.Labels_Off);
				break;
			
			case "7":
				setSoundSetting(SoundSetting.Sound_On);
				break;

			case "8":
				setSoundSetting(SoundSetting.Sound_Off);
				break;
			
			case "9":
				setColorChipMode(ColorChipMode.Chips_Limited);
				break;
			
			case "0":
				setColorChipMode(ColorChipMode.Chips_Any);
				break;
			
			case "ArrowLeft":
				if(event.target && event.target instanceof HTMLSelectElement) return;

				offsetPlayIndex(-1);
				break;
			case "ArrowRight":
				if(event.target && event.target instanceof HTMLSelectElement) return;

				offsetPlayIndex(1);
				break;
		}
	});

	const applyShareCode = useCallback((shareCode: string) => {
		shareCode = shareCode.substring(0, NUM_PALETTE_SLOTS);

		setPlacedChips(convertShareCode(shareCode));

		setShareCode(shareCode);

	}, [setShareCode, setPlacedChips]);

	const playSound = useCallback((sound: string | undefined) => {
		if(soundSetting !== SoundSetting.Sound_On || !sound) return;

		const audio = new Audio(sound);

		audio.play();
	}, [soundSetting]);

	const resetPalette = useCallback(() => {
		setPlacedChips(DEFAULT_PALETTE);

		playSound(require(`assets/sounds/ChipBeamVanish.wav`));

		createShareCode(DEFAULT_PALETTE);
	}, [createShareCode, playSound, setPlacedChips]);

	const randomizePalette = useCallback(() => {
		setPlacedChips(DEFAULT_PALETTE);

		let randomChips: number[] = [];

		if(colorChipMode === ColorChipMode.Chips_Any) {
			randomChips = placedChips.map(() => {
				const possibleChips = getBaseChips();
	
				return possibleChips[randRange(0, possibleChips.length - 1)].index;
			})
		}
		else {
			let remainingColorChips = getBaseChips();

			placedChips.forEach(() => {
				remainingColorChips = getRemainingValidChips(remainingColorChips, randomChips, paletteIndex);

				const randomChip = remainingColorChips[randRange(0, remainingColorChips.length - 1)].index;

				randomChips.push(randomChip);
			})
		}

		setPlacedChips(randomChips);
		createShareCode(randomChips);

		playSound(require(`assets/sounds/PlaceColorChip.wav`));
	}, [createShareCode, placedChips, playSound, setPlacedChips, paletteIndex, colorChipMode]);

	const randomizeTones = useCallback(() => {

		const toneChips = getColorTones();

		let randomChips: number[] = [];

		if(colorChipMode === ColorChipMode.Chips_Any) {
			randomChips = placedChips.map((chip) => {
				if(chip === NO_CHIP) return chip;
	
				const possibleChips = toneChips.filter((randomChip) => randomChip.group === getColorChipByIndex(chip).group);
	
				return possibleChips[randRange(0, possibleChips.length - 1)].index;
			})
		}
		else {
			//When logic is enabled, randomize chips where possible until no options remain, then simply randomize from the tone.
			placedChips.forEach((chip) => {
				if(chip === NO_CHIP) {
					randomChips.push(chip);
					return;
				}

				const relevantChips = toneChips.filter((randomChip) => randomChip.group === getColorChipByIndex(chip).group);

				const validChips = getRemainingValidChips(relevantChips, randomChips, paletteIndex);

				if(validChips.length <= 0) {
					const randomChip = relevantChips[randRange(0, relevantChips.length - 1)].index;
					randomChips.push(randomChip);
				}
				else {
					const randomChip = getWeightedRandomChip(validChips, randomChips, paletteIndex);
					randomChips.push(randomChip.index);
				}
			})
		}
		
		setPlacedChips(randomChips);
		createShareCode(randomChips);

		playSound(require(`assets/sounds/PlaceColorChip.wav`));
	}, [createShareCode, placedChips, playSound, setPlacedChips, paletteIndex, colorChipMode]);

	const shuffleChips = useCallback(() => {
		const shuffledChips: number[] = [];
		const remainingChips: number[] = placedChips.slice();

		placedChips.forEach(() => {
			const randomIndex = randRange(0, remainingChips.length - 1);

			shuffledChips.push(remainingChips[randomIndex]);
			remainingChips.splice(randomIndex, 1);
		})

		setPlacedChips(shuffledChips);
		createShareCode(shuffledChips);

		playSound(require(`assets/sounds/PlaceColorChip.wav`));
	}, [createShareCode, placedChips, playSound, setPlacedChips])

	const flipHorizontal = useCallback(() => {
		const flippedChips = placedChips.map((chip, index) => {
			const rowOffset = (Math.floor((index / PALETTE_ROW_LENGTH)) * PALETTE_ROW_LENGTH);
			const flippedRowIndex = ((PALETTE_ROW_LENGTH - 1) - (index % PALETTE_ROW_LENGTH));

			const flippedIndex = rowOffset + flippedRowIndex;

			return placedChips[flippedIndex];
		})

		setPlacedChips(flippedChips);
		createShareCode(flippedChips);

		playSound(require(`assets/sounds/PlaceColorChip.wav`));

	}, [setPlacedChips, createShareCode, placedChips, playSound]);

	const flipVertical = useCallback(() => {
		const flippedChips = placedChips.map((chip, index) => {
			const maxRows = Math.floor(NUM_PALETTE_SLOTS / PALETTE_ROW_LENGTH);
			const flippedRowOffset = (((maxRows - 1) - Math.floor((index / PALETTE_ROW_LENGTH))) * PALETTE_ROW_LENGTH);
			const rowIndex = (index % PALETTE_ROW_LENGTH);
			
			const flippedIndex = flippedRowOffset + rowIndex;

			return placedChips[flippedIndex];
		})

		setPlacedChips(flippedChips);
		createShareCode(flippedChips);

		playSound(require(`assets/sounds/PlaceColorChip.wav`));

	}, [setPlacedChips, createShareCode, placedChips, playSound])

	const onSelectChip = useCallback((chip: ColorChip) => {

		if(paletteMode === PaletteMode.Palette_Sound) {
			playSound(require(`assets/sounds/tones/UI_Sdodr_MyPalette_00_PushTip_${getColorGroup(chip.group).name}_${chip.tone}.wav`));
		}
		
		if(chip.isTone) {
			setSelectedTone(chip.index);
		}
		else {
			setSelectedChip(chip.index);
		}
		
	}, [playSound, paletteMode]);

	const onClickChip = useCallback((chip: number, index: number) => {
		switch(paletteMode) {
			case PaletteMode.Palette_Draw:
				if(((displayState === DisplayState.DS_ColorChips) ? selectedChip : selectedTone) === chip) return;

				const newChips = placedChips.map((value, idx) => {
					if(idx !== index) return value;

					if(displayState === DisplayState.DS_ColorChips) {
						return selectedChip;
					}
					else {
						return selectedTone;
					}
				});

				setPlacedChips(newChips);
				createShareCode(newChips);

				playSound(require(`assets/sounds/PlaceColorChip.wav`));

				
				break;

			case PaletteMode.Palette_Erase:
				if(chip !== NO_CHIP) {
					playSound(require(`assets/sounds/ChipBeamVanish.wav`));

					const newChips = placedChips.map((value, idx) => idx === index ? NO_CHIP : value);

					setPlacedChips(newChips);		
					createShareCode(newChips);
				}
				break;

			case PaletteMode.Palette_Sound:
				if(chip !== NO_CHIP) {
					const colorChip = getColorChipByIndex(chip);

					playSound(require(`assets/sounds/tones/UI_Sdodr_MyPalette_00_PushTip_${getColorGroup(colorChip.group).name}_${colorChip.tone}.wav`));
				}
				break;
			
			case PaletteMode.Palette_Play:
				setPlayIndex(index);
				break;
		}
	}, [placedChips, createShareCode, selectedChip, selectedTone, displayState, paletteMode, playSound, setPlacedChips]);
	
  	return (
		<>
			<Background />
			<Dots />
			<Content>
				<LeftSide>
					<LeftAside $collapsed={canCollapseLeftAside && aside !== AsideState.Aside_Left}>
						{canCollapseLeftAside && (
							<LeftCollapseButton
							onClick={() => { setAside((oldState) => oldState === AsideState.Aside_Left ? AsideState.Aside_None : AsideState.Aside_Left); }}
							$active={false}>
								<img alt="Color Chip and Tone Selection Menu Drawer" src={require(`assets/npcs/IconNPCHimeDroneSdodr.png`)} />
							</LeftCollapseButton>
						)}
						<ColorChipList 
							onClickChip={onSelectChip} 
							selectedChip={selectedChip} 
							selectedTone={selectedTone}
							settings={settings}
							setDisplayState={setDisplayState}
							placedChips={placedChips}
							paletteIndex={paletteIndex}  />
					</LeftAside>
					<Main>
						<PaletteSpace>
							<TopArea>
								<Header>Side Order Palette Planner</Header>
								{isSmallScreen && (
									<div>
										<div>Hi there, this tool is designed for use on larger screens!</div>
										<div>You may run into issues using it on your device.</div>
									</div>
								)}
								<Controls>
									<ButtonRow>
										<ItemSelectionRow items={["1. Draw Mode", "2. Erase Mode", "3. Sound Mode", "4. Play Mode"]} selected={paletteMode} setSelected={setPaletteMode} />
										<ItemSelectionRow items={["5. Show Labels", "6. Hide Labels"]} selected={labelsSetting} setSelected={setLabelsSetting} />
									</ButtonRow>
									<ButtonRow>
										<ItemSelectionRow items={["7. Sound On", "8. Sound Off"]} selected={soundSetting} setSelected={setSoundSetting} />
										<ItemSelectionRow items={["9. Chip Logic", "0. No Logic"]} selected={colorChipMode} setSelected={setColorChipMode} />
										<ItemTextInputRow label="Share Code" value={shareCode} setValue={applyShareCode} />
									</ButtonRow>
									<ButtonRow>
										<GlowButton onClick={() => { resetPalette(); }}>
											Reset
										</GlowButton>
										<GlowButton onClick={() => { randomizePalette(); }}>
											Randomize
										</GlowButton>
										<GlowButton onClick={() => { randomizeTones(); }}>
											Randomize Tones
										</GlowButton>
										<GlowButton onClick={() => { flipHorizontal(); }}>
											Flip Horizontally
										</GlowButton>
										<GlowButton onClick={() => { flipVertical(); }}>
											Flip Vertically
										</GlowButton>
										<GlowButton onClick={() => { shuffleChips(); }}>
											Shuffle
										</GlowButton>
										{paletteIndex === EIGHTS_PALETTE && (
										<GlowSelect id="open-slots" value={numOpenSlots} onChange={(event) => { setNumOpenSlots(Number(event.target.value)); }}>
											<GlowOption value={36}>0 Hacks</GlowOption>
											<GlowOption value={30}>1 Hack</GlowOption>
											<GlowOption value={24}>2 Hacks</GlowOption>
											<GlowOption value={18}>3 Hacks</GlowOption>
											<GlowOption value={12}>4 Hacks</GlowOption>
											<GlowOption value={6}>5+ Hacks</GlowOption>
										</GlowSelect>
										)}
										{paletteMode === PaletteMode.Palette_Play && (
											<>
												<GlowButton onClick={() => { offsetPlayIndex(-1); }}>
													←
												</GlowButton>
												<GlowButton onClick={() => { offsetPlayIndex(1); }}>
													→
												</GlowButton>
											</>
										)}
									</ButtonRow>
								</Controls>
								
								<PaletteInfo 
									droneAbilities={droneAbilities}
									colorBias={colorChipBias}
									paletteIndex={paletteIndex}
									setPaletteIndex={setPaletteIndex}
								/>
							</TopArea>
							<BottomArea>
								<ChipPalette 
									paletteIndex={paletteIndex} 
									playIndex={paletteMode === PaletteMode.Palette_Play ? playIndex : NO_CHIP} 
									placedChips={placedChips} 
									onClickChip={onClickChip} 
									openSlots={numFreeSlots}
									settings={settings}
									/>
							</BottomArea>
						</PaletteSpace>
					</Main>
				</LeftSide>
				<RightAside $collapsed={canCollapseRightAside && aside !== AsideState.Aside_Right}>
					{canCollapseRightAside && (
						<RightCollapseButton
							onClick={() => { setAside((oldState) => oldState === AsideState.Aside_Right ? AsideState.Aside_None : AsideState.Aside_Right); }}
							$active={false}>
								<img alt="Detailed Palette Information Menu Drawer" src={require(`assets/npcs/IconNPCMizutaSdodr.png`)} />
						</RightCollapseButton>
					)}
					<PaletteDetails 
						placedChips={placedChips}
						playIndex={paletteMode === PaletteMode.Palette_Play ? playIndex : NO_CHIP}
						hacks={hacks}
						selectedChip={selectedChip}
						selectedTone={selectedTone}
						displayState={displayState}
						/>
				</RightAside>
			</Content>
		</>
	);
}

export default App;

const Background = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;

	background: linear-gradient(to right, var(--background-gradient-start), var(--background-gradient-end));
`;

const Content = styled.div`
	position: relative;
	font-size: var(--text-size);

	display: flex;
	flex-direction: row;
	justify-content: space-between;

	color: var(--text);

	overflow: hidden;

	@media (max-width: 2400px) {
		--text-size: 1.25rem;
		--title-size: 2.5rem;
		--color-group-size: 1.5rem;
		--header-size: 1.5rem;
	}

	@media (max-width: 2200px) {
		--text-size: 1.1rem;
		--title-size: 2.1rem;
		--color-group-size: 1.4rem;
		--header-size: 1.4rem;
		--label-size: 1.1rem;
	}

	@media (max-width: 1400px) {
		--text-size: 1rem;
		--title-size: 2rem;
		--color-group-size: 1.25rem;
		--header-size: 1.4rem;
		--label-size: 0.9rem;
	}

	@media (max-width: 875px) {
		--title-size: 1.5rem;
		--text-size: 0.9rem;
		--header-size: 1.25rem;
		--label-size: 0.75rem;
	}

	@media (max-width: 650px) {
		--title-size: 1.1rem;
		--text-size: 0.75rem;
		--header-size: 0.9rem;
		--label-size: 0.6rem;
	}

	@media (max-width: 450px) {
		--title-size: 1.1rem;
		--text-size: 0.75rem;
		--header-size: 0.9rem;
		--label-size: 0.5rem;
	}

	@media (max-width: 400px) {
		--label-size: 0.4rem;
	}
`;

const LeftSide = styled.div`
	position: relative;

	display: flex;
	flex-direction: row;
`;

const Header = styled.h1`
	position: relative;
	margin: 0;
	text-align: left;
	font-size: var(--title-size);

	${textGlow};

	@media (max-width: 1700px) {
		margin-left: 60px;
	}
`;

const Controls = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	row-gap: 10px;	

	& > div, & > button {
		margin: 0 5px;
	}
`;

const ButtonRow = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	margin: 10px 0;

	row-gap: 10px;

	flex-wrap: wrap;

	& > div, & > button {
		margin: 0 5px;
	}

	@media (max-width: 850px) {
		display: contents;
	}
`;

const Main = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	gap: 20px;
	
	height: 100vh;
	height: 100dvh;

	overflow: auto;
	
	padding: 10px;
	padding-top: 0;
	

	@media (max-width: 875px) {
		padding: 5px;
		padding-top: 0;
	}
`;

const PaletteSpace = styled.div`
	position: relative;
	width: 1450px;

	@media (max-width: 2400px) {
		width: 1350px;
	}

	@media (max-width: 2200px) {
		width: 1220px;
	}

	@media (max-width: 1900px) {
		width: 1125px;
	}

	@media (max-width: 1800px) {
		width: 1025px;
	}

	//Collapsing the right aside lets us have more space again
	@media (max-width: 1700px) {
		width: 1220px;
	}

	@media (max-width: 1600px) {
		width: 1100px;
	}

	@media (max-width: 1500px) {
		width: 1025px;
	}

	@media (max-width: 1400px) {
		width: 925px;
	}

	@media (max-width: 1250px) {
		width: 850px;
	}

	//no more..........
	@media (max-width: 1150px) {
		width: 100%;
	}
`;

const Aside = styled.aside<{ $collapsed: boolean }>`
	position: relative;

	transition: transform 0.5s ease-in-out;
`;

const LeftAside = styled(Aside)`
	min-width: 400px;
	width: 400px;
	max-width: 400px;

	${({ $collapsed }) => $collapsed ? 
	css`
		transform-origin: 0% 0%;
		transform: translate(-100%, 0);
	` 
	: css``};

	@media (max-width: 2200px) {
		min-width: 325px;
		width: 325px;
		max-width: 325px;
	}

	@media (max-width: 1400px) {
		min-width: 300px;
		width: 300px;
		max-width: 300px;
	}

	@media (max-width: 1250px) {
		min-width: 275px;
		width: 275px;
		max-width: 275px;
	}

	@media (max-width: 1150px) {
		position: fixed;
		z-index: 3;
		background: linear-gradient(to right, var(--background-gradient-start), var(--background-gradient-end));
	}

	@media (max-width: 450px) {
		min-width: 250px;
		width: 250px;
		max-width: 250px;
	}
`;

const RightAside = styled(Aside)`
	right: 0;
	${({ $collapsed }) => $collapsed ? 
	css`
		transform-origin: 0% 0%;
		transform: translate(100%, 0);
	` 
	: css``};

	flex-grow: 1;

	@media (max-width: 1700px) {
		position: fixed;
		z-index: 3;
		background: linear-gradient(to right, var(--background-gradient-start), var(--background-gradient-end));
	}

	@media (max-width: 1400px) {
		max-width: 450px;
	}

	@media (max-width: 1300px) {
		max-width: 350px;
	}
	
	@media (max-width: 450px) {
		max-width: 275px;
	}
`;

const LeftCollapseButton = styled(IconGlowButton)`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	left: 100%;	
	z-index: 5;
	width: 50px;
	height: 50px;
	padding: 8px;

	img {
		width: 32px;
		height: 32px;

		filter: drop-shadow(0px 0px 0.25em var(--text-glow)) drop-shadow(0px 0px 0.5em var(--text-glow)) drop-shadow(0px 0px 0.5em var(--text-glow));
	}
`;

const RightCollapseButton = styled(LeftCollapseButton)`
	left: -50px;
`;

const TopArea = styled.div`
	position: relative;
`;

const BottomArea = styled.div`
	position: relative;
	padding-bottom: 10px;
`;