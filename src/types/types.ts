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
    image: string;
    chips: ColorChip[];
}

export type ColorGroup = {
    name: string;
    image: string;
    tones: ColorTone[];
}

export type PlacedChip = {
    placed: boolean;
    image: string;
}

export type OnClickChipProps = (group: ColorGroup, tone: ColorTone, chip: ColorChip) => void;

export type OnClickToneProps = (group: ColorGroup, tone: ColorTone) => void;

export type Palette = {
    index: number;
    name: string;
    pixel: string;
    firstTone: string;
    secondTone: string;
    mainWeapon: string;
}