import { ColorGroupJson, ColorChipJson, ColorGroup } from "../types/types"

export const createChipDatabase = (colorGroups: ColorGroupJson[], chips: ColorChipJson[]): ColorGroup[] => {
	let chipDatabase: ColorGroup[] = [];

	const sortTones = (a: ColorGroupJson, b: ColorGroupJson) => { return a.index < b.index ? -1 : (a.index > b.index ? 1 : 0); }

	colorGroups = colorGroups.sort(sortTones);

	chipDatabase = colorGroups.map((group) => {
		return { 
			name: group.name, 
			image: group.image,
			tones: group.tones.map((tone, index) => { 
				return {image: tone, index: index, chips: []}; 
			}) 
		};
	})

	chips.forEach((chip) => {
		let group = colorGroups.find((group) => { return chip.group === group.name; });

		if(!group) return;

		chipDatabase[group.index].tones[chip.tone].chips[chip.index] = { name: chip.name, max: chip.max };
	});

	return chipDatabase;
}

/**
 * Random Integer between min and max (inclusive)
 */
export const randRange = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}