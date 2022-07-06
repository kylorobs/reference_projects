import { Modal } from 'flowbite-react';
import React from 'react';

type R = React.ReactNode;

const Popup = ({
    show,
    close,
    children,
    heading,
}: {
    show: boolean;
    close: () => void;
    children: R;
    heading: string;
}) => {
    console.log(show);
    return (
        <div className="relative">
            <div
                id="authentication-modal"
                tabIndex={-1}
                aria-hidden={show}
                className={`${!show ? 'hidden' : ''
                    } overflow-y-auto overflow-x-hidden fixed m-auto inset-x-0 inset-y-0  z-150 h-1/2 w-full`}
            >
                <div className="relative p-4 max-w-xl md:h-auto mx-auto h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                            type="button"
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                            onClick={close}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <div className="py-12 px-12 lg:px-8">
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">{heading}</h3>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Popup;
