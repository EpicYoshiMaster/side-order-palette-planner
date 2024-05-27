import React, { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import PaletteList from './data/palettes.json'
import { ColorChipJson, Palette, PaletteMode, SoundSetting, ColorChipMode, DisplayState } from './types/types';
import { ColorChipList } from './components/ColorChipList';
import { randRange, getLastBaseIndex, NO_CHIP, getColorChipbyIndex, getColorGroup } from './utils/utils';
import { ChipPalette } from './components/palette/ChipPalette';
import { Theme } from 'components/Theme';
import { GlowButton, textGlow, Dots, GlowSelect, GlowOption } from 'components/Layout';
import { exportComponentAsPNG } from 'react-component-export-image';
import { PrintComponent } from 'components/PrintComponent';
import { ItemSelectionRow } from 'components/ItemSelectionRow';

//
// Palette Planner:
//
// - Import palettes from others to share them
// - Eraser
// - Drawing Mode: Click / Click and drag to draw on the palette
// - Play/Tracking mode where you progress through the palette as you play and can reset it
// - Option to restrict the palette to only what's possible (ex. exclusive palette chips, chip # limits, etc.)

const NUM_PALETTE_SLOTS = 36;
const EIGHTS_PALETTE = 11;
const DEFAULT_PALETTE: number[] = (new Array(NUM_PALETTE_SLOTS)).fill(NO_CHIP);

const sortPalettes = (a: Palette, b: Palette) => { return a.index < b.index ? -1 : (a.index > b.index ? 1 : 0); };

const palettes: Palette[] = Object.values(PaletteList.Table).map((value) => {
	return {
		index: value.OrderForChangeUI,
		name: value.PaletteName,
		icon: value.NPCIconPath,
		pixel: value.PixelName,
		firstTone: value.FreqFirstColorGroupType,
		secondTone: value.FreqSecondColorGroupType,
		mainWeapon: value.MainWeapon,
		subWeapon: value.SubWeapon,
		specialWeapon: value.SpecialWeapon
	}
}).sort(sortPalettes);

//--color-so-text-shadow: 0px 0px 4px rgba(137,39,17,.3)

function App() {

	const [ placedChips, setPlacedChips ] = useState<number[]>(DEFAULT_PALETTE);
	const [ chipIndex, setChipIndex ] = useState(0);
	const [ paletteMode, setPaletteMode ] = useState(PaletteMode.Palette_Draw);
	const [ soundSetting, setSoundSetting ] = useState(SoundSetting.Sound_On);
	const [ colorChipMode, setColorChipMode ] = useState(ColorChipMode.Chips_Limited);
	const [ displayState, setDisplayState ] = useState(DisplayState.DS_ColorChips);
	const [ paletteIndex, setPaletteIndex ] = useState(0);
	const [ numOpenSlots, setNumOpenSlots ] = useState(NUM_PALETTE_SLOTS);
	const [ selectedChip, setSelectedChip ] = useState(0);
	const [ selectedTone, setSelectedTone ] = useState(getLastBaseIndex() + 1);

	//Selected Chip
	//Selected Tone

	const paletteRef = useRef(null);

	const numFreeSlots = useMemo(() => {
		return paletteIndex === EIGHTS_PALETTE ? numOpenSlots : NUM_PALETTE_SLOTS;
	}, [paletteIndex, numOpenSlots])

	useEffect(() => {
		if(chipIndex + 1 > numFreeSlots) {
			setChipIndex(0);
		}
	}, [chipIndex, numFreeSlots])

	const playSound = useCallback((sound: string | undefined) => {
		if(soundSetting !== SoundSetting.Sound_On || !sound) return;

		const audio = new Audio(sound);

		audio.play();
	}, [soundSetting]);

	const resetPalette = useCallback(() => {
		setPlacedChips(DEFAULT_PALETTE);
		setChipIndex(0);

		playSound(require(`assets/sounds/ChipBeamVanish.wav`));
	}, [playSound]);

	const randomizePalette = useCallback(() => {
		setPlacedChips(DEFAULT_PALETTE);
		setChipIndex(0);

		let randomChips = placedChips.map(() => {
			return randRange(0, getLastBaseIndex());
		})

		setPlacedChips(randomChips);

		playSound(require(`assets/sounds/PlaceColorChip.wav`));
	}, [placedChips, playSound]);

	const downloadImage = useCallback(() => {
		exportComponentAsPNG(paletteRef, { fileName: "Palette", html2CanvasOptions: { backgroundColor: null }});
	}, []);

	const onSelectChip = useCallback((chip: ColorChipJson) => {

		if(chip.isTone) {
			setSelectedTone(chip.index);
		}
		else {
			setSelectedChip(chip.index);
		}
	}, []);

	const onClickChip = useCallback((chip: number, index: number) => {
		switch(paletteMode) {
			case PaletteMode.Palette_Draw:
				setPlacedChips((chips) => chips.map((value, idx) => {
					if(idx !== index) return value;

					if(displayState === DisplayState.DS_ColorChips) {
						return selectedChip;
					}
					else {
						return selectedTone;
					}
				}));

				playSound(require(`assets/sounds/PlaceColorChip.wav`));
				break;
			case PaletteMode.Palette_Erase:
				if(chip !== NO_CHIP) {
					playSound(require(`assets/sounds/ChipBeamVanish.wav`));

					setPlacedChips((chips) => chips.map((value, idx) => idx === index ? NO_CHIP : value));		
				}
				
				break;
			case PaletteMode.Palette_Sound:
				if(chip !== NO_CHIP) {
					const colorChip = getColorChipbyIndex(chip);

					playSound(require(`assets/sounds/tones/UI_Sdodr_MyPalette_00_PushTip_${getColorGroup(colorChip.group).name}_${colorChip.tone}.wav`));
				}
				break;
		}
	}, [selectedChip, selectedTone, displayState, paletteMode, playSound]);
	
  	return (
		<Theme>
			<Background />
			<Dots />
			<Content>
				<ColorChipList onClickChip={onSelectChip} selectedChip={selectedChip} selectedTone={selectedTone} displayState={displayState} setDisplayState={setDisplayState} />
				<PaletteSpace>
					<Header>Side Order Palette Planner</Header>
					<ButtonRow>
						<ItemSelectionRow items={["Draw Mode", "Erase Mode", "Sound Mode"]} selected={paletteMode} setSelected={setPaletteMode} />
						<GlowButton onClick={() => { resetPalette(); }}>
							Reset
						</GlowButton>
						<GlowButton onClick={() => { randomizePalette(); }}>
							Randomize
						</GlowButton>
						<GlowButton onClick={() => { downloadImage(); }}>
							Download Image
						</GlowButton>
						<ItemSelectionRow items={["Sound On", "Sound Off"]} selected={soundSetting} setSelected={setSoundSetting} />
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
						<ItemSelectionRow items={["Limit Color Chips", "Any Color Chips"]} selected={colorChipMode} setSelected={setColorChipMode} />
					</ButtonRow>
					<PrintComponent ref={paletteRef}>
						<ChipPalette 
						palette={palettes[paletteIndex]} 
						chipIndex={chipIndex} 
						chips={placedChips} 
						onClickChip={onClickChip} 
						openSlots={numFreeSlots} />
					</PrintComponent>
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

	overflow: hidden;
`;

const Header = styled.h1`
	position: relative;
	width: 100%;
	margin: 0;
	text-align: left;
	${textGlow};
`;

const ButtonRow = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	width: 100%;
	align-items: center;
	justify-content: flex-start;
	margin: 10px 0;

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
	padding: 0px 25px;
	height: 100vh;

	display: grid;
	grid-template-rows: max-content max-content max-content 1fr;
`;