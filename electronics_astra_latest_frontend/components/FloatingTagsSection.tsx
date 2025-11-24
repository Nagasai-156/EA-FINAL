'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { gsap } from 'gsap';

const FloatingTagsSection = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const tagsRef = useRef<Matter.Body[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);
  const animationsRef = useRef<gsap.core.Tween[]>([]);

  const tags = [
    { text: 'VLSI Design', color: '#00e676' },
    { text: 'Verilog Coding', color: '#ffb300' },
    { text: 'SystemVerilog', color: '#ff4081' },
    { text: 'HDL Simulation', color: '#a020f0' },
    { text: 'Circuit Design', color: '#00e676' },
    { text: 'Digital Electronics', color: '#ffb300' },
    { text: 'Analog Design', color: '#ff4081' },
    { text: 'FPGA Projects', color: '#a020f0' },
    { text: 'Embedded Systems', color: '#00e676' },
    { text: 'IoT Development', color: '#ffb300' },
    { text: 'Microcontrollers', color: '#ff4081' },
    { text: 'Problem Solving', color: '#a020f0' },
    { text: 'Logic Building', color: '#00e676' },
    { text: 'Live Simulation', color: '#ffb300' },
    { text: 'AI in Electronics', color: '#ff4081' },
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

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    // Create engine with realistic gravity
    const engine = Engine.create({
      gravity: { x: 0, y: 0.8 }
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

    // Create boundaries
    const wallOptions = { isStatic: true, render: { visible: false } };
    const ground = Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, wallOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions);

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Create tags with delay
    const isMobile = width < 768;
    const tagCount = isMobile ? 10 : 15;
    const selectedTags = tags.slice(0, tagCount);

    selectedTags.forEach((tag, index) => {
      setTimeout(() => {
        const tagWidth = isMobile ? 100 : 140;
        const tagHeight = isMobile ? 35 : 45;
        const x = Math.random() * (width - tagWidth) + tagWidth / 2;
        const y = -100 - index * 50;

        const tagBody = Bodies.rectangle(x, y, tagWidth, tagHeight, {
          restitution: 0.7, // More bounce
          friction: 0.03,
          frictionAir: 0.01,
          density: 0.002,
          chamfer: { radius: 8 },
          render: {
            fillStyle: tag.color,
          },
        });

        (tagBody as any).label = tag.text;
        (tagBody as any).color = tag.color;
        (tagBody as any).initialY = y;
        tagsRef.current.push(tagBody);
        Composite.add(engine.world, tagBody);

        // Entrance animation with GSAP
        gsap.from(tagBody, {
          alpha: 0,
          duration: 0.5,
          ease: 'power2.out',
        });

        // Add subtle floating animation after settling
        setTimeout(() => {
          const floatAnim = gsap.to(tagBody.position, {
            y: `+=${Math.random() * 8 + 4}`,
            duration: 2.5 + Math.random() * 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            onUpdate: () => {
              Matter.Body.setPosition(tagBody, {
                x: tagBody.position.x,
                y: tagBody.position.y
              });
            }
          });
          animationsRef.current.push(floatAnim);
        }, 4000 + index * 200);
      }, index * 150);
    });

    // Mouse interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    // Mouse move effect - tags react to nearby cursor
    Events.on(mouseConstraint, 'mousemove', (event: any) => {
      const mousePosition = event.mouse.position;
      tagsRef.current.forEach((tag) => {
        const dx = tag.position.x - mousePosition.x;
        const dy = tag.position.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const force = 0.0005 * (1 - distance / 120);
          Matter.Body.applyForce(tag, tag.position, {
            x: (dx / distance) * force,
            y: (dy / distance) * force,
          });
        }
      });
    });

    // Add hover scale effect
    let hoveredTag: Matter.Body | null = null;
    Events.on(mouseConstraint, 'mousemove', (event: any) => {
      const mousePosition = event.mouse.position;
      let newHoveredTag: Matter.Body | null = null;

      tagsRef.current.forEach((tag) => {
        const dx = tag.position.x - mousePosition.x;
        const dy = tag.position.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const width = (tag.bounds.max.x - tag.bounds.min.x) / 2;
        const height = (tag.bounds.max.y - tag.bounds.min.y) / 2;

        if (Math.abs(dx) < width && Math.abs(dy) < height) {
          newHoveredTag = tag;
        }
      });

      if (newHoveredTag !== hoveredTag) {
        if (hoveredTag) {
          (hoveredTag as any).hovered = false;
        }
        if (newHoveredTag) {
          (newHoveredTag as any).hovered = true;
        }
        hoveredTag = newHoveredTag;
      }
    });

    // Custom rendering for tags with enhanced visuals
    Events.on(render, 'afterRender', () => {
      const context = render.context;
      tagsRef.current.forEach((tag) => {
        const { x, y } = tag.position;
        const angle = tag.angle;
        const width = (tag.bounds.max.x - tag.bounds.min.x);
        const height = (tag.bounds.max.y - tag.bounds.min.y);
        const isHovered = (tag as any).hovered;

        context.save();
        context.translate(x, y);
        context.rotate(angle);

        // Scale effect on hover
        const scale = isHovered ? 1.1 : 1;
        context.scale(scale, scale);

        // Draw rounded rectangle with gradient
        const radius = 10;
        const gradient = context.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
        gradient.addColorStop(0, (tag as any).color);
        gradient.addColorStop(1, adjustBrightness((tag as any).color, -20));
        
        context.fillStyle = gradient;
        context.shadowColor = 'rgba(0, 0, 0, 0.4)';
        context.shadowBlur = isHovered ? 20 : 12;
        context.shadowOffsetY = isHovered ? 6 : 4;

        context.beginPath();
        context.roundRect(-width / 2, -height / 2, width, height, radius);
        context.fill();

        // Add subtle border glow
        context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        context.lineWidth = 2;
        context.stroke();

        // Draw text with better styling
        context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        context.shadowBlur = 4;
        context.shadowOffsetY = 1;
        context.fillStyle = '#ffffff';
        context.font = `bold ${isMobile ? '12px' : '15px'} 'Inter', 'Poppins', sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText((tag as any).label, 0, 0);

        context.restore();
      });
    });

    // Helper function to adjust color brightness
    function adjustBrightness(color: string, amount: number): string {
      const hex = color.replace('#', '');
      const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
      const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
      const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
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

      // Update boundaries
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 25 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 25, y: newHeight / 2 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
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
    <section className="relative w-full py-20 overflow-hidden bg-primary-700 transition-colors">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-[#00999e] rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-3 h-3 bg-[#00e676] rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-[#ffb300] rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-40 right-1/3 w-3 h-3 bg-[#ff4081] rounded-full animate-pulse delay-300"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Our <span className="text-[#00999e]">Expertise</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Explore the technologies and skills that power <span className="font-semibold text-[#00999e]">Electronics Astra</span>
          </p>
        </div>

        <div
          ref={sceneRef}
          className="relative w-full h-[500px] md:h-[650px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#00999e]/30"
          style={{ 
            backgroundColor: 'rgba(0, 153, 158, 0.08)',
            boxShadow: '0 0 60px rgba(0, 153, 158, 0.2)'
          }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />
          
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#00999e] rounded-tl-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#00999e] rounded-br-3xl opacity-50"></div>
        </div>

        <div className="text-center mt-10">
          <p className="text-white/70 text-base md:text-lg font-medium">
            ✨ <span className="text-[#00999e]">Drag</span>, <span className="text-[#00e676]">hover</span>, and <span className="text-[#ffb300]">interact</span> with the tags above! ✨
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

export default FloatingTagsSection;
