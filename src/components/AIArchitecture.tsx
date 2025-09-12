import { useEffect, useRef } from 'react';

const AIArchitecture = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, '#1a1f3a');
    gradient.addColorStop(1, '#0a0e27');
    
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 300);

      // Neural network layers
      const layers = [
        { x: 80, y: 150, nodes: 4, label: 'INPUT' },
        { x: 160, y: 150, nodes: 6, label: 'HIDDEN' },
        { x: 240, y: 150, nodes: 6, label: 'HIDDEN' },
        { x: 320, y: 150, nodes: 3, label: 'OUTPUT' }
      ];

      // Draw connections between layers
      layers.forEach((layer, layerIndex) => {
        if (layerIndex < layers.length - 1) {
          const nextLayer = layers[layerIndex + 1];
          const pulse = 0.3 + 0.2 * Math.sin(time * 0.03 + layerIndex);
          
          ctx.strokeStyle = `rgba(0, 128, 255, ${pulse})`;
          ctx.lineWidth = 1;
          ctx.shadowColor = '#0080ff';
          ctx.shadowBlur = 3;

          for (let i = 0; i < layer.nodes; i++) {
            for (let j = 0; j < nextLayer.nodes; j++) {
              const y1 = layer.y - (layer.nodes - 1) * 15 + i * 30;
              const y2 = nextLayer.y - (nextLayer.nodes - 1) * 15 + j * 30;
              
              ctx.beginPath();
              ctx.moveTo(layer.x + 15, y1);
              ctx.lineTo(nextLayer.x - 15, y2);
              ctx.stroke();
            }
          }
        }
      });

      // Draw neural network nodes
      layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.nodes; i++) {
          const y = layer.y - (layer.nodes - 1) * 15 + i * 30;
          const activation = 0.5 + 0.3 * Math.sin(time * 0.02 + layerIndex + i);
          
          ctx.shadowColor = '#00d4ff';
          ctx.shadowBlur = 8 * activation;
          
          ctx.fillStyle = `rgba(0, 212, 255, ${0.2 + activation * 0.3})`;
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = 2;
          
          ctx.beginPath();
          ctx.arc(layer.x, y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        
        // Layer labels
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#a8b2d1';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(layer.label, layer.x, layer.y + 60);
      });

      // Data flow particles
      const particles = [
        { x: 50, y: 120, targetX: 350, targetY: 180, speed: 0.005 },
        { x: 50, y: 150, targetX: 350, targetY: 150, speed: 0.007 },
        { x: 50, y: 180, targetX: 350, targetY: 120, speed: 0.006 }
      ];

      particles.forEach((particle, index) => {
        const progress = (Math.sin(time * particle.speed + index) + 1) / 2;
        const x = particle.x + (particle.targetX - particle.x) * progress;
        const y = particle.y + (particle.targetY - particle.y) * progress;
        
        ctx.shadowColor = '#0080ff';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(0, 128, 255, 0.8)';
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Performance metrics display
      const metrics = [
        { label: 'ACCURACY', value: '94.7%', x: 50, y: 50 },
        { label: 'LATENCY', value: '<50ms', x: 200, y: 50 },
        { label: 'THROUGHPUT', value: '10K/s', x: 350, y: 50 }
      ];

      metrics.forEach(metric => {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0080ff';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(metric.value, metric.x, metric.y);
        
        ctx.fillStyle = '#a8b2d1';
        ctx.font = '8px Inter';
        ctx.fillText(metric.label, metric.x, metric.y + 15);
      });

      // Title
      ctx.fillStyle = '#a8b2d1';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('AI NEURAL ARCHITECTURE', 200, 280);

      time++;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef}
        className="w-full h-auto max-w-[400px] border border-primary/20 bg-gradient-to-br from-card to-background"
        style={{ aspectRatio: '4/3' }}
      />
    </div>
  );
};

export default AIArchitecture;