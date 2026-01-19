"use client";

import { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const BurgerScreen = () => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleStateChange = (state: { isOpen: boolean }) => {
        setIsMobileNavOpen(state.isOpen);
    };

    const currentPath = usePathname();

    const menuItems = [
        { text: "Mon Profil", iconWhite: "/images/icons/white/solar-user-outline(1).svg", iconBlue: "/images/icons/blue/solar-user-outline.svg", href: "/userSpace" },
        { text: "L’aidé", iconWhite: "/images/icons/white/icons-patient.svg", iconBlue: "/images/icons/blue/icons-patient.svg", href: "/ProfilAide" },
        { text: "Calendrier", iconWhite: "/images/icons/white/solar-calendar-outline.svg", iconBlue: "/images/icons/blue/solar-calendar-outline(1).svg", href: "/calendar" },
        { text: "Résumé", iconWhite: "/images/icons/white/icons-bell.svg", iconBlue: "/images/icons/blue/icons-bell(1).svg", href: "/resume" },
        { text: "Fil de transmission", iconWhite: "/images/icons/white/icons-message.svg", iconBlue: "/images/icons/blue/ep-message.svg", href: "/fil" },
        { text: "Médecin", iconWhite: "/images/icons/white/hugeicons-doctor-03.svg", iconBlue: "/images/icons/blue/hugeicons-doctor-03(1).svg", href: "/medecin" },
        { text: "Assistants", iconWhite: "/images/icons/white/lucide-users.svg", iconBlue: "/images/icons/blue/lucide-users(1).svg", href: "/assistants" },
    ];

    return (
        <div id="outer-container" style={{width: "100%", height: "100%" }}>
            <Menu
                isOpen={isMobileNavOpen}
                onStateChange={handleStateChange}
                outerContainerId="outer-container"
                pageWrapId="page-wrap"
                styles={{
                    bmMenuWrap: { width: "350px", top: "0px", height: "100vh", zIndex: "1000" },
                    bmMenu: {
                        backgroundImage: "linear-gradient(161deg, #215a9e 32%, #20baa7 139%)",
                        height: "100vh",
                        padding: "20px 16px",
                        boxShadow: "3px 0 4px 0 rgba(0, 0, 0, 0.06)",
                    },
                    bmItemList: { paddingTop: "80px" },
                    bmBurgerButton: {
                        position: "absolute",
                        width: "30px",
                        height: "30px",
                        top: "27px",
                        left: "20px",
                        zIndex: "1101",
                        display: isMobileNavOpen ? "none" : "block", // скрываем бургер при открытом меню
                    },
                    bmBurgerBars: {
                        background: "#0551ab",
                        width: "40px",       // толщина линии крестика
                        height: "4px",
                        borderRadius: "100px"
                    }, // добавили цвет полосок
                    bmCrossButton: {
                        width: "20px",      // ширина кнопки-крестика
                        height: "20px",     // высота кнопки-крестика
                        top: "20px",
                        right: "20px",
                        zIndex: "1101",

                    },
                    bmCross: {
                        background: "#fff",
                        width: "2px",       // толщина линии крестика
                        height: "20px",
                        borderRadius: "100px", // длина линии крестика
                    }
                }}
            >
                {menuItems.map((item, index) => {
                    const isActive = item.href === currentPath;
                    const isHovered = hoveredIndex === index;

                    const bgColor = isActive ? "rgba(255, 255, 255, 0.85)"
                        : isHovered ? "rgba(191, 219, 254, 0.5)"
                            : "transparent";

                    const textColor = isActive || isHovered ? "#0551ab" : "#fff";
                    const fontWeight = isActive || isHovered ? 700 : 400;
                    const borderRadius = "12px";
                    const iconSrc = isHovered || isActive ? item.iconBlue : item.iconWhite;

                    return (
                        <Link key={index} href={item.href} style={{ textDecoration: "none" }}>
                            <div
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "12px 16px",
                                    fontSize: "1.5rem",
                                    color: textColor,
                                    fontWeight: fontWeight,
                                    backgroundColor: bgColor,
                                    borderRadius: borderRadius,
                                    marginBottom: "8px",
                                    transition: "background 0.2s, color 0.2s",
                                    cursor: "pointer",
                                }}
                            >
                                <Image src={iconSrc} alt={item.text} style={{ width: "24px", height: "24px", marginRight: "12px" }} />
                                <span>{item.text}</span>
                            </div>
                        </Link>
                    );
                })}
            </Menu>

            <main id="page-wrap" />
        </div>
    );
};

export default BurgerScreen;


