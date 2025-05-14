import { useState, type ChangeEvent } from "react";

 export const ChooseDevices = ({ handleNext }: { handleNext: (data: any) => void }) => {
        const [screens, setScreens] = useState<string[]>([]);
        const devices = [

            "Apple iPhone 12",
            "Samsung Galaxy S23 ",
            "Google Pixel 6",
            "Google Pixel 4",
            "Apple iPad (10th generation)",
            "Samsung Galaxy Tab S8",


        ];
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            if (event.target.checked) {

                setScreens((prev: any) => [...prev, value]);
            } else {

                setScreens((prev: any[]) => prev.filter((item: any) => item !== value));
            }
        };
        return (
            <div className="flex items-center justify-center ">
                <div className="bg-white p-6 rounded-lg shadow-md w-lg">
                    <h2 className="text-2xl font-bold mb-4">Choose a device</h2>
                    <ul className=" text-sm mb-4 font-medium grid grid-cols-2 items-center">
                        {devices.map((device, index) => (
                            <li key={index} className="w-full col-span-1 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <input checked={screens.includes(device)}
                                        onChange={handleChange} id={`${device}-checkbox`} value={device} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                    <label htmlFor={`${device}-checkbox`} className="w-full whitespace-nowrap py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"> {device}</label>
                                </div>
                            </li>
                        ))}

                    </ul>
                    <div className="flex justify-end items-center">
                        <button onClick={() => handleNext({ screens })} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Next
                        </button>
                    </div>
                </div>

            </div>)
    }