import { Pose, POSE_CONNECTIONS, Results } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import * as draw from "@mediapipe/drawing_utils";
import { calculateAngle } from "./calculateAngle";

export function setupSquats(
  webcamRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setCounter: (n: number) => void,
  setStage: (s: string) => void
) {
  let stage: "up" | "down" = "up";
  let counter = 0;

  const pose = new Pose({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  pose.onResults((results: Results) => {
    if (!canvasRef.current) return;

    const canvasCtx = canvasRef.current.getContext("2d");
    const video = webcamRef.current;

    if (!canvasCtx || !video) return;

    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0);

    if (results.poseLandmarks) {
      draw.drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "white",
        lineWidth: 3,
      });

      draw.drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "red",
        lineWidth: 2,
      });

      // LOWER BODY landmarks for squats
      const hip = results.poseLandmarks[23];    // left hip
      const knee = results.poseLandmarks[25];   // left knee
      const ankle = results.poseLandmarks[27];  // left ankle

      const angle = calculateAngle(
        { x: hip.x, y: hip.y },
        { x: knee.x, y: knee.y },
        { x: ankle.x, y: ankle.y }
      );

      // --- Squat logic ---
      // Standing straight
      if (angle > 160) {
        stage = "up";
        setStage("Up");
      }

      // Squat position
      if (angle < 90 && stage === "up") {
        stage = "down";
        counter += 1;
        setCounter(counter);
        setStage("Down");
      }

      // (Optional) visualize angle
      canvasCtx.fillStyle = "yellow";
      canvasCtx.font = "24px Arial";
      canvasCtx.fillText(`Angle: ${Math.round(angle)}`, knee.x * video.videoWidth, knee.y * video.videoHeight);
    }

    canvasCtx.restore();
  });

  if (webcamRef.current) {
    const camera = new Camera(webcamRef.current, {
      onFrame: async () => {
        await pose.send({ image: webcamRef.current! });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }
}
