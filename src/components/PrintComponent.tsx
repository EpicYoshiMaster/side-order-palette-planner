import React from "react";
import styled from "styled-components";

interface PrintComponentProps {
	children: React.ReactNode;
}

export const PrintComponent = React.forwardRef<HTMLDivElement, PrintComponentProps>(({ children }, ref) => {
	return (
		<Wrapper ref={ref}>
			{children}
		</Wrapper>
	)
});

const Wrapper = styled.div`
`;