import { SVGProps } from 'react';
import Sprite from '/assets/media/svg/sprite.svg';

interface IconProps extends SVGProps<SVGSVGElement> {
  id: string;
}

const Icon: React.FC<IconProps> = ({ id, ...props }) => {
  return (
    <svg {...props}>
      <use xlinkHref={`${Sprite}#${id}`} />
    </svg>
  );
};

export default Icon;
