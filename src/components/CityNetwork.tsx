import { useEffect, useRef } from 'react';

const CityNetwork = () => {
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

      // City infrastructure nodes
      const infrastructureNodes = [
        { x: 100, y: 80, type: 'traffic', size: 15, connections: [1, 2, 4] },
        { x: 200, y: 60, type: 'energy', size: 12, connections: [2, 3] },
        { x: 300, y: 90, type: 'emergency', size: 14, connections: [3, 5] },
        { x: 120, y: 180, type: 'pollution', size: 10, connections: [4, 5] },
        { x: 220, y: 200, type: 'transport', size: 13, connections: [0, 5] },
        { x: 320, y: 170, type: 'security', size: 11, connections: [2, 4] }
      ];

      // Draw connections between nodes
      infrastructureNodes.forEach((node, index) => {
        node.connections.forEach(targetIndex => {
          if (targetIndex < infrastructureNodes.length) {
            const target = infrastructureNodes[targetIndex];
            const pulse = 0.4 + 0.3 * Math.sin(time * 0.02 + index + targetIndex);
            
            ctx.strokeStyle = `rgba(0, 212, 255, ${pulse})`;
            ctx.lineWidth = 2;
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 5;
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      // Draw infrastructure nodes
      infrastructureNodes.forEach((node, index) => {
        const pulse = 1 + 0.3 * Math.sin(time * 0.025 + index);
        const glowIntensity = 0.5 + 0.3 * Math.sin(time * 0.03 + index);
        
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 15 * glowIntensity;
        
        // Node colors based on type
        const colors = {
          traffic: '#ff6b6b',
          energy: '#4ecdc4', 
          emergency: '#ff7675',
          pollution: '#fd79a8',
          transport: '#6c5ce7',
          security: '#00d4ff'
        };
        
        ctx.fillStyle = `rgba(0, 212, 255, 0.2)`;
        ctx.strokeStyle = colors[node.type as keyof typeof colors] || '#00d4ff';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // IoT sensors (small dots)
      const sensors = Array.from({ length: 25 }, (_, i) => ({
        x: 50 + (i % 5) * 75,
        y: 120 + Math.floor(i / 5) * 40 + Math.sin(i) * 10,
        active: Math.sin(time * 0.02 + i) > 0
      }));

      sensors.forEach((sensor, index) => {
        const opacity = sensor.active ? 0.8 : 0.3;
        const size = sensor.active ? 3 : 2;
        
        ctx.shadowColor = '#0080ff';
        ctx.shadowBlur = sensor.active ? 8 : 2;
        ctx.fillStyle = `rgba(0, 128, 255, ${opacity})`;
        
        ctx.beginPath();
        ctx.arc(sensor.x, sensor.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Data transmission waves
      const waves = [
        { x: 100, y: 80, radius: (time * 2) % 100, opacity: 1 - ((time * 2) % 100) / 100 },
        { x: 220, y: 200, radius: ((time * 2) + 30) % 80, opacity: 1 - (((time * 2) + 30) % 80) / 80 },
        { x: 300, y: 90, radius: ((time * 2) + 60) % 90, opacity: 1 - (((time * 2) + 60) % 90) / 90 }
      ];

      waves.forEach(wave => {
        if (wave.opacity > 0) {
          ctx.strokeStyle = `rgba(0, 212, 255, ${wave.opacity * 0.5})`;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 5;
          
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Status indicators
      const status = [
        { label: 'SENSORS', value: '10,247', x: 70, y: 40 },
        { label: 'TRAFFIC', value: '-34%', x: 200, y: 40 },
        { label: 'ENERGY', value: '-20%', x: 330, y: 40 }
      ];

      status.forEach(item => {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(item.value, item.x, item.y);
        
        ctx.fillStyle = '#a8b2d1';
        ctx.font = '8px Inter';
        ctx.fillText(item.label, item.x, item.y + 12);
      });

      // Title
      ctx.fillStyle = '#a8b2d1';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('SMART CITY NETWORK', 200, 280);

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

export default CityNetwork;