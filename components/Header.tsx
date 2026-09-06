import React, {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

/* =========================================================
   NAVIGATION
========================================================= */

const navLinks = [
  {
    name: "Events",
    href: "#events",
  },
  {
    name: "Team",
    href: "#team",
  },
  {
    name: "Goals",
    href: "#goals",
  },
  {
    name: "FAQ",
    href: "#faq",
  },
];

/* =========================================================
   ICONS
========================================================= */

const ArrowIcon = ({
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
      d="M8 16L16 8M10 8h6v6"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MenuIcon = ({
  open,
}: {
  open: boolean;
}) => (
  <div
    className="
      relative
      h-[18px]
      w-[20px]
    "
  >
    <motion.span
      animate={{
        rotate: open ? 45 : 0,
        y: open ? 0 : -5,
      }}
      transition={{
        duration: 0.25,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="
        absolute
        left-0
        top-1/2

        h-[1.5px]
        w-full

        -translate-y-1/2

        rounded-full
        bg-current
      "
    />

    <motion.span
      animate={{
        opacity: open ? 0 : 1,
        scaleX: open ? 0.45 : 1,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        absolute
        left-0
        top-1/2

        h-[1.5px]
        w-full

        -translate-y-1/2

        rounded-full
        bg-current
      "
    />

    <motion.span
      animate={{
        rotate: open ? -45 : 0,
        y: open ? 0 : 5,
      }}
      transition={{
        duration: 0.25,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="
        absolute
        left-0
        top-1/2

        h-[1.5px]
        w-full

        -translate-y-1/2

        rounded-full
        bg-current
      "
    />
  </div>
);

/* =========================================================
   HEADER
========================================================= */

const Header: React.FC = () => {
  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    activeSection,
    setActiveSection,
  ] = useState("#hero");

  /* =======================================================
     SCROLL STATE
  ======================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 18
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =======================================================
     ACTIVE SECTION
  ======================================================== */

  useEffect(() => {
    const sectionIds = [
      "hero",
      "events",
      "team",
      "goals",
      "faq",
      "join",
    ];

    const sections =
      sectionIds
        .map((id) =>
          document.getElementById(
            id
          )
        )
        .filter(
          (
            section
          ): section is HTMLElement =>
            Boolean(section)
        );

    if (
      sections.length === 0
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visibleEntries =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              );

          if (
            visibleEntries.length === 0
          ) {
            return;
          }

          const section =
            visibleEntries[0]
              .target as HTMLElement;

          setActiveSection(
            `#${section.id}`
          );
        },
        {
          rootMargin:
            "-32% 0px -48% 0px",

          threshold: [
            0,
            0.1,
            0.25,
            0.5,
          ],
        }
      );

    sections.forEach(
      (section) => {
        observer.observe(
          section
        );
      }
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =======================================================
     MOBILE MENU
  ======================================================== */

  useEffect(() => {
    document.body.style.overflow =
      mobileMenuOpen
        ? "hidden"
        : "";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setMobileMenuOpen(
          false
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [mobileMenuOpen]);

  /* =======================================================
     NAVIGATION
  ======================================================== */

  const scrollToSection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();

    document
      .querySelector(href)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    setMobileMenuOpen(
      false
    );
  };

  const scrollHome = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setActiveSection(
      "#hero"
    );

    setMobileMenuOpen(
      false
    );
  };

  const glassVisible =
    scrolled ||
    mobileMenuOpen;

  return (
    <>
      {/* ===================================================
          HEADER
      ==================================================== */}

      <header
        className="
          pointer-events-none

          fixed
          inset-x-0
          top-0

          z-50
        "
      >
        <div
          className="
            mx-auto
            max-w-[1400px]

            px-3
            pt-3

            sm:px-4
            lg:px-6
          "
        >
          {/* =================================================
              HIGH-TRANSPARENCY LIQUID GLASS

              Very little dark tint.
              Lower blur lets more of the page read through.
          ================================================== */}

          <motion.div
            animate={{
              y:
                glassVisible
                  ? 0
                  : -2,
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
              pointer-events-auto
              relative

              overflow-hidden

              rounded-[22px]

              border

              transition-all
              duration-500

              ${
                glassVisible
                  ? `
                    border-white/[0.13]

                    bg-[#090b11]/[0.14]

                    backdrop-blur-[18px]
                    backdrop-saturate-[1.35]

                    shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_12px_45px_rgba(0,0,0,0.12)]
                  `
                  : `
                    border-transparent
                    bg-transparent
                  `
              }
            `}
          >
            {/* ===============================================
                VERY LIGHT GLASS WASH
            ================================================ */}

            <div
              className={`
                pointer-events-none
                absolute
                inset-0

                bg-gradient-to-b
                from-white/[0.025]
                via-transparent
                to-transparent

                transition-opacity
                duration-500

                ${
                  glassVisible
                    ? "opacity-100"
                    : "opacity-0"
                }
              `}
            />

            {/* ===============================================
                TOP SPECULAR EDGE
            ================================================ */}

            <div
              className={`
                pointer-events-none
                absolute

                left-[8%]
                right-[8%]
                top-0

                h-px

                bg-gradient-to-r
                from-transparent
                via-white/45
                to-transparent

                transition-opacity
                duration-500

                ${
                  glassVisible
                    ? "opacity-100"
                    : "opacity-0"
                }
              `}
            />

            {/* ===============================================
                SUBTLE MAROON REFRACTION

                Lower opacity so it doesn't muddy
                whatever is behind the navbar.
            ================================================ */}

            <div
              className={`
                pointer-events-none
                absolute

                -bottom-16
                right-[8%]

                h-28
                w-52

                rounded-full

                bg-red-900/[0.055]

                blur-3xl

                transition-opacity
                duration-500

                ${
                  glassVisible
                    ? "opacity-100"
                    : "opacity-0"
                }
              `}
            />

            {/* ===============================================
                INNER GLASS EDGE
            ================================================ */}

            <div
              className={`
                pointer-events-none
                absolute
                inset-[1px]

                rounded-[21px]

                border
                border-white/[0.025]

                transition-opacity
                duration-500

                ${
                  glassVisible
                    ? "opacity-100"
                    : "opacity-0"
                }
              `}
            />

            {/* ===============================================
                CONTENT
            ================================================ */}

            <div
              className="
                relative
                z-10

                flex
                h-[68px]

                items-center
                justify-between

                px-4

                sm:h-[72px]
                sm:px-5

                lg:px-6
              "
            >
              {/* =============================================
                  BRAND
              ============================================== */}

              <a
                href="#"
                onClick={
                  scrollHome
                }
                aria-label="iNITiate home"
                className="
                  group
                  flex
                  items-center
                "
              >
                <span
                  className="
                    text-[23px]
                    font-semibold
                    tracking-[-0.05em]

                    text-white

                    drop-shadow-[0_1px_8px_rgba(0,0,0,0.25)]

                    transition-opacity
                    duration-300

                    group-hover:opacity-80

                    sm:text-[24px]
                  "
                >
                  i
                  <span className="text-red-700">
                    NIT
                  </span>
                  iate
                </span>
              </a>

              {/* =============================================
                  DESKTOP NAV
              ============================================== */}

              <nav
                className="
                  hidden

                  items-center

                  gap-1

                  md:flex
                "
              >
                {navLinks.map(
                  (link) => {
                    const active =
                      activeSection ===
                      link.href;

                    return (
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
                        className={`
                          group/nav
                          relative

                          rounded-[13px]

                          px-3.5
                          py-2.5

                          text-[13px]
                          font-medium

                          drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)]

                          transition-all
                          duration-300

                          ${
                            active
                              ? `
                                text-white
                              `
                              : `
                                text-slate-300/80

                                hover:bg-white/[0.055]
                                hover:text-white
                              `
                          }
                        `}
                      >
                        {link.name}

                        {active && (
                          <motion.span
                            layoutId="header-active-section"
                            transition={{
                              type: "spring",
                              stiffness: 320,
                              damping: 28,
                            }}
                            className="
                              absolute

                              bottom-[4px]
                              left-1/2

                              h-px
                              w-[18px]

                              -translate-x-1/2

                              rounded-full

                              bg-red-700
                            "
                          />
                        )}
                      </a>
                    );
                  }
                )}
              </nav>

              {/* =============================================
                  DESKTOP JOIN
              ============================================== */}

              <div
                className="
                  hidden
                  md:block
                "
              >
                <motion.a
                  href="#join"
                  onClick={(
                    event
                  ) =>
                    scrollToSection(
                      event,
                      "#join"
                    )
                  }
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className={`
                    group/join
                    relative

                    flex
                    items-center
                    justify-center

                    gap-2

                    overflow-hidden

                    rounded-full

                    border

                    px-4
                    py-2.5

                    text-[13px]
                    font-medium

                    text-white

                    backdrop-blur-[10px]

                    transition-all
                    duration-300

                    ${
                      activeSection ===
                      "#join"
                        ? `
                          border-red-700/55
                          bg-red-900/20
                        `
                        : `
                          border-red-800/40
                          bg-red-900/[0.10]

                          hover:border-red-700/55
                          hover:bg-red-900/20
                        `
                    }
                  `}
                >
                  {/* internal refraction */}

                  <div
                    className="
                      pointer-events-none
                      absolute

                      -bottom-10
                      left-1/2

                      h-16
                      w-24

                      -translate-x-1/2

                      rounded-full

                      bg-red-700/[0.12]

                      blur-xl
                    "
                  />

                  {/* highlight */}

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
                      via-white/30
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

                  <ArrowIcon
                    className="
                      relative
                      z-10

                      h-4
                      w-4

                      text-slate-400

                      transition-all
                      duration-200

                      group-hover/join:translate-x-0.5
                      group-hover/join:-translate-y-0.5

                      group-hover/join:text-red-700
                    "
                  />
                </motion.a>
              </div>

              {/* =============================================
                  MOBILE BUTTON
              ============================================== */}

              <motion.button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    (previous) =>
                      !previous
                  )
                }
                whileTap={{
                  scale: 0.94,
                }}
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation"
                    : "Open navigation"
                }
                aria-expanded={
                  mobileMenuOpen
                }
                className={`
                  flex

                  h-10
                  w-10

                  items-center
                  justify-center

                  rounded-[14px]

                  border

                  text-slate-200

                  backdrop-blur-[12px]

                  transition-all
                  duration-300

                  md:hidden

                  ${
                    mobileMenuOpen
                      ? `
                        border-red-800/35
                        bg-red-900/[0.12]
                        text-white
                      `
                      : `
                        border-white/[0.12]
                        bg-white/[0.025]

                        hover:border-white/[0.18]
                        hover:bg-white/[0.05]
                      `
                  }
                `}
              >
                <MenuIcon
                  open={
                    mobileMenuOpen
                  }
                />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ===================================================
          MOBILE MENU
      ==================================================== */}

      <AnimatePresence
        initial={false}
      >
        {mobileMenuOpen && (
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
              duration: 0.22,
            }}
            className="
              fixed
              inset-0

              z-40

              md:hidden
            "
          >
            {/* ===============================================
                BACKDROP

                Barely darkens the site.
            ================================================ */}

            <motion.button
              type="button"
              aria-label="Close navigation"
              onClick={() =>
                setMobileMenuOpen(
                  false
                )
              }
              className="
                absolute
                inset-0

                bg-black/[0.08]

                backdrop-blur-[2px]
              "
            />

            {/* ===============================================
                HIGH-TRANSPARENCY FROSTED SHEET
            ================================================ */}

            <motion.div
              initial={{
                opacity: 0,
                y: -12,
                scale: 0.985,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -8,
                scale: 0.99,
              }}
              transition={{
                duration: 0.32,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                absolute

                left-3
                right-3
                top-[88px]

                overflow-hidden

                rounded-[26px]

                border
                border-white/[0.14]

                bg-[#090b11]/[0.22]

                p-3

                backdrop-blur-[20px]
                backdrop-saturate-[1.4]

                shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_28px_90px_rgba(0,0,0,0.18)]
              "
            >
              {/* subtle glass wash */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0

                  bg-gradient-to-b
                  from-white/[0.03]
                  via-transparent
                  to-transparent
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
                  via-white/45
                  to-transparent
                "
              />

              {/* maroon depth */}

              <div
                className="
                  pointer-events-none
                  absolute

                  -bottom-28
                  right-0

                  h-[220px]
                  w-[220px]

                  rounded-full

                  bg-red-900/[0.065]

                  blur-[80px]
                "
              />

              {/* inner rim */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-[1px]

                  rounded-[25px]

                  border
                  border-white/[0.03]
                "
              />

              {/* =============================================
                  LINKS
              ============================================== */}

              <div
                className="
                  relative
                  z-10
                "
              >
                {navLinks.map(
                  (
                    link,
                    index
                  ) => {
                    const active =
                      activeSection ===
                      link.href;

                    return (
                      <motion.a
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
                        initial={{
                          opacity: 0,
                          y: 7,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.32,
                          delay:
                            index *
                            0.03,
                          ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                          ],
                        }}
                        className={`
                          group/mobile

                          flex
                          items-center
                          justify-between

                          rounded-[19px]

                          px-4
                          py-3.5

                          transition-all
                          duration-250

                          ${
                            active
                              ? `
                                bg-white/[0.07]
                              `
                              : `
                                hover:bg-white/[0.045]
                              `
                          }
                        `}
                      >
                        <span
                          className={`
                            text-[22px]
                            font-semibold
                            tracking-[-0.04em]

                            drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]

                            ${
                              active
                                ? "text-white"
                                : "text-slate-200"
                            }
                          `}
                        >
                          {
                            link.name
                          }
                        </span>

                        <ArrowIcon
                          className="
                            h-4
                            w-4

                            text-slate-500

                            transition-all
                            duration-200

                            group-hover/mobile:translate-x-0.5
                            group-hover/mobile:-translate-y-0.5

                            group-hover/mobile:text-white
                          "
                        />
                      </motion.a>
                    );
                  }
                )}

                {/* ===========================================
                    JOIN
                ============================================ */}

                <motion.a
                  href="#join"
                  onClick={(
                    event
                  ) =>
                    scrollToSection(
                      event,
                      "#join"
                    )
                  }
                  initial={{
                    opacity: 0,
                    y: 7,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.32,
                    delay: 0.13,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  className="
                    relative

                    mt-2

                    flex
                    h-[54px]

                    items-center
                    justify-between

                    overflow-hidden

                    rounded-[19px]

                    border
                    border-red-800/35

                    bg-red-900/[0.12]

                    px-4

                    text-[14px]
                    font-semibold

                    text-white

                    backdrop-blur-[10px]
                  "
                >
                  <div
                    className="
                      pointer-events-none
                      absolute

                      -bottom-16
                      left-1/2

                      h-24
                      w-[180px]

                      -translate-x-1/2

                      rounded-full

                      bg-red-700/[0.12]

                      blur-2xl
                    "
                  />

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
                      via-white/30
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

                  <ArrowIcon
                    className="
                      relative
                      z-10

                      h-4
                      w-4

                      text-red-700
                    "
                  />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;