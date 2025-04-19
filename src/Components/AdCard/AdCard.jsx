import React from 'react';
import style from './AdCard.module.css';
import { useNavigate } from 'react-router-dom';

const AdCard = ({ index, name, image, category }) => {
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        if (category) {
            navigate(`/category/${category}`);
        }
    };

    return (
        <div className={`${style.card} ${style[`background${index}`]}`}
            onClick={handleClick}>
            <div className={style.cardContent}>
                <div className={style.left}>
                    <div className={style.title}>
                        {name}
                    </div>
                    <button
                        className={style.adCardButton}
                        onClick={handleClick}
                    >
                        View
                    </button>
                </div>
                <div className={`${style.right} nonSelectableText`}>
                    <img src={image} alt={name} />
                </div>
            </div>
        </div>
    );
};

export default AdCard;
