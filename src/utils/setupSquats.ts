import { calculateAngle } from "./calculateAngle";

export function setupSquats(
  webcamRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setCounter: (n: number) => void,
  setStage: (s: string) => void
) {
  let stage: "up" | "down" = "up";
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
      // ✅ Draw pose skeleton
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

      // Hip–knee–ankle (left leg)
      const hip = results.poseLandmarks[23];
      const knee = results.poseLandmarks[25];
      const ankle = results.poseLandmarks[27];

      const angle = calculateAngle(
        { x: hip.x, y: hip.y },
        { x: knee.x, y: knee.y },
        { x: ankle.x, y: ankle.y }
      );

      // ✅ Squat logic
      if (angle > 160) {
        stage = "up";
        setStage("Up");
      }

      if (angle < 90 && stage === "up") {
        stage = "down";
        counter += 1;
        setCounter(counter);
        setStage("Down");
      }

      // Angle display
      ctx.fillStyle = "yellow";
      ctx.font = "24px Arial";
      ctx.fillText(
        `Angle: ${Math.round(angle)}`,
        knee.x * video.videoWidth,
        knee.y * video.videoHeight
      );
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
