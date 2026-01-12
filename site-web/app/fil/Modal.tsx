import { useEffect } from 'react'

type ModalProps = {
    isOpen: boolean
    onClose: () => void
}

export default function Modal({ isOpen, onClose }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }

        // Nettoyage au démontage (important)
        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg">
                <p>Ma popup</p>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-black text-white rounded"
                >
                    Fermer
                </button>
            </div>
        </div>
    )
}
