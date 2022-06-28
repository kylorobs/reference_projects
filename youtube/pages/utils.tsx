import { Button } from 'flowbite-react';

export default function Utils() {
    return (
        <div className="mt-10 ml-20">
            <h2 className="mb-10 text-xl">Utils</h2>

            <button
                type="button"
                onClick={async () => {
                    await fetch('/api/utils', {
                        body: JSON.stringify({
                            task: 'generate_content',
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                    });
                }}
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
                Populate database
            </button>
            <div className="flex-1 mb-5">
                <button
                    type="button"
                    className="border px-8 py-2 mt-5 mr-8 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover-darker"
                    onClick={async () => {
                        await fetch('/api/utils', {
                            body: JSON.stringify({
                                task: 'clean_database',
                            }),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            method: 'POST',
                        });
                    }}
                >
                    Clean database
                </button>
            </div>
        </div>
    );
}
