import React, { Dispatch, SetStateAction } from "react";
import styled, { css } from "styled-components";
import { ActiveGlowButton, textGlow } from "./Layout";
import { OnClickChipProps, DisplayState, LabelsSetting, ColorChip } from "../types/types";
import { getColorGroups, getColorChips, getToneImage, getColorChipByIndex } from "utils/utils";
import { ItemSelectionRow } from "./ItemSelectionRow";

interface ColorChipListProps {
    onClickChip: OnClickChipProps;
    selectedChip: number;
    selectedTone: number;
    displayState: DisplayState;
    setDisplayState: Dispatch<SetStateAction<number>>;
    labelsSetting: LabelsSetting;
    remainingChips: number[];
}

const colorGroups = getColorGroups();
const colorChips = getColorChips();

export const ColorChipList: React.FC<ColorChipListProps> = ({ onClickChip, selectedChip, selectedTone, displayState, setDisplayState, labelsSetting, remainingChips }) => {

    return (
        <StyledColorChipList>
            <SelectionWrapper>
                <ItemSelectionRow items={["Color Chips", "Tones"]} selected={displayState} setSelected={setDisplayState} />
            </SelectionWrapper>
            <GroupList>
            {
                colorGroups.map((group, index) => (
                    <GroupEntry key={index}>
                        <GroupTitle>
                            <GroupImage src={require(`assets/tones/${group.image}`)} alt={`${group.name} Logo`} />
                            <GroupName>{group.name}</GroupName>
                        </GroupTitle>

                        {displayState === DisplayState.DS_ColorChips && 
                        colorChips.filter((chip) => chip.group === group.index && !chip.isTone).map((chip, chipIndex) => {
                            let prevChip: ColorChip | undefined = undefined;

                            if(chip.index > 0) {
                                prevChip = getColorChipByIndex(chip.index - 1);
                            }

                            return (
                            <ChipWrapper key={chipIndex}>
                                {prevChip && chip.group === prevChip.group && chip.tone !== prevChip.tone && (
                                    <Divider />
                                )}
                                <ChipEntry >
                                    <ChipItem 
                                    //disabled={true}
                                    $active={selectedChip === chip.index} 
                                    onClick={() => { onClickChip(chip); }}>
                                        <div>
                                            {chip.name}
                                        </div>
                                        <div>
                                            ({remainingChips[chip.index]})
                                        </div>
                                    </ChipItem>
                                </ChipEntry>
                            </ChipWrapper>
                            )
                            })}

                        {displayState === DisplayState.DS_Tones && (
                        
                            <ToneRow>
                            {
                            colorChips.filter((chip) => chip.group === group.index && chip.isTone).map((chip, chipIndex) => (
                                <ToneImage 
                                onDragStart={(event) => { event.preventDefault(); }}
                                $active={selectedTone === chip.index} 
                                src={require(`assets/chips/${getToneImage(chip.group, chip.tone)}`)} 
                                key={chipIndex} 
                                onClick={() => { onClickChip(chip); }} />
                            ))
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
    width: 15vw;
    position: relative;
    display: grid;
    grid-template-rows: max-content 1fr;
`;

const SelectionWrapper = styled.div`
    margin-bottom: 10px;
`;

const GroupList = styled.div`
    position: relative;
    margin: 0;
    padding: 0 20px;

    overflow: scroll;
`;

const GroupEntry = styled.div`
    position: relative;
`;

const GroupTitle = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;

    font-size: 2rem;
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
    background-image: linear-gradient(to right, ${props => props.theme.gradient_background} 70%, rgba(94, 66, 66, 0) 100%);
`;

const ToneRow = styled.div`
    margin: 5px 0;
    height: 4em;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 6px;
`;

const ToneImage = styled.img<{$active: boolean}>`
    height: 100%;
    object-fit: contain;

    transition: transform 0.1s linear;

    &:hover {
        transform: scale(1.1, 1.1);
    }

    ${({ $active }) => $active ? css`transform: scale(1.05, 1.05); filter: drop-shadow(0px 0px 10px #ffffff);` : ''};

    user-select: none;
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

    border-top: 3px ${props => props.theme.glow_background} solid;    
`;