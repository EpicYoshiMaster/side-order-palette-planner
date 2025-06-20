import React from "react";
import styled from "styled-components";

interface HacksIndicatorProps {
	current: number; //Number from 0 to max
	max: number;
}

export const HacksIndicator: React.FC<HacksIndicatorProps> = ({ current, max }) => {
	return (
		<IndicatorWrapper $numEntries={max > 0 ? max : 0}>
			<StartBar $enabled={current > 0} />
			{max > 0 && Array.from(Array(max).keys()).map((index) => 
				<HackBar key={index} $partial={current > index} $enabled={current >= index + 1} />
			)}
		</IndicatorWrapper>
	)
}

const IndicatorWrapper = styled.div<{ $numEntries: number }>`
	position: relative;
	display: grid;
	min-width: 150px;
	height: 20px;
	padding-left: 5px;

	@media (max-width: 2400px) {
		min-width: 140px;
	}

	@media (max-width: 2200px) {
		min-width: 120px;
	}

	@media (max-width: 2000px) {
		min-width: 110px;
	}

	@media (max-width: 450px) {
		min-width: 100px;
		height: 15px;
	}

	grid-template-columns: 15px repeat(${({ $numEntries }) => $numEntries}, 1fr);
	gap: 3px;
`;

const HackBar = styled.div<{ $partial?: boolean, $enabled?: boolean }>`
	position: relative;

	width: 100%;
	height: 100%;

	border-radius: 0.5rem 0.125rem;

	@media (max-width: 450px) {
		border-radius: 0.4rem 0.1rem;
	}

	background-color: ${({$partial, $enabled}) => $enabled ? 'var(--hack-bar-on)' : ($partial ? 'var(--hack-bar-partial)' :'var(--hack-bar-off)')};
`;

const StartBar = styled(HackBar)`
	background-color: ${({$enabled}) => $enabled ? 'var(--hack-bar-on)' : 'var(--hack-bar-start)'};
`;