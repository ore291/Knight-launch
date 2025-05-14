import { useState, type SetStateAction, type ChangeEvent } from "react"
import { db } from "../db/db";
import ProjectsList from '../components/ProjectsList';
import type { Screenshot } from "../db/models/Screenshot";
import type { TextOverlay } from "../db/models/TextOverlay";
import Onboarding from "./Onboarding";
export default function CreateProject() {
    const [isOnboarding, setIsOnboarding] = useState(false);
    return (
        <main className="flex-1 bg-gray-50 p-6 overflow-x-auto">
            <div className="flex space-x-4">
                <div className="min-h-screen w-full flex items-center justify-center p-4">

                    {!isOnboarding ? (
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => setIsOnboarding(true)}
                        >
                            Create Project
                        </button>
                    ) : (
                        <div className="fixed inset-0 z-10  bg-opacity-50 flex items-center justify-center">
                            <div onClick={() => setIsOnboarding(false)} className="fixed inset-0 z-10 bg-black/50 bg-opacity-50"></div>
                            <div className="bg-white p-10 rounded-lg w-full max-w-xl z-50">
                                <Onboarding onClose={() => setIsOnboarding(false)} />
                            </div>
                        </div>
                    )}
                </div>


            </div>
        </main>
    )
}
