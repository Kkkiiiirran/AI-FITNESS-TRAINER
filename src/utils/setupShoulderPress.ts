import { calculateAngle } from "./calculateAngle";

export function setupShoulderPress(
  webcamRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setCounter: (n: number) => void,
  setStage: (s: string) => void
) {
  let stage: "up" | "down" = "down";
  let counter = 0;

  // ✅ Global MediaPipe Pose
  const pose = new (window as any).Pose({
    locateFile: (file: string) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  pose.onResults((results: any) => {
    if (!canvasRef.current || !webcamRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = webcamRef.current;

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      // ✅ Draw skeleton (global drawing utils)
      (window as any).drawConnectors(
        ctx,
        results.poseLandmarks,
        (window as any).POSE_CONNECTIONS,
        { color: "white", lineWidth: 3 }
      );

      (window as any).drawLandmarks(ctx, results.poseLandmarks, {
        color: "red",
        lineWidth: 2,
      });

      // Left arm
      const leftShoulder = results.poseLandmarks[11];
      const leftElbow = results.poseLandmarks[13];
      const leftWrist = results.poseLandmarks[15];

      // Right arm
      const rightShoulder = results.poseLandmarks[12];
      const rightElbow = results.poseLandmarks[14];
      const rightWrist = results.poseLandmarks[16];

      // Shoulder press logic (arms above shoulders)
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

      // Angles (optional debug)
      const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

      ctx.fillStyle = "white";
      ctx.font = "18px Arial";
      ctx.fillText(`Left Angle: ${Math.round(leftAngle)}`, 10, 20);
      ctx.fillText(`Right Angle: ${Math.round(rightAngle)}`, 10, 40);
    }

    ctx.restore();
  });

  // ✅ Global Camera
  if (webcamRef.current) {
    const camera = new (window as any).Camera(webcamRef.current, {
      onFrame: async () => {
        await pose.send({ image: webcamRef.current! });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }
}
