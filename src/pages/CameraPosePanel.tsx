import React, { useRef } from "react";
import Webcam from "react-webcam";

// Import all exercise detectors
import { setupBicepCurl } from "../utils/setupBicepCurl";
import { setupSquats } from "../utils/setupSquats";
import { setupShoulderPress } from "../utils/setupShoulderPress";
// import { setupPushups } from "../utils/setupPushups";

interface CameraPosePanelProps {
  exerciseId: string;
  onCountChange: (n: number) => void;
  onStageChange: (s: string) => void;
}

export default function CameraPosePanel({
  exerciseId,
  onCountChange,
  onStageChange,
}: CameraPosePanelProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUserMedia = () => {
    const video = webcamRef.current?.video as HTMLVideoElement;
    if (!video) return;

    video.onloadedmetadata = () => {
      if (!canvasRef.current) return;

      const videoRefObj = { current: video };

      // 🔥 SWITCH BETWEEN EXERCISES
      switch (exerciseId) {
        case "bicep-curl":
          setupBicepCurl(videoRefObj, canvasRef, onCountChange, onStageChange);
          break;

        case "squats":
          setupSquats(videoRefObj, canvasRef, onCountChange, onStageChange);
          break;

        case "shoulder-press":
          setupShoulderPress?.(videoRefObj, canvasRef, onCountChange, onStageChange);
          break;

        default:
          console.error("Unknown exercise:", exerciseId);
      }
    };
  };

  return (
    <div className="relative w-full max-w-[640px] mx-auto">
      <Webcam
        ref={webcamRef}
        onUserMedia={handleUserMedia}
        className="rounded-xl overflow-hidden"
        videoConstraints={{ facingMode: "user" }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
