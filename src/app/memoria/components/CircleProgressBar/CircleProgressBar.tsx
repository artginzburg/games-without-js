import { CircleProgressBarContainer } from './CircleProgressBar.styled';

/** @see https://nikitahl.com/circle-progress-bar-css */
export function CircleProgressBar({
  value,
  previousValue,
  animate,
}: {
  value: number;
  previousValue: number;
  animate: boolean;
}) {
  return (
    <CircleProgressBarContainer
      title={`${value}%`}
      value={value}
      previousValue={previousValue}
      data-animate={animate}
    >
      <progress value={value} max={100}>
        {value}%
      </progress>
    </CircleProgressBarContainer>
  );
}
