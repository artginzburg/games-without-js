import { FaRegStar, FaStar } from 'react-icons/fa';

import { starsConfig } from '../../config';

import { WinModalStarsContainer } from './WinModalStars.styled';

export function WinModalStars({ currentMistakes }: { currentMistakes: number }) {
  const stars = Math.max(starsConfig.minStars, starsConfig.maxStars - currentMistakes);

  return (
    <WinModalStarsContainer title={`Mistakes: ${currentMistakes}`}>
      {[...Array(starsConfig.maxStars)].map((_val, starIndex) => {
        const isStarEarned = starIndex + 1 <= stars;
        return (
          <span key={starIndex} data-filled={isStarEarned}>
            {isStarEarned ? <FaStar /> : <FaRegStar />}
          </span>
        );
      })}
    </WinModalStarsContainer>
  );
}
