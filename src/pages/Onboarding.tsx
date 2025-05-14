import { useState, type SetStateAction, type ChangeEvent } from "react"
import { db } from "../db/db";
import ProjectsList from '../components/ProjectsList';
import type { Screenshot } from "../db/models/Screenshot";
import type { TextOverlay } from "../db/models/TextOverlay";
import { type projectDataTypes } from "../types/ProjectData";
import { CreateProject } from "./Onboarding/CreateProject";
import { ChooseDevices } from "./Onboarding/ChooseDevices";
import { UploadScreenshots } from "./Onboarding/UploadScreenshots";
export default function Onboarding({ onClose }: { onClose: SetStateAction<any> }) {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [projectData, setProjectData] = useState<projectDataTypes>({ name: '', orientation: '', screens: [], screenshots: [] });



    const handleNext = (data: any) => {
        setProjectData({ ...projectData, ...data });
        setCurrentStep(currentStep + 1);
    };
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file); // Converts to Base64
        });
    };
    const handleFinish = async () => {

        const now = new Date();
        const project = {
            name: projectData.name,
            orientation: projectData.orientation,
            createdAt: now,
            updatedAt: now,
        };
        try {
            const projectId = await db.projects.add(project);
            if (projectData.screenshots.length > 0) {
                const base64Images = await Promise.all(
                    projectData.screenshots.map((file) => convertToBase64(file))
                );

                const screenshotPromises = base64Images.map(async (base64Image) => {
                    const screenshot: Screenshot = {
                        projectId,
                        baseImage: base64Image,
                        textOverlays: [],
                    };
                    return db.screenshots.add(screenshot);
                });
                await Promise.all(screenshotPromises);
            }

        } catch (e) {
            console.error(e);

        }
        onClose();
    };
    const steps = [
        <CreateProject handleNext={handleNext} />,
        <ChooseDevices handleNext={handleNext} />,
        <UploadScreenshots handleFinish={handleFinish} saveImages={(data: any) => { setProjectData({ ...projectData, ...data }) }} />

    ];
    return steps[currentStep]
}
