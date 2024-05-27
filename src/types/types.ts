export type ColorGroupJson = {
    name: string;
    image: string;
    index: number;
    tones: string[];
};

export type ColorChipJson = {
    key: string;
    name: string;
    group: number;
    tone: number;
    entry: number;
    index: number;
    max: number;
    isTone: boolean;
};

export type OnClickChipProps = (chip: ColorChipJson) => void;

export type Palette = {
    index: number;
    name: string;
    icon: string;
    pixel: string;
    firstTone: string;
    secondTone: string;
    mainWeapon: string;
    subWeapon: string;
    specialWeapon: string;
}

export enum PaletteMode {
	Palette_Draw,
	Palette_Erase,
	Palette_Sound
};

export enum SoundSetting {
	Sound_On,
	Sound_Off
};

export enum ColorChipMode {
	Chips_Limited,
	Chips_Any
};

export enum DisplayState {
    DS_ColorChips,
    DS_Tones
};