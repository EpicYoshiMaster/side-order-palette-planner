import React, { useCallback, useState, useMemo, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { ColorChip, PaletteMode, SoundSetting, ColorChipMode, DisplayState, LabelsSetting, Settings } from './types/types';
import { ColorChipList } from './components/ColorChipList';
import { randRange, getLastBaseIndex, NO_CHIP, DEFAULT_PALETTE, EIGHTS_PALETTE, NUM_PALETTE_SLOTS, PALETTE_ROW_LENGTH, getColorChipByIndex, getColorGroup, getColorTones, generateShareCode, convertShareCode, getPalettes, getColorChips } from './utils/utils';
import { ChipPalette } from './components/palette/ChipPalette';
import { GlowButton, textGlow, Dots, GlowSelect, GlowOption, IconGlowButton } from 'components/Layout';
import { ItemSelectionRow } from 'components/ItemSelectionRow';
import { ItemTextInputRow } from 'components/ItemTextInputRow';
import { useKeyDown, useSearchParamNumber, useLocalStorage } from 'utils/hooks';
import { useMediaQuery } from 'react-responsive';
import { List } from '@phosphor-icons/react';

//
// Palette Planner:
//
// - Tone Count Limits
// - Display exclusive chip icons

const DEFAULT_SHARE_CODE = generateShareCode(DEFAULT_PALETTE);
const palettes = getPalettes();
const colorChips = getColorChips();

function App() {
	//const [ placedChips, setPlacedChips ] = useState<number[]>(DEFAULT_PALETTE);
	const [ paletteMode, setPaletteMode ] = useState(PaletteMode.Palette_Draw);
	const [ displayState, setDisplayState ] = useState(DisplayState.DS_ColorChips);
	const [ numOpenSlots, setNumOpenSlots ] = useState(NUM_PALETTE_SLOTS);
	const [ selectedChip, setSelectedChip ] = useState(0);
	const [ selectedTone, setSelectedTone ] = useState(getLastBaseIndex() + 1);
	const [ playIndex, setPlayIndex ] = useState(0);
	const [ shareCode, setShareCode ] = useState(DEFAULT_SHARE_CODE);
	const [ collapsed, setCollapsed] = useState(true);

	const createShareCode = useCallback((chips: number[]) => {
		const newShareCode = generateShareCode(chips);

		setShareCode(newShareCode);
	}, [setShareCode]);
	
	const [ placedChips, setPlacedChips ] = useLocalStorage<number[]>("palette", DEFAULT_PALETTE, (parsedValue: number[]) => {
		createShareCode(parsedValue);
	});
	const [ labelsSetting, setLabelsSetting ] = useLocalStorage("label", LabelsSetting.Labels_Off);
	const [ soundSetting, setSoundSetting ] = useLocalStorage("sound", SoundSetting.Sound_On);
	const [ paletteIndex, setPaletteIndex ] = useSearchParamNumber("index", 0, {replace: true});
	const [ colorChipMode, setColorChipMode ] = useSearchParamNumber("mode", ColorChipMode.Chips_Limited, {replace: true});

	const isSmallScreen = useMediaQuery({ query: '(max-width: 1700px)'});

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
	}, [paletteIndex, numOpenSlots])

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

		console.log(event.target);

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

	const remainingChips = useMemo(() => {
		let chipAmounts = colorChips.map((value) => value.max);

		placedChips.forEach((chip) => {
			if(chip === NO_CHIP) return;

			chipAmounts[chip] -= 1;
		})

		return chipAmounts;

	}, [placedChips]);

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

		let randomChips = placedChips.map(() => {
			return randRange(0, getLastBaseIndex());
		})

		setPlacedChips(randomChips);
		createShareCode(randomChips);

		playSound(require(`assets/sounds/PlaceColorChip.wav`));
	}, [createShareCode, placedChips, playSound, setPlacedChips]);

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

	const randomizeTones = useCallback(() => {

		const colorChips = getColorTones();

		let randomChips = placedChips.map((chip) => {
			if(chip === NO_CHIP) return chip;

			const possibleChips = colorChips.filter((randomChip) => randomChip.group === getColorChipByIndex(chip).group);

			return possibleChips[randRange(0, possibleChips.length - 1)].index;
		})
		
		setPlacedChips(randomChips);
		createShareCode(randomChips);

		playSound(require(`assets/sounds/PlaceColorChip.wav`));
	}, [createShareCode, placedChips, playSound, setPlacedChips]);

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
				<Aside $collapsed={isSmallScreen && collapsed}>
					{isSmallScreen && (
						<CollapseMenu
						onClick={() => { setCollapsed(!collapsed); }}
						$active={false}>
							<List />
						</CollapseMenu>
					)}
					<ColorChipList 
						onClickChip={onSelectChip} 
						selectedChip={selectedChip} 
						selectedTone={selectedTone}
						settings={settings}
						setDisplayState={setDisplayState}
						remainingChips={remainingChips}
						paletteIndex={paletteIndex}  />
				</Aside>
				<Main>
					<PaletteSpace>
						<TopArea>
							<Header>Side Order Palette Planner (WIP)</Header>
							<ButtonRow>
								<ItemSelectionRow items={["1. Draw Mode", "2. Erase Mode", "3. Sound Mode", "4. Play Mode"]} selected={paletteMode} setSelected={setPaletteMode} />
								<ItemSelectionRow items={["5. Show Labels", "6. Hide Labels"]} selected={labelsSetting} setSelected={setLabelsSetting} />
							</ButtonRow>
							<ButtonRow>
								<ItemSelectionRow items={["7. Sound On", "8. Sound Off"]} selected={soundSetting} setSelected={setSoundSetting} />
								<ItemSelectionRow items={["9. Lock Chips", "0. Any Chips"]} selected={colorChipMode} setSelected={setColorChipMode} />
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
							</ButtonRow>
							<ButtonRow>
								<PaletteIconBackground src={require(`assets/npcs/${palettes[paletteIndex].icon}`)} />
								<GlowSelect id="palette-index" value={paletteIndex} onChange={(event) => { setPaletteIndex(Number(event.target.value)); }}>
									{
									palettes.map((value, index) => {
										return (
											<GlowOption value={index} key={index}>{value.name}</GlowOption>
										)
									})
									}
								</GlowSelect>
								<PaletteIconBackground src={require(`assets/weapons/${palettes[paletteIndex].mainWeapon}`)} />
								<PaletteIcon src={require(`assets/subs/${palettes[paletteIndex].subWeapon}`)} />
								<PaletteIcon src={require(`assets/specials/${palettes[paletteIndex].specialWeapon}`)} />
								<div>Common Tones</div>
								<Tones>
									<PaletteIcon src={require(`assets/tones/Category_${palettes[paletteIndex].firstTone}.png`)} />
									<SecondaryTone src={require(`assets/tones/Category_${palettes[paletteIndex].secondTone}.png`)} />
								</Tones>
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
						</TopArea>
						<BottomArea>
							<ChipPalette 
								paletteIndex={paletteIndex} 
								playIndex={paletteMode === PaletteMode.Palette_Play ? playIndex : NO_CHIP} 
								chips={placedChips} 
								onClickChip={onClickChip} 
								openSlots={numFreeSlots}
								settings={settings}
								remainingChips={remainingChips}
								/>
						</BottomArea>
					</PaletteSpace>
				</Main>
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
	overflow: auto;

	background: linear-gradient(to right, var(--background-gradient-start), var(--background-gradient-end));
`;

const Content = styled.div`
	position: relative;
	font-size: var(--text-size);

	display: flex;
	flex-direction: row;

	color: var(--text);

	overflow: auto;

	@media (max-width: 1920px) {
		--text-size: 1.25rem;
		--title-size: 2.5rem;
		--color-group-size: 1.5rem;
	}

	@media (max-width: 1350px) {
		--text-size: 1rem;
		--title-size: 2rem;
		--color-group-size: 1.25rem;
		--label-size: 0.9rem;
	}

	@media (max-width: 1000px) {
		--title-size: 1.5rem;
		--text-size: 0.9rem;
		--label-size: 0.75rem;
	}

	@media (max-width: 700px) {
		--label-size: 0.6rem;
	}
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
`;

const PaletteIcon = styled.img`
	margin-right: 10px;
	height: 4rem;
	object-fit: contain;

	@media (max-width: 1350px) {
		height: 2.5rem;
	}
`;

const Tones = styled.div`
	display: flex;
	flex-direction: row;
	align-items: top;
	justify-content: flex-start;	
`;

const SecondaryTone = styled(PaletteIcon)`
	height: 3.25rem;

	@media (max-width: 1350px) {
		height: 2rem;
	}
`;

const PaletteIconBackground = styled(PaletteIcon)`
	height: 5rem;
	background: radial-gradient(circle, #fffefe34 0% 40%, transparent 70%);

	@media (max-width: 1350px) {
		height: 3rem;
	}
`;

const Aside = styled.aside<{ $collapsed: boolean }>`
	position: relative;
	min-width: 400px;
	width: 400px;
	max-width: 400px;

	${({ $collapsed }) => $collapsed ? 
	css`
		transform-origin: 0% 0%;
		transform: translate(-100%, 0);
	` 
	: css``};

	transition: transform 0.5s ease-in-out;

	@media (max-width: 1920px) {
		min-width: 350px;
		width: 350px;
		max-width: 350px;
	}

	@media (max-width: 1700px) {
		position: absolute;
		z-index: 1;
		background: linear-gradient(to right, var(--background-gradient-start), var(--background-gradient-end));
	}
`;

const Main = styled.div`
	position: relative;
	width: 100%;
	height: 100vh;
	
	overflow: auto;
	padding: 10px;
	padding-top: 0;
`;

const PaletteSpace = styled.div`
	position: relative;
	width: 1450px;

	@media (max-width: 1920px) {
		width: 1300px;
	}

	@media (max-width: 1350px) {
		width: 950px;
	}

	@media (max-width: 1000px) {
		width: 95vw;
	}
`;

const CollapseMenu = styled(IconGlowButton)`
	position: absolute;
	left: 100%;	
	z-index: 3;
	height: 56px;
`;

const TopArea = styled.div`
	position: relative;
`;

const BottomArea = styled.div`
	position: relative;
`;