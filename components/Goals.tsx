import React, {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  Variants,
} from "framer-motion";

import {
  getGoals,
  Goal,
} from "../services/api";

import Loader from "./Loader";

const placeholderGoals: Goal[] = [
  {
    id: "placeholder-cross-discipline",
    name: "Connect Across Disciplines",
    description:
      "Meet people outside your usual circle.",
    icon: `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <circle cx="7" cy="8" r="3" />
        <circle cx="17" cy="8" r="3" />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.5 19a4.5 4.5 0 019 0M12.5 19a4.5 4.5 0 019 0"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10 11.5h4"
        />
      </svg>
    `,
  },

  {
    id: "placeholder-projects",
    name: "Build Real Projects",
    description:
      "Turn ideas into something tangible.",
    icon: `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3l7 4v8l-7 4-7-4V7l7-4z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 7l7 4 7-4M12 11v8"
        />
      </svg>
    `,
  },

  {
    id: "placeholder-experts",
    name: "Meet People Doing the Work",
    description:
      "Hear from researchers, founders and engineers.",
    icon: `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 5h16v11H4z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8 20h8M12 16v4"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 9h6M9 12h4"
        />
      </svg>
    `,
  },

  {
    id: "placeholder-opportunities",
    name: "Find Better Opportunities",
    description:
      "Discover competitions, research and collaborations.",
    icon: `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 19L19 5"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11 5h8v8"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 9v10h10"
        />
      </svg>
    `,
  },
];

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const GoalIcon: React.FC<{
  icon?: string;
  className?: string;
}> = ({
  icon,
  className = "",
}) => {
  if (!icon) {
    return (
      <div
        className={`
          flex
          items-center
          justify-center
          ${className}
        `}
      >
        <span
          className="
            h-2
            w-2
            rounded-full
            bg-red-700
          "
        />
      </div>
    );
  }

  return (
    <div
      className={`
        [&_svg]:h-full
        [&_svg]:w-full
        [&_svg]:stroke-current
        ${className}
      `}
      dangerouslySetInnerHTML={{
        __html: icon,
      }}
      aria-hidden="true"
    />
  );
};

const GoalFocus: React.FC<{
  goal: Goal;
  index: number;
}> = ({
  goal,
  index,
}) => {
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const smoothTiltX = useSpring(
    tiltX,
    {
      stiffness: 140,
      damping: 25,
    }
  );

  const smoothTiltY = useSpring(
    tiltY,
    {
      stiffness: 140,
      damping: 25,
    }
  );

  const reflection = useMotionTemplate`
    radial-gradient(
      340px circle at ${pointerX}% ${pointerY}%,
      rgba(255,255,255,0.13),
      rgba(255,255,255,0.035) 38%,
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

    const normalizedX =
      x / 100 - 0.5;

    const normalizedY =
      y / 100 - 0.5;

    tiltX.set(
      normalizedY * -1.1
    );

    tiltY.set(
      normalizedX * 1.1
    );
  };

  const resetPointer = () => {
    pointerX.set(50);
    pointerY.set(50);

    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.div
      onMouseMove={
        handlePointerMove
      }
      onMouseLeave={
        resetPointer
      }
      style={{
        rotateX: smoothTiltX,
        rotateY: smoothTiltY,
        transformPerspective: 1200,
      }}
      className="
        relative
        min-h-[340px]
        overflow-hidden
        rounded-[34px]
        border
        border-white/[0.12]
        bg-white/[0.05]
        p-8
        backdrop-blur-3xl
        backdrop-saturate-150
        shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.025),0_28px_80px_rgba(0,0,0,0.24)]
        lg:p-10
      "
    >
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

      <div
        className="
          pointer-events-none
          absolute
          -bottom-28
          -left-16
          h-[300px]
          w-[300px]
          rounded-full
          bg-red-800/[0.14]
          blur-[90px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          top-[12%]
          h-[220px]
          w-[220px]
          rounded-full
          bg-red-900/[0.09]
          blur-[85px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-10
          left-0
          top-10
          w-[2px]
          bg-gradient-to-b
          from-transparent
          via-red-800
          to-transparent
        "
      />

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
          via-white/35
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-[1px]
          rounded-[33px]
          border
          border-white/[0.025]
        "
      />

      <div
        className="
          relative
          z-10
          flex
          min-h-[260px]
          flex-col
          justify-between
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-6
          "
        >
          <div
            className="
              flex
              h-[58px]
              w-[58px]
              shrink-0
              items-center
              justify-center
              rounded-[20px]
              border
              border-white/[0.12]
              bg-white/[0.055]
              text-red-700
              backdrop-blur-2xl
              shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_10px_30px_rgba(0,0,0,0.18)]
            "
          >
            <GoalIcon
              icon={goal.icon}
              className="
                h-6
                w-6
              "
            />
          </div>

          <span
            className="
              text-[11px]
              font-medium
              tracking-[0.16em]
              text-white/20
            "
          >
            {String(
              index + 1
            ).padStart(
              2,
              "0"
            )}
          </span>
        </div>

        <AnimatePresence
          mode="wait"
        >
          <motion.div
            key={goal.id}
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
            className="
              mt-10
              max-w-[610px]
            "
          >
            <h3
              className="
                max-w-[600px]
                text-[clamp(2rem,3.3vw,3.15rem)]
                font-semibold
                leading-[0.99]
                tracking-[-0.05em]
                text-white
              "
            >
              {goal.name}

              <span className="text-red-700">
                .
              </span>
            </h3>

            <p
              className="
                mt-4
                max-w-[520px]
                text-[15px]
                leading-6
                text-slate-400
              "
            >
              {goal.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const GoalSelector: React.FC<{
  goal: Goal;
  index: number;
  active: boolean;
  onActivate: () => void;
}> = ({
  goal,
  index,
  active,
  onActivate,
}) => {
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
        w-full
        overflow-hidden
        rounded-[24px]
        border
        px-5
        py-4
        text-left
        backdrop-blur-2xl
        backdrop-saturate-150
        transition-all
        duration-300

        ${
          active
            ? `
              border-white/[0.13]
              bg-white/[0.065]
              shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_40px_rgba(0,0,0,0.14)]
            `
            : `
              border-white/[0.07]
              bg-white/[0.025]
              hover:border-white/[0.11]
              hover:bg-white/[0.045]
            `
        }
      `}
    >
      <motion.span
        animate={{
          opacity: active
            ? 1
            : 0,

          scaleY: active
            ? 1
            : 0.45,
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
        className="
          absolute
          bottom-4
          left-0
          top-4
          w-[2px]
          origin-center
          rounded-full
          bg-red-800
        "
      />

      <motion.div
        animate={{
          opacity: active
            ? 1
            : 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="
          pointer-events-none
          absolute
          -bottom-12
          -right-8
          h-24
          w-24
          rounded-full
          bg-red-800/[0.13]
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10
          flex
          items-center
          gap-4
        "
      >
        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-[14px]
            border
            transition-all
            duration-300

            ${
              active
                ? `
                  border-red-800/25
                  bg-red-900/20
                  text-red-700
                `
                : `
                  border-white/[0.08]
                  bg-white/[0.025]
                  text-slate-600
                  group-hover:text-slate-400
                `
            }
          `}
        >
          <GoalIcon
            icon={goal.icon}
            className="
              h-[18px]
              w-[18px]
            "
          />
        </div>

        <div className="min-w-0">
          <span
            className="
              text-[9px]
              font-medium
              tracking-[0.14em]
              text-slate-600
            "
          >
            {String(
              index + 1
            ).padStart(
              2,
              "0"
            )}
          </span>

          <h4
            className={`
              mt-1
              text-[15px]
              font-semibold
              leading-tight
              tracking-[-0.025em]
              transition-colors

              ${
                active
                  ? "text-white"
                  : "text-slate-400 group-hover:text-slate-200"
              }
            `}
          >
            {goal.name}
          </h4>
        </div>
      </div>
    </motion.button>
  );
};

const MobileGoal: React.FC<{
  goal: Goal;
  index: number;
}> = ({
  goal,
  index,
}) => {
  return (
    <motion.article
      variants={reveal}
      whileTap={{
        scale: 0.99,
      }}
      className="
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.10]
        bg-white/[0.045]
        p-5
        backdrop-blur-2xl
        backdrop-saturate-150
        shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_16px_46px_rgba(0,0,0,0.16)]
      "
    >
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
          via-white/30
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-16
          -right-10
          h-32
          w-32
          rounded-full
          bg-red-800/[0.11]
          blur-[48px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-5
          left-0
          top-5
          w-[2px]
          rounded-full
          bg-red-800/80
        "
      />

      <div
        className="
          relative
          z-10
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-[15px]
              border
              border-white/[0.10]
              bg-white/[0.05]
              text-red-700
              shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
            "
          >
            <GoalIcon
              icon={goal.icon}
              className="
                h-5
                w-5
              "
            />
          </div>

          <span
            className="
              text-[9px]
              font-medium
              tracking-[0.15em]
              text-white/20
            "
          >
            {String(
              index + 1
            ).padStart(
              2,
              "0"
            )}
          </span>
        </div>

        <h3
          className="
            mt-4
            text-[22px]
            font-semibold
            leading-[1.02]
            tracking-[-0.04em]
            text-white
          "
        >
          {goal.name}

          <span className="text-red-700">
            .
          </span>
        </h3>

        <p
          className="
            mt-2.5
            text-[13px]
            leading-5
            text-slate-500
          "
        >
          {goal.description}
        </p>
      </div>
    </motion.article>
  );
};

const Goals: React.FC<{
  data?: Goal[];
}> = ({
  data,
}) => {
  const [
    fetchedGoals,
    setFetchedGoals,
  ] = useState<Goal[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(
    data === undefined
  );

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const realGoals =
    data !== undefined
      ? data
      : fetchedGoals;

  const goals =
    realGoals.length > 0
      ? realGoals
      : placeholderGoals;

  useEffect(() => {
    if (
      data !== undefined
    ) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const fetchGoals =
      async () => {
        try {
          const result =
            await getGoals();

          if (mounted) {
            setFetchedGoals(
              result
            );
          }
        } catch (error) {
          console.error(
            "Failed to fetch goals:",
            error
          );
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      };

    fetchGoals();

    return () => {
      mounted = false;
    };
  }, [data]);

  useEffect(() => {
    if (
      activeIndex >
      goals.length - 1
    ) {
      setActiveIndex(0);
    }
  }, [
    goals.length,
    activeIndex,
  ]);

  const activeGoal =
    goals[activeIndex];

  return (
    <section
      id="goals"
      className="
        relative
        overflow-hidden
        py-24
        sm:py-28
        lg:py-32
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -left-24
          top-[36%]
          hidden
          h-[340px]
          w-[340px]
          rounded-full
          bg-red-800/[0.08]
          blur-[130px]
          lg:block
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          bottom-[8%]
          hidden
          h-[320px]
          w-[320px]
          rounded-full
          bg-white/[0.018]
          blur-[130px]
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
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          variants={reveal}
          className="
            mb-11
            max-w-3xl
            sm:mb-14
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
            Goals
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
            What we want
            <br className="hidden sm:block" /> to make happen.
          </h2>

          <p
            className="
              mt-5
              max-w-xl
              text-[14px]
              leading-6
              text-slate-500
              sm:text-[15px]
            "
          >
            A few things iNITiate should make easier at NIT.
          </p>
        </motion.div>

        {isLoading && (
          <div
            className="
              flex
              justify-center
              py-16
            "
          >
            <Loader />
          </div>
        )}

        {!isLoading &&
          activeGoal && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.1,
              }}
              variants={stagger}
              className="
                hidden
                grid-cols-[1.15fr_.85fr]
                gap-5
                md:grid
                lg:grid-cols-[1.25fr_.75fr]
              "
            >
              <motion.div
                variants={reveal}
              >
                <GoalFocus
                  goal={activeGoal}
                  index={
                    activeIndex
                  }
                />
              </motion.div>

              <motion.div
                variants={stagger}
                className="
                  flex
                  flex-col
                  gap-3
                "
              >
                {goals.map(
                  (
                    goal,
                    index
                  ) => (
                    <motion.div
                      key={
                        goal.id
                      }
                      variants={
                        reveal
                      }
                    >
                      <GoalSelector
                        goal={
                          goal
                        }
                        index={
                          index
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
                    </motion.div>
                  )
                )}
              </motion.div>
            </motion.div>
          )}

        {!isLoading &&
          goals.length > 0 && (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.05,
              }}
              className="
                space-y-3
                md:hidden
              "
            >
              {goals.map(
                (
                  goal,
                  index
                ) => (
                  <MobileGoal
                    key={
                      goal.id
                    }
                    goal={
                      goal
                    }
                    index={
                      index
                    }
                  />
                )
              )}
            </motion.div>
          )}
      </div>
    </section>
  );
};

export default Goals;