import React, { useEffect, useRef, useState } from 'react';
import style from './EventCard.module.css';
import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { addToWatchlist, removeFromWatchlist, fetchWatchlist } from '../Back/fetchUserInfo';
import getImage from '../getImage';

const EventCard = ({ id, image, title, chance, volume, yesName, noName }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const variantListRef = useRef(null);
  const { wallet, setChosenEventId } = useContext(DataContext);
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const checkIfInWatchlist = async () => {
      try {
        if (wallet) {
          const result = await fetchWatchlist(wallet);
          watchlist = Array.isArray(result.watchlist) ? result.watchlist : [];
        }
        let aaa = watchlist.hasOwnProperty(String(id));
        setIsInWatchlist(aaa);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    };
    checkIfInWatchlist();
  }, []); 

  const handleAddToWatchlist = async () => {
    try {
      let result = await addToWatchlist(wallet, id);
      setIsInWatchlist(true);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };
  const handleRemoveFromWatchlist = async () => {
    try {
      await removeFromWatchlist(wallet, id);
      setIsInWatchlist(false);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const formatVolume = (value) => {
    if (!value) return "$0 volume";

    const billion = 1e9;
    const million = 1e6;
    const thousand = 1e3;

    if (value >= billion) return `$${(value / billion).toFixed(1)}b volume`;
    if (value >= million) return `$${(value / million).toFixed(1)}m volume`;
    if (value >= thousand) return `$${(value / thousand).toFixed(1)}k volume`;

    return `$${value.toFixed(1)} volume`;
  };

  const handleMouseEnter = (e) => {
    e.preventDefault();
    if (variantListRef.current) {
      variantListRef.current.scrollTo({
        bottom: variantListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleEventSelect = (e, id, index, chanceID) => {
    e.preventDefault();
    setChosenEventId(prev => {
      if (prev && prev.id === id && prev.variant === (index + 1) && prev.chance === chanceID) {
        return prev;
      }
      return {
        iteration: true,
        id: id,
        variant: index,
        chance: chanceID,
      };
    });
    navigate(`/event/${id}`);
  };

  const handleWatchListToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      handleRemoveFromWatchlist();
    } else {
      handleAddToWatchlist();
    }
  };

  const WatchListIcon = () => (
    isInWatchlist ? (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
        onClick={handleWatchListToggle}>
        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#6d3c89"
        onClick={handleWatchListToggle}>
        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
      </svg>
    )
  );

  return (
    <div className={style.card}>
      <div className={style.cardContent}>
        <div className={style.cardHeader}
          onClick={(e) => handleEventSelect(e, id, 0, 0)}>
          <div className={style.cardImage}>
            {image && <img src={getImage(id)} alt={title} />}
          </div>
          <h3 className={style.cardTitle}>
            {title}
          </h3>
        </div>
        <div className={style.cardBody}>
          <div className={style.variantList}
            ref={variantListRef}
            onMouseEnter={handleMouseEnter}>
            <div className={`${style.noVariant} nonSelectableText`}>
              <div className={style.noVariantChance}>
                {chance && `${chance}% chance`}
              </div>
              <div className={style.noVariantButtons}>
                <div className={style.noVariantYes}
                  onClick={(e) => handleEventSelect(e, id, 0, 1)}>
                  {yesName}
                </div>
                <div className={style.noVariantNo}
                  onClick={(e) => handleEventSelect(e, id, 0, 2)}>
                  {noName}
                </div>
              </div>
            </div>
          </div>
          <div className={`${style.cardVolume} nonSelectableText`}>
            {formatVolume(volume)}
            <div className={`${style.watchlist} ${isInWatchlist ? style.favorite : style.nonFavorite}`}>
              <WatchListIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
