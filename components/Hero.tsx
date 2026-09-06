import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  Variants,
} from "framer-motion";

/* =========================================================
   MOTION
========================================================= */

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   ICONS
========================================================= */

const ArrowUpRight = ({
  className = "",
}: {
  className?: string;
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
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeft = ({
  className = "",
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M19 12H5M10 7l-5 5 5 5"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = ({
  className = "",
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M5 12h14M14 7l5 5-5 5"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* =========================================================
   DESKTOP EXPERIENCES
========================================================= */

const experiences = [
  {
    title: "Events",
    description:
      "Talks, showcases and experiences worth showing up for.",
  },

  {
    title: "Projects",
    description:
      "Turn curiosity into something real.",
  },

  {
    title: "Community",
    description:
      "Meet curious people from across campus.",
  },
];

/* =========================================================
   HERO
========================================================= */

const Hero: React.FC = () => {
  const cardRef =
    useRef<HTMLDivElement>(null);

  const [
    active,
    setActive,
  ] = useState(0);

  const [
    paused,
    setPaused,
  ] = useState(false);

  /* =======================================================
     DESKTOP POINTER
  ======================================================== */

  const mouseX =
    useMotionValue(0);

  const mouseY =
    useMotionValue(0);

  const x =
    useSpring(mouseX, {
      stiffness: 130,
      damping: 26,
    });

  const y =
    useSpring(mouseY, {
      stiffness: 130,
      damping: 26,
    });

  const rotateY =
    useTransform(
      x,
      [-0.5, 0.5],
      [-1.7, 1.7]
    );

  const rotateX =
    useTransform(
      y,
      [-0.5, 0.5],
      [1.7, -1.7]
    );

  const lightX =
    useTransform(
      x,
      [-0.5, 0.5],
      [18, 82]
    );

  const lightY =
    useTransform(
      y,
      [-0.5, 0.5],
      [20, 80]
    );

  const glassReflection =
    useMotionTemplate`
      radial-gradient(
        290px circle at ${lightX}% ${lightY}%,
        rgba(255,255,255,0.15),
        rgba(255,255,255,0.045) 34%,
        transparent 70%
      )
    `;

  const maroonRefraction =
    useMotionTemplate`
      radial-gradient(
        300px circle at ${lightX}% ${lightY}%,
        rgba(153,27,27,0.16),
        rgba(127,29,29,0.06) 40%,
        transparent 72%
      )
    `;

  /* =======================================================
     DESKTOP AUTO ROTATE
  ======================================================== */

  useEffect(() => {
    if (paused) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setActive(
          (current) =>
            (current + 1) %
            experiences.length
        );
      }, 3800);

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [paused]);

  /* =======================================================
     POINTER
  ======================================================== */

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect =
      cardRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const normalizedX =
      (event.clientX -
        rect.left) /
        rect.width -
      0.5;

    const normalizedY =
      (event.clientY -
        rect.top) /
        rect.height -
      0.5;

    mouseX.set(
      normalizedX
    );

    mouseY.set(
      normalizedY
    );
  };

  const resetPointer =
    () => {
      mouseX.set(0);
      mouseY.set(0);
    };

  /* =======================================================
     DESKTOP CONTROLS
  ======================================================== */

  const next = () => {
    setActive(
      (current) =>
        (current + 1) %
        experiences.length
    );
  };

  const previous = () => {
    setActive(
      (current) =>
        (
          current -
          1 +
          experiences.length
        ) %
        experiences.length
    );
  };

  /* =======================================================
     NAVIGATION
  ======================================================== */

  const scrollTo = (
    event:
      React.MouseEvent<HTMLAnchorElement>,
    selector: string
  ) => {
    event.preventDefault();

    document
      .querySelector(
        selector
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <section
      id="hero"
      className="
        relative
        text-white
        lg:overflow-hidden
      "
    >
      {/* ===================================================
          DESKTOP BACKGROUND ONLY

          Mobile remains completely transparent.
      ==================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0

          hidden

          bg-[#07090d]/91

          lg:block
        "
      />

      {/* ===================================================
          DESKTOP ATMOSPHERE
      ==================================================== */}

      <div
        className="
          pointer-events-none

          absolute

          right-[4%]
          top-[27%]

          hidden

          h-[420px]
          w-[420px]

          rounded-full

          bg-red-900/[0.08]

          blur-[150px]

          lg:block
        "
      />

      <div
        className="
          pointer-events-none

          absolute

          right-[24%]
          top-[17%]

          hidden

          h-[250px]
          w-[250px]

          rounded-full

          bg-white/[0.018]

          blur-[120px]

          lg:block
        "
      />

      {/* ===================================================
          CONTENT

          Mobile is intentionally shorter now.

          We aren't wasting an entire viewport just because
          desktop uses one.
      ==================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto
          flex

          min-h-[82svh]
          max-w-7xl

          items-start

          px-5
          pb-[72px]
          pt-[10.5rem]

          sm:min-h-[84svh]
          sm:px-6
          sm:pb-[78px]
          sm:pt-[11rem]

          lg:min-h-[calc(100vh-20px)]
          lg:items-center
          lg:px-8
          lg:pb-10
          lg:pt-28
        "
      >
        <div
          className="
            grid
            w-full
            items-center

            gap-12

            lg:grid-cols-[1.15fr_.7fr]
            lg:gap-20
          "
        >
          {/* =================================================
              LEFT
          ================================================== */}

          <div
            className="
              mx-auto
              w-full
              max-w-3xl

              lg:mx-0
            "
          >
            {/* =================================================
                HEADLINE
            ================================================== */}

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={reveal}
              className="
                max-w-3xl

                text-[clamp(3.45rem,14vw,4.35rem)]

                font-semibold

                leading-[0.94]
                tracking-[-0.06em]

                sm:text-[clamp(3.8rem,11vw,5rem)]

                lg:text-[clamp(3.45rem,6.5vw,6.4rem)]
              "
            >
              <span className="text-red-700">
                Ideas
              </span>{" "}
              deserve
              <br />
              somewhere to go.
            </motion.h1>

            {/* =================================================
                SUPPORT
            ================================================== */}

            <motion.p
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.08,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                mt-7

                max-w-2xl

                text-[17px]
                font-medium
                leading-7

                text-slate-400

                sm:text-[19px]
              "
            >
              Science & technology at{" "}
              <span className="text-slate-100">
                Pakistan&apos;s
                first American
                university.
              </span>
            </motion.p>

            {/* =================================================
                CTA
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.16,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                relative
                z-20

                mt-9

                grid
                w-full
                grid-cols-2

                gap-3

                sm:flex
                sm:w-auto
                sm:items-center
                sm:gap-4

                lg:mt-9
              "
            >
              {/* =============================================
                  PRIMARY
              ============================================== */}

              <motion.a
                href="#events"
                onClick={(
                  event
                ) =>
                  scrollTo(
                    event,
                    "#events"
                  )
                }
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.975,
                }}
                className="
                  group/primary
                  relative

                  flex
                  h-[54px]
                  w-full

                  items-center
                  justify-center

                  overflow-hidden

                  whitespace-nowrap

                  rounded-full

                  border
                  border-red-700/50

                  bg-red-900/55

                  px-4

                  text-[13px]
                  font-semibold

                  text-white

                  backdrop-blur-xl

                  shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_12px_34px_rgba(0,0,0,0.17),0_0_36px_rgba(127,29,29,0.08)]

                  transition-all
                  duration-300

                  hover:border-red-700/65
                  hover:bg-red-800/55

                  sm:h-auto
                  sm:w-auto
                  sm:px-6
                  sm:py-3.5
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute

                    -bottom-12
                    left-1/2

                    h-20
                    w-[140px]

                    -translate-x-1/2

                    rounded-full

                    bg-red-700/22

                    blur-xl
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute

                    left-[18%]
                    right-[18%]
                    top-0

                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-white/34
                    to-transparent
                  "
                />

                <span
                  className="
                    relative
                    z-10
                  "
                >
                  Explore iNITiate
                </span>
              </motion.a>

              {/* =============================================
                  SECONDARY
              ============================================== */}

              <motion.a
                href="#join"
                onClick={(
                  event
                ) =>
                  scrollTo(
                    event,
                    "#join"
                  )
                }
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.975,
                }}
                className="
                  group
                  relative

                  flex
                  h-[54px]
                  w-full

                  items-center
                  justify-center

                  gap-2

                  overflow-hidden

                  whitespace-nowrap

                  rounded-full

                  border
                  border-white/[0.12]

                  bg-white/[0.045]

                  px-4

                  text-[13px]
                  font-semibold

                  text-white

                  backdrop-blur-xl
                  backdrop-saturate-150

                  shadow-[inset_0_1px_0_rgba(255,255,255,0.11),0_10px_28px_rgba(0,0,0,0.12)]

                  transition-all
                  duration-300

                  hover:border-white/[0.18]
                  hover:bg-white/[0.065]

                  sm:h-auto
                  sm:w-auto
                  sm:px-6
                  sm:py-3.5
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute

                    left-[18%]
                    right-[18%]
                    top-0

                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-white/28
                    to-transparent
                  "
                />

                <span
                  className="
                    relative
                    z-10
                  "
                >
                  Join
                </span>

                <ArrowUpRight
                  className="
                    relative
                    z-10

                    h-4
                    w-4

                    text-slate-400

                    transition-all
                    duration-200

                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5

                    group-hover:text-red-700
                  "
                />
              </motion.a>
            </motion.div>
          </div>

          {/* =================================================
              DESKTOP EXPERIENCE

              Desktop remains unchanged.
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.22,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              hidden
              items-center
              justify-end
              lg:flex
            "
          >
            <motion.div
              ref={cardRef}
              onMouseMove={
                handleMouseMove
              }
              onMouseEnter={() =>
                setPaused(true)
              }
              onMouseLeave={() => {
                setPaused(false);
                resetPointer();
              }}
              style={{
                rotateX,
                rotateY,
                transformPerspective:
                  1200,
              }}
              whileHover={{
                y: -3,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 24,
              }}
              className="
                group/card
                relative

                h-[290px]
                w-full
                max-w-[400px]

                overflow-hidden

                rounded-[28px]

                border
                border-white/[0.12]

                bg-white/[0.045]

                backdrop-blur-3xl
                backdrop-saturate-150

                shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.025),0_24px_70px_rgba(0,0,0,0.22)]
              "
            >
              {/* POINTER REFLECTION */}

              <motion.div
                style={{
                  background:
                    glassReflection,
                }}
                className="
                  pointer-events-none
                  absolute
                  inset-0
                "
              />

              {/* MAROON REFRACTION */}

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
                  group-hover/card:opacity-100
                "
              />

              {/* STATIC DEPTH */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  -right-12
                  h-[220px]
                  w-[220px]
                  rounded-full
                  bg-red-900/[0.10]
                  blur-[80px]
                "
              />

              {/* TOP EDGE */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-[10%]
                  right-[10%]
                  top-0
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-white/40
                  to-transparent
                "
              />

              {/* INNER RIM */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-[1px]
                  rounded-[27px]
                  border
                  border-white/[0.025]
                "
              />

              {/* BOTTOM EDGE */}

              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-0
                  left-[18%]
                  right-[18%]
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-red-800/65
                  to-transparent
                "
              />

              {/* CONTENT */}

              <div
                className="
                  relative
                  z-10
                  flex
                  h-full
                  flex-col
                  p-7
                "
              >
                <div
                  className="
                    flex
                    flex-1
                    items-center
                  "
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                    >
                      <h2
                        className={`
                          font-semibold
                          leading-[0.95]
                          tracking-[-0.05em]
                          text-white

                          ${
                            experiences[
                              active
                            ].title.length >
                            8
                              ? "text-[clamp(2.6rem,4vw,3.8rem)]"
                              : "text-[clamp(3rem,5vw,4.5rem)]"
                          }
                        `}
                      >
                        {
                          experiences[
                            active
                          ].title
                        }

                        <span className="text-red-700">
                          .
                        </span>
                      </h2>

                      <p
                        className="
                          mt-4
                          max-w-[285px]
                          text-[14px]
                          leading-6
                          text-slate-500
                        "
                      >
                        {
                          experiences[
                            active
                          ].description
                        }
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-t
                    border-white/[0.065]
                    pt-4
                  "
                >
                  {/* PROGRESS */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    {experiences.map(
                      (
                        item,
                        index
                      ) => (
                        <button
                          key={
                            item.title
                          }
                          type="button"
                          onClick={() =>
                            setActive(
                              index
                            )
                          }
                          aria-label={`Show ${item.title}`}
                          className="
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                          "
                        >
                          <motion.span
                            animate={{
                              width:
                                active ===
                                index
                                  ? 18
                                  : 5,

                              opacity:
                                active ===
                                index
                                  ? 1
                                  : 0.3,
                            }}
                            transition={{
                              duration:
                                0.25,
                            }}
                            className={`
                              block
                              h-[5px]
                              rounded-full

                              ${
                                active ===
                                index
                                  ? "bg-red-700"
                                  : "bg-slate-500"
                              }
                            `}
                          />
                        </button>
                      )
                    )}
                  </div>

                  {/* ARROWS */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <motion.button
                      type="button"
                      onClick={
                        previous
                      }
                      whileHover={{
                        x: -2,
                      }}
                      whileTap={{
                        scale: 0.92,
                      }}
                      aria-label="Previous"
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/[0.09]
                        bg-white/[0.035]
                        text-slate-500
                        backdrop-blur-xl
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                        transition-all
                        duration-300
                        hover:border-white/[0.15]
                        hover:bg-white/[0.06]
                        hover:text-white
                      "
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={
                        next
                      }
                      whileHover={{
                        x: 2,
                      }}
                      whileTap={{
                        scale: 0.92,
                      }}
                      aria-label="Next"
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/[0.09]
                        bg-white/[0.035]
                        text-slate-400
                        backdrop-blur-xl
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                        transition-all
                        duration-300
                        hover:border-red-800/40
                        hover:bg-red-900/20
                        hover:text-red-700
                      "
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;