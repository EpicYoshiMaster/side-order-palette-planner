import { ColorGroup, ColorChip } from "../types/types"
import ColorChips from '../data/colorchips.json'
import ColorGroups from '../data/colorgroups.json'

export const NO_CHIP = -1;

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

export const getColorChipbyIndex = (index: number) => {
	return colorChips[index];
}

export const getToneImage = (group: number, tone: number) => {
	return ColorGroups[group].tones[tone];
}

export const getColorChipImage = (index: number) => {
	return getToneImage(colorChips[index].group, colorChips[index].tone);
}

/**
 * Random Integer between min and max (inclusive)
 */
export const randRange = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}