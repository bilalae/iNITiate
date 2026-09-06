import React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  Variants,
} from "framer-motion";

import {
  GithubIcon,
  InstagramIcon,
} from "./icons/SocialIcons";

import { TeamMember } from "./AdminDashboard";

/* =========================================================
   MOTION
========================================================= */

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

const gridReveal: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name?: string) => {
  if (!name) return "IN";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

/* =========================================================
   DESKTOP LIQUID GLASS MEMBER
========================================================= */

const GlassMemberCard: React.FC<{
  person: TeamMember;
}> = ({ person }) => {
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const smoothTiltX = useSpring(tiltX, {
    stiffness: 150,
    damping: 24,
  });

  const smoothTiltY = useSpring(tiltY, {
    stiffness: 150,
    damping: 24,
  });

  const glassHighlight = useMotionTemplate`
    radial-gradient(
      240px circle at ${pointerX}% ${pointerY}%,
      rgba(255,255,255,0.15),
      rgba(255,255,255,0.045) 35%,
      transparent 68%
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

    const normalizedX = x / 100 - 0.5;
    const normalizedY = y / 100 - 0.5;

    tiltX.set(normalizedY * -1.4);
    tiltY.set(normalizedX * 1.4);
  };

  const resetPointer = () => {
    pointerX.set(50);
    pointerY.set(50);

    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.article
      variants={reveal}
      whileHover={{
        y: -4,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 24,
      }}
      className="group"
    >
      <motion.div
        onMouseMove={handlePointerMove}
        onMouseLeave={resetPointer}
        style={{
          rotateX: smoothTiltX,
          rotateY: smoothTiltY,
          transformPerspective: 1000,
        }}
        className="
          relative
          min-h-[158px]
          overflow-hidden
          rounded-[28px]

          border
          border-white/[0.12]

          bg-white/[0.055]

          px-4
          py-4

          backdrop-blur-2xl
          backdrop-saturate-150

          shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(255,255,255,0.025),0_22px_70px_rgba(0,0,0,0.22)]
        "
      >
        {/* =================================================
            GLASS REFLECTION
        ================================================== */}

        <motion.div
          style={{
            background: glassHighlight,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            z-0
          "
        />

        {/* =================================================
            NIT / iNITiate MAROON REFRACTION
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -left-16
            top-1/2

            h-[180px]
            w-[180px]

            -translate-y-1/2
            rounded-full

            bg-red-800/[0.14]

            blur-[58px]

            transition-all
            duration-700

            group-hover:bg-red-800/[0.20]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            right-[8%]

            h-40
            w-40

            rounded-full

            bg-red-900/[0.12]

            blur-[60px]

            transition-all
            duration-700

            group-hover:bg-red-900/[0.17]
          "
        />

        {/* =================================================
            MAROON LIQUID EDGE
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute

            bottom-7
            left-0
            top-7

            w-[2px]

            bg-gradient-to-b
            from-transparent
            via-red-800/80
            to-transparent

            opacity-80

            transition-all
            duration-500

            group-hover:via-red-700
            group-hover:opacity-100
          "
        />

        {/* top reflection */}

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
            via-white/35
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
            CONTENT
        ================================================== */}

        <div
          className="
            relative
            z-10

            flex
            min-h-[126px]
            items-center
            gap-4
          "
        >
          {/* =================================================
              PORTRAIT
          ================================================== */}

          <div
            className="
              relative

              h-[124px]
              w-[104px]

              shrink-0

              overflow-hidden
              rounded-[22px]

              border
              border-white/[0.13]

              bg-black/20

              shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_28px_rgba(0,0,0,0.24)]

              transition-all
              duration-500

              group-hover:border-red-800/35
            "
          >
            {person.imageUrl ? (
              <img
                src={person.imageUrl}
                alt={
                  person.name ||
                  "iNITiate team member"
                }
                className="
                  h-full
                  w-full

                  object-cover
                  object-center

                  transition-transform
                  duration-700
                  ease-out

                  group-hover:scale-[1.035]
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  w-full

                  items-center
                  justify-center

                  bg-white/[0.025]
                "
              >
                <span
                  className="
                    text-3xl
                    font-semibold

                    tracking-[-0.06em]

                    text-white/20
                  "
                >
                  {getInitials(person.name)}
                </span>
              </div>
            )}

            {/* image depth */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0

                bg-gradient-to-t
                from-black/25
                via-transparent
                to-white/[0.045]
              "
            />

            {/* glass reflection */}

            <div
              className="
                pointer-events-none
                absolute

                left-2
                right-2
                top-[1px]

                h-px

                bg-gradient-to-r
                from-transparent
                via-white/30
                to-transparent
              "
            />

            {/* branded bottom reflection */}

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
                via-red-800/70
                to-transparent
              "
            />
          </div>

          {/* =================================================
              INFO
          ================================================== */}

          <div
            className="
              flex
              min-w-0
              flex-1
              flex-col
              justify-center
            "
          >
            {/* ROLE */}

            <p
              className="
                truncate

                text-[9px]
                font-semibold
                uppercase
                tracking-[0.17em]

                text-red-700

                transition-colors
                duration-300

                group-hover:text-red-600
              "
            >
              {person.role ||
                "Society Member"}
            </p>

            {/* NAME */}

            <h3
              className="
                mt-2

                line-clamp-2

                text-[19px]
                font-semibold
                leading-[1.05]
                tracking-[-0.04em]

                text-white
              "
            >
              {person.name || "Team Member"}
            </h3>

            {/* =================================================
                SOCIALS
            ================================================== */}

            {(person.instagramUrl ||
              person.githubUrl) && (
              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                "
              >
                {person.instagramUrl && (
                  <motion.a
                    href={person.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${person.name || "Team member"} on Instagram`}
                    whileHover={{
                      scale: 1.06,
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.94,
                    }}
                    className="
                      flex
                      h-8
                      w-8

                      items-center
                      justify-center

                      rounded-full

                      border
                      border-white/[0.11]

                      bg-white/[0.055]

                      text-slate-400

                      backdrop-blur-xl

                      shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]

                      transition-all
                      duration-300

                      hover:border-red-800/45
                      hover:bg-red-900/25
                      hover:text-white
                    "
                  >
                    <InstagramIcon className="h-3.5 w-3.5" />
                  </motion.a>
                )}

                {person.githubUrl && (
                  <motion.a
                    href={person.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${person.name || "Team member"} on GitHub`}
                    whileHover={{
                      scale: 1.06,
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.94,
                    }}
                    className="
                      flex
                      h-8
                      w-8

                      items-center
                      justify-center

                      rounded-full

                      border
                      border-white/[0.11]

                      bg-white/[0.055]

                      text-slate-400

                      backdrop-blur-xl

                      shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]

                      transition-all
                      duration-300

                      hover:border-red-800/45
                      hover:bg-red-900/25
                      hover:text-white
                    "
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                  </motion.a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
};

/* =========================================================
   MOBILE LIQUID GLASS MEMBER
========================================================= */

const MobileGlassMember: React.FC<{
  person: TeamMember;
}> = ({ person }) => {
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

        p-3.5

        backdrop-blur-2xl
        backdrop-saturate-150

        shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_40px_rgba(0,0,0,0.18)]
      "
    >
      {/* top reflection */}

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

      {/* branded refraction */}

      <div
        className="
          pointer-events-none
          absolute

          -bottom-12
          -right-12

          h-28
          w-28

          rounded-full

          bg-red-800/[0.10]

          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10

          grid
          grid-cols-[76px_1fr_auto]

          items-center
          gap-3.5
        "
      >
        {/* PORTRAIT */}

        <div
          className="
            relative

            h-[88px]
            w-[76px]

            overflow-hidden

            rounded-[18px]

            border
            border-white/[0.12]

            bg-black/20

            shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
          "
        >
          {person.imageUrl ? (
            <img
              src={person.imageUrl}
              alt={
                person.name ||
                "iNITiate team member"
              }
              className="
                h-full
                w-full

                object-cover
                object-center
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full

                items-center
                justify-center
              "
            >
              <span
                className="
                  text-xl
                  font-semibold

                  tracking-[-0.05em]

                  text-white/20
                "
              >
                {getInitials(person.name)}
              </span>
            </div>
          )}

          <div
            className="
              pointer-events-none
              absolute
              inset-0

              bg-gradient-to-t
              from-black/20
              to-white/[0.04]
            "
          />
        </div>

        {/* INFO */}

        <div className="min-w-0">
          <p
            className="
              truncate

              text-[9px]
              font-semibold
              uppercase
              tracking-[0.15em]

              text-red-700
            "
          >
            {person.role ||
              "Society Member"}
          </p>

          <h3
            className="
              mt-1.5

              line-clamp-2

              text-[19px]
              font-semibold
              leading-[1.08]
              tracking-[-0.035em]

              text-white
            "
          >
            {person.name ||
              "Team Member"}
          </h3>
        </div>

        {/* SOCIAL DOCK */}

        {(person.instagramUrl ||
          person.githubUrl) && (
          <div
            className="
              flex
              flex-col
              gap-2
            "
          >
            {person.instagramUrl && (
              <a
                href={person.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name || "Team member"} on Instagram`}
                className="
                  flex
                  h-9
                  w-9

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/[0.10]

                  bg-white/[0.055]

                  text-slate-400

                  backdrop-blur-xl

                  shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]

                  active:bg-red-900/30
                  active:text-white
                "
              >
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
            )}

            {person.githubUrl && (
              <a
                href={person.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name || "Team member"} on GitHub`}
                className="
                  flex
                  h-9
                  w-9

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/[0.10]

                  bg-white/[0.055]

                  text-slate-400

                  backdrop-blur-xl

                  shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]

                  active:bg-red-900/30
                  active:text-white
                "
              >
                <GithubIcon className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
};

/* =========================================================
   TEAM
========================================================= */

const Team: React.FC<{
  data?: TeamMember[];
}> = ({ data = [] }) => {
  return (
    <section
      id="team"
      className="
        relative
        overflow-hidden

        py-24
        sm:py-28
        lg:py-32
      "
    >
      {/* ===================================================
          MAROON BACKGROUND REFRACTION
      ==================================================== */}

      <div
        className="
          pointer-events-none
          absolute

          left-[4%]
          top-[37%]

          hidden

          h-[320px]
          w-[320px]

          rounded-full

          bg-red-800/[0.10]

          blur-[125px]

          lg:block
        "
      />

      <div
        className="
          pointer-events-none
          absolute

          bottom-[8%]
          right-[8%]

          hidden

          h-[300px]
          w-[300px]

          rounded-full

          bg-red-900/[0.10]

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
        {/* =================================================
            HEADER
        ================================================== */}

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
            Team
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
            People behind
            <br className="hidden sm:block" /> the ideas.
          </h2>

          <p
            className="
              mt-5
              max-w-lg

              text-[14px]
              leading-6

              text-slate-500

              sm:text-[15px]
            "
          >
            The students building, organizing and moving
            iNITiate forward.
          </p>
        </motion.div>

        {/* =================================================
            EMPTY
        ================================================== */}

        {data.length === 0 && (
          <div
            className="
              rounded-[24px]

              border
              border-white/[0.08]

              bg-white/[0.035]

              px-6
              py-8

              text-sm
              text-slate-500

              backdrop-blur-xl
            "
          >
            Team coming soon.
          </div>
        )}

        {/* =================================================
            DESKTOP / TABLET
        ================================================== */}

        {data.length > 0 && (
          <motion.div
            variants={gridReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.08,
            }}
            className="
              hidden
              grid-cols-2
              gap-4

              md:grid

              lg:grid-cols-3
              lg:gap-5
            "
          >
            {data.map((person) => (
              <GlassMemberCard
                key={person.id}
                person={person}
              />
            ))}
          </motion.div>
        )}

        {/* =================================================
            MOBILE
        ================================================== */}

        {data.length > 0 && (
          <motion.div
            variants={gridReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.06,
            }}
            className="
              space-y-3
              md:hidden
            "
          >
            {data.map((person) => (
              <MobileGlassMember
                key={person.id}
                person={person}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Team;