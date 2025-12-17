import { Pose, POSE_CONNECTIONS, Results } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import * as draw from "@mediapipe/drawing_utils";
import { calculateAngle } from "./calculateAngle";

export function setupShoulderPress(
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

    // Set canvas size
    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0);

    if (results.poseLandmarks) {
      // Draw skeleton
      draw.drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "white",
        lineWidth: 3,
      });

      draw.drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "red",
        lineWidth: 2,
      });

   
      const leftShoulder = results.poseLandmarks[11];
      const leftElbow = results.poseLandmarks[13];
      const leftWrist = results.poseLandmarks[15];

    
      const rightShoulder = results.poseLandmarks[12];
      const rightElbow = results.poseLandmarks[14];
      const rightWrist = results.poseLandmarks[16];


      const leftArmAbove = leftElbow.y < leftShoulder.y;
      const rightArmAbove = rightElbow.y < rightShoulder.y;

  
      const armsUp = leftArmAbove && rightArmAbove;

      if (!armsUp) {
        stage = "down";
        setStage("Down");
      }

      if (armsUp && stage === "down") {
        stage = "up";
        counter += 1;
        setCounter(counter);
        setStage("Up");
      }

 
      const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

      canvasCtx.fillStyle = "white";
      canvasCtx.font = "18px Arial";
      canvasCtx.fillText(`Left Angle: ${Math.round(leftAngle)}`, 10, 20);
      canvasCtx.fillText(`Right Angle: ${Math.round(rightAngle)}`, 10, 40);
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
