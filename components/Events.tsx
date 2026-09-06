import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";

import {
  Event,
} from "./AdminDashboard";

/* =========================================================
   BRANDED TEXT
========================================================= */

const BrandText = ({
  text,
}: {
  text: string;
}) => {
  const parts =
    text.split(/(iNITiate)/g);

  return (
    <>
      {parts.map(
        (
          part,
          index
        ): ReactNode => {
          if (
            part ===
            "iNITiate"
          ) {
            return (
              <React.Fragment
                key={index}
              >
                i
                <span className="text-red-700">
                  NIT
                </span>
                iate
              </React.Fragment>
            );
          }

          return (
            <React.Fragment
              key={index}
            >
              {part}
            </React.Fragment>
          );
        }
      )}
    </>
  );
};

/* =========================================================
   EVENT IMAGE
========================================================= */

const EventImage: React.FC<{
  event: Event;
  className?: string;
}> = ({
  event,
  className = "",
}) => {
  const [
    failed,
    setFailed,
  ] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [event.imageUrl]);

  if (
    !event.imageUrl ||
    failed
  ) {
    return (
      <div
        className={`
          relative
          h-full
          w-full
          overflow-hidden
          bg-[#0b0e13]
          ${className}
        `}
      >
        <div
          className="
            absolute
            -bottom-10
            -right-8

            h-24
            w-24

            rounded-full

            bg-red-900/[0.14]

            blur-[42px]
          "
        />

        <div
          className="
            absolute
            inset-0

            flex
            items-center
            justify-center
          "
        >
          <span
            className="
              text-[18px]
              font-semibold
              tracking-[-0.07em]

              text-white/[0.12]
            "
          >
            i
            <span className="text-red-700/40">
              NIT
            </span>
            iate
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={event.imageUrl}
      alt={
        event.name ||
        "iNITiate event"
      }
      onError={() =>
        setFailed(true)
      }
      className={`
        h-full
        w-full
        object-cover
        ${className}
      `}
    />
  );
};

/* =========================================================
   STATUS
========================================================= */

const EventStatus = ({
  status,
}: {
  status?: string;
}) => {
  if (!status) {
    return null;
  }

  const upcoming =
    status
      .trim()
      .toLowerCase() ===
    "upcoming";

  return (
    <span
      className={`
        relative

        inline-flex
        h-[24px]

        items-center
        justify-center

        overflow-hidden

        rounded-full

        border

        px-2.5

        text-[8px]
        font-semibold
        uppercase
        tracking-[0.14em]

        backdrop-blur-xl
        backdrop-saturate-150

        ${
          upcoming
            ? `
              border-red-700/30
              bg-red-900/[0.18]
              text-red-300

              shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
            `
            : `
              border-white/[0.13]
              bg-white/[0.06]
              text-slate-300

              shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_5px_16px_rgba(0,0,0,0.10)]
            `
        }
      `}
    >
      {/* top sheen */}

      <span
        className="
          pointer-events-none
          absolute

          left-[18%]
          right-[18%]
          top-0

          h-px

          bg-gradient-to-r
          from-transparent
          via-white/35
          to-transparent
        "
      />

      {/* upcoming under-light */}

      {upcoming && (
        <span
          className="
            pointer-events-none
            absolute

            -bottom-6
            left-1/2

            h-8
            w-12

            -translate-x-1/2

            rounded-full

            bg-red-700/20

            blur-lg
          "
        />
      )}

      <span
        className="
          relative
          z-10
        "
      >
        {status}
      </span>
    </span>
  );
};

/* =========================================================
   EVENT SELECTOR
========================================================= */

const EventSelector: React.FC<{
  event: Event;
  active: boolean;
  onActivate: () => void;
}> = ({
  event,
  active,
  onActivate,
}) => {
  const eventName =
    event.name ||
    "Untitled Event";

  return (
    <motion.button
      type="button"
      onMouseEnter={
        onActivate
      }
      onClick={
        onActivate
      }
      whileTap={{
        scale: 0.985,
      }}
      className={`
        group
        relative

        min-w-[190px]
        flex-1

        overflow-hidden

        rounded-[18px]

        border

        px-4
        py-3.5

        text-left

        backdrop-blur-2xl
        backdrop-saturate-150

        transition-all
        duration-300

        ${
          active
            ? `
              border-white/[0.12]
              bg-white/[0.055]

              shadow-[inset_0_1px_0_rgba(255,255,255,0.11),0_10px_30px_rgba(0,0,0,0.12)]
            `
            : `
              border-white/[0.06]
              bg-white/[0.022]

              hover:border-white/[0.10]
              hover:bg-white/[0.04]
            `
        }
      `}
    >
      {/* top glass highlight */}

      <div
        className="
          pointer-events-none
          absolute

          left-[15%]
          right-[15%]
          top-0

          h-px

          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
        "
      />

      {/* active refraction */}

      <motion.div
        animate={{
          opacity:
            active
              ? 1
              : 0,
        }}
        className="
          pointer-events-none
          absolute

          -bottom-10
          right-0

          h-16
          w-20

          rounded-full

          bg-red-800/[0.13]

          blur-xl
        "
      />

      <div
        className="
          relative
          z-10
          min-w-0
        "
      >
        <h4
          className={`
            truncate

            text-[13px]
            font-semibold
            tracking-[-0.025em]

            transition-colors

            ${
              active
                ? "text-white"
                : "text-slate-400 group-hover:text-slate-200"
            }
          `}
        >
          <BrandText
            text={
              eventName
            }
          />
        </h4>

        <div
          className="
            mt-1

            flex
            items-center

            gap-2
          "
        >
          <p
            className="
              truncate

              text-[9px]
              font-medium
              uppercase
              tracking-[0.11em]

              text-slate-600
            "
          >
            {event.date ||
              "Date TBA"}
          </p>

          {event.status && (
            <>
              <span
                className="
                  h-[2px]
                  w-[2px]

                  shrink-0

                  rounded-full

                  bg-white/15
                "
              />

              <span
                className={`
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.11em]

                  ${
                    event.status
                      .trim()
                      .toLowerCase() ===
                    "upcoming"
                      ? "text-red-500/80"
                      : "text-slate-500"
                  }
                `}
              >
                {
                  event.status
                }
              </span>
            </>
          )}
        </div>
      </div>

      {active && (
        <motion.div
          layoutId="event-selector-active"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 28,
          }}
          className="
            absolute

            bottom-0
            left-[22%]
            right-[22%]

            h-px

            bg-gradient-to-r
            from-transparent
            via-red-700
            to-transparent
          "
        />
      )}
    </motion.button>
  );
};

/* =========================================================
   MOBILE EVENT

   Tap anywhere on the card:
   collapsed -> expanded
   expanded -> collapsed

   No "See more" UI.
========================================================= */

const MobileEvent: React.FC<{
  event: Event;
}> = ({
  event,
}) => {
  const [
    expanded,
    setExpanded,
  ] = useState(false);

  const eventName =
    event.name ||
    "Untitled Event";

  const toggleExpanded =
    () => {
      if (
        !event.description
      ) {
        return;
      }

      setExpanded(
        (current) =>
          !current
      );
    };

  const handleKeyDown = (
    event:
      React.KeyboardEvent<HTMLElement>
  ) => {
    if (
      !event.description
    ) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      setExpanded(
        (current) =>
          !current
      );
    }
  };

  return (
    <motion.article
      layout
      variants={{
        hidden: {
          opacity: 0,
          y: 16,
        },

        visible: {
          opacity: 1,
          y: 0,

          transition: {
            duration: 0.55,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          },
        },
      }}
      transition={{
        layout: {
          duration: 0.35,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        },
      }}
      onClick={
        toggleExpanded
      }
      onKeyDown={
        handleKeyDown
      }
      role={
        event.description
          ? "button"
          : undefined
      }
      tabIndex={
        event.description
          ? 0
          : undefined
      }
      aria-expanded={
        event.description
          ? expanded
          : undefined
      }
      className={`
        group/mobile-event
        relative

        overflow-hidden

        rounded-[24px]

        border

        p-4

        backdrop-blur-2xl
        backdrop-saturate-150

        transition-colors
        duration-300

        ${
          expanded
            ? `
              border-white/[0.12]
              bg-white/[0.05]
            `
            : `
              border-white/[0.09]
              bg-white/[0.038]
            `
        }

        shadow-[inset_0_1px_0_rgba(255,255,255,0.11),0_14px_40px_rgba(0,0,0,0.14)]

        focus:outline-none
        focus-visible:border-white/[0.16]
      `}
    >
      {/* =================================================
          TOP GLASS EDGE
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute

          left-[12%]
          right-[12%]
          top-0

          h-px

          bg-gradient-to-r
          from-transparent
          via-white/28
          to-transparent
        "
      />

      {/* =================================================
          MAROON REFRACTION
      ================================================== */}

      <motion.div
        animate={{
          opacity:
            expanded
              ? 1
              : 0.7,

          scale:
            expanded
              ? 1.12
              : 1,
        }}
        transition={{
          duration: 0.4,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="
          pointer-events-none
          absolute

          -bottom-14
          -right-8

          h-28
          w-28

          rounded-full

          bg-red-800/[0.10]

          blur-[46px]
        "
      />

      {/* =================================================
          TOP
      ================================================== */}

      <div
        className="
          relative
          z-10

          grid
          grid-cols-[1fr_72px]

          items-start

          gap-4
        "
      >
        {/* =================================================
            TEXT
        ================================================== */}

        <div className="min-w-0">
          {/* META */}

          <div
            className="
              flex
              flex-wrap
              items-center

              gap-x-2
              gap-y-2
            "
          >
            <div
              className="
                flex
                flex-wrap
                items-center

                gap-x-1.5
                gap-y-1

                text-[9px]
                font-semibold
                uppercase
                tracking-[0.11em]

                text-slate-500
              "
            >
              <span>
                {event.date ||
                  "Date TBA"}
              </span>

              {event.venue && (
                <>
                  <span className="text-white/15">
                    ·
                  </span>

                  <span>
                    {
                      event.venue
                    }
                  </span>
                </>
              )}
            </div>

            <EventStatus
              status={
                event.status
              }
            />
          </div>

          {/* TITLE */}

          <h3
            className="
              mt-3

              text-[24px]
              font-semibold
              leading-[1.02]
              tracking-[-0.045em]

              text-white
            "
          >
            <BrandText
              text={
                eventName
              }
            />

            <span className="text-red-700">
              .
            </span>
          </h3>
        </div>

        {/* =================================================
            IMAGE
        ================================================== */}

        <motion.div
          layout
          className="
            relative

            h-[72px]
            w-[72px]

            overflow-hidden

            rounded-[16px]

            border
            border-white/[0.09]

            bg-black/20

            shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_7px_20px_rgba(0,0,0,0.16)]
          "
        >
          <EventImage
            event={
              event
            }
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0

              bg-gradient-to-t
              from-black/20
              to-white/[0.025]
            "
          />
        </motion.div>
      </div>

      {/* =================================================
          DESCRIPTION

          Collapsed:
          two lines with a soft fade.

          Expanded:
          full description.

          No button.
          No label.
          No chevron.
      ================================================== */}

      {event.description && (
        <motion.div
          layout
          className="
            relative
            z-10

            mt-3
          "
        >
          <motion.p
            layout
            style={
              expanded
                ? undefined
                : {
                    display:
                      "-webkit-box",

                    WebkitBoxOrient:
                      "vertical",

                    WebkitLineClamp:
                      2,

                    overflow:
                      "hidden",
                  }
            }
            className={`
              text-[12px]
              leading-[1.65]

              transition-colors
              duration-300

              ${
                expanded
                  ? "text-slate-400"
                  : "text-slate-500"
              }
            `}
          >
            {
              event.description
            }
          </motion.p>

          {/* =================================================
              INVISIBLE AFFORDANCE

              The fade suggests there's more content without
              putting another UI element on the card.
          ================================================== */}

          <AnimatePresence>
            {!expanded && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                  pointer-events-none
                  absolute

                  bottom-0
                  left-0
                  right-0

                  h-5

                  bg-gradient-to-t
                  from-[#111319]/75
                  to-transparent
                "
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* =================================================
          VERY SUBTLE EXPANDED MATERIAL CHANGE

          Not an icon or button. Just a little more light in
          the material after the card opens.
      ================================================== */}

      <motion.div
        animate={{
          opacity:
            expanded
              ? 1
              : 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="
          pointer-events-none
          absolute

          inset-x-[18%]
          bottom-0

          h-px

          bg-gradient-to-r
          from-transparent
          via-red-700/75
          to-transparent
        "
      />

      {!expanded && (
        <div
          className="
            pointer-events-none
            absolute

            bottom-0
            left-[22%]
            right-[22%]

            h-px

            bg-gradient-to-r
            from-transparent
            via-red-800/50
            to-transparent
          "
        />
      )}
    </motion.article>
  );
};

/* =========================================================
   EVENTS
========================================================= */

const Events: React.FC<{
  data?: Event[];
}> = ({
  data = [],
}) => {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const hasSelectedInitialEvent =
    useRef(false);

  /* =======================================================
     POINTER LIGHT
  ======================================================== */

  const pointerX =
    useMotionValue(50);

  const pointerY =
    useMotionValue(50);

  const reflection =
    useMotionTemplate`
      radial-gradient(
        420px circle at ${pointerX}% ${pointerY}%,
        rgba(255,255,255,0.10),
        rgba(255,255,255,0.022) 38%,
        transparent 72%
      )
    `;

  const maroonRefraction =
    useMotionTemplate`
      radial-gradient(
        390px circle at ${pointerX}% ${pointerY}%,
        rgba(153,27,27,0.12),
        rgba(127,29,29,0.045) 44%,
        transparent 74%
      )
    `;

  /* =======================================================
     INITIAL EVENT

     First Upcoming event wins.
     Otherwise first event.
  ======================================================== */

  useEffect(() => {
    if (!data.length) {
      hasSelectedInitialEvent.current =
        false;

      setActiveIndex(0);

      return;
    }

    if (
      !hasSelectedInitialEvent.current
    ) {
      const upcomingIndex =
        data.findIndex(
          (event) =>
            event.status
              ?.trim()
              .toLowerCase() ===
            "upcoming"
        );

      setActiveIndex(
        upcomingIndex >= 0
          ? upcomingIndex
          : 0
      );

      hasSelectedInitialEvent.current =
        true;

      return;
    }

    setActiveIndex(
      (current) =>
        Math.min(
          current,
          data.length - 1
        )
    );
  }, [data]);

  const activeEvent =
    data[activeIndex];

  /* =======================================================
     POINTER
  ======================================================== */

  const handlePointerMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX -
        rect.left) /
        rect.width) *
      100;

    const y =
      ((event.clientY -
        rect.top) /
        rect.height) *
      100;

    pointerX.set(x);
    pointerY.set(y);
  };

  const resetPointer = () => {
    pointerX.set(50);
    pointerY.set(50);
  };

  /* =======================================================
     EMPTY
  ======================================================== */

  if (
    data.length === 0
  ) {
    return (
      <section
        id="events"
        className="
          py-24
          sm:py-28
          lg:py-32
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl

            px-5
            sm:px-6
            lg:px-8
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="
              mx-auto
              max-w-3xl

              text-center
            "
          >
            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]

                text-red-700
              "
            >
              Events
            </span>

            <h2
              className="
                mt-4

                text-4xl
                font-semibold
                leading-[0.98]
                tracking-[-0.05em]

                text-white

                sm:text-5xl
                lg:text-6xl
              "
            >
              Things worth
              showing up for.
            </h2>

            <p
              className="
                mt-6

                text-sm
                text-slate-500
              "
            >
              Nothing announced yet.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="events"
      className="
        relative
        overflow-hidden

        py-24
        sm:py-28
        lg:py-32
      "
    >
      {/* ===================================================
          BACKGROUND
      ==================================================== */}

      <div
        className="
          pointer-events-none
          absolute

          left-1/2
          top-[52%]

          hidden

          h-[380px]
          w-[650px]

          -translate-x-1/2

          rounded-full

          bg-red-900/[0.035]

          blur-[145px]

          lg:block
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
            HEADER
        ================================================== */}

        <motion.header
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={{
            duration: 0.65,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            mx-auto
            mb-10

            max-w-4xl

            text-center

            sm:mb-12
            lg:mb-14
          "
        >
          <span
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.18em]

              text-red-700
            "
          >
            Events
          </span>

          <h2
            className="
              mt-4

              text-4xl
              font-semibold
              leading-[0.98]
              tracking-[-0.055em]

              text-white

              sm:text-5xl
              lg:text-[58px]
            "
          >
            Things worth
            showing up for.
          </h2>
        </motion.header>

        {/* =================================================
            DESKTOP
        ================================================== */}

        {activeEvent && (
          <div
            className="
              hidden
              lg:block
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 22,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.12,
              }}
              transition={{
                duration: 0.7,
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
                group/stage
                relative

                min-h-[315px]

                overflow-hidden

                rounded-[32px]

                border
                border-white/[0.11]

                bg-white/[0.04]

                p-8

                backdrop-blur-3xl
                backdrop-saturate-150

                shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_24px_70px_rgba(0,0,0,0.18)]

                xl:p-9
              "
            >
              {/* WHITE REFLECTION */}

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

                  opacity-70

                  transition-opacity
                  duration-500

                  group-hover/stage:opacity-100
                "
              />

              {/* STATIC DEPTH */}

              <div
                className="
                  pointer-events-none
                  absolute

                  -bottom-28
                  right-[9%]

                  h-[280px]
                  w-[280px]

                  rounded-full

                  bg-red-900/[0.085]

                  blur-[100px]
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
                  via-white/36
                  to-transparent
                "
              />

              {/* INNER RIM */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-[1px]

                  rounded-[31px]

                  border
                  border-white/[0.022]
                "
              />

              <div
                className="
                  relative
                  z-10

                  grid
                  min-h-[245px]

                  grid-cols-[1fr_170px]

                  items-center

                  gap-10
                "
              >
                {/* =================================================
                    DESKTOP CONTENT
                ================================================== */}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={
                      activeEvent.id
                    }
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -7,
                    }}
                    transition={{
                      duration: 0.28,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  >
                    {/* META */}

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center

                        gap-2.5
                      "
                    >
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center

                          gap-x-2

                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.13em]

                          text-slate-500
                        "
                      >
                        <span>
                          {activeEvent.date ||
                            "Date TBA"}
                        </span>

                        {activeEvent.venue && (
                          <>
                            <span className="text-white/15">
                              ·
                            </span>

                            <span>
                              {
                                activeEvent.venue
                              }
                            </span>
                          </>
                        )}
                      </div>

                      <EventStatus
                        status={
                          activeEvent.status
                        }
                      />
                    </div>

                    {/* TITLE */}

                    <h3
                      className="
                        mt-4

                        max-w-[760px]

                        text-[clamp(3rem,4.6vw,5rem)]

                        font-semibold

                        leading-[0.92]
                        tracking-[-0.06em]

                        text-white
                      "
                    >
                      <BrandText
                        text={
                          activeEvent.name ||
                          "Untitled Event"
                        }
                      />

                      <span className="text-red-700">
                        .
                      </span>
                    </h3>

                    {/* DESCRIPTION */}

                    {activeEvent.description && (
                      <p
                        style={{
                          display:
                            "-webkit-box",

                          WebkitBoxOrient:
                            "vertical",

                          WebkitLineClamp:
                            2,

                          overflow:
                            "hidden",
                        }}
                        className="
                          mt-4

                          max-w-[620px]

                          text-[13px]
                          leading-6

                          text-slate-400
                        "
                      >
                        {
                          activeEvent.description
                        }
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* =================================================
                    IMAGE
                ================================================== */}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeEvent.id}-image`}
                    initial={{
                      opacity: 0,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.32,
                    }}
                    className="
                      relative

                      aspect-square

                      overflow-hidden

                      rounded-[22px]

                      border
                      border-white/[0.10]

                      bg-black/20

                      shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_14px_36px_rgba(0,0,0,0.16)]
                    "
                  >
                    <EventImage
                      event={
                        activeEvent
                      }
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0

                        bg-gradient-to-t
                        from-black/20
                        via-transparent
                        to-white/[0.03]
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute

                        left-[14%]
                        right-[14%]
                        top-0

                        h-px

                        bg-gradient-to-r
                        from-transparent
                        via-white/36
                        to-transparent
                      "
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* BOTTOM EDGE */}

              <div
                className="
                  pointer-events-none
                  absolute

                  bottom-0
                  left-[22%]
                  right-[22%]

                  h-px

                  bg-gradient-to-r
                  from-transparent
                  via-red-800/50
                  to-transparent
                "
              />
            </motion.div>

            {/* =================================================
                DESKTOP SELECTORS
            ================================================== */}

            <motion.div
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
                duration: 0.55,
                delay: 0.06,
              }}
              className="
                mt-3

                flex
                gap-2.5

                overflow-x-auto

                pb-1
              "
            >
              {data.map(
                (
                  event,
                  index
                ) => (
                  <EventSelector
                    key={
                      event.id
                    }
                    event={
                      event
                    }
                    active={
                      activeIndex ===
                      index
                    }
                    onActivate={() =>
                      setActiveIndex(
                        index
                      )
                    }
                  />
                )
              )}
            </motion.div>
          </div>
        )}

        {/* =================================================
            MOBILE
        ================================================== */}

        <motion.div
          variants={{
            hidden: {},

            visible: {
              transition: {
                staggerChildren:
                  0.065,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.05,
          }}
          className="
            space-y-3
            lg:hidden
          "
        >
          {data.map(
            (event) => (
              <MobileEvent
                key={
                  event.id
                }
                event={
                  event
                }
              />
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Events;