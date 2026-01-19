"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ImagePreviewProps = {
    file: File | null;
};

const ImagePreview = ({ file }: ImagePreviewProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setTimeout(() => {
                setPreviewUrl(null);
            }, 0);
            return;
        }

        const url = URL.createObjectURL(file);
        setTimeout(() => {
            setPreviewUrl(url);
        }, 0);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    return (
        <Image
            src={previewUrl || "/images/placeholder.png"}
            alt="Preview"
            width={250}
            height={250}
            className="object-contain rounded-lg border cursor-pointer hover:opacity-80 transition"
        />
    );
};

export default ImagePreview;