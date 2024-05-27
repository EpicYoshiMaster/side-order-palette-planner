import React, { Dispatch, SetStateAction } from "react";
import styled, { css } from "styled-components";
import { ActiveGlowButton, textGlow } from "./Layout";
import { OnClickChipProps, DisplayState } from "../types/types";
import { getColorGroups, getColorChips, getToneImage } from "utils/utils";
import { ItemSelectionRow } from "./ItemSelectionRow";

interface ColorChipListProps {
    onClickChip: OnClickChipProps;
    selectedChip: number;
    selectedTone: number;
    displayState: DisplayState;
    setDisplayState: Dispatch<SetStateAction<number>>;
}

const colorGroups = getColorGroups();
const colorChips = getColorChips();

export const ColorChipList: React.FC<ColorChipListProps> = ({ onClickChip, selectedChip, selectedTone, displayState, setDisplayState }) => {

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
                        colorChips.filter((chip) => chip.group === group.index && !chip.isTone).map((chip, chipIndex) => (
                                <ChipEntry key={chipIndex}>
                                    <ChipItem $active={selectedChip === chip.index} onClick={() => { onClickChip(chip); }}>
                                        {chip.name}
                                    </ChipItem>
                                </ChipEntry>
                        ))}

                        {displayState === DisplayState.DS_Tones && (
                        
                            <ToneRow>
                            {
                            colorChips.filter((chip) => chip.group === group.index && chip.isTone).map((chip, chipIndex) => (
                                <ToneImage $active={selectedTone === chip.index} src={require(`assets/chips/${getToneImage(chip.group, chip.tone)}`)} key={chipIndex} onClick={() => { onClickChip(chip); }} />
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
`;

const ChipEntry = styled.div`
    width: 100%;
    height: 100%;

    margin: 10px 0;
`;

const ChipItem = styled(ActiveGlowButton)`
    width: 100%;
    height: 100%;
`;