export type ColorGroupJson = {
    name: string;
    image: string;
    index: number;
    tones: string[];
};

export type ColorChipJson = {
    name: string;
    group: string;
    tone: number;
    index: number;
    max: number;
};

export type ColorChip = {
    name: string;
    max: number;
};

export type ColorTone = {
    index: number;
    image: string;
    chips: ColorChip[];
}

export type ColorGroup = {
    name: string;
    image: string;
    tones: ColorTone[];
}

//This is a placed Power Chip of Tone 1 called Splash Damage which has a maximum of 9 chips

export type PlacedChip = {
    placed: boolean;
    group: string;    
    tone: number;
    image: string;
}

export type OnClickChipProps = (group: ColorGroup, tone: ColorTone, chip: ColorChip) => void;

export type OnClickToneProps = (group: ColorGroup, tone: ColorTone) => void;

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