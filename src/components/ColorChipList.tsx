import React, { Dispatch, SetStateAction } from "react";
import styled, { css } from "styled-components";
import { ActiveGlowButton, textGlow } from "./Layout";
import { OnClickChipProps, DisplayState, ColorChip, Settings, ColorChipMode, LabelsSetting } from "../types/types";
import { getColorGroups, getColorChips, getColorChipByIndex, isChipExclusive, getRemainingChips, isChipLimited } from "utils/utils";
import { ItemSelectionRow } from "./ItemSelectionRow";
import { ChipSlot } from "./palette/ChipSlot";

interface ColorChipListProps {
    onClickChip: OnClickChipProps;
    selectedChip: number;
    selectedTone: number;
    settings: Settings;
    setDisplayState: Dispatch<SetStateAction<number>>;
    placedChips: number[];
    paletteIndex: number;
}

const colorGroups = getColorGroups();
const colorChips = getColorChips();

export const ColorChipList: React.FC<ColorChipListProps> = ({ onClickChip, selectedChip, selectedTone, settings, setDisplayState, placedChips, paletteIndex }) => {

    return (
        <StyledColorChipList>
            <SelectionWrapper>
                <ItemSelectionRow items={["Color Chips", "Tones"]} selected={settings.display} setSelected={setDisplayState} />
            </SelectionWrapper>
            <GroupList $useGrid={settings.display === DisplayState.DS_Tones}>
            {
                colorGroups.map((group, index) => (
                    <GroupEntry key={index}>
                        <GroupTitle>
                            <GroupImage src={require(`assets/tones/${group.image}`)} alt={`${group.name} Logo`} />
                            <GroupName>{group.name}</GroupName>
                        </GroupTitle>

                        {settings.display === DisplayState.DS_ColorChips && 
                        colorChips.filter((chip) => chip.group === group.index && !chip.isTone).map((chip, chipIndex) => {
                            let prevChip: ColorChip | undefined = undefined;

                            if(chip.index > 0) {
                                prevChip = getColorChipByIndex(chip.index - 1);
                            }

                            const remainingChips = getRemainingChips(placedChips, chip, paletteIndex);

                            const disabled = settings.chips === ColorChipMode.Chips_Limited && 
                            (remainingChips <= 0
                            || isChipExclusive(chip, paletteIndex));

                            return (
                            <ChipWrapper key={chipIndex}>
                                {prevChip && chip.group === prevChip.group && chip.tone !== prevChip.tone && (
                                    <Divider />
                                )}
                                <ChipEntry>
                                    <ChipItem 
                                    disabled={disabled}
                                    $active={selectedChip === chip.index} 
                                    onClick={() => { onClickChip(chip); }}>
                                        <div>
                                            {chip.name}
                                        </div>
                                        <div>
                                            ({remainingChips})
                                        </div>
                                    </ChipItem>
                                </ChipEntry>
                            </ChipWrapper>
                            )
                            })}

                        {settings.display === DisplayState.DS_Tones && (
                        
                            <ToneRow>
                            {
                            colorChips.filter((chip) => chip.group === group.index && chip.isTone).map((chip, chipIndex) => {
                                const testPlacedChips = placedChips.concat([chip.index]);
                                const isLimited = isChipLimited(testPlacedChips, chip, paletteIndex);

                                return (
                                <ChipSlot
                                    chip={chip.index}
                                    index={chipIndex}
                                    key={chipIndex}
                                    selected={selectedTone === chip.index}
                                    limited={settings.chips === ColorChipMode.Chips_Limited && isLimited}
                                    labeled={settings.labels === LabelsSetting.Labels_On}
                                    locked={false}
                                    showAttachment={false}
                                    chipNumber={getRemainingChips(placedChips, chip, paletteIndex)}
                                    onClickChip={() => { onClickChip(chip); }}  />
                            )})
                            }
                            </ToneRow>
                        )}
                    </GroupEntry>
                ))
            }
            </GroupList>
        </StyledColorChipList>
    )
}

const StyledColorChipList = styled.div`
    height: 100vh;
    height: 100dvh;
    width: 100%;
    position: relative;
    display: grid;
    grid-template-rows: max-content 1fr;
`;

const SelectionWrapper = styled.div`
    margin-bottom: 10px;
`;

const GroupList = styled.div<{ $useGrid: boolean }>`
    position: relative;
    width: 100%;

    ${ ({$useGrid}) => {
        if($useGrid) {
            return css`
                display: grid;
                grid-template-rows: repeat(6, 1fr);
            `;
        }
    }}

    margin: 0;
    padding: 0 20px;

    overflow: scroll;
`;

const GroupEntry = styled.div`
    position: relative;
    width: 100%;
`;

const GroupTitle = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;

    font-size: var(--color-group-size);
`;

const GroupImage = styled.img`
    position: relative;
    height: 2em;
    object-fit: contain;
`;

const GroupName = styled.div`
    position: relative;
    padding-left: 10px;
    padding-right: 50px;

    ${textGlow};
    background-image: linear-gradient(to right, var(--color-group-gradient-start) 70%, var(--color-group-gradient-end) 100%);
`;

const ToneRow = styled.div`
    position: relative;
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);

    margin: 5px 0;
    gap: 6px;

    --color-chip-drop-shadow: #ffffff;
`;

const ChipWrapper = styled.div`
    width: 100%;
    height: 100%;
`;

const ChipEntry = styled.div`
    width: 100%;
    height: 100%;

    margin: 10px 0;
`;

const ChipItem = styled(ActiveGlowButton)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    width: 100%;
    height: 100%;
`;

const Divider = styled.div`
    width: 90%;
    margin: auto;

    border-top: 3px var(--list-divider) solid;    
`;