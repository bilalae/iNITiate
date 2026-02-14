import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = document.body.scrollHeight;
        
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.body.scrollHeight;
        };

        window.addEventListener('resize', handleResize);
        
        const particles: Particle[] = [];
        const particleCount = 50;

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = Math.random() * 0.4 - 0.2;
                this.vy = Math.random() * 0.4 - 0.2;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx!.fillStyle = 'rgba(0, 255, 255, 0.3)';
                ctx!.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dist = Math.sqrt(
                        (particles[i].x - particles[j].x) ** 2 +
                        (particles[i].y - particles[j].y) ** 2
                    );

                    if (dist < 150) {
                        ctx!.beginPath();
                        ctx!.moveTo(particles[i].x, particles[i].y);
                        ctx!.lineTo(particles[j].x, particles[j].y);
                        ctx!.strokeStyle = `rgba(0, 255, 255, ${1 - dist / 150})`;
                        ctx!.lineWidth = 0.5;
                        ctx!.stroke();
                    }
                }
            }
        };
        
        let animationFrameId: number;
        const animate = () => {
            ctx!.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();

        const resizeObserver = new ResizeObserver(() => {
            height = canvas.height = document.body.scrollHeight;
        });
        resizeObserver.observe(document.body);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full z-0"
        ></canvas>
    );
};

export default AnimatedBackground;
