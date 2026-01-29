import type { Stage } from 'konva/lib/Stage';

// Global stage reference for export functionality
let stageRef: Stage | null = null;

export function setStageRef(stage: Stage | null) {
    stageRef = stage;
}

export function getStageRef(): Stage | null {
    return stageRef;
}
