import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

/*
 * SHA-256 hash of the existing admin passcode.
 *
 * This avoids leaving the literal passcode sitting directly
 * in this component as readable plaintext.
 *
 * IMPORTANT:
 * This remains client-side gating.
 * Firestore Security Rules must protect actual database writes.
 */

const ADMIN_PASSCODE_HASH =
  "78db78d3bad04b16101712d7a815e23c8f0377f6add6e5b677d92454363df318";

/* =========================================================
   TYPES
========================================================= */

interface PasscodeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/* =========================================================
   ICONS
========================================================= */

const CloseIcon = ({
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
      d="M6 6l12 12M18 6 6 18"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const LockIcon = ({
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
    <rect
      x="5"
      y="10"
      width="14"
      height="10"
      rx="3"
      strokeWidth="1.5"
    />

    <path
      d="M8 10V8a4 4 0 0 1 8 0v2"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/* =========================================================
   HASH
========================================================= */

const sha256 = async (
  value: string
) => {
  const bytes =
    new TextEncoder().encode(
      value
    );

  const digest =
    await crypto.subtle.digest(
      "SHA-256",
      bytes
    );

  return Array.from(
    new Uint8Array(
      digest
    )
  )
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, "0")
    )
    .join("");
};

/* =========================================================
   PASSCODE
========================================================= */

const PasscodeModal: React.FC<
  PasscodeModalProps
> = ({
  onClose,
  onSuccess,
}) => {
  const [
    passcode,
    setPasscode,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    shake,
    setShake,
  ] = useState(0);

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  /* =======================================================
     ESCAPE / FOCUS
  ======================================================== */

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  /* =======================================================
     SUBMIT
  ======================================================== */

  const handleSubmit =
    async (
      event:
        React.FormEvent
    ) => {
      event.preventDefault();

      if (
        !passcode ||
        submitting
      ) {
        return;
      }

      setSubmitting(true);
      setError("");

      try {
        const hash =
          await sha256(
            passcode
          );

        if (
          hash ===
          ADMIN_PASSCODE_HASH
        ) {
          onSuccess();

          return;
        }

        setError(
          "Incorrect passcode."
        );

        setPasscode("");

        setShake(
          (value) =>
            value + 1
        );

        requestAnimationFrame(
          () =>
            inputRef.current?.focus()
        );
      } catch (error) {
        console.error(
          "Passcode verification failed:",
          error
        );

        setError(
          "Could not verify passcode."
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div
      className="
        fixed
        inset-0
        z-[120]

        flex
        items-center
        justify-center

        p-4
      "
    >
      {/* ===================================================
          BACKDROP
      ==================================================== */}

      <motion.button
        type="button"
        aria-label="Close admin access"
        onClick={onClose}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        className="
          absolute
          inset-0

          bg-black/50

          backdrop-blur-[12px]
        "
      />

      {/* ===================================================
          GLASS PANEL
      ==================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.975,
          y: 14,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.98,
          y: 10,
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
          relative
          z-10

          w-full
          max-w-[410px]

          overflow-hidden

          rounded-[30px]

          border
          border-white/[0.12]

          bg-[#090b10]/60

          p-6

          backdrop-blur-3xl
          backdrop-saturate-150

          shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_30px_100px_rgba(0,0,0,0.38)]

          sm:p-7
        "
      >
        {/* =================================================
            TOP SHEEN
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
            via-white/45
            to-transparent
          "
        />

        {/* =================================================
            MAROON REFRACTION
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute

            -bottom-24
            -right-16

            h-52
            w-52

            rounded-full

            bg-red-900/[0.15]

            blur-[70px]
          "
        />

        {/* =================================================
            INNER EDGE
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-[1px]

            rounded-[29px]

            border
            border-white/[0.025]
          "
        />

        {/* =================================================
            CLOSE
        ================================================== */}

        <motion.button
          type="button"
          onClick={onClose}
          whileTap={{
            scale: 0.92,
          }}
          className="
            absolute
            right-4
            top-4

            z-20

            flex
            h-9
            w-9

            items-center
            justify-center

            rounded-[12px]

            border
            border-white/[0.07]

            bg-white/[0.025]

            text-slate-600

            transition-all
            duration-200

            hover:bg-white/[0.05]
            hover:text-white
          "
          aria-label="Close"
        >
          <CloseIcon className="h-4 w-4" />
        </motion.button>

        {/* =================================================
            CONTENT
        ================================================== */}

        <div
          className="
            relative
            z-10
          "
        >
          {/* BRAND */}

          <div
            className="
              flex
              h-11
              w-11

              items-center
              justify-center

              rounded-[15px]

              border
              border-white/[0.09]

              bg-white/[0.035]

              shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
            "
          >
            <LockIcon
              className="
                h-[18px]
                w-[18px]
                text-red-700
              "
            />
          </div>

          <div
            className="
              mt-7
            "
          >
            <span
              className="
                text-[18px]
                font-semibold
                tracking-[-0.05em]

                text-white
              "
            >
              i
              <span className="text-red-700">
                NIT
              </span>
              iate
            </span>

            <h2
              className="
                mt-3

                text-[32px]
                font-semibold
                leading-none
                tracking-[-0.055em]

                text-white
              "
            >
              Admin access.
            </h2>
          </div>

          {/* =================================================
              FORM
          ================================================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="
              mt-7
            "
          >
            <motion.div
              key={
                shake
              }
              animate={
                shake > 0
                  ? {
                      x: [
                        0,
                        -5,
                        4,
                        -3,
                        2,
                        0,
                      ],
                    }
                  : {
                      x: 0,
                    }
              }
              transition={{
                duration: 0.32,
              }}
            >
              <label
                htmlFor="admin-passcode"
                className="sr-only"
              >
                Passcode
              </label>

              <input
                ref={
                  inputRef
                }
                id="admin-passcode"
                type="password"
                value={
                  passcode
                }
                onChange={(
                  event
                ) => {
                  setPasscode(
                    event.target
                      .value
                  );

                  if (
                    error
                  ) {
                    setError(
                      ""
                    );
                  }
                }}
                autoComplete="current-password"
                placeholder="Passcode"
                className={`
                  h-[52px]
                  w-full

                  rounded-[16px]

                  border

                  bg-black/20

                  px-4

                  text-[14px]
                  tracking-[0.04em]

                  text-white

                  outline-none

                  backdrop-blur-xl

                  transition-all
                  duration-200

                  placeholder:tracking-normal
                  placeholder:text-slate-700

                  ${
                    error
                      ? `
                        border-red-800/55

                        shadow-[0_0_0_3px_rgba(127,29,29,0.08)]
                      `
                      : `
                        border-white/[0.09]

                        focus:border-red-800/45
                        focus:bg-white/[0.025]

                        focus:shadow-[0_0_0_3px_rgba(127,29,29,0.07)]
                      `
                  }
                `}
              />
            </motion.div>

            <div
              className="
                h-7
                pt-2
              "
            >
              {error && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -3,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="
                    text-[11px]
                    text-red-500
                  "
                >
                  {error}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={
                submitting ||
                !passcode
              }
              whileTap={{
                scale:
                  submitting
                    ? 1
                    : 0.985,
              }}
              className="
                relative

                flex
                h-[50px]
                w-full

                items-center
                justify-center

                overflow-hidden

                rounded-[16px]

                border
                border-red-800/45

                bg-red-900/30

                text-[13px]
                font-semibold

                text-white

                shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]

                transition-all
                duration-200

                hover:border-red-700/55
                hover:bg-red-900/45

                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <span
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

              {submitting
                ? "Verifying…"
                : "Continue"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PasscodeModal;