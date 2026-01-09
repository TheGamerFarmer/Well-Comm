"use client";

import { useEffect, useState } from "react";

type ImagePreviewProps = {
    file: File | null;
};

const ImagePreview = ({ file }: ImagePreviewProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Nettoyage mémoire
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    return (
        <img
            src={previewUrl || "/images/placeholder.png"}
            alt="Preview"
            className="w-50 h-50 object-contain rounded-lg border cursor-pointer hover:opacity-80 transition"
        />
    );
};

export default ImagePreview;
