import { useNavigate } from 'react-router-dom';
import CircularProgressBar from '~components/ProgressBar/CircularProgressBar';
import style from './styles/turfs.module.scss';

const mockData = [
  {
    name: 'cypressflats',
    percentage: 35,
  },
  {
    name: 'sandyshores',
    percentage: 20,
  },
  {
    name: 'aztecas',
    percentage: 14,
  },
  {
    name: 'families',
    percentage: 35,
  },
  {
    name: 'littlesoul',
    percentage: 10,
  },
  {
    name: 'paleto',
    percentage: 5,
  },
  {
    name: 'ballas',
    percentage: 2,
  },
  {
    name: 'vagos',
    percentage: 1,
  },
  {
    name: 'lapuerta',
    percentage: 8,
  },
];

const Turfs = () => {
  const navigate = useNavigate();

  return (
    <div className={style.turfs}>
      <div className={style.turfsNav}>
        <div className={style.backButton} onClick={() => navigate('/hq')}>
          Back
        </div>
      </div>
      <div className={style.turfsContainer}>
        <div className={style.turfsList}>
          {mockData
            .sort((a, b) => {
              if (a.percentage === b.percentage) {
                return a.name.localeCompare(b.name);
              }
              return b.percentage - a.percentage;
            })
            .map((turf) => (
              <div className={style.turf} key={turf.name}>
                <div className={style.turfProgress}>
                  <CircularProgressBar strokeWidth={10} sqSize={100} percentage={turf.percentage} />
                </div>
                <div className={style.turfInfo}>
                  <span className={style.turfSpan}>Turf Name</span>
                  <div className={style.turfName}>{turf.name}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Turfs;
