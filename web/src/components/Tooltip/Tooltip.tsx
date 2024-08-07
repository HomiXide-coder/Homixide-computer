import style from './Tooltip.module.scss';

interface TooltipProps {
  content: string;
  position?: 'top' | 'left' | 'right' | 'bottom';
  image?: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, position = 'top', image, children }) => {
  return (
    <div className={`${style.tooltipBox} ${style[`tooltip${position.charAt(0).toUpperCase() + position.slice(1)}`]}`}>
      {image && <img src={image} alt='Tooltip' className={style.tooltipImage} />}
      <span className={style.tooltipText}>{content}</span>
      {children}
    </div>
  );
};

export default Tooltip;
