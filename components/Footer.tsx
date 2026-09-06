import React from "react";

import {
  motion,
} from "framer-motion";

import {
  InstagramIcon,
} from "./icons/SocialIcons";

/* =========================================================
   LINKS
========================================================= */

const footerLinks = [
  { name: "Events", href: "#events" },
  { name: "Team", href: "#team" },
  { name: "Goals", href: "#goals" },
  { name: "FAQ", href: "#faq" },
  { name: "Join", href: "#join" },
];

/* =========================================================
   ARROW
========================================================= */

const ArrowUpIcon: React.FC<{
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
      d="M12 19V5M6.5 10.5L12 5l5.5 5.5"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* =========================================================
   FOOTER
========================================================= */

const Footer: React.FC<{
  onNavigateToAdmin: () => void;
}> = ({
  onNavigateToAdmin,
}) => {
  const scrollToSection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) {
      return;
    }

    event.preventDefault();

    document
      .querySelector(href)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const scrollToTop = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="
        relative
        overflow-hidden

        border-t
        border-white/[0.06]
      "
    >
      {/* ===================================================
          SUBTLE MAROON DEPTH
      ==================================================== */}

      <div
        className="
          pointer-events-none
          absolute

          -bottom-36
          left-[12%]

          h-[240px]
          w-[320px]

          rounded-full

          bg-red-900/[0.05]

          blur-[120px]
        "
      />

      {/* ===================================================
          CONTENT
      ==================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto
          max-w-7xl

          px-5
          py-7

          sm:px-6
          sm:py-9

          lg:px-8
          lg:py-12
        "
      >
        {/* =================================================
            BRAND + MOBILE SOCIAL
        ================================================== */}

        <motion.div
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
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            flex
            items-center
            justify-between
          "
        >
          <div>
            <a
              href="#"
              onClick={
                scrollToTop
              }
              className="
                inline-block

                text-[24px]
                font-semibold
                tracking-[-0.055em]

                text-white

                transition-opacity
                duration-300

                hover:opacity-75

                lg:text-[25px]
              "
            >
              i
              <span className="text-red-700">
                NIT
              </span>
              iate
            </a>

            <p
              className="
                mt-0.5

                text-[8px]
                font-semibold
                uppercase
                tracking-[0.16em]

                text-slate-600

                sm:text-[9px]
              "
            >
              Science & Technology Society
            </p>
          </div>

          {/* =================================================
              INSTAGRAM
          ================================================== */}

          <motion.a
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.94,
            }}
            href="https://www.instagram.com/initiate.nit"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="iNITiate on Instagram"
            className="
              flex

              h-9
              w-9

              items-center
              justify-center

              rounded-full

              border
              border-white/[0.08]

              bg-white/[0.025]

              text-slate-500

              backdrop-blur-xl

              shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]

              transition-all
              duration-300

              hover:border-red-800/30
              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            <InstagramIcon className="h-4 w-4" />
          </motion.a>
        </motion.div>

        {/* =================================================
            NAVIGATION

            Mobile = one tight row.
            Desktop = slightly roomier.
        ================================================== */}

        <motion.nav
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
            delay: 0.05,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            mt-7

            grid
            grid-cols-5

            items-center

            gap-1

            sm:mt-8
            sm:flex
            sm:flex-wrap
            sm:gap-x-6
            sm:gap-y-3
          "
        >
          {footerLinks.map(
            (link) => (
              <a
                key={
                  link.name
                }
                href={
                  link.href
                }
                onClick={(
                  event
                ) =>
                  scrollToSection(
                    event,
                    link.href
                  )
                }
                className="
                  relative

                  py-1

                  text-center

                  text-[11px]
                  font-medium

                  text-slate-500

                  transition-colors
                  duration-300

                  after:absolute
                  after:-bottom-0.5
                  after:left-1/2

                  after:h-px
                  after:w-0

                  after:-translate-x-1/2

                  after:bg-red-800

                  after:transition-all
                  after:duration-300

                  hover:text-white
                  hover:after:w-5

                  sm:text-left
                  sm:text-[12px]
                  sm:after:left-0
                  sm:after:translate-x-0
                  sm:hover:after:w-full
                "
              >
                {link.name}
              </a>
            )
          )}
        </motion.nav>

        {/* =================================================
            DIVIDER
        ================================================== */}

        <div
          className="
            relative

            mt-6

            h-px
            w-full

            bg-white/[0.05]

            sm:mt-8
          "
        >
          <div
            className="
              absolute
              left-0
              top-0

              h-px
              w-16

              bg-gradient-to-r
              from-red-800/40
              to-transparent
            "
          />
        </div>

        {/* =================================================
            BOTTOM ROW

            Stays horizontal even on phones.
        ================================================== */}

        <div
          className="
            mt-5

            flex
            items-center
            justify-between

            gap-4
          "
        >
          {/* admin trigger preserved */}

          <button
            type="button"
            onClick={
              onNavigateToAdmin
            }
            className="
              text-[10px]
              text-slate-600

              transition-colors
              duration-300

              hover:text-slate-400

              sm:text-[11px]
            "
          >
            © {new Date().getFullYear()} iNITiate
          </button>

          {/* BACK TO TOP */}

          <a
            href="#"
            onClick={
              scrollToTop
            }
            className="
              group

              flex
              items-center

              gap-1.5

              text-[10px]
              font-medium

              text-slate-600

              transition-colors
              duration-300

              hover:text-slate-300

              sm:text-[11px]
            "
          >
            Back to top

            <ArrowUpIcon
              className="
                h-3
                w-3

                transition-transform
                duration-300

                group-hover:-translate-y-0.5
              "
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;