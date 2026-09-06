import React, { useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";

import {
  FAQ as FAQType,
} from "./AdminDashboard";

/* =========================================================
   PLUS ICON
========================================================= */

const PlusIcon: React.FC<{
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
      d="M12 5v14M5 12h14"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

/* =========================================================
   FAQ CARD
========================================================= */

const FAQCard: React.FC<{
  faq: FAQType;
  isOpen: boolean;
  onToggle: () => void;
}> = ({
  faq,
  isOpen,
  onToggle,
}) => {
  const pointerX =
    useMotionValue(50);

  const pointerY =
    useMotionValue(50);

  const reflection =
    useMotionTemplate`
      radial-gradient(
        320px circle at ${pointerX}% ${pointerY}%,
        rgba(255,255,255,0.11),
        rgba(255,255,255,0.03) 38%,
        transparent 70%
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
    <motion.article
      layout
      transition={{
        layout: {
          duration: 0.45,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        },
      }}
      onMouseMove={
        handlePointerMove
      }
      onMouseLeave={
        resetPointer
      }
      className={`
        group
        relative
        overflow-hidden

        rounded-[28px]

        border

        backdrop-blur-3xl
        backdrop-saturate-150

        transition-colors
        duration-300

        ${
          isOpen
            ? `
              border-white/[0.14]
              bg-white/[0.065]

              md:col-span-2

              shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.025),0_24px_70px_rgba(0,0,0,0.20)]
            `
            : `
              border-white/[0.085]
              bg-white/[0.038]

              hover:border-white/[0.13]
              hover:bg-white/[0.052]

              shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_12px_35px_rgba(0,0,0,0.12)]
            `
        }
      `}
    >
      {/* =================================================
          CURSOR REFLECTION
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
          MAROON REFRACTION
      ================================================== */}

      <motion.div
        animate={{
          opacity:
            isOpen
              ? 1
              : 0.35,

          scale:
            isOpen
              ? 1
              : 0.85,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          pointer-events-none
          absolute

          -bottom-24
          -right-12

          h-[220px]
          w-[220px]

          rounded-full

          bg-red-800/[0.13]

          blur-[75px]
        "
      />

      {/* secondary refraction */}

      <motion.div
        animate={{
          opacity:
            isOpen
              ? 0.8
              : 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="
          pointer-events-none
          absolute

          -left-16
          top-1/2

          h-[150px]
          w-[150px]

          -translate-y-1/2

          rounded-full

          bg-red-900/[0.12]

          blur-[60px]
        "
      />

      {/* =================================================
          GLASS HIGHLIGHT
      ================================================== */}

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
          via-white/30
          to-transparent
        "
      />

      {/* inner rim */}

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

      {/* =================================================
          MAROON ACTIVE EDGE
      ================================================== */}

      <motion.div
        animate={{
          opacity:
            isOpen
              ? 1
              : 0,

          scaleY:
            isOpen
              ? 1
              : 0.25,
        }}
        transition={{
          duration: 0.35,
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

          bottom-8
          left-0
          top-8

          w-[2px]

          origin-center

          rounded-full

          bg-red-800
        "
      />

      {/* =================================================
          QUESTION BUTTON
      ================================================== */}

      <button
        type="button"
        onClick={
          onToggle
        }
        aria-expanded={
          isOpen
        }
        className="
          relative
          z-10

          flex
          w-full

          items-center
          justify-between

          gap-5

          px-5
          py-6

          text-left

          sm:px-7
          sm:py-7

          lg:px-8
        "
      >
        <motion.h3
          layout="position"
          className={`
            max-w-[90%]

            text-[17px]
            font-semibold
            leading-[1.25]
            tracking-[-0.03em]

            transition-colors
            duration-300

            sm:text-[19px]

            ${
              isOpen
                ? "text-white"
                : "text-slate-300 group-hover:text-white"
            }
          `}
        >
          {faq.question ||
            "Untitled Question"}
        </motion.h3>

        {/* PLUS */}

        <motion.span
          animate={{
            rotate:
              isOpen
                ? 45
                : 0,
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
          className={`
            flex

            h-10
            w-10

            shrink-0

            items-center
            justify-center

            rounded-full

            border

            backdrop-blur-xl

            transition-colors
            duration-300

            ${
              isOpen
                ? `
                  border-red-800/35
                  bg-red-900/25
                  text-red-700
                `
                : `
                  border-white/[0.10]
                  bg-white/[0.045]
                  text-slate-500

                  group-hover:border-white/[0.15]
                  group-hover:text-slate-300
                `
            }
          `}
        >
          <PlusIcon className="h-4 w-4" />
        </motion.span>
      </button>

      {/* =================================================
          ANSWER
      ================================================== */}

      <AnimatePresence
        initial={false}
      >
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.42,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              },

              opacity: {
                duration: 0.24,
                delay: 0.06,
              },
            }}
            className="
              relative
              z-10

              overflow-hidden
            "
          >
            <div
              className="
                mx-5

                border-t
                border-white/[0.07]

                pb-7
                pt-5

                sm:mx-7
                sm:pb-8

                lg:mx-8
                lg:pb-9
              "
            >
              <p
                className="
                  max-w-3xl

                  text-[14px]
                  leading-6

                  text-slate-400

                  sm:text-[15px]
                  sm:leading-7
                "
              >
                {faq.answer ||
                  "No answer provided yet."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

/* =========================================================
   FAQ
========================================================= */

const FAQ: React.FC<{
  data?: FAQType[];
}> = ({
  data = [],
}) => {
  const [
    openId,
    setOpenId,
  ] = useState<
    string | null
  >(null);

  const toggleFAQ = (
    id: string
  ) => {
    setOpenId(
      openId === id
        ? null
        : id
    );
  };

  return (
    <section
      id="faq"
      className="
        relative
        overflow-hidden

        py-24
        sm:py-28
        lg:py-32
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
          top-[42%]

          hidden

          h-[440px]
          w-[700px]

          -translate-x-1/2

          rounded-full

          bg-red-900/[0.055]

          blur-[150px]

          lg:block
        "
      />

      <div
        className="
          pointer-events-none
          absolute

          -right-20
          top-[18%]

          hidden

          h-[260px]
          w-[260px]

          rounded-full

          bg-white/[0.018]

          blur-[120px]

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
            CENTERED HEADER

            Different from Team/Goals.
        ================================================== */}

        <motion.header
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
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
            mb-12

            max-w-3xl

            text-center

            sm:mb-14
            lg:mb-16
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
            FAQ
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

              lg:text-[56px]
            "
          >
            Questions, answered.
          </h2>
        </motion.header>

        {/* =================================================
            EMPTY STATE
        ================================================== */}

        {data.length === 0 && (
          <div
            className="
              mx-auto
              max-w-xl

              rounded-[28px]

              border
              border-white/[0.09]

              bg-white/[0.035]

              px-6
              py-8

              text-center

              text-sm
              text-slate-500

              backdrop-blur-2xl

              shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
            "
          >
            Questions coming soon.
          </div>
        )}

        {/* =================================================
            FAQ WALL

            DESKTOP:
            2-column glass wall.

            OPEN CARD:
            expands across both columns.

            MOBILE:
            single stack.
        ================================================== */}

        {data.length > 0 && (
          <motion.div
            layout
            initial={{
              opacity: 0,
              y: 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.06,
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
              grid
              grid-cols-1

              gap-3

              md:grid-cols-2
              md:gap-4

              lg:gap-5
            "
          >
            {data.map(
              (faq) => {
                const isOpen =
                  openId ===
                  faq.id;

                return (
                  <FAQCard
                    key={
                      faq.id
                    }
                    faq={
                      faq
                    }
                    isOpen={
                      isOpen
                    }
                    onToggle={() =>
                      toggleFAQ(
                        faq.id
                      )
                    }
                  />
                );
              }
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FAQ;