import { ColorGroup, ColorChip, Palette } from "../types/types"
import ColorChips from '../data/colorchips.json'
import ColorGroups from '../data/colorgroups.json'
import PaletteList from '../data/palettes.json'

export const NO_CHIP = -1;
export const NUM_PALETTE_SLOTS = 36;
export const EIGHTS_PALETTE = 11;
export const DEFAULT_PALETTE: number[] = (new Array(NUM_PALETTE_SLOTS)).fill(NO_CHIP);

const sortPalettes = (a: Palette, b: Palette) => { return a.index < b.index ? -1 : (a.index > b.index ? 1 : 0); };

export const getColorGroups = (): ColorGroup[] => {
	return ColorGroups;
}

export const getColorGroup = (group: number): ColorGroup => {
	return ColorGroups[group];
}

const sortChips = (a: ColorChip, b: ColorChip) => { 
	if(a.group < b.group) {
		return -1;
	}
	else if(a.group > b.group) {
		return 1;
	}

	if(a.tone < b.tone) {
		return -1;
	}
	else if(a.tone > b.tone) {
		return 1;
	}

	if(a.entry < b.entry) {
		return -1;
	}
	else if(a.entry > b.entry) {
		return 1;
	}
	
	return 0;
}

const baseChips: ColorChip[] = Object.entries(ColorChips).map(([key, value]) => {
	return {
		key: key,
		name: value.Name,
		group: value.Color,
		tone: value.Tone,
		entry: value.Index,
		index: -1,
		max: value.MaxNum,
		isTone: false
	}
}).sort(sortChips).map((item, index) => { return { ...item, index: index}});

const toneChips: ColorChip[] = ColorGroups.map((group): ColorChip[] => {
	return group.tones.map((tone, index): ColorChip => {
		return {
			key: `${group.name}Tone${String.fromCharCode(65 + index)}`,
			name: `${group.name} Tone ${String.fromCharCode(65 + index)}`,
			group: group.index,
			tone: index,
			entry: -1,
			index: -1,
			max: -1,
			isTone: true
		}
	})
}).reduce((prev, current) => prev.concat(current)).map((chip, index) => {
	return { ...chip, index: baseChips.length + index }
});

const colorChips = baseChips.concat(toneChips);

export const getPalettes = () => {
	return palettes;
}

export const getLastBaseIndex = () => {
	return baseChips.length - 1;
}

export const getColorChips = () => {
	return colorChips;
}

export const getBaseChips = () => {
	return baseChips;
}

export const getColorTones = () => {
	return toneChips;
}

export const getColorChipByIndex = (index: number) => {
	return colorChips[index];
}

export const getColorChipByTip = (tipName: string) => {
	return colorChips.find((value) => value.key === tipName);
}

export const getToneImage = (group: number, tone: number) => {
	return ColorGroups[group].tones[tone];
}

export const getColorChipImage = (index: number) => {
	return getToneImage(colorChips[index].group, colorChips[index].tone);
}

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
		specialWeapon: value.SpecialWeapon,
		exclusiveChips: value.UnlockTip.flatMap((tipName) => {
			const chip = getColorChipByTip(tipName);

			return chip ? [chip.index] : [];
		})
	}
}).sort(sortPalettes);

const exclusiveChips = Array.from(new Set(palettes.reduce((prevValue: number[], palette: Palette) => {
	return prevValue.concat(palette.exclusiveChips);
}, []))).sort((a, b) => a > b ? 1 : (a < b ? -1 : 0));

export const getExclusiveChipIndexes = () => {
	return exclusiveChips;
}

//-
const characterSet = "-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+=,.?;:'/";

export const generateShareCode = (chips: number[]) => {
	let shareCode = ``;

	shareCode = chips.reduce<string>((prevShareCode, currChip) => { 
		currChip += 1;

		let string = characterSet[currChip];

		return prevShareCode + string;
	}, shareCode);

	return shareCode;
}

export const convertShareCode = (shareCode: string) => {
	let chips: number[] = DEFAULT_PALETTE.slice();

	shareCode.split('').forEach((character, index) => {
		const charSetIndex = characterSet.indexOf(character);

		chips[index] = (charSetIndex === -1) ? NO_CHIP : charSetIndex - 1;
	});

	return chips;
}

/**
 * Random Integer between min and max (inclusive)
 */
export const randRange = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}