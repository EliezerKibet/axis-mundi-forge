import { useEffect, useRef } from 'react';

const QuantumCircuit = () => {
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

      // Quantum gates (blue squares)
      const gates = [
        { x: 80, y: 120, label: 'H' },
        { x: 160, y: 80, label: 'N' },
        { x: 240, y: 160, label: 'X' },
        { x: 320, y: 100, label: 'Z' }
      ];

      gates.forEach(gate => {
        // Gate glow effect
        const glowIntensity = 0.3 + 0.2 * Math.sin(time * 0.02 + gate.x * 0.01);
        ctx.shadowColor = '#0080ff';
        ctx.shadowBlur = 15 * glowIntensity;
        
        ctx.fillStyle = 'rgba(0, 128, 255, 0.1)';
        ctx.strokeStyle = '#0080ff';
        ctx.lineWidth = 2;
        
        ctx.fillRect(gate.x - 15, gate.y - 15, 30, 30);
        ctx.strokeRect(gate.x - 15, gate.y - 15, 30, 30);
        
        // Gate labels
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(gate.label, gate.x, gate.y + 5);
      });

      // Quantum state nodes (circles)
      const nodes = [
        { x: 200, y: 150, size: 20, isPrimary: true },
        { x: 120, y: 60, size: 8, isPrimary: false },
        { x: 280, y: 220, size: 8, isPrimary: false },
        { x: 340, y: 50, size: 8, isPrimary: false }
      ];

      nodes.forEach(node => {
        const pulse = 1 + 0.3 * Math.sin(time * 0.03);
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;
        
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = node.isPrimary ? 3 : 2;
        ctx.fillStyle = node.isPrimary ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 212, 255, 0.1)';
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Connection lines with pulse animation
      const connections = [
        { from: gates[0], to: nodes[1] },
        { from: gates[1], to: nodes[0] },
        { from: nodes[0], to: gates[2] },
        { from: gates[2], to: nodes[2] },
        { from: gates[3], to: nodes[3] }
      ];

      connections.forEach((conn, index) => {
        const pulseOffset = time * 0.05 + index * 0.8;
        const opacity = 0.6 + 0.4 * Math.sin(pulseOffset);
        
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 5;
        ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.stroke();
      });

      // Quantum dots (particles)
      const dots = [
        { x: 50, y: 200 }, { x: 150, y: 250 }, { x: 300, y: 40 },
        { x: 370, y: 180 }, { x: 30, y: 80 }, { x: 250, y: 30 }
      ];

      dots.forEach((dot, index) => {
        const float = 5 * Math.sin(time * 0.02 + index);
        const opacity = 0.4 + 0.3 * Math.sin(time * 0.03 + index * 0.5);
        
        ctx.shadowBlur = 8;
        ctx.fillStyle = `rgba(0, 128, 255, ${opacity})`;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y + float, 3 + index % 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Title
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#a8b2d1';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('QUANTUM CIRCUITS', 200, 280);

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

export default QuantumCircuit;