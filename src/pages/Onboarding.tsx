import { useState, type SetStateAction, } from "react"
import { db } from "../db/db";
import type { Screenshot } from "../db/models/Screenshot";
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
               

                const screenshotPromises =   projectData.screenshots.map(async (file) => {
                    const screenshot: Screenshot = {
                        projectId,
                        baseImage: file,
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
