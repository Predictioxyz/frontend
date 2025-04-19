import style from './Marquee.module.css';
import { useContext } from "react"
import { DataContext } from '../../context/DataContext'
import initialItems from '../../context/line'

const Marquee = () => {
  const { isMobile } = useContext(DataContext);

  const formatWallet = (wallet) => {
    if (!isMobile) return `${wallet.slice(0, 8)}...${wallet.slice(-6)}`;
    return `${wallet.slice(0, 4)}...${wallet.slice(-2)}`;
  };

  const renderItems = (items) =>
    items.map((item, index) => (
      <span key={index} className={style.marqueeItem}>
        <div className={style.item}>
          <div className={style.marqueeTitle}>{item.title}</div>
          <div className={style.marqueeInfo}>
            <div className={style.wallet}>{formatWallet(item.wallet)}</div>
            <div>{item.type}</div>
            <div className={`${style.yesOrNO} ${item.yesOrNo ? style.yes : style.no}`}>
              {item.yesOrNo ? 'Yes' : 'No'}
            </div>
            <div>at {item.price / 100} EDU</div>
          </div>
        </div>
      </span>
    ));

  return (
    <div className={`${style.marqueeContainer} nonSelectableText`}>
      <div className={style.marquee}>
        <div className={style.marqueeContent}>
          {renderItems(initialItems)}
          {renderItems(initialItems)}
        </div>
      </div>
    </div>
  );
};

export default Marquee;