import { useState } from "react";

export const CreateProject = ({ handleNext }: { handleNext: (data: any) => void }) => {
    const [name, setName] = useState('');
    const [orientation, setOrientation] = useState('');

    return (
        <div className="flex items-center justify-center ">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Create a New Project</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Project Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Orientation</label>
                    <div className="flex gap-4 items-center mb-4">
                        <div className="flex items-center ">
                            <input id="default-radio-1" type="radio" onChange={(e) => setOrientation(e.target.value)} value={'portrait'} name="default-radio" className="w-4 h-4 " />
                            <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Portrait</label>
                        </div>
                        <div className="flex items-center">
                            <input id="default-radio-2" type="radio" onChange={(e) => setOrientation(e.target.value)} value={'landscape'} name="default-radio" className="w-4 h-4 " />
                            <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Landscape</label>
                        </div>
                    </div>


                </div>
                <button onClick={() => handleNext({ name, orientation })} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Create Project
                </button>
            </div>
        </div>
    )
}