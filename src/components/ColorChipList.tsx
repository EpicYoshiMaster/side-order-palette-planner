import React, { useState } from "react";
import styled from "styled-components";
import { ActiveGlowButton, GlowButton, textGlow } from "./Layout";
import { ColorGroup, OnClickChipProps, OnClickToneProps } from "../types/types";
import { ItemSelectionRow } from "./ItemSelectionRow";

interface ColorChipListProps {
    chipDatabase: ColorGroup[];
    onClickChip: OnClickChipProps;
    onClickTone: OnClickToneProps;
}

enum DisplayState {
    DS_ColorChips,
    DS_Tones
};

export const ColorChipList: React.FC<ColorChipListProps> = ({ chipDatabase, onClickChip, onClickTone }) => {

    const [displayState, setDisplayState] = useState(DisplayState.DS_ColorChips);

    return (
        <StyledColorChipList>
            <SelectionWrapper>
                <ItemSelectionRow items={["Color Chips", "Tones"]} selected={displayState} setSelected={setDisplayState} />
            </SelectionWrapper>
            <GroupList>
            {
                chipDatabase.map((group, index) => {
                    return (
                    <GroupEntry key={index}>
                        <GroupTitle>
                            <GroupImage src={require(`assets/tones/${group.image}`)} alt={`${group.name} Logo`} />
                            <GroupName>
                                {group.name}
                            </GroupName>
                        </GroupTitle>

                        {displayState === DisplayState.DS_ColorChips && (<ChipList>
                        {
                        group.tones.map((tone, index) => {
                            return (
                            <ToneEntry key={index}>
                            {
                                 tone.chips.map((chip, index) => {
                                    return (
                                        <ChipEntry key={index}>
                                            <ChipItem onClick={() => { onClickChip(group, tone, chip); }} >
                                                {chip.name}
                                            </ChipItem>
                                        </ChipEntry>
                                    )
                                    })
                            }
                            </ToneEntry>
                            )
                        })
                        }
                        </ChipList>
                        )}
                        {displayState === DisplayState.DS_Tones && (<ToneRow>
                            {
                            group.tones.map((tone, index) => {
                                return <ToneImage src={require(`assets/chips/${tone.image}`)} key={index} onClick={() => { onClickTone(group, tone); }} />
                            })
                            }
                        </ToneRow>
                        )}
                    </GroupEntry>
                    );
                })
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

const GroupList = styled.ul`
    position: relative;
    margin: 0;
    padding: 0 20px;

    list-style: none;

    overflow: scroll;
`;

const GroupEntry = styled.li`
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

const ChipList = styled.ul`
    position: relative;
    margin: 0;
    padding: 0;

    list-style: none;

    overflow: auto;
`;

const ToneRow = styled.div`
    margin: 5px 0;
    height: 4em;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 3px;
`;

const ToneImage = styled.img`
    height: 100%;
    object-fit: contain;
`;

const ToneEntry = styled.div`
    position: relative;
    display: contents;
`

const ChipEntry = styled.li`
    width: 100%;
    height: 100%;

    margin: 10px 0;
`;

const ChipItem = styled(GlowButton)`
    width: 100%;
    height: 100%;
`;