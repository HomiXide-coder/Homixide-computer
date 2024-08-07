import Window from "../../../components/Window/Window";
import style from "./noid.module.scss";

const NoidMinigame = () => {
  return (
    <div className={style.minigameContainer}>
      <div className={style.minigameTitleContainer}>
        <div className={style.minigameSplitter}>
          01010101010101010101010101010101010101010101
        </div>
        <div className={style.minigameInfo}>
          <div className={style.minigameTitle}>Try to get access</div>
          <div className={style.minigameInstructions}>
            Enter the sequence below to get access to the plans
          </div>
        </div>
        <div className={style.minigameSplitter}>
          01010101010101010101010101010101010101010101
        </div>
      </div>
      <div className={style.minigameInputContainer}>
        {Array.from({ length: 25 }).map(() => (
          <div className={style.minigameInput}>
            <span>OL</span>
            <div className={style.lineOne}></div>
            <div className={style.lineTwo}></div>
            <div className={style.lineThree}></div>
          </div>
        ))}
      </div>
      <div className={style.minigameRequiredContainer}>
        <div className={style.minigameSequence}>
          <div className={style.requiredAccess}>
            // SEQUENCE REQUIRED TO ACCESS
          </div>
          <div className={style.requiredInputs}>
            <span>EL</span>
            <span>06</span>
            <span>06</span>
            <span>06</span>
            <span>06</span>
            <span>06</span>
            <span>06</span>
            <span>06</span>
          </div>
        </div>
        <div className={style.attemptsInfo}>
          <div className={style.attemptsText}>
            <span className={style.attemptsRed}>Attempts per day</span>
            <span className={style.attemptsWhite}>Resets every 24h</span>
          </div>
          <div className={style.attemptsCounter}>
            <span>5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Noid = () => {
  return (
    <Window>
      <div className={style.noidContainer}>
        <NoidMinigame />
      </div>
    </Window>
  );
};

export default Noid;
