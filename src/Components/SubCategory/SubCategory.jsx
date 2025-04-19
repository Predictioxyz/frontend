import React, { useState, useRef } from 'react';
import style from './SubCategory.module.css';

const SubCategory = ({ 
    categories = ['New', 'Trending', 'High volume', 'Ending soon'],
    onSelect = () => {} 
}) => {
    const [selectedSubCategory, setSelectedSubCategory] = useState();
    const containerRef = useRef(null);
    const isMouseDown = useRef(false);
    const startX = useRef(0);

    const handleDragStart = (e) => {
        isMouseDown.current = true;
        startX.current = e.clientX ?? e.touches?.[0]?.clientX;
    };

    const handleDragMove = (e) => {
        if (!isMouseDown.current) return;
        const currentX = e.clientX ?? e.touches?.[0]?.clientX;
        const dx = currentX - startX.current;
        containerRef.current.scrollLeft -= dx;
        startX.current = currentX;
    };

    const handleDragEnd = () => {
        isMouseDown.current = false;
    };

    const handleSelect = (index) => {
        setSelectedSubCategory(index);
        onSelect(categories[index]);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(index);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`${style.container} scroll-container`}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            role="tablist"
            aria-label="Category filters"
        >
            {categories.map((category, index) => (
                <div
                    key={index}
                    className={`${style.subCategory} ${selectedSubCategory === index ? style.selected : ''}`}
                    onClick={() => handleSelect(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    role="tab"
                    tabIndex={0}
                    aria-selected={selectedSubCategory === index}
                >
                    {category}
                </div>
            ))}
        </div>
    );
};

export default SubCategory;
