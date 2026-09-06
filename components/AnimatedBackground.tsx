import React, {
  useEffect,
  useRef,
} from "react";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/* =========================================================
   TYPES
========================================================= */

interface DustParticle {
  x: number;
  y: number;

  vx: number;
  vy: number;

  radius: number;
  alpha: number;

  phase: number;
  phaseSpeed: number;

  maroon: boolean;
}

/* =========================================================
   ANIMATED BACKGROUND
========================================================= */

const AnimatedBackground: React.FC = () => {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  /* =======================================================
     POINTER
  ======================================================== */

  const pointerX =
    useMotionValue(0);

  const pointerY =
    useMotionValue(0);

  const smoothPointerX =
    useSpring(pointerX, {
      stiffness: 70,
      damping: 28,
      mass: 0.75,
    });

  const smoothPointerY =
    useSpring(pointerY, {
      stiffness: 70,
      damping: 28,
      mass: 0.75,
    });

  const pointerField =
    useMotionTemplate`
      radial-gradient(
        520px circle at ${smoothPointerX}px ${smoothPointerY}px,
        rgba(255,255,255,0.03),
        rgba(153,27,27,0.045) 25%,
        rgba(127,29,29,0.018) 48%,
        transparent 72%
      )
    `;

  /* =======================================================
     HERO SCROLL STATE
  ======================================================== */

  const heroProgress =
    useMotionValue(0);

  const smoothHeroProgress =
    useSpring(
      heroProgress,
      {
        stiffness: 60,
        damping: 26,
        mass: 0.8,
      }
    );

  /*
   * The Hero material fades gradually as the user leaves
   * the first viewport.
   *
   * It is not tied to the Hero DOM boundary.
   */

  const heroOpacity =
    useTransform(
      smoothHeroProgress,
      [
        0,
        0.25,
        0.65,
        1.05,
      ],
      [
        1,
        1,
        0.55,
        0,
      ]
    );

  const heroLensY =
    useTransform(
      smoothHeroProgress,
      [
        0,
        1,
      ],
      [
        0,
        -70,
      ]
    );

  const heroLensScale =
    useTransform(
      smoothHeroProgress,
      [
        0,
        1,
      ],
      [
        1,
        1.08,
      ]
    );

  /* =======================================================
     POINTER + SCROLL EVENTS
  ======================================================== */

  useEffect(() => {
    const updatePointer = (
      event: PointerEvent
    ) => {
      if (
        event.pointerType ===
        "touch"
      ) {
        return;
      }

      pointerX.set(
        event.clientX
      );

      pointerY.set(
        event.clientY
      );
    };

    const updateScroll =
      () => {
        heroProgress.set(
          window.scrollY /
            Math.max(
              window.innerHeight,
              1
            )
        );
      };

    const initialize =
      () => {
        if (
          pointerX.get() ===
            0 &&
          pointerY.get() ===
            0
        ) {
          pointerX.set(
            window.innerWidth *
              0.62
          );

          pointerY.set(
            window.innerHeight *
              0.38
          );
        }

        updateScroll();
      };

    initialize();

    window.addEventListener(
      "pointermove",
      updatePointer,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "scroll",
      updateScroll,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      initialize
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        updatePointer
      );

      window.removeEventListener(
        "scroll",
        updateScroll
      );

      window.removeEventListener(
        "resize",
        initialize
      );
    };
  }, [
    heroProgress,
    pointerX,
    pointerY,
  ]);

  /* =======================================================
     DUST CANVAS
  ======================================================== */

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx =
      canvas.getContext(
        "2d"
      );

    if (!ctx) {
      return;
    }

    const mobileQuery =
      window.matchMedia(
        "(max-width: 767px)"
      );

    const reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    let width =
      window.innerWidth;

    let height =
      window.innerHeight;

    let dpr =
      Math.min(
        window.devicePixelRatio ||
          1,
        1.75
      );

    let animationFrame = 0;

    let particles:
      DustParticle[] = [];

    const random = (
      min: number,
      max: number
    ) =>
      min +
      Math.random() *
        (max - min);

    /* =====================================================
       PARTICLES
    ====================================================== */

    const buildParticles =
      () => {
        particles = [];

        const count =
          mobileQuery.matches
            ? 26
            : 36;

        for (
          let index = 0;
          index < count;
          index++
        ) {
          const maroon =
            Math.random() <
            0.42;

          particles.push({
            x:
              Math.random() *
              width,

            y:
              Math.random() *
              height,

            vx:
              random(
                -0.028,
                0.028
              ),

            vy:
              random(
                -0.02,
                0.02
              ),

            radius:
              random(
                0.4,
                1.2
              ),

            alpha:
              maroon
                ? random(
                    0.07,
                    0.17
                  )
                : random(
                    0.035,
                    0.09
                  ),

            phase:
              Math.random() *
              Math.PI *
              2,

            phaseSpeed:
              random(
                0.0025,
                0.007
              ),

            maroon,
          });
        }
      };

    /* =====================================================
       RESIZE
    ====================================================== */

    const resize =
      () => {
        width =
          window.innerWidth;

        height =
          window.innerHeight;

        dpr =
          Math.min(
            window.devicePixelRatio ||
              1,
            1.75
          );

        canvas.width =
          Math.round(
            width * dpr
          );

        canvas.height =
          Math.round(
            height * dpr
          );

        canvas.style.width =
          `${width}px`;

        canvas.style.height =
          `${height}px`;

        ctx.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0
        );

        buildParticles();
      };

    /* =====================================================
       DRAW PARTICLE
    ====================================================== */

    const drawParticle = (
      particle:
        DustParticle,
      time: number
    ) => {
      if (
        !reducedMotionQuery.matches
      ) {
        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;

        particle.phase +=
          particle.phaseSpeed;

        if (
          particle.x <
          -5
        ) {
          particle.x =
            width + 5;
        }

        if (
          particle.x >
          width + 5
        ) {
          particle.x =
            -5;
        }

        if (
          particle.y <
          -5
        ) {
          particle.y =
            height + 5;
        }

        if (
          particle.y >
          height + 5
        ) {
          particle.y =
            -5;
        }
      }

      const pulse =
        0.7 +
        Math.sin(
          particle.phase +
            time *
              0.00045
        ) *
          0.3;

      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        particle.maroon
          ? `rgba(185,28,28,${
              particle.alpha *
              pulse
            })`
          : `rgba(255,255,255,${
              particle.alpha *
              pulse
            })`;

      ctx.fill();
    };

    /* =====================================================
       LOOP
    ====================================================== */

    const animate = (
      time = 0
    ) => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      particles.forEach(
        (
          particle
        ) => {
          drawParticle(
            particle,
            time
          );
        }
      );

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    resize();
    animate();

    window.addEventListener(
      "resize",
      resize
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        inset-0
        z-0
        overflow-hidden
        bg-[#07090d]
      "
    >
      {/* ===================================================
          GLOBAL MAROON FIELD — TOP RIGHT
      ==================================================== */}

      <motion.div
        animate={{
          x: [
            "0%",
            "-3%",
            "2%",
            "0%",
          ],

          y: [
            "0%",
            "4%",
            "-2%",
            "0%",
          ],

          scale: [
            1,
            1.05,
            0.98,
            1,
          ],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              rgba(153,27,27,0.15) 0%,
              rgba(127,29,29,0.075) 34%,
              rgba(69,10,10,0.025) 58%,
              transparent 76%
            )
          `,
        }}
        className="
          absolute
          -right-[28vw]
          -top-[18vh]
          h-[82vw]
          w-[82vw]
          min-h-[700px]
          min-w-[700px]
          max-h-[1150px]
          max-w-[1150px]
          rounded-full
          blur-[115px]
        "
      />

      {/* ===================================================
          GLOBAL MAROON FIELD — LOWER LEFT
      ==================================================== */}

      <motion.div
        animate={{
          x: [
            "0%",
            "4%",
            "-3%",
            "0%",
          ],

          y: [
            "0%",
            "-3%",
            "4%",
            "0%",
          ],

          scale: [
            1,
            0.97,
            1.05,
            1,
          ],
        }}
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              rgba(127,29,29,0.105) 0%,
              rgba(69,10,10,0.055) 40%,
              transparent 74%
            )
          `,
        }}
        className="
          absolute
          -bottom-[38vh]
          -left-[28vw]
          h-[80vw]
          w-[80vw]
          min-h-[680px]
          min-w-[680px]
          max-h-[1100px]
          max-w-[1100px]
          rounded-full
          blur-[125px]
        "
      />

      {/* ===================================================
          MOBILE HERO MATERIAL

          Integrated into the global background itself.
      ==================================================== */}

      <motion.div
        style={{
          opacity:
            heroOpacity,

          y:
            heroLensY,

          scale:
            heroLensScale,
        }}
        className="
          absolute
          inset-0
          origin-center
          lg:hidden
        "
      >
        {/* ===============================================
            UPPER MAROON ATMOSPHERE
        ================================================ */}

        <motion.div
          animate={{
            x: [
              0,
              16,
              -10,
              0,
            ],

            y: [
              0,
              -10,
              8,
              0,
            ],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                rgba(153,27,27,0.15) 0%,
                rgba(127,29,29,0.07) 38%,
                transparent 76%
              )
            `,
          }}
          className="
            absolute
            -left-[190px]
            top-[160px]
            h-[560px]
            w-[560px]
            rounded-full
            blur-[105px]
          "
        />

        {/* ===============================================
            MAIN LIQUID GLASS LENS

            This is what gives the empty lower area a
            deliberate focal point.

            No opaque fill.
        ================================================ */}

        <motion.div
          animate={{
            y: [
              0,
              -8,
              5,
              0,
            ],

            scaleX: [
              1,
              1.025,
              0.99,
              1,
            ],

            scaleY: [
              1,
              0.98,
              1.02,
              1,
            ],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute

            left-1/2
            top-[68vh]

            h-[330px]
            w-[660px]

            -translate-x-1/2

            rounded-[50%]

            border
            border-white/[0.07]

            bg-white/[0.008]

            shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(127,29,29,0.05)]
          "
        />

        {/* ===============================================
            INNER LENS
        ================================================ */}

        <motion.div
          animate={{
            y: [
              0,
              6,
              -5,
              0,
            ],

            scale: [
              1,
              0.985,
              1.02,
              1,
            ],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute

            left-1/2
            top-[73vh]

            h-[270px]
            w-[560px]

            -translate-x-1/2

            rounded-[50%]

            border
            border-red-800/[0.10]
          "
        />

        {/* ===============================================
            MAROON REFRACTION INSIDE LENS
        ================================================ */}

        <motion.div
          animate={{
            x: [
              "-50%",
              "-46%",
              "-53%",
              "-50%",
            ],

            opacity: [
              0.75,
              1,
              0.8,
              0.75,
            ],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                rgba(153,27,27,0.18) 0%,
                rgba(127,29,29,0.075) 35%,
                rgba(69,10,10,0.025) 60%,
                transparent 78%
              )
            `,
          }}
          className="
            absolute

            left-1/2
            top-[69vh]

            h-[350px]
            w-[590px]

            rounded-[50%]

            blur-[75px]
          "
        />

        {/* ===============================================
            SPECULAR TOP EDGE
        ================================================ */}

        <motion.div
          animate={{
            opacity: [
              0.35,
              0.72,
              0.42,
              0.35,
            ],

            scaleX: [
              1,
              1.05,
              0.98,
              1,
            ],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",

            maskImage:
              "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
          }}
          className="
            absolute

            left-1/2
            top-[68vh]

            h-[140px]
            w-[570px]

            -translate-x-1/2

            rounded-[50%]

            border-t
            border-white/[0.15]
          "
        />

        {/* ===============================================
            DIAGONAL GLASS ORBIT
        ================================================ */}

        <motion.div
          animate={{
            rotate: [
              -8,
              -5,
              -10,
              -8,
            ],

            x: [
              0,
              8,
              -5,
              0,
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 4%, black 25%, black 72%, transparent 96%)",

            maskImage:
              "linear-gradient(to right, transparent 4%, black 25%, black 72%, transparent 96%)",
          }}
          className="
            absolute

            -left-[250px]
            top-[65vh]

            h-[430px]
            w-[760px]

            rounded-[50%]

            border
            border-white/[0.055]
          "
        />

        {/* ===============================================
            COUNTER ORBIT
        ================================================ */}

        <motion.div
          animate={{
            rotate: [
              9,
              12,
              7,
              9,
            ],

            x: [
              0,
              -8,
              6,
              0,
            ],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 2%, black 26%, black 76%, transparent 98%)",

            maskImage:
              "linear-gradient(to right, transparent 2%, black 26%, black 76%, transparent 98%)",
          }}
          className="
            absolute

            -right-[350px]
            top-[66vh]

            h-[570px]
            w-[760px]

            rounded-full

            border
            border-red-800/[0.08]
          "
        />

        {/* ===============================================
            CENTRAL REFLECTION
        ================================================ */}

        <motion.div
          animate={{
            opacity: [
              0.45,
              0.85,
              0.55,
              0.45,
            ],

            x: [
              "-50%",
              "-47%",
              "-52%",
              "-50%",
            ],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                rgba(255,255,255,0.055) 0%,
                rgba(255,255,255,0.018) 38%,
                transparent 72%
              )
            `,
          }}
          className="
            absolute

            left-1/2
            top-[75vh]

            h-[120px]
            w-[300px]

            rounded-full

            blur-[38px]
          "
        />

        {/* ===============================================
            SMALL SPECULAR GLINTS

            Tiny enough to read as light catches, not
            decorative dots.
        ================================================ */}

        <motion.span
          animate={{
            opacity: [
              0.2,
              0.85,
              0.25,
            ],

            scale: [
              0.8,
              1.25,
              0.85,
            ],
          }}
          transition={{
            duration: 5.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute

            left-[23%]
            top-[72vh]

            h-[2px]
            w-[2px]

            rounded-full

            bg-white/50

            shadow-[0_0_12px_rgba(255,255,255,0.35)]
          "
        />

        <motion.span
          animate={{
            opacity: [
              0.15,
              0.6,
              0.15,
            ],

            scale: [
              0.8,
              1.2,
              0.8,
            ],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            delay: 1.8,
            ease: "easeInOut",
          }}
          className="
            absolute

            right-[20%]
            top-[79vh]

            h-[2px]
            w-[2px]

            rounded-full

            bg-red-500/50

            shadow-[0_0_12px_rgba(185,28,28,0.40)]
          "
        />
      </motion.div>

      {/* ===================================================
          DESKTOP GLOBAL ARC
      ==================================================== */}

      <motion.div
        animate={{
          scale: [
            1,
            1.025,
            0.985,
            1,
          ],

          rotate: [
            0,
            2,
            -1,
            0,
          ],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute

          -right-[30vw]
          top-[6vh]

          hidden

          h-[68vw]
          w-[68vw]

          max-h-[920px]
          max-w-[920px]

          rounded-full

          border
          border-red-800/[0.055]

          md:block
        "
      />

      {/* ===================================================
          DUST
      ==================================================== */}

      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          h-full
          w-full
        "
      />

      {/* ===================================================
          DESKTOP POINTER
      ==================================================== */}

      <motion.div
        style={{
          background:
            pointerField,
        }}
        className="
          absolute
          inset-0
          hidden
          md:block
        "
      />

      {/* ===================================================
          GLOBAL SHEEN
      ==================================================== */}

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-br

          from-white/[0.012]
          via-transparent
          to-red-950/[0.012]
        "
      />

      {/* ===================================================
          GLOBAL VIGNETTE
      ==================================================== */}

      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(3,5,8,0.04)_54%,rgba(3,5,8,0.22)_100%)]
        "
      />
    </div>
  );
};

export default AnimatedBackground;