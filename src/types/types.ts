export type ColorGroup = {
    name: string;
    image: string;
    index: number;
    tones: string[];
};

export type ColorChip = {
    key: string;
    name: string;
    group: number;
    tone: number;
    entry: number;
    index: number;
    max: number;
    drone: boolean;
    isTone: boolean;
    exclusive: number[];
};

export type OnClickChipProps = (chip: ColorChip) => void;

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
    exclusiveTips: string[];
}

export type DroneAbilitiesEntry = {
    chip: ColorChip;
    count: number;
}

export type ColorGroupEntry = {
    group: number;
    count: number;
}

export enum PaletteMode {
	Palette_Draw,
	Palette_Erase,
	Palette_Sound,
    Palette_Play
};

export enum SoundSetting {
	Sound_On,
	Sound_Off
};

export enum LabelsSetting {
    Labels_On,
    Labels_Off
};

export enum ColorChipMode {
	Chips_Limited,
	Chips_Any
};

export enum DisplayState {
    DS_ColorChips,
    DS_Tones
};

export type Settings = {
    mode: PaletteMode;
    sound: SoundSetting;
    labels: LabelsSetting;
    chips: ColorChipMode;
    display: DisplayState;
}