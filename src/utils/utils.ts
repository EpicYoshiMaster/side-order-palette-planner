import { ColorGroup, ColorChip, Palette } from "../types/types"
import ColorChips from '../data/colorchips.json'
import ColorGroups from '../data/colorgroups.json'
import PaletteList from '../data/palettes.json'

export const NO_CHIP = -1;
export const PALETTE_ROW_LENGTH = 9;
export const NUM_PALETTE_SLOTS = 36;
export const EIGHTS_PALETTE = 11;
export const MAX_DRONE_ABILITIES = 5;
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

const generateChipsAndPalettes = () => {
	let baseChips: ColorChip[] = Object.entries(ColorChips).map(([key, value]) => {
		return {
			key: key,
			name: value.Name,
			group: value.Color,
			tone: value.Tone,
			entry: value.Index,
			index: -1,
			max: value.MaxNum,
			drone: value.IsDroneAction,
			isTone: false,
			exclusive: []
		}
	}).sort(sortChips).map((item, index) => { return { ...item, index: index}});

	let toneChips: ColorChip[] = ColorGroups.map((group): ColorChip[] => {
		return group.tones.map((tone, index): ColorChip => {
			return {
				key: `${group.name}Tone${String.fromCharCode(65 + index)}`,
				name: `${group.name} Tone ${String.fromCharCode(65 + index)}`,
				group: group.index,
				tone: index,
				entry: -1,
				index: -1,
				max: -1,
				drone: false,
				isTone: true,
				exclusive: []
			}
		})
	}).reduce((prev, current) => prev.concat(current)).map((chip, index) => {
		return { ...chip, index: baseChips.length + index }
	});

	let palettes: Palette[] = Object.values(PaletteList.Table).map((value) => {
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
			exclusiveTips: value.UnlockTip
		}
	}).sort(sortPalettes);

	palettes.forEach((palette) => {
		palette.exclusiveTips.forEach((tipName) => {
			const chipIndex = baseChips.findIndex((value) => value.key === tipName);

			if(chipIndex !== NO_CHIP) {
				baseChips[chipIndex].exclusive.push(palette.index);
			}
		})
	})

	const colorChips = baseChips.concat(toneChips);

	return {baseChips, toneChips, colorChips, palettes};
}

const { baseChips, toneChips, colorChips, palettes } = generateChipsAndPalettes();

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

export const isChipIndexExclusive = (index: number, paletteIndex: number): boolean => {
	const chip = colorChips[index];

	if(!chip) return false;

	return chip.exclusive.length > 0 && (chip.exclusive.findIndex((exclusivePaletteIndex) => exclusivePaletteIndex === paletteIndex) === NO_CHIP);
}

export const isChipCountExceeded = (chips: number[], remainingChips: number[], chip: ColorChip, chipIndex: number, index: number): boolean => {
	if(!chip) return false;
	if(remainingChips[chipIndex] >= 0) return false;

	const chipsOfTypeNumber = chips.filter((itemChipIndex, itemIndex) => itemIndex <= index && itemChipIndex === chipIndex).length;
	const totalChipsOfType = chips.filter((itemChipIndex) => itemChipIndex === chipIndex).length;

	return (totalChipsOfType - chipsOfTypeNumber) < Math.abs(remainingChips[chipIndex]);
}

export const isDroneAbilitiesExceeded = (chips: number[], chip: ColorChip, chipIndex: number, index: number): boolean => {
	if(!chip) return false;
	if(!chip.drone) return false;
	if(chip.isTone) return false;

	const abilities = chips.filter((itemChipIndex, itemIndex, array) => {
		if(itemChipIndex === NO_CHIP) return false;

		const itemChip = getColorChipByIndex(itemChipIndex)

		return itemIndex <= index && itemChip.drone && array.indexOf(itemChipIndex) === itemIndex;
	});

	return abilities.indexOf(chipIndex) + 1 > MAX_DRONE_ABILITIES;
}

export const isChipLimited = (chipIndex: number, index: number, paletteIndex: number, chips: number[], remainingChips: number[]): boolean => {
	if(chipIndex === NO_CHIP) return false;

	return (isChipIndexExclusive(chipIndex, paletteIndex) 
		|| isChipCountExceeded(chips, remainingChips, getColorChipByIndex(chipIndex), chipIndex, index)
		|| isDroneAbilitiesExceeded(chips, getColorChipByIndex(chipIndex), chipIndex, index));
}

export const getMaxChipsOfTone = (chipIndex: number, paletteIndex: number): number => {
	const chip = colorChips[chipIndex];

	if(!chip) return -1;

	const chipsOfTone = colorChips.filter((testChip) => testChip.group === chip.group && testChip.tone === chip.tone && !testChip.isTone);

	return chipsOfTone.reduce((accum, currentValue) => { 
		if(currentValue.exclusive.length <= 0) return accum + currentValue.max;

		const isExclusive = currentValue.exclusive.findIndex((exclusivePaletteIndex) => exclusivePaletteIndex === paletteIndex) === -1;

		return isExclusive ? accum : accum + currentValue.max;
	 }, 0);
}

const characterSet = "-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&<>+=,.?;:'/";

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