import Hacks from '../data/hacks.json';
import { Hack } from 'types/types';
import { NO_CHIP, TONE_ABILITIES_BELOW_MAX_DETERMINED, getChipCount, getColorChipByIndex, getDroneAbilities, getMaxChips, getSameToneChips } from './utils';

const generateHacksList = (): Hack[] => {
	return Object.entries(Hacks).map(([key, value], index) => {
		return { index: index, key: key, name: value.Name, max: value.Max };
	})
}

const hacks = generateHacksList();

export const getHacks = () => {
	return hacks;
}


export const getHacksUsed = (chips: number[], paletteIndex: number): number[] => {
	const hackCounts: number[] = new Array(hacks.length).fill(0);
	const droneAbilities = getDroneAbilities(chips, paletteIndex);

	//Max Drone Abilities
	hackCounts[0] = Math.max(0, Math.min(4, droneAbilities.length - 1));

	//Assigns hack values, preserving the largest value given
	const setHackValue = (hackKey: string, value: number) => {
		const hackIndex = hacks.findIndex((hack) => hack.key === hackKey);

		if(hackIndex !== -1 && hackCounts[hackIndex] < value) {
			hackCounts[hackIndex] = value;
		}
	}

	chips.forEach((currentChip) => {
		if(currentChip === NO_CHIP) return;
		
		const itemChip = getColorChipByIndex(currentChip);

		if(itemChip.hack !== "") {
			setHackValue(itemChip.hack, 1);
		}

		//Tones are, of course, more complicated!
		if(itemChip.isTone) {
			const sameToneChips = getSameToneChips(itemChip, false);

			//First, verify if any base chips of this tone can contribute hacks
			if(sameToneChips.filter((chip) => chip.hack !== "").length > 0) {
				const toneCount = getChipCount(chips, itemChip);

				//Check if the threshold is exceeded, if so the hacks are used, if not then specify that they could be used
				if(toneCount >= getMaxChips(chips, itemChip, paletteIndex) - TONE_ABILITIES_BELOW_MAX_DETERMINED) {
					
					sameToneChips.forEach((chip) => {
						if(chip.hack === "") return;

						setHackValue(chip.hack, 1);
					})
				}
				else {
					sameToneChips.forEach((chip) => {
						if(chip.hack === "") return;

						setHackValue(chip.hack, 0.5);
					})
				}
			}
		}
	});

	return hackCounts;
}

export const getHackByIndex = (index: number) => {
	return hacks[index];
}