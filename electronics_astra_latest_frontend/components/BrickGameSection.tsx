'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { gsap } from 'gsap';
import { Coins } from 'lucide-react';

const BrickGameSection = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const tagsRef = useRef<Matter.Body[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const animationsRef = useRef<gsap.core.Tween[]>([]);

  const tags = [
    { text: 'VLSI', color: '#00e676', category: 'design' },
    { text: 'Verilog', color: '#ffb300', category: 'coding' },
    { text: 'SystemVerilog', color: '#ff4081', category: 'coding' },
    { text: 'HDL', color: '#a020f0', category: 'coding' },
    { text: 'Circuit', color: '#00e676', category: 'design' },
    { text: 'Digital', color: '#ffb300', category: 'electronics' },
    { text: 'Analog', color: '#ff4081', category: 'electronics' },
    { text: 'FPGA', color: '#a020f0', category: 'hardware' },
    { text: 'Embedded', color: '#00e676', category: 'systems' },
    { text: 'IoT', color: '#ffb300', category: 'systems' },
    { text: 'MCU', color: '#ff4081', category: 'hardware' },
    { text: 'Logic', color: '#a020f0', category: 'design' },
    { text: 'Simulation', color: '#00e676', category: 'tools' },
    { text: 'PCB', color: '#ffb300', category: 'hardware' },
    { text: 'AI', color: '#ff4081', category: 'tools' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.2 }
    );

    if (sceneRef.current) {
      observer.observe(sceneRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !canvasRef.current || !sceneRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Events } = Matter;

    // Create engine with gravity
    const engine = Engine.create({
      gravity: { x: 0, y: 0.5 }
    });
    engineRef.current = engine;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
      },
    });
    renderRef.current = render;

    // Create boundaries - GROUND at bottom to stop blocks
    const wallOptions = { isStatic: true, render: { visible: false } };
    const ground = Bodies.rectangle(width / 2, height - 10, width, 20, wallOptions);
    const leftWall = Bodies.rectangle(-10, height / 2, 20, height, wallOptions);
    const rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, wallOptions);

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Create tags with delay - they fall and stack
    const isMobile = width < 768;
    const tagCount = isMobile ? 10 : 15;
    const selectedTags = tags.slice(0, tagCount);
    let spawnIndex = 0;

    const spawnTag = () => {
      if (spawnIndex >= selectedTags.length) return;
      
      const tag = selectedTags[spawnIndex];
      const tagWidth = isMobile ? 80 : 100;
      const tagHeight = isMobile ? 35 : 40;
      const x = Math.random() * (width - tagWidth * 2) + tagWidth;
      const y = -50;

      const tagBody = Bodies.rectangle(x, y, tagWidth, tagHeight, {
        restitution: 0.3,
        friction: 0.8,
        frictionAir: 0.01,
        density: 0.01,
        chamfer: { radius: 5 },
        render: {
          fillStyle: tag.color,
        },
      });

      (tagBody as any).label = tag.text;
      (tagBody as any).color = tag.color;
      (tagBody as any).category = tag.category;
      (tagBody as any).matched = false;
      tagsRef.current.push(tagBody);
      Composite.add(engine.world, tagBody);

      spawnIndex++;
    };

    // Spawn tags at intervals
    const spawnInterval = setInterval(() => {
      spawnTag();
      if (spawnIndex >= selectedTags.length) {
        clearInterval(spawnInterval);
      }
    }, 1500);

    // Check for matching combinations
    const checkMatches = () => {
      const bodies = tagsRef.current.filter(b => !(b as any).matched);
      
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const bodyA = bodies[i];
          const bodyB = bodies[j];
          
          // Check if bodies are close and same category
          const dx = bodyA.position.x - bodyB.position.x;
          const dy = bodyA.position.y - bodyB.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120 && 
              (bodyA as any).category === (bodyB as any).category &&
              !(bodyA as any).matched && 
              !(bodyB as any).matched) {
            
            // Mark as matched
            (bodyA as any).matched = true;
            (bodyB as any).matched = true;
            
            // Award points
            const points = 100;
            setScore(prev => prev + points);
            setCombo(prev => prev + 1);
            
            // Animate and remove
            gsap.to([bodyA.position, bodyB.position], {
              y: '-=50',
              duration: 0.3,
              onComplete: () => {
                Composite.remove(engine.world, bodyA);
                Composite.remove(engine.world, bodyB);
                tagsRef.current = tagsRef.current.filter(b => b !== bodyA && b !== bodyB);
              }
            });
            
            // Show coin animation
            showCoinAnimation(bodyA.position.x, bodyA.position.y);
          }
        }
      }
    };

    // Check matches periodically
    const matchInterval = setInterval(checkMatches, 500);

    const showCoinAnimation = (x: number, y: number) => {
      // This will be handled by React state
    };

    // Custom rendering for tags
    Events.on(render, 'afterRender', () => {
      const context = render.context;
      tagsRef.current.forEach((tag) => {
        if ((tag as any).matched) return;
        
        const { x, y } = tag.position;
        const angle = tag.angle;
        const width = (tag.bounds.max.x - tag.bounds.min.x);
        const height = (tag.bounds.max.y - tag.bounds.min.y);

        context.save();
        context.translate(x, y);
        context.rotate(angle);

        // Draw brick-like rectangle
        const gradient = context.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
        gradient.addColorStop(0, (tag as any).color);
        gradient.addColorStop(1, adjustBrightness((tag as any).color, -30));
        
        context.fillStyle = gradient;
        context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        context.shadowBlur = 8;
        context.shadowOffsetY = 4;

        // Brick shape with slight 3D effect
        context.fillRect(-width / 2, -height / 2, width, height);
        
        // Border
        context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        context.lineWidth = 2;
        context.strokeRect(-width / 2, -height / 2, width, height);

        // Inner highlight for 3D effect
        context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        context.lineWidth = 1;
        context.strokeRect(-width / 2 + 2, -height / 2 + 2, width - 4, height - 4);

        // Draw text
        context.shadowColor = 'rgba(0, 0, 0, 0.8)';
        context.shadowBlur = 3;
        context.fillStyle = '#ffffff';
        context.font = `bold ${isMobile ? '11px' : '13px'} 'Inter', 'Poppins', sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText((tag as any).label, 0, 0);

        context.restore();
      });
    });

    function adjustBrightness(color: string, amount: number): string {
      const hex = color.replace('#', '');
      const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
      const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
      const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    // Run engine
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      const newWidth = sceneRef.current.clientWidth;
      const newHeight = sceneRef.current.clientHeight;

      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      render.options.width = newWidth;
      render.options.height = newHeight;

      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight - 10 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 10, y: newHeight / 2 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(matchInterval);
      window.removeEventListener('resize', handleResize);
      animationsRef.current.forEach(anim => anim.kill());
      animationsRef.current = [];
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [isVisible]);

  return (
    <section className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#003845' }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-[#00999e] rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-3 h-3 bg-[#00e676] rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-[#ffb300] rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-40 right-1/3 w-3 h-3 bg-[#ff4081] rounded-full animate-pulse delay-300"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Brick <span className="text-[#00999e]">Match</span> Game
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6">
            Match blocks of the same <span className="font-semibold text-[#00999e]">category</span> to earn coins!
          </p>
          
          {/* Score Display */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl" style={{
              backgroundColor: 'rgba(0, 153, 158, 0.2)',
              border: '2px solid #00999e'
            }}>
              <Coins className="w-6 h-6 text-[#ffb300]" />
              <span className="text-2xl font-black text-white">{score}</span>
              <span className="text-sm font-semibold text-white/70">Points</span>
            </div>
            
            {combo > 0 && (
              <div className="flex items-center gap-2 px-6 py-3 rounded-2xl animate-pulse" style={{
                backgroundColor: 'rgba(255, 179, 0, 0.2)',
                border: '2px solid #ffb300'
              }}>
                <span className="text-2xl font-black text-[#ffb300]">{combo}x</span>
                <span className="text-sm font-semibold text-white/70">Combo</span>
              </div>
            )}
          </div>
        </div>

        <div
          ref={sceneRef}
          className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#00999e]/30"
          style={{ 
            backgroundColor: 'rgba(0, 153, 158, 0.08)',
            boxShadow: '0 0 60px rgba(0, 153, 158, 0.2)'
          }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />
          
          {/* Grid lines for brick game feel */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(0, 153, 158, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 153, 158, 0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#00999e] rounded-tl-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#00999e] rounded-br-3xl opacity-50"></div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/70 text-base md:text-lg font-medium">
            🎮 Match <span className="text-[#00e676]">same category</span> blocks to earn <span className="text-[#ffb300]">coins</span>! 🎮
          </p>
          <p className="text-white/50 text-sm mt-2">
            Categories: Design • Coding • Electronics • Hardware • Systems • Tools
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.5s;
        }
        .delay-200 {
          animation-delay: 1s;
        }
        .delay-300 {
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
};

export default BrickGameSection;
