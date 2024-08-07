import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Window.module.scss';

interface WindowProps {
  children: ReactNode;
  activeApp?: boolean;
}

const Window: React.FC<WindowProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className={style.windowContainer}>
      <div className={style.windowNav}>
        <div className={`${style.windowNavButton} ${style.red}`} onClick={() => navigate('/')} />
        <div className={`${style.windowNavButton} ${style.yellow}`} />
        <div className={`${style.windowNavButton} ${style.green}`} />
      </div>
      {children}
    </div>
  );
};

export default Window;
