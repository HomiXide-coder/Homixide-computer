import { useNavigate } from 'react-router-dom';
import style from './styles/hire.module.scss';
import Icon from '~utils/icon';

const Hire = () => {
  const navigate = useNavigate();
  return (
    <div className={style.hireWrapper}>
      <div className={style.hireNav}>
        <div className={style.backButton} onClick={() => navigate('/hq')}>
          Back
        </div>
      </div>
      <div className={style.hireContainer}>
        <div className={style.hireList}>
          <div className={style.contact}>
            <Icon id='cowboy' className={style.cowboyIcon} />
            <div className={style.contactName}>Contact #1</div>
            <div className={style.advantages}>
              <div className={style.title}>Advantages</div>
              <div className={style.advantage}>
                <div className={style.plus}>+</div>
                <span>Sells Fast</span>
              </div>
              <div className={style.advantage}>
                <div className={style.plus}>+</div>
                <span>Sells Fast</span>
              </div>
              <div className={style.advantage}>
                <div className={style.plus}>+</div>
                <span>Sells Fast</span>
              </div>
            </div>
            <div className={style.disadvantages}>
              <div className={style.title}>Disdvantages</div>
              <div className={style.disadvantage}>
                <div className={style.minus}>-</div>
                <span>Sells Fast</span>
              </div>
              <div className={style.disadvantage}>
                <div className={style.minus}>-</div>
                <span>Sells Fast</span>
              </div>
              <div className={style.disadvantage}>
                <div className={style.minus}>-</div>
                <span>Sells Fast</span>
              </div>
            </div>
            <div className={style.contactPrice}>
              <div className={style.paymentDetails}>
                <div className={style.iconContainer}>
                  <Icon id='selection' className={style.selectionIcon} />
                </div>
                <span>Payment</span>
              </div>
              <div className={style.price}>10 BDCOIN / WEEK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hire;
