import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import Loader from "./Loader";

/* =========================================================
   TYPES
========================================================= */

export interface Submission {
  id: string;
  name: string;
  campusId: string;
  email: string;
  interests: string;
  submissionDate: string;
  subscribeNewsletter: boolean;
}

export interface Event {
  id: string;
  name?: string;
  description?: string;
  date?: string;
  venue?: string;
  status?: "Upcoming" | "Past";
  imageUrl?: string;
  order?: number;
}

export interface TeamMember {
  id: string;
  name?: string;
  role?: string;
  imageUrl?: string;
  githubUrl?: string;
  instagramUrl?: string;
  order?: number;
}

export interface FAQ {
  id: string;
  question?: string;
  answer?: string;
  order?: number;
}

export interface Goal {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  order?: number;
}

type Tab =
  | "Submissions"
  | "Events"
  | "Team"
  | "FAQs"
  | "Goals";

type EditableItem =
  | Event
  | TeamMember
  | FAQ
  | Goal;

/* =========================================================
   CONSTANTS
========================================================= */

const tabs: Tab[] = [
  "Submissions",
  "Events",
  "Team",
  "FAQs",
  "Goals",
];

const collectionForTab: Record<Tab, string> = {
  Submissions: "submissions",
  Events: "events",
  Team: "team",
  FAQs: "faqs",
  Goals: "goals",
};

const singularForTab: Record<Tab, string> = {
  Submissions: "Submission",
  Events: "Event",
  Team: "Team member",
  FAQs: "FAQ",
  Goals: "Goal",
};

/* =========================================================
   ICONS
========================================================= */

const ArrowLeftIcon = ({
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
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = ({
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
      d="M12 5v14M5 12h14"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const EditIcon = ({
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
      d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="m13.5 6.5 4 4"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const TrashIcon = ({
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
      d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LogoutIcon = ({
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
      d="M10 6V4H5v16h5v-2M14 8l4 4-4 4M18 12H9"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

/* =========================================================
   EVENT STATUS
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
        tracking-[0.13em]
        backdrop-blur-xl
        backdrop-saturate-150

        ${
          upcoming
            ? `
              border-red-800/35
              bg-red-900/20
              text-red-300
            `
            : `
              border-white/[0.11]
              bg-white/[0.045]
              text-slate-300
            `
        }
      `}
    >
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
          via-white/30
          to-transparent
        "
      />

      {status}
    </span>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
  label,
}: {
  label: string;
}) => (
  <div
    className="
      flex
      min-h-[260px]
      items-center
      justify-center
      px-6
      text-center
    "
  >
    <p
      className="
        text-[14px]
        text-slate-600
      "
    >
      No {label.toLowerCase()} yet.
    </p>
  </div>
);

/* =========================================================
   ACTION BUTTONS
========================================================= */

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
}) => (
  <div
    className="
      flex
      items-center
      justify-end
      gap-1.5
    "
  >
    <motion.button
      type="button"
      onClick={onEdit}
      whileTap={{
        scale: 0.94,
      }}
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-[12px]
        border
        border-white/[0.07]
        bg-white/[0.025]
        text-slate-500
        transition-all
        duration-200
        hover:border-white/[0.12]
        hover:bg-white/[0.05]
        hover:text-white
      "
      aria-label="Edit"
    >
      <EditIcon className="h-4 w-4" />
    </motion.button>

    <motion.button
      type="button"
      onClick={() => {
        void onDelete();
      }}
      whileTap={{
        scale: 0.94,
      }}
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-[12px]
        border
        border-red-900/20
        bg-red-950/[0.08]
        text-red-900
        transition-all
        duration-200
        hover:border-red-800/35
        hover:bg-red-950/20
        hover:text-red-500
      "
      aria-label="Delete"
    >
      <TrashIcon className="h-4 w-4" />
    </motion.button>
  </div>
);

/* =========================================================
   SUBMISSIONS
========================================================= */

const SubmissionsContent = ({
  data,
}: {
  data: Submission[];
}) => {
  if (!data.length) {
    return <EmptyState label="Submissions" />;
  }

  return (
    <>
      <div className="hidden md:block">
        <div
          className="
            grid
            grid-cols-[1.1fr_1.35fr_.8fr]
            border-b
            border-white/[0.06]
            px-6
            py-3
          "
        >
          {[
            "Name",
            "Email",
            "Campus ID",
          ].map((label) => (
            <span
              key={label}
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-slate-600
              "
            >
              {label}
            </span>
          ))}
        </div>

        <div>
          {data.map((submission) => (
            <div
              key={submission.id}
              className="
                grid
                grid-cols-[1.1fr_1.35fr_.8fr]
                items-center
                border-b
                border-white/[0.045]
                px-6
                py-4
                transition-colors
                duration-200
                last:border-b-0
                hover:bg-white/[0.02]
              "
            >
              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-[14px]
                    font-medium
                    text-white
                  "
                >
                  {submission.name}
                </p>
              </div>

              <a
                href={`mailto:${submission.email}`}
                className="
                  truncate
                  pr-5
                  text-[13px]
                  text-slate-400
                  transition-colors
                  hover:text-white
                "
              >
                {submission.email}
              </a>

              <span
                className="
                  truncate
                  text-[12px]
                  text-slate-500
                "
              >
                {submission.campusId}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="
          divide-y
          divide-white/[0.05]
          md:hidden
        "
      >
        {data.map((submission) => (
          <article
            key={submission.id}
            className="p-5"
          >
            <h3
              className="
                text-[16px]
                font-semibold
                tracking-[-0.02em]
                text-white
              "
            >
              {submission.name}
            </h3>

            <a
              href={`mailto:${submission.email}`}
              className="
                mt-1.5
                block
                break-all
                text-[12px]
                text-slate-400
              "
            >
              {submission.email}
            </a>

            <p
              className="
                mt-2
                text-[10px]
                uppercase
                tracking-[0.11em]
                text-slate-600
              "
            >
              {submission.campusId}
            </p>

            {submission.interests && (
              <p
                className="
                  mt-3
                  text-[12px]
                  leading-5
                  text-slate-500
                "
              >
                {submission.interests}
              </p>
            )}
          </article>
        ))}
      </div>
    </>
  );
};

/* =========================================================
   EDITABLE ROW
========================================================= */

interface EditableRowProps {
  order?: number;
  title: string;
  subtitle?: string;
  status?: string;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
}

const EditableRow: React.FC<EditableRowProps> = ({
  order,
  title,
  subtitle,
  status,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className="
        group
        flex
        items-center
        gap-4
        border-b
        border-white/[0.045]
        px-4
        py-4
        transition-colors
        duration-200
        last:border-b-0
        hover:bg-white/[0.022]
        sm:px-6
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-[11px]
          border
          border-white/[0.06]
          bg-white/[0.02]
          text-[10px]
          font-medium
          text-slate-600
        "
      >
        {String(order ?? 0).padStart(2, "0")}
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          <h3
            className="
              truncate
              text-[14px]
              font-semibold
              tracking-[-0.02em]
              text-white
            "
          >
            {title}
          </h3>

          {status && (
            <EventStatus status={status} />
          )}
        </div>

        {subtitle && (
          <p
            className="
              mt-1
              truncate
              text-[11px]
              text-slate-600
            "
          >
            {subtitle}
          </p>
        )}
      </div>

      <ActionButtons
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

/* =========================================================
   MANAGE CONTENT MODAL
========================================================= */

interface ManageContentModalProps {
  tab: Tab;
  item: EditableItem | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

const ManageContentModal: React.FC<
  ManageContentModalProps
> = ({
  tab,
  item,
  onClose,
  onSuccess,
}) => {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const current =
    item as any;

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
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

  const handleSubmit =
    async (
      event:
        React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      setLoading(true);

      const formData =
        new FormData(
          event.currentTarget
        );

      const payload =
        Object.fromEntries(
          formData.entries()
        ) as Record<
          string,
          string | number
        >;

      if (
        payload.order !== ""
      ) {
        payload.order =
          Number(
            payload.order
          );
      }

      try {
        if (item) {
          await updateDoc(
            doc(
              db,
              collectionForTab[
                tab
              ],
              item.id
            ),
            payload
          );
        } else {
          await addDoc(
            collection(
              db,
              collectionForTab[
                tab
              ]
            ),
            payload
          );
        }

        await onSuccess();
        onClose();
      } catch (error) {
        console.error(
          "Firestore write failed:",
          error
        );

        window.alert(
          "Could not save changes."
        );
      } finally {
        setLoading(false);
      }
    };

  const inputClass = `
    w-full
    rounded-[15px]
    border
    border-white/[0.08]
    bg-black/20
    px-4
    py-3
    text-[13px]
    text-white
    outline-none
    backdrop-blur-xl
    transition-all
    duration-200
    placeholder:text-slate-700
    focus:border-red-800/55
    focus:bg-white/[0.035]
    focus:shadow-[0_0_0_3px_rgba(127,29,29,0.08)]
  `;

  const labelClass = `
    mb-2
    block
    text-[9px]
    font-semibold
    uppercase
    tracking-[0.14em]
    text-slate-500
  `;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        p-3
        sm:p-6
      "
    >
      <motion.button
        type="button"
        aria-label="Close editor"
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
          bg-black/55
          backdrop-blur-[10px]
        "
      />

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
          duration: 0.3,
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
          flex
          max-h-[90svh]
          w-full
          max-w-[560px]
          flex-col
          overflow-hidden
          rounded-[28px]
          border
          border-white/[0.12]
          bg-[#090b10]/75
          backdrop-blur-3xl
          backdrop-saturate-150
          shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_30px_90px_rgba(0,0,0,0.40)]
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
            via-white/40
            to-transparent
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            right-[-50px]
            h-52
            w-52
            rounded-full
            bg-red-900/[0.12]
            blur-[70px]
          "
        />

        <div
          className="
            relative
            z-10
            flex
            items-center
            justify-between
            border-b
            border-white/[0.06]
            px-5
            py-5
            sm:px-6
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-red-700
              "
            >
              {item
                ? "Edit"
                : "New"}
            </p>

            <h2
              className="
                mt-1
                text-[22px]
                font-semibold
                tracking-[-0.04em]
                text-white
              "
            >
              {
                singularForTab[
                  tab
                ]
              }
            </h2>
          </div>

          <motion.button
            type="button"
            onClick={onClose}
            whileTap={{
              scale: 0.92,
            }}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-[13px]
              border
              border-white/[0.08]
              bg-white/[0.025]
              text-slate-500
              transition-all
              duration-200
              hover:bg-white/[0.05]
              hover:text-white
            "
            aria-label="Close"
          >
            <CloseIcon className="h-4 w-4" />
          </motion.button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="
            relative
            z-10
            overflow-y-auto
            px-5
            py-5
            sm:px-6
            sm:py-6
          "
        >
          <div className="space-y-5">
            <div>
              <label className={labelClass}>
                Order
              </label>

              <input
                type="number"
                name="order"
                defaultValue={
                  current?.order ??
                  0
                }
                className={
                  inputClass
                }
              />
            </div>

            {tab !== "FAQs" && (
              <div>
                <label className={labelClass}>
                  Image URL
                </label>

                <input
                  type="url"
                  name="imageUrl"
                  defaultValue={
                    current?.imageUrl ??
                    ""
                  }
                  placeholder="https://..."
                  className={
                    inputClass
                  }
                />
              </div>
            )}

            <div>
              <label className={labelClass}>
                {tab ===
                "FAQs"
                  ? "Question"
                  : "Name / Title"}
              </label>

              <input
                name={
                  tab ===
                  "FAQs"
                    ? "question"
                    : "name"
                }
                defaultValue={
                  current?.name ??
                  current?.question ??
                  ""
                }
                required
                className={
                  inputClass
                }
              />
            </div>

            {tab ===
              "Events" && (
              <>
                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  <div>
                    <label className={labelClass}>
                      Date
                    </label>

                    <input
                      name="date"
                      defaultValue={
                        current?.date ??
                        ""
                      }
                      placeholder="Dec 5, 2026"
                      className={
                        inputClass
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Status
                    </label>

                    <select
                      name="status"
                      defaultValue={
                        current?.status ??
                        "Upcoming"
                      }
                      className={
                        inputClass
                      }
                    >
                      <option value="Upcoming">
                        Upcoming
                      </option>

                      <option value="Past">
                        Past
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Venue
                  </label>

                  <input
                    name="venue"
                    defaultValue={
                      current?.venue ??
                      ""
                    }
                    placeholder="Auditorium"
                    className={
                      inputClass
                    }
                  />
                </div>
              </>
            )}

            {tab ===
              "Team" && (
              <>
                <div>
                  <label className={labelClass}>
                    Role
                  </label>

                  <input
                    name="role"
                    defaultValue={
                      current?.role ??
                      ""
                    }
                    placeholder="President"
                    className={
                      inputClass
                    }
                  />
                </div>

                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  <div>
                    <label className={labelClass}>
                      GitHub
                    </label>

                    <input
                      type="url"
                      name="githubUrl"
                      defaultValue={
                        current?.githubUrl ??
                        ""
                      }
                      placeholder="https://..."
                      className={
                        inputClass
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Instagram
                    </label>

                    <input
                      type="url"
                      name="instagramUrl"
                      defaultValue={
                        current?.instagramUrl ??
                        ""
                      }
                      placeholder="https://..."
                      className={
                        inputClass
                      }
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className={labelClass}>
                {tab ===
                "FAQs"
                  ? "Answer"
                  : "Description"}
              </label>

              <textarea
                name={
                  tab ===
                  "FAQs"
                    ? "answer"
                    : "description"
                }
                defaultValue={
                  current?.description ??
                  current?.answer ??
                  ""
                }
                rows={5}
                className={`
                  ${inputClass}
                  resize-none
                `}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{
              scale:
                loading
                  ? 1
                  : 0.985,
            }}
            className="
              relative
              mt-6
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
              disabled:cursor-wait
              disabled:opacity-60
            "
          >
            <span
              className="
                pointer-events-none
                absolute
                left-[16%]
                right-[16%]
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-white/30
                to-transparent
              "
            />

            {loading
              ? "Saving…"
              : item
              ? "Save changes"
              : `Add ${
                  singularForTab[
                    tab
                  ]
                }`}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

interface AdminDashboardProps {
  onBack: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<
  AdminDashboardProps
> = ({
  onBack,
  onLogout,
}) => {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<Tab>(
      "Submissions"
    );

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    editingItem,
    setEditingItem,
  ] =
    useState<EditableItem | null>(
      null
    );

  const [
    submissions,
    setSubmissions,
  ] = useState<
    Submission[]
  >([]);

  const [
    events,
    setEvents,
  ] = useState<Event[]>([]);

  const [
    team,
    setTeam,
  ] = useState<
    TeamMember[]
  >([]);

  const [
    faqs,
    setFAQs,
  ] = useState<FAQ[]>([]);

  const [
    goals,
    setGoals,
  ] = useState<Goal[]>([]);

  const fetchData =
    useCallback(
      async (): Promise<void> => {
        setIsLoading(true);

        try {
          const fetchCollection =
            async (
              collectionName: string
            ) => {
              const snapshot =
                await getDocs(
                  collection(
                    db,
                    collectionName
                  )
                );

              const items =
                snapshot.docs.map(
                  (
                    document
                  ) => ({
                    id:
                      document.id,

                    ...document.data(),
                  })
                ) as any[];

              if (
                collectionName !==
                "submissions"
              ) {
                return items.sort(
                  (
                    a,
                    b
                  ) =>
                    (Number(
                      a.order
                    ) ||
                      999) -
                    (Number(
                      b.order
                    ) ||
                      999)
                );
              }

              return items;
            };

          const [
            submissionData,
            eventData,
            teamData,
            faqData,
            goalData,
          ] =
            await Promise.all([
              fetchCollection(
                "submissions"
              ),

              fetchCollection(
                "events"
              ),

              fetchCollection(
                "team"
              ),

              fetchCollection(
                "faqs"
              ),

              fetchCollection(
                "goals"
              ),
            ]);

          setSubmissions(
            submissionData
          );

          setEvents(
            eventData
          );

          setTeam(
            teamData
          );

          setFAQs(
            faqData
          );

          setGoals(
            goalData
          );
        } catch (error) {
          console.error(
            "Firestore error:",
            error
          );
        } finally {
          setIsLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleDelete =
    async (
      id: string,
      tab: Tab
    ): Promise<void> => {
      const singular =
        singularForTab[
          tab
        ];

      const confirmed =
        window.confirm(
          `Delete this ${singular.toLowerCase()}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteDoc(
          doc(
            db,
            collectionForTab[
              tab
            ],
            id
          )
        );

        await fetchData();
      } catch (error) {
        console.error(
          "Delete failed:",
          error
        );

        window.alert(
          "Could not delete item."
        );
      }
    };

  const openEditor = (
    item:
      | EditableItem
      | null
  ) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeEditor = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const tabCounts: Record<
    Tab,
    number
  > = {
    Submissions:
      submissions.length,

    Events:
      events.length,

    Team:
      team.length,

    FAQs:
      faqs.length,

    Goals:
      goals.length,
  };

  const renderContent =
    () => {
      if (isLoading) {
        return (
          <div
            className="
              flex
              min-h-[320px]
              items-center
              justify-center
            "
          >
            <Loader />
          </div>
        );
      }

      if (
        activeTab ===
        "Submissions"
      ) {
        return (
          <SubmissionsContent
            data={
              submissions
            }
          />
        );
      }

      if (
        activeTab ===
        "Events"
      ) {
        if (!events.length) {
          return (
            <EmptyState label="Events" />
          );
        }

        return (
          <div>
            {events.map(
              (event) => (
                <EditableRow
                  key={event.id}
                  order={event.order}
                  title={
                    event.name ||
                    "Untitled event"
                  }
                  subtitle={[
                    event.date,
                    event.venue,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  status={
                    event.status
                  }
                  onEdit={() => {
                    openEditor(
                      event
                    );
                  }}
                  onDelete={() =>
                    handleDelete(
                      event.id,
                      "Events"
                    )
                  }
                />
              )
            )}
          </div>
        );
      }

      if (
        activeTab ===
        "Team"
      ) {
        if (!team.length) {
          return (
            <EmptyState label="Team members" />
          );
        }

        return (
          <div>
            {team.map(
              (member) => (
                <EditableRow
                  key={member.id}
                  order={member.order}
                  title={
                    member.name ||
                    "Unnamed member"
                  }
                  subtitle={
                    member.role
                  }
                  onEdit={() => {
                    openEditor(
                      member
                    );
                  }}
                  onDelete={() =>
                    handleDelete(
                      member.id,
                      "Team"
                    )
                  }
                />
              )
            )}
          </div>
        );
      }

      if (
        activeTab ===
        "FAQs"
      ) {
        if (!faqs.length) {
          return (
            <EmptyState label="FAQs" />
          );
        }

        return (
          <div>
            {faqs.map(
              (faq) => (
                <EditableRow
                  key={faq.id}
                  order={faq.order}
                  title={
                    faq.question ||
                    "Untitled question"
                  }
                  subtitle={
                    faq.answer
                  }
                  onEdit={() => {
                    openEditor(
                      faq
                    );
                  }}
                  onDelete={() =>
                    handleDelete(
                      faq.id,
                      "FAQs"
                    )
                  }
                />
              )
            )}
          </div>
        );
      }

      if (!goals.length) {
        return (
          <EmptyState label="Goals" />
        );
      }

      return (
        <div>
          {goals.map(
            (goal) => (
              <EditableRow
                key={goal.id}
                order={goal.order}
                title={
                  goal.name ||
                  "Untitled goal"
                }
                subtitle={
                  goal.description
                }
                onEdit={() => {
                  openEditor(
                    goal
                  );
                }}
                onDelete={() =>
                  handleDelete(
                    goal.id,
                    "Goals"
                  )
                }
              />
            )
          )}
        </div>
      );
    };

  return (
    <>
      <div
        className="
          relative
          z-10
          min-h-screen
          px-4
          pb-10
          pt-5
          sm:px-6
          sm:pt-7
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
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
              relative
              flex
              items-center
              justify-between
              overflow-hidden
              rounded-[22px]
              border
              border-white/[0.10]
              bg-white/[0.035]
              px-4
              py-3
              backdrop-blur-2xl
              backdrop-saturate-150
              shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_45px_rgba(0,0,0,0.16)]
              sm:px-5
            "
          >
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

            <div
              className="
                relative
                z-10
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  text-[20px]
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

              <span
                className="
                  h-4
                  w-px
                  bg-white/[0.10]
                "
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-slate-600
                "
              >
                Admin
              </span>
            </div>

            <div
              className="
                relative
                z-10
                flex
                items-center
                gap-2
              "
            >
              <motion.button
                type="button"
                onClick={onBack}
                whileTap={{
                  scale: 0.96,
                }}
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-[13px]
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  px-3
                  text-[11px]
                  font-medium
                  text-slate-400
                  transition-all
                  duration-200
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                <ArrowLeftIcon className="h-3.5 w-3.5" />

                <span className="hidden sm:inline">
                  Site
                </span>
              </motion.button>

              <motion.button
                type="button"
                onClick={onLogout}
                whileTap={{
                  scale: 0.96,
                }}
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-[13px]
                  border
                  border-red-900/25
                  bg-red-950/[0.10]
                  px-3
                  text-[11px]
                  font-medium
                  text-red-500/80
                  transition-all
                  duration-200
                  hover:border-red-800/35
                  hover:bg-red-950/20
                  hover:text-red-400
                "
              >
                <LogoutIcon className="h-3.5 w-3.5" />

                <span className="hidden sm:inline">
                  Logout
                </span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.06,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              pb-9
              pt-14
              sm:pb-11
              sm:pt-16
            "
          >
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-red-700
              "
            >
              Management
            </p>

            <h1
              className="
                mt-3
                text-[42px]
                font-semibold
                leading-none
                tracking-[-0.06em]
                text-white
                sm:text-[54px]
              "
            >
              Admin.
            </h1>
          </motion.div>

          <div
            className="
              mb-4
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div
              className="
                -mx-4
                overflow-x-auto
                px-4
                sm:mx-0
                sm:px-0
              "
            >
              <div
                className="
                  flex
                  min-w-max
                  items-center
                  gap-1
                "
              >
                {tabs.map(
                  (tab) => {
                    const active =
                      tab ===
                      activeTab;

                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setActiveTab(
                            tab
                          );
                        }}
                        className={`
                          relative
                          flex
                          items-center
                          gap-2
                          rounded-[13px]
                          px-3
                          py-2.5
                          text-[12px]
                          font-medium
                          transition-colors
                          duration-200

                          ${
                            active
                              ? "text-white"
                              : "text-slate-500 hover:text-slate-300"
                          }
                        `}
                      >
                        {active && (
                          <motion.span
                            layoutId="admin-active-tab"
                            transition={{
                              type: "spring",
                              stiffness: 320,
                              damping: 28,
                            }}
                            className="
                              absolute
                              inset-0
                              rounded-[13px]
                              border
                              border-white/[0.08]
                              bg-white/[0.045]
                              shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                            "
                          />
                        )}

                        <span
                          className="
                            relative
                            z-10
                          "
                        >
                          {tab}
                        </span>

                        <span
                          className={`
                            relative
                            z-10
                            text-[9px]

                            ${
                              active
                                ? "text-red-700"
                                : "text-slate-700"
                            }
                          `}
                        >
                          {
                            tabCounts[
                              tab
                            ]
                          }
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {activeTab !==
              "Submissions" && (
              <motion.button
                type="button"
                onClick={() => {
                  openEditor(null);
                }}
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="
                  relative
                  flex
                  h-[43px]
                  items-center
                  justify-center
                  gap-2
                  overflow-hidden
                  rounded-[14px]
                  border
                  border-red-800/40
                  bg-red-900/25
                  px-4
                  text-[11px]
                  font-semibold
                  text-white
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.11)]
                  transition-all
                  duration-200
                  hover:border-red-700/50
                  hover:bg-red-900/38
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
                    via-white/25
                    to-transparent
                  "
                />

                <PlusIcon className="h-4 w-4 text-red-500" />

                Add{" "}
                {
                  singularForTab[
                    activeTab
                  ]
                }
              </motion.button>
            )}
          </div>

          <motion.section
            key={activeTab}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
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
              relative
              overflow-hidden
              rounded-[26px]
              border
              border-white/[0.09]
              bg-white/[0.027]
              backdrop-blur-2xl
              backdrop-saturate-150
              shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_20px_55px_rgba(0,0,0,0.15)]
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                left-[8%]
                right-[8%]
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-white/28
                to-transparent
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-32
                right-[5%]
                h-64
                w-64
                rounded-full
                bg-red-900/[0.055]
                blur-[90px]
              "
            />

            <div
              className="
                relative
                z-10
              "
            >
              {renderContent()}
            </div>
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ManageContentModal
            tab={activeTab}
            item={editingItem}
            onClose={closeEditor}
            onSuccess={fetchData}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminDashboard;