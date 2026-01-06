"use client";

import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "start";
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: () => void;
};

const baseStyles =
    "w-40 h-12 flex flex flex-row justify-center items-center gap-[10px] py-4 ph-6 rounded-[100px]";

const variantStyles = {
    primary:
        "bg-[#0551ab] text-white " +
        "hover:bg-[#f87c7c]",
    secondary:
        "bg-white text-[#20baa7] border #20baa7 border-solid " +
        "hover:bg-[#20baa7] hover:text-white ",
    start:
        "bg-[#f87c7c] text-white",
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
