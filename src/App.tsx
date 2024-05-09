import React, { useCallback, useState, useRef } from 'react';
import styled from 'styled-components';
import ColorTones from './data/tones.json'
import ColorChips from './data/colorchips.json'
import PaletteList from './data/palettes.json'
import { ColorChipJson, ColorGroupJson, ColorGroup, PlacedChip, ColorTone, ColorChip, Palette } from './types/types';
import { ColorChipList } from './components/ColorChipList';
import { createChipDatabase, randRange } from './utils/utils';
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
// - Play palette sounds for doing music-themed runs
// - Eraser
// - Drawing Mode: Click / Click and drag to draw on the palette
// - Play/Tracking mode where you progress through the palette as you play and can reset it

const NUM_PALETTE_SLOTS = 36;
const DEFAULT_PALETTE: PlacedChip[] = (new Array(NUM_PALETTE_SLOTS)).fill({ placed: false, color: "", pattern: "" });

const colorGroups: ColorGroupJson[] = ColorTones.ColorGroups;

const chips: ColorChipJson[] = Object.values(ColorChips.Table).map((value) => {
	return {
		name: value.Name,
		group: value.Color,
		tone: value.Tone,
		index: value.Index,
		max: value.MaxNum
	}
});

const chipDatabase: ColorGroup[] = createChipDatabase(colorGroups, chips);

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

enum PaletteMode {
	PM_Playing,
	PM_Drawing
};

//--color-so-text-shadow: 0px 0px 4px rgba(137,39,17,.3)

//disabled slot #262626

function App() {

	const [ placedChips, setPlacedChips ] = useState<PlacedChip[]>(DEFAULT_PALETTE);
	const [ chipIndex, setChipIndex ] = useState(0);
	const [ paletteMode, setPaletteMode ] = useState(PaletteMode.PM_Playing);

	const [ paletteIndex, setPaletteIndex ] = useState(0);

	const paletteRef = useRef(null);

	const resetPalette = useCallback(() => {
		setPlacedChips(DEFAULT_PALETTE);
		setChipIndex(0);
	}, []);

	const randomizePalette = useCallback(() => {
		resetPalette();

		let randomChips = placedChips.map(() => {
			let randomTone: string = colorGroups[randRange(0, colorGroups.length - 1)].tones[randRange(0, 2)];

			return {
				placed: true,
				image: randomTone
			}
		})

		setPlacedChips(randomChips);
	}, [placedChips, resetPalette]);

	const downloadImage = useCallback(() => {
		exportComponentAsPNG(paletteRef, { fileName: "Palette", html2CanvasOptions: { backgroundColor: null }});
	}, []);

	const onClickChipName = useCallback((group: ColorGroup, tone: ColorTone, chip: ColorChip) => {
		
		setPlacedChips((chips) => chips.map((value, index) => index === chipIndex ? {placed: true, image: tone.image} : value))

		setChipIndex((chip) => { 
			return (chip + 1) % NUM_PALETTE_SLOTS;
		});	
	}, [chipIndex]);

	const onClickChip = useCallback((index: number) => {

		setChipIndex(index);

		//setPlacedChips((chips) => chips.map((value, idx) => idx === index ? {placed: false, image: ""} : value));		
	}, []);

	const onClickToneName = useCallback((group: ColorGroup, tone: ColorTone) => {

		setPlacedChips((chips) => chips.map((value, index) => index === chipIndex ? {placed: true, image: tone.image} : value))

		setChipIndex((chip) => { 
			return (chip + 1) % NUM_PALETTE_SLOTS;
		});	
	}, [chipIndex]);
	
  	return (
		<Theme>
			<Background />
			<Dots />
			<Content>
				<ColorChipList chipDatabase={chipDatabase} onClickChip={onClickChipName} onClickTone={onClickToneName} />
				<PaletteSpace>
					<Header>Side Order Palette Planner</Header>
					<ButtonRow>
						<ItemSelectionRow items={["Playing Mode", "Drawing Mode"]} selected={paletteMode} setSelected={setPaletteMode} />
						<GlowButton onClick={() => { resetPalette(); }}>
							Reset
						</GlowButton>
						<GlowButton onClick={() => { randomizePalette(); }}>
							Randomize
						</GlowButton>
						<GlowButton onClick={() => { downloadImage(); }}>
							Download Image
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
					</ButtonRow>
					<PrintComponent ref={paletteRef}>
						<ChipPalette palette={palettes[paletteIndex]} chipIndex={chipIndex} chips={placedChips} onClickChip={onClickChip} />
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