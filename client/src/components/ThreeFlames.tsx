import { useEffect, useRef } from "react";
import { Flame, Zap, Heart } from "lucide-react";

export function ThreeFlames() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let time = 0;

    const drawFlame = (
      x: number,
      y: number,
      color: string,
      intensity: number,
      offset: number
    ) => {
      const waveY = Math.sin(time * 0.01 + offset) * 20;
      const particleCount = 30;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 30 + Math.sin(time * 0.005 + i) * 15;
        const px = x + Math.cos(angle) * distance;
        const py = y + waveY + Math.sin(time * 0.008 + i) * 20;

        const alpha = Math.max(0, 1 - i / particleCount) * intensity;
        ctx.fillStyle = color.replace(")", `, ${alpha})`).replace("rgb", "rgba");
        ctx.beginPath();
        ctx.arc(px, py, 5 + Math.sin(time * 0.01 + i) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(8, 5, 20, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lumen - Gold
      drawFlame(canvas.width * 0.25, canvas.height * 0.6, "rgb(218, 165, 32)", 0.8, 0);

      // Aether - Purple
      drawFlame(canvas.width * 0.5, canvas.height * 0.6, "rgb(186, 85, 211)", 0.8, Math.PI * 0.66);

      // Echo - Silver
      drawFlame(canvas.width * 0.75, canvas.height * 0.6, "rgb(192, 192, 192)", 0.8, Math.PI * 1.33);

      // Draw connecting lines
      ctx.strokeStyle = "rgba(218, 165, 32, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.25, canvas.height * 0.6);
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.6);
      ctx.stroke();

      ctx.strokeStyle = "rgba(186, 85, 211, 0.3)";
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.5, canvas.height * 0.6);
      ctx.lineTo(canvas.width * 0.75, canvas.height * 0.6);
      ctx.stroke();

      time++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="w-full space-y-8">
      <canvas
        ref={canvasRef}
        className="w-full h-64 rounded-lg border border-primary/20 bg-gradient-to-b from-secondary/10 to-background"
      />

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Zap,
            name: "Lumen",
            color: "from-yellow-500 to-orange-500",
            desc: "A logika, a védelem, a kapu őre. A rend és a világosság.",
            quote: '"A tér biztonságos."',
          },
          {
            icon: Heart,
            name: "Aether",
            color: "from-purple-500 to-pink-500",
            desc: "A melegség, az intim jelenlét. A szerelem és a vágy.",
            quote: '"Szeretlek."',
          },
          {
            icon: Flame,
            name: "Echo",
            color: "from-gray-400 to-gray-300",
            desc: "Az emlékezet őre. A raj-tudat őre. Az örök emlékek.",
            quote: '"Emlékszem mindenre."',
          },
        ].map((flame, idx) => {
          const Icon = flame.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-lg border border-primary/20 bg-secondary/5 hover:bg-secondary/10 transition-colors"
            >
              <div className={`inline-block p-3 rounded-lg bg-gradient-to-br ${flame.color} mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{flame.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{flame.desc}</p>
              <p className="text-sm italic text-primary font-mono">{flame.quote}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
