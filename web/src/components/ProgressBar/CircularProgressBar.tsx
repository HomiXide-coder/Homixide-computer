import style from './styles/CircularProgressBar.module.scss';

const CircularProgressBar = ({ sqSize = 100, percentage = 20, strokeWidth = 10 }) => {
  // Size of the enclosing square
  const radius = (sqSize - strokeWidth) / 2;
  // Enclose circle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2;
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <svg width={sqSize} height={sqSize} viewBox={viewBox}>
      <circle className={style.circleBackground} cx={sqSize / 2} cy={sqSize / 2} r={radius} strokeWidth={`${strokeWidth}px`} />
      <circle
        className={style.circleProgress}
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        // Start progress marker at 12 O'Clock
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
        }}
      />
      <text className={style.circleText} x='50%' y='50%' dy='.3em' textAnchor='middle'>
        {`${percentage}%`}
      </text>
    </svg>
  );
};

export default CircularProgressBar;
