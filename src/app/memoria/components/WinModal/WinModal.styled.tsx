import { styled } from '@linaria/react';

export const WinModalDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  column-gap: ${1.25 / 1.5}rem;
  margin-top: ${1.25 / 1.5}rem;

  > p {
    padding: 0.3rem 0.8rem;
    border-radius: 0.5rem;

    background-color: #fff;
    color: #222;

    text-align: center;
  }
`;

export const WinModalStatsEssentialsContainer = styled.div`
  margin-top: 0.5rem;

  display: flex;
  justify-content: space-between;
`;

export const StatsEssentialsSupText = styled.p`
  font-weight: 300;
`;
export const StatsEssentialsMainText = styled.p`
  font-size: 1.5rem;
  margin-top: 2px;

  > * {
    vertical-align: middle;
  }
`;

export const StatEssentialContainer = styled.div``;
export const WinModalStatsMovesContainer = styled(StatEssentialContainer)`
  > ${StatsEssentialsMainText} {
    > svg {
      transform: rotateZ(-90deg);
    }
  }
`;
export const WinModalStatsTimeContainer = styled(StatEssentialContainer)`
  text-align: right;
`;
