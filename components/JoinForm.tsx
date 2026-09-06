import React from "react";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";

/* =========================================================
   ARROW ICON
========================================================= */

const ArrowIcon: React.FC<{
  className?: string;
}> = ({
  className = "",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M7 17L17 7M9 7h8v8"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* =========================================================
   JOIN
========================================================= */

const JoinForm: React.FC = () => {
  const pointerX =
    useMotionValue(50);

  const pointerY =
    useMotionValue(50);

  /* white surface reflection */

  const reflection =
    useMotionTemplate`
      radial-gradient(
        460px circle at ${pointerX}% ${pointerY}%,
        rgba(255,255,255,0.13),
        rgba(255,255,255,0.035) 36%,
        transparent 72%
      )
    `;

  /* subtle NIT maroon refraction */

  const maroonRefraction =
    useMotionTemplate`
      radial-gradient(
        420px circle at ${pointerX}% ${pointerY}%,
        rgba(153,27,27,0.16),
        rgba(127,29,29,0.07) 42%,
        transparent 72%
      )
    `;

  const handlePointerMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) /
        rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) /
        rect.height) *
      100;

    pointerX.set(x);
    pointerY.set(y);
  };

  const resetPointer = () => {
    pointerX.set(50);
    pointerY.set(50);
  };

  return (
    <section
      id="join"
      className="
        relative
        overflow-hidden

        py-24
        sm:py-28
        lg:py-36
      "
    >
      {/* ===================================================
          BACKGROUND ATMOSPHERE
      ==================================================== */}

      <div
        className="
          pointer-events-none
          absolute

          left-1/2
          top-1/2

          h-[440px]
          w-[760px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          bg-red-900/[0.06]

          blur-[155px]
        "
      />

      <div
        className="
          relative
          z-10

          mx-auto
          max-w-7xl

          px-5
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            MAIN LIQUID GLASS PANEL
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 28,
            scale: 0.985,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.75,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          onMouseMove={
            handlePointerMove
          }
          onMouseLeave={
            resetPointer
          }
          className="
            group
            relative

            mx-auto

            overflow-hidden

            rounded-[36px]

            border
            border-white/[0.12]

            bg-white/[0.043]

            px-5
            py-12

            backdrop-blur-3xl
            backdrop-saturate-150

            shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.025),0_30px_100px_rgba(0,0,0,0.25)]

            sm:px-10
            sm:py-14

            lg:min-h-[430px]
            lg:px-16
            lg:py-16
          "
        >
          {/* =================================================
              MOVING WHITE REFLECTION
          ================================================== */}

          <motion.div
            style={{
              background:
                reflection,
            }}
            className="
              pointer-events-none
              absolute
              inset-0
            "
          />

          {/* =================================================
              MOVING MAROON REFRACTION
          ================================================== */}

          <motion.div
            style={{
              background:
                maroonRefraction,
            }}
            className="
              pointer-events-none
              absolute
              inset-0

              opacity-80

              transition-opacity
              duration-500

              group-hover:opacity-100
            "
          />

          {/* =================================================
              STATIC MAROON DEPTH
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute

              -bottom-48
              left-1/2

              h-[420px]
              w-[600px]

              -translate-x-1/2

              rounded-full

              bg-red-900/[0.10]

              blur-[120px]
            "
          />

          {/* =================================================
              TOP SPECULAR EDGE
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute

              left-[9%]
              right-[9%]
              top-0

              h-px

              bg-gradient-to-r
              from-transparent
              via-white/40
              to-transparent
            "
          />

          {/* =================================================
              INNER RIM
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-[1px]

              rounded-[35px]

              border
              border-white/[0.025]
            "
          />

          {/* =================================================
              VERY SUBTLE MOVING EDGE GLINT
          ================================================== */}

          <motion.div
            animate={{
              x: [
                "-50%",
                "175%",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
            className="
              pointer-events-none
              absolute

              left-0
              top-[1px]

              h-px
              w-[28%]

              bg-gradient-to-r
              from-transparent
              via-red-700/40
              to-transparent

              opacity-45
            "
          />

          {/* =================================================
              BOTTOM BRAND REFLECTION
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute

              bottom-0
              left-1/2

              h-[2px]
              w-[30%]

              -translate-x-1/2

              bg-gradient-to-r
              from-transparent
              via-red-800/55
              to-transparent

              opacity-65
            "
          />

          {/* =================================================
              CONTENT
          ================================================== */}

          <div
            className="
              relative
              z-10

              mx-auto

              flex
              max-w-4xl

              flex-col
              items-center

              text-center

              lg:min-h-[300px]
              lg:justify-center
            "
          >
            {/* small label */}

            <motion.span
              initial={{
                opacity: 0,
                y: 8,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: 0.08,
              }}
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.20em]

                text-red-700

                sm:text-[11px]
              "
            >
              Join iNITiate
            </motion.span>

            {/* =================================================
                STRONG TYPOGRAPHY
            ================================================== */}

            <motion.h2
              initial={{
                opacity: 0,
                y: 14,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: 0.12,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                mt-4

                max-w-[900px]

                text-[43px]
                font-semibold
                leading-[0.94]
                tracking-[-0.06em]

                text-white

                sm:text-[58px]

                lg:text-[76px]
              "
            >
              Come make
              <br className="sm:hidden" />{" "}
              something

              <span className="text-red-700">
                .
              </span>
            </motion.h2>

            {/* =================================================
                MINIMAL SUPPORT COPY
            ================================================== */}

            <motion.p
              initial={{
                opacity: 0,
                y: 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
                delay: 0.18,
              }}
              className="
                mt-5

                max-w-md

                text-[14px]
                leading-6

                text-slate-500

                sm:text-[15px]
              "
            >
              Bring your curiosity.
              Let&apos;s initiate your journey.
            </motion.p>

            {/* =================================================
                SINGLE LIQUID GLASS CTA
            ================================================== */}

            <motion.a
              initial={{
                opacity: 0,
                y: 12,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
                delay: 0.24,
              }}
              whileHover={{
                scale: 1.018,
                y: -2,
              }}
              whileTap={{
                scale: 0.985,
              }}
              href="https://chat.whatsapp.com/GxqDBd54qrzKdWlpd0amA5?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group/button
                relative

                mt-8

                flex

                h-[54px]
                w-full

                items-center
                justify-center

                gap-3

                overflow-hidden

                rounded-[19px]

                border
                border-red-800/45

                bg-red-900/35

                px-8

                text-[14px]
                font-semibold

                text-white

                backdrop-blur-2xl
                backdrop-saturate-150

                shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_36px_rgba(0,0,0,0.18)]

                transition-colors
                duration-300

                hover:border-red-700/55
                hover:bg-red-900/45

                sm:w-auto
                sm:min-w-[215px]
              "
            >
              {/* under-glass maroon light */}

              <div
                className="
                  pointer-events-none
                  absolute

                  -bottom-14
                  left-1/2

                  h-24
                  w-[170px]

                  -translate-x-1/2

                  rounded-full

                  bg-red-700/20

                  blur-2xl

                  transition-all
                  duration-500

                  group-hover/button:bg-red-700/30
                "
              />

              {/* one highlight, not another border */}

              <div
                className="
                  pointer-events-none
                  absolute

                  left-[16%]
                  right-[16%]
                  top-0

                  h-px

                  bg-gradient-to-r
                  from-transparent
                  via-white/35
                  to-transparent
                "
              />

              <span
                className="
                  relative
                  z-10
                "
              >
                Join iNITiate
              </span>

              <motion.span
                className="
                  relative
                  z-10

                  flex
                  items-center
                "
                variants={{
                  idle: {
                    x: 0,
                    y: 0,
                  },

                  hover: {
                    x: 2,
                    y: -2,
                  },
                }}
                initial="idle"
                whileHover="hover"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <ArrowIcon className="h-4 w-4" />
              </motion.span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinForm;