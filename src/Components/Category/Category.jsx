import React from 'react';
import { useEffect, useState } from 'react';
import EventCard from '../EventCard/EventCard';
import style from './Category.module.css';
import { useParams, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';
import SubCategory from '../SubCategory/SubCategory';

const VALID_CATEGORIES = ["sports", "crypto", "all", "featured", "culture", "politics"];
const SKELETON_COUNT = 20;

const Category = () => {
    const { data, filteredEvents, setFilteredEvents } = useContext(DataContext);
    const { category } = useParams();
    const [loading, setLoading] = useState(true);

    if (!VALID_CATEGORIES.includes(category)) {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        if (data) {
            setFilteredEvents(data.filter(event =>
                category === 'all' || event.category === category
            ));
            setLoading(false);
        }

    }, [data, setFilteredEvents, category]);

    const skeletonLoaders = Array(SKELETON_COUNT).fill(null);

    return (
        <div className={`content ${style.categoryPage}`}>
            <SubCategory />
            <div className={style.grid}>
                {loading
                    ? skeletonLoaders.map((_, index) => (
                        <SkeletonLoader key={index} />
                    ))
                    : filteredEvents.map((event, index) => (
                        <EventCard
                            key={index}
                            id={event.id}
                            image={event.image}
                            title={event.name}
                            chance={event.chance}
                            volume={event.volume}
                            yesName={event.yesName}
                            noName={event.noName}
                        />
                    ))}
            </div>
        </div>
    );
};

export default Category;