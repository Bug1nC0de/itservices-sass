import { useEffect, useRef } from 'react';

const LiveAudioVisualizer = ({ stream }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    function draw() {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = 'rgba(70, 62, 62, 0.34)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      const barWidth = (WIDTH / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(50, ${barHeight + 50}, ${barHeight + 100})`;
        ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);
        x += barWidth + 1;
      }
    }

    draw();

    return () => {
      source.disconnect();
      analyser.disconnect();
      audioContext.close();
    };
  }, [stream]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={50}
      style={{ width: '100%', height: '50px', borderRadius: 999 }}
    />
  );
};

export default LiveAudioVisualizer;
