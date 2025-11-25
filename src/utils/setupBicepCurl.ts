import { Pose, POSE_CONNECTIONS, Results } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import * as draw from "@mediapipe/drawing_utils";
import { calculateAngle } from "./calculateAngle";

export function setupBicepCurl(
  webcamRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setCounter: (n: number) => void,
  setStage: (s: string) => void
) {
  let stage: "up" | "down" = "down";
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

      // LEFT ARM landmarks
      const shoulder = results.poseLandmarks[11];
      const elbow = results.poseLandmarks[13];
      const wrist = results.poseLandmarks[15];

      const angle = calculateAngle(
        { x: shoulder.x, y: shoulder.y },
        { x: elbow.x, y: elbow.y },
        { x: wrist.x, y: wrist.y }
      );

      // Count Logic
      if (angle > 160) {
        stage = "down";
        setStage("Down");
      }
      if (angle < 40 && stage === "down") {
        stage = "up";
        counter += 1;
        setCounter(counter);
        setStage("Up");
      }
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
