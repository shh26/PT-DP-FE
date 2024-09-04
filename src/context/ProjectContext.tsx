import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ProjectContextType = {
    completedGates: { [projectId: string]: { [gate: string]: boolean } };
    setCompletedGate: (projectId: string, gate: string, completed: boolean) => void;
    stageStatuses: { [projectId: string]: { [key: string]: string } };
    setStageStatuses: (projectId: string, statuses: { [key: string]: string }) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [completedGates, setCompletedGates] = useState<{ [projectId: string]: { [gate: string]: boolean } }>({});
    const [stageStatuses, setStageStatuses] = useState<{ [projectId: string]: { [key: string]: string } }>({});

    useEffect(() => {
        const storedCompletedGates = localStorage.getItem('completedGates');
        const storedStageStatuses = localStorage.getItem('stageStatuses');
        if (storedCompletedGates) {
            setCompletedGates(JSON.parse(storedCompletedGates));
        }
        if (storedStageStatuses) {
            setStageStatuses(JSON.parse(storedStageStatuses));
        }
    }, []);

    const updateCompletedGate = (projectId: string, gate: string, completed: boolean) => {
        setCompletedGates(prevCompletedGates => {
            const newCompletedGates = {
                ...prevCompletedGates,
                [projectId]: {
                    ...prevCompletedGates[projectId],
                    [gate]: completed
                }
            };

            // Update localStorage
            localStorage.setItem('completedGates', JSON.stringify(newCompletedGates));

            return newCompletedGates;
        });
    };

    const updateStageStatuses = (projectId: string, statuses: { [key: string]: string }) => {
        setStageStatuses(prevStageStatuses => {
            const newStageStatuses = { ...prevStageStatuses, [projectId]: statuses };

            // Update localStorage
            localStorage.setItem('stageStatuses', JSON.stringify(newStageStatuses));

            return newStageStatuses;
        });
    };

    return (
        <ProjectContext.Provider
            value={{
                completedGates,
                setCompletedGate: updateCompletedGate,
                stageStatuses,
                setStageStatuses: updateStageStatuses
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};