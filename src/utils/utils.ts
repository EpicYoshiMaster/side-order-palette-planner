import { ColorGroup, ColorChip, Palette, DroneAbilitiesEntry, ColorGroupEntry } from "../types/types"
import ColorChips from '../data/colorchips.json'
import ColorGroups from '../data/colorgroups.json'
import PaletteList from '../data/palettes.json'

export const NO_CHIP = -1;
export const PALETTE_ROW_LENGTH = 9;
export const NUM_PALETTE_SLOTS = 36;
export const EIGHTS_PALETTE = 11;
export const MAX_DRONE_ABILITIES = 5;
export const TONE_ABILITIES_BELOW_MAX_DETERMINED = 4; //This number of abilities below max has definitive drone abilities
export const ABILITY_INTERVAL = 5;
export const DEFAULT_PALETTE: number[] = (new Array(NUM_PALETTE_SLOTS)).fill(NO_CHIP);

export const NONE_CHIP: ColorChip = {
	key: "None",
	name: "None",
	group: -1,
	tone: -1,
	entry: -1,
	index: -1,
	max: -1,
	drone: false,
	isTone: false,
	exclusive: [],
	pitch: "",
	hack: ""
}

/**
 * Random Integer between min and max (inclusive)
 */
export const randRange = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
			exclusive: [],
			pitch: ColorGroups[value.Color].pitches[value.Tone],
			hack: value.Hack
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
				drone: group.drone && index <= 1,
				isTone: true,
				exclusive: [],
				pitch: group.pitches[index],
				hack: ""
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

export const getPaletteByIndex = (index: number) => {
	return palettes[index];
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

export const getDroneChips = (includeTones: boolean) => {
	return colorChips.filter((chip) => chip.drone && (includeTones || !chip.isTone));
}

export const getSameToneChips = (colorChip: ColorChip, includeTones: boolean) => {
	return colorChips.filter((chip) => (includeTones || !chip.isTone) && chip.group === colorChip.group && chip.tone === colorChip.tone);
}

export const getSamePitchChips = (colorChip: ColorChip, includeTones: boolean, includeChips: boolean) => {
	return colorChips.filter((chip) => (includeTones || !chip.isTone) && (includeChips || chip.isTone) && chip.pitch === colorChip.pitch);	
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

export const isChipExclusive = (chip: ColorChip, paletteIndex: number): boolean => {
	if(!chip) return false;

	return chip.exclusive.length > 0 && (chip.exclusive.findIndex((exclusivePaletteIndex) => exclusivePaletteIndex === paletteIndex) === NO_CHIP);
}

export const getChipCount = (chips: number[], chip: ColorChip, maximumIndex: number = chips.length - 1): number => {
	if(!chip) return 0;

	const chipsOfTypeInRange = chips.filter((itemChipIndex, itemIndex) => itemIndex <= maximumIndex && itemChipIndex === chip.index).length;

	return chipsOfTypeInRange;
}

/**
 * Considerations:
 * Tones should be Wildcards, so they take whatever slot would minimize their count as abilities.
 * Abilities are returned by their Color Chip Names, ex. "Drone Splat Bomb"
 * If an ability is unclear as a wildcard, it will be returned with its tone name as "Drone Tone A" or "Drone Tone B"
 * seems to still be some bugs with tone positioning
 */
export const getDroneAbilities = (chips: number[], paletteIndex: number, maximumIndex: number = chips.length - 1): string[] => {
	let abilityEntries: DroneAbilitiesEntry[] = [];

	chips.forEach((currentChip, currentIndex) => {
		if(currentChip === NO_CHIP) return;
		if(currentIndex > maximumIndex) return;
		
		const itemChip = getColorChipByIndex(currentChip);

		if(!itemChip.drone) return;

		const abilityIndex = abilityEntries.findIndex((value) => currentChip === value.chip.index);

		if(abilityIndex !== -1) {
			abilityEntries[abilityIndex].count += 1;
		}
		else {
			abilityEntries.push({ chip: itemChip, count: 1 });
		}
	});

	//Sort to force tones to be last in the list
	abilityEntries.sort((a, b) => a.chip.isTone ? (b.chip.isTone ? 0 : 1) : (b.chip.isTone ? -1 : 0));

	const abilities = abilityEntries.reduce<string[]>((abilitiesList, entry, index, array) => { 
		if(entry.count <= 0) return abilitiesList;

		//If we are not a tone, and we are placed, then we just count as an ability outright
		if(!entry.chip.isTone && entry.count > 0) return abilitiesList.concat([entry.chip.name]);

		//This Tone has enough chips that we can say with certainty every ability of its tone should be present, just add them and move on
		//Also an out for if there are too many tone chips with regular chips, prevents new non-existant abilities being added
		if(entry.count >= getMaxChips(chips, entry.chip, paletteIndex) - TONE_ABILITIES_BELOW_MAX_DETERMINED) {
			getDroneChips(false).forEach((chip) => {
				if(chip.tone === entry.chip.tone && !abilitiesList.includes(chip.name)) {
					abilitiesList.push(chip.name);
				}
			})

			return abilitiesList;
		}

		//If we are a tone, we need to check for the presence of chips we can apply to as wildcards
		//Prioritize those with existing counts as they add no slots
		const wildcardOptions = array.filter((arrayEntry) => !arrayEntry.chip.isTone && arrayEntry.chip.tone === entry.chip.tone).sort((a, b) => b.count - a.count);

		let remainingCount = entry.count;

		wildcardOptions.forEach((option) => {
			if(remainingCount <= 0) return;
			
			if(option.count > 0) {
				if(option.count < option.chip.max) {
					remainingCount -= option.chip.max - option.count;
				}
			}
			else {
				//We're in essence adding this ability
				remainingCount -= option.chip.max;
				abilitiesList.push(option.chip.name);
			}
		})

		if(remainingCount <= 0) return abilitiesList;

		//Any remaining now must apply to abilities which we simply don't know, for every ABILITY_INTERVAL, add the tone itself.
		return abilitiesList.concat(Array(Math.ceil(remainingCount / ABILITY_INTERVAL)).fill(entry.chip.name));
	}, []);

	return abilities;
}

export const getMaxChips = (placedChips: number[], chip: ColorChip, paletteIndex: number): number => {
	if(!chip.isTone) return chip.max;

	const chipsOfTone = colorChips.filter((testChip) => testChip.group === chip.group && testChip.tone === chip.tone && !testChip.isTone);

	return chipsOfTone.reduce((accum, currentChip) => {
		const isExclusive = isChipExclusive(currentChip, paletteIndex);

		return isExclusive ? accum : accum + (currentChip.max - getChipCount(placedChips, currentChip));
	 }, 0);
}

/**
 * Returns a list of all color chips which have at least 1 chip remaining that is legal to place next on the palette.
 */
export const getRemainingValidChips = (currentColorChips: ColorChip[], placedChips: number[], paletteIndex: number, maximumIndex: number = placedChips.length - 1): ColorChip[] => {

	const slicedPlacedChips = placedChips.slice(0, maximumIndex + 1);

	return currentColorChips.filter(chip => {
		const testPlacedChips = slicedPlacedChips.concat([chip.index]);

		return !isChipLimited(testPlacedChips, chip, paletteIndex, testPlacedChips.length - 1);
	})
}

export const getRemainingChips = (placedChips: number[], chip: ColorChip, paletteIndex: number, maximumIndex = placedChips.length - 1): number => {
	return getMaxChips(placedChips, chip, paletteIndex) - getChipCount(placedChips, chip, maximumIndex);
}

export const getHacksUsed = (placedChips: number[], maximumIndex = placedChips.length - 1): string[] => {
	return [];
}

/**
 * A Color Chip is considered Limited if it contributes invalidity to the palette.
 * 
 * Invalidity is some condition broken which makes the palette impossible to make:
 * - The chip is exclusive to specific palettes, and this palette is not one of those.
 * - The chip's total number which can be placed has been exceeded.
 * - The chip is a Drone Chip for an ability that exceeds the established maximum cap of Drone Abilities.
 */
export const isChipLimited = (placedChips: number[], chip: ColorChip, paletteIndex: number, maximumIndex = placedChips.length - 1): boolean => {
	if(!chip) return false;
	if(isChipExclusive(chip, paletteIndex)) return true;
	if(getRemainingChips(placedChips, chip, paletteIndex, maximumIndex) < 0) return true;

	const droneAbilities = getDroneAbilities(placedChips, paletteIndex, maximumIndex);

	let abilityIndex = -1;

	if(chip.isTone) {
		//For tone chips, we are attributed to whatever the last ability we could be associated with is.
		const aliasChips = getSameToneChips(chip, true);

		abilityIndex = aliasChips.reduce((currentIndex, currentChip) => {
			const index = droneAbilities.lastIndexOf(currentChip.name);

			return index > currentIndex ? index : currentIndex;
		}, abilityIndex)
	}
	else {
		abilityIndex = droneAbilities.lastIndexOf(chip.name);
	}

	if(chip.drone && abilityIndex !== -1 && abilityIndex + 1 > MAX_DRONE_ABILITIES) return true;

	return false;
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
 * Determines from the placed color chips which group is biased in the form "[group]-bias"
 * 
 * A biased color group has the maximum number of color chips in its group (ex. Power) in the palette.
 * It must also have at least 2 chips of that color
 * 
 * Otherwise, a "none-bias" is returned.
 */
export const getBiasedColorGroup = (placedChips: number[], maximumIndex: number = placedChips.length - 1): string => {
	let groupCounts: ColorGroupEntry[] = [{ group: -1, count: 1 }];

	placedChips.forEach((currentChip, index) => {
		if(currentChip === NO_CHIP) return;
		if(index > maximumIndex) return;

		const itemChip = getColorChipByIndex(currentChip);

		if(!itemChip) return;

		const entryIndex = groupCounts.findIndex((entry) => entry.group === itemChip.group);

		if(entryIndex !== -1) {
			groupCounts[entryIndex].count += 1;
		}
		else {
			groupCounts.push({ group: itemChip.group, count: 1 });
		}
	})

	const maxGroup = groupCounts.reduce((prevValue, currentValue) => {
		return prevValue.count >= currentValue.count ? prevValue : currentValue;
	})

	if(maxGroup.group === -1) {
		return "none-bias";
	}
	else {
		return `${getColorGroups()[maxGroup.group].name}-bias`.toLowerCase()
	}
}

/**
 * Selects a random chip from a provided set of color chips, weighted by the number of chips remaining for each.
 * Useful for logic-based randomization to help distribute color chips with lesser quantities better.
 * 
 * It is expected that possibleChips.length > 0.
 */
export const getWeightedRandomChip = (possibleChips: ColorChip[], placedChips: number[], paletteIndex: number, maximumIndex: number = placedChips.length - 1): ColorChip => {

	const weights = possibleChips.map((chip) => {
		return getRemainingChips(placedChips, chip, paletteIndex, maximumIndex);
	})

	const weightsSum = weights.reduce((prev, current) => prev + current);

	let random = Math.floor(Math.random() * weightsSum);
	let selectedIndex = 0;

	weights.forEach((item, index) => {
		if(random <= 0) return;

		random -= item;

		if(random <= 0) {
			selectedIndex = index;
		}
	})

	return possibleChips[selectedIndex];
}

export const formatWeaponName = (name: string) => {
	name = name.replaceAll(".png", "");
	name = name.replace(/([A-Z])/g, ' $1').trim()

	return name;
}