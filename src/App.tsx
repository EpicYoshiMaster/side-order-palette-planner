import React, { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { ColorChip, PaletteMode, SoundSetting, ColorChipMode, DisplayState, LabelsSetting, Settings } from './types/types';
import { ColorChipList } from './components/ColorChipList';
import { randRange, getLastBaseIndex, NO_CHIP, DEFAULT_PALETTE, EIGHTS_PALETTE, NUM_PALETTE_SLOTS, getColorChipByIndex, getColorGroup, getColorTones, generateShareCode, convertShareCode, getPalettes, getColorChips } from './utils/utils';
import { ChipPalette } from './components/palette/ChipPalette';
import { Theme } from 'components/Theme';
import { GlowButton, textGlow, Dots, GlowSelect, GlowOption } from 'components/Layout';
import { exportComponentAsPNG } from 'react-component-export-image';
import { PrintComponent } from 'components/PrintComponent';
import { ItemSelectionRow } from 'components/ItemSelectionRow';
import { ItemTextInputRow } from 'components/ItemTextInputRow';
import { useKeyDown } from 'utils/hooks';

//
// Palette Planner:
//
// - Import palettes from others to share them
// - Tone Count Limits
// - Display exclusive chip icons
// - Responsive CSS

const DEFAULT_SHARE_CODE = generateShareCode(DEFAULT_PALETTE);
const palettes = getPalettes();
const colorChips = getColorChips();

function App() {

	const [ placedChips, setPlacedChips ] = useState<number[]>(DEFAULT_PALETTE);
	const [ paletteMode, setPaletteMode ] = useState(PaletteMode.Palette_Draw);
	const [ soundSetting, setSoundSetting ] = useState(SoundSetting.Sound_On);
	const [ labelsSetting, setLabelsSetting ] = useState(LabelsSetting.Labels_Off);
	const [ colorChipMode, setColorChipMode ] = useState(ColorChipMode.Chips_Limited);
	const [ displayState, setDisplayState ] = useState(DisplayState.DS_ColorChips);
	const [ paletteIndex, setPaletteIndex ] = useState(0);
	const [ numOpenSlots, setNumOpenSlots ] = useState(NUM_PALETTE_SLOTS);
	const [ selectedChip, setSelectedChip ] = useState(0);
	const [ selectedTone, setSelectedTone ] = useState(getLastBaseIndex() + 1);
	const [ playIndex, setPlayIndex ] = useState(0);
	const [ shareCode, setShareCode ] = useState(DEFAULT_SHARE_CODE);

	const settings: Settings = useMemo(() => {
		return {
			mode: paletteMode, 
			sound: soundSetting,
			labels: labelsSetting,
			chips: colorChipMode,
			display: displayState
		}
	}, [paletteMode, soundSetting, labelsSetting, colorChipMode, displayState]);

	const paletteRef = useRef(null);

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

	}, [setShareCode]);

	const createShareCode = useCallback((chips: number[]) => {
		const newShareCode = generateShareCode(chips);

		setShareCode(newShareCode);
	}, [setShareCode]);

	const playSound = useCallback((sound: string | undefined) => {
		if(soundSetting !== SoundSetting.Sound_On || !sound) return;

		const audio = new Audio(sound);

		audio.play();
	}, [soundSetting]);

	const resetPalette = useCallback(() => {
		setPlacedChips(DEFAULT_PALETTE);

		playSound(require(`assets/sounds/ChipBeamVanish.wav`));

		createShareCode(DEFAULT_PALETTE);
	}, [createShareCode, playSound]);

	const randomizePalette = useCallback(() => {
		setPlacedChips(DEFAULT_PALETTE);

		let randomChips = placedChips.map(() => {
			return randRange(0, getLastBaseIndex());
		})

		setPlacedChips(randomChips);
		createShareCode(randomChips);

		playSound(require(`assets/sounds/PlaceColorChip.wav`));
	}, [createShareCode, placedChips, playSound]);

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
	}, [createShareCode, placedChips, playSound]);

	const downloadImage = useCallback(() => {
		exportComponentAsPNG(paletteRef, { fileName: "Palette", html2CanvasOptions: { backgroundColor: null }});
	}, []);

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
	}, [placedChips, createShareCode, selectedChip, selectedTone, displayState, paletteMode, playSound]);
	
  	return (
		<Theme>
			<Background />
			<Dots />
			<Content>
				<ColorChipList 
				onClickChip={onSelectChip} 
				selectedChip={selectedChip} 
				selectedTone={selectedTone}
				settings={settings}
				setDisplayState={setDisplayState}
				remainingChips={remainingChips}
				paletteIndex={paletteIndex}  />
				<PaletteSpace>
					<TopArea>
						<Header>Side Order Palette Planner (WIP)</Header>
						<ButtonRow>
							<ItemSelectionRow items={["1. Draw Mode", "2. Erase Mode", "3. Sound Mode", "4. Play Mode"]} selected={paletteMode} setSelected={setPaletteMode} />
							<ItemSelectionRow items={["5. Show Labels", "6. Hide Labels"]} selected={labelsSetting} setSelected={setLabelsSetting} />
							<ItemSelectionRow items={["7. Sound On", "8. Sound Off"]} selected={soundSetting} setSelected={setSoundSetting} />
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
							{/*<GlowButton onClick={() => { downloadImage(); }}>
								Download Image
							</GlowButton>*/}
							<ItemTextInputRow label="Share Code" value={shareCode} setValue={applyShareCode} />
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
							<ItemSelectionRow items={["9. Limit Color Chips", "0. Any Color Chips"]} selected={colorChipMode} setSelected={setColorChipMode} />
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
			</Content>
		</Theme>
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

	background: ${({ theme }) => `linear-gradient(to right, ${theme.background_from}, ${theme.background_to})`};
`;

const Content = styled.div`
	position: relative;
	width: 100vw;
	height: 100vh;
	font-size: 1.75rem;

	display: grid;
	grid-template-columns: max-content 1fr;

	color: ${props => props.theme.text};

	overflow: auto;
`;

const Header = styled.h1`
	position: relative;
	margin: 0;
	text-align: left;
	${textGlow};
`;

const ButtonRow = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	margin: 10px 0;

	flex-wrap: wrap;

	& > div, & > button {
		margin: 0 5px;
	}
`;

const PaletteIcon = styled.img`
	margin-right: 10px;
	height: 4rem;
	object-fit: contain;
`;

const Tones = styled.div`
	display: flex;
	flex-direction: row;
	align-items: top;
	justify-content: flex-start;	
`;

const SecondaryTone = styled(PaletteIcon)`
	height: 3.25rem;
`;

const PaletteIconBackground = styled(PaletteIcon)`
	height: 5rem;
	background: radial-gradient(circle, #fffefe34 0% 40%, transparent 70%);
`;

const PaletteSpace = styled.div`
	position: relative;
	padding: 10px;
	height: 100vh;

	display: grid;
	grid-template-rows: max-content 1fr;
`;

const TopArea = styled.div`
	position: relative;
`

const BottomArea = styled.div`
	position: relative;
`;