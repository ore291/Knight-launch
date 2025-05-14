import type { ChangeEvent } from "react";

export const UploadScreenshots = ({ handleFinish, saveImages }: { handleFinish: () => Promise<void>, saveImages: (data: any) => void }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            saveImages({ screenshots: files });
        }
    };
    return (
        <div className="flex items-center justify-center ">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Upload Screenshots</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex justify-end items-center">
                    <button onClick={() => handleFinish()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Finish
                    </button>
                </div>
            </div>

        </div>
    )
}