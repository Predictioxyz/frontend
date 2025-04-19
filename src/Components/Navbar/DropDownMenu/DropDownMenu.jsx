import React, { useState, useEffect, useRef } from "react";
import style from "./DropdownMenu.module.css";

const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const menuRef = useRef(null);

    const handleMouseEnter = () => {
        if (!isPinned) setIsOpen(true);
    };

    const handleMouseLeave = () => {
        if (!isPinned) setIsOpen(false);
    };

    const handleDocumentClick = (e) => {
        if (isPinned && menuRef.current && !menuRef.current.contains(e.target)) {
            setIsPinned(false);
            setIsOpen(false);
        }
    };

    const handleMenuClick = () => {
        setIsPinned(true);
    };

    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [isPinned]);

    return (
        <div
            className={style.dropDownContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={menuRef}
        >
            <button className={style.dropDownTrigger}>Hover or Click Me</button>
            {isOpen && (
                <div className={style.dropDownMenu} onClick={handleMenuClick}>
                    <p>Menu Item 1</p>
                    <p>Menu Item 2</p>
                    <p>Menu Item 3</p>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
