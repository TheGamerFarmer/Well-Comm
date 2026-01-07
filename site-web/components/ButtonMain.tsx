"use client";

import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "start" | "start1";
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: () => void;
};

const baseStyles =
    "w-40 h-12 flex flex flex-row justify-center items-center gap-[10px] py-4 ph-6 rounded-[100px] font-bold";

const variantStyles = {
    primary:
        "bg-[#0551ab] text-white " +
        "hover:bg-[#f87c7c]",
    secondary:
        "bg-white text-[#20baa7] border #20baa7 border-solid " +
        "hover:bg-[#20baa7] hover:text-white ",
    start:
        "bg-[#f87c7c] text-white",
    start1:
    "w-[shadow-[0 4px 0 0 #0551ab] bg-[#f87c7c]\n" +
        "\n" +
        "                    text-white py-2 px-4 md:py-4 md:px-10\n" +
        "                     shadow-[0px_4px_0px_0px_#0551ab] md:shadow-[0px_6px_0px_0px_#0551ab] text-[12px] sm:text-sm md:text-base transition-all duration-300 hover:translate-y-[2px]",
};

export const Button = ({
                           children,
                           variant = "primary",
                           type = "button",
                           disabled = false,
                           onClick,
                       }: ButtonProps) => {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]}`}
        >
            {children}
        </button>
    );
};
