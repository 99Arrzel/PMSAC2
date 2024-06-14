import React, { useEffect, useState } from "react";

export const Modal = ({ children, open, onClose, titulo }: { children: React.ReactNode, open: boolean, onClose: () => void, titulo: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(open);
    useEffect(() => {
        setIsOpen(open);
    }, [open]);
    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="bg-white rounded-md shadow-md p-4">
                            <div className="flex">
                                {titulo}
                                <div className="ml-auto">
                                <button className="bg-red-400 px-2 py-1 rounded-md hover:bg-red-500" onClick={onClose}>X</button>
                                </div>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
