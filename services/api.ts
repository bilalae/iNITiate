export interface Submission {
  id: string;
  name: string;
  campusId: string;
  email: string;
  interests: string;
  subscribeNewsletter: boolean;
  submissionDate: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  status: 'Upcoming' | 'Past';
  icon: string; // Storing icon as full SVG string
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

export interface Goal {
    id: string;
    name: string;
    description: string;
    icon: string; // Storing icon as full SVG string
}


// --- Storage Keys ---
const SUBMISSIONS_KEY = 'initiate_submissions';
const EVENTS_KEY = 'initiate_events';
const TEAM_KEY = 'initiate_team';
const FAQ_KEY = 'initiate_faq';
const GOALS_KEY = 'initiate_goals';


// --- Helper Functions ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getFromStorage = <T>(key: string, defaultValue: T[] = []): T[] => {
  if (typeof window === 'undefined') return defaultValue;
  const storedJson = localStorage.getItem(key);
  try {
    return storedJson ? JSON.parse(storedJson) : defaultValue;
  } catch (e) {
    console.error(`Failed to parse ${key} from localStorage`, e);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
};

const generateId = () => new Date().toISOString() + Math.random().toString(36).substring(2, 9);


// --- Submissions API ---
export const getSubmissions = async (): Promise<Submission[]> => {
  await delay(500);
  return getFromStorage<Submission>(SUBMISSIONS_KEY);
};

export const submitApplication = async (formData: Omit<Submission, 'id' | 'submissionDate'>): Promise<Submission> => {
    await delay(1000);
    const currentSubmissions = getFromStorage<Submission>(SUBMISSIONS_KEY);
    const newSubmission: Submission = {
        ...formData,
        id: generateId(),
        submissionDate: new Date().toLocaleString(),
    };
    const updatedSubmissions = [newSubmission, ...currentSubmissions];
    saveToStorage(SUBMISSIONS_KEY, updatedSubmissions);
    return newSubmission;
};

// --- Events API ---
export const getEvents = async (): Promise<Event[]> => {
    await delay(300);
    const events = getFromStorage<Event>(EVENTS_KEY);
    if (events.length === 0) {
        const defaultEvents: Event[] = [
            { id: generateId(), name: 'AI & Machine Learning Workshop', description: 'An immersive workshop covering the fundamentals of AI and practical applications in machine learning. Suitable for all skill levels.', date: 'October 15, 2024', status: 'Upcoming', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>` },
            { id: generateId(), name: 'InnovateNIT Hackathon 2024', description: 'A 24-hour coding marathon where teams collaborate to build innovative solutions for real-world problems. Prizes and glory await!', date: 'November 5-6, 2024', status: 'Upcoming', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>` },
            { id: generateId(), name: 'Guest Seminar: The Future of Quantum Computing', description: 'Join us for an inspiring talk by Dr. Evelyn Reed, a leading expert in quantum physics, as she discusses the next frontier of computing.', date: 'September 28, 2024', status: 'Past', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>` },
            { id: generateId(), name: 'Annual Robotics Competition', description: 'Design, build, and battle! Showcase your engineering prowess in our annual robotics showdown. Open to all students.', date: 'December 2, 2024', status: 'Upcoming', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M9 19H6a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2h-3m-6 0v-2a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>` },
        ];
        saveToStorage(EVENTS_KEY, defaultEvents);
        return defaultEvents;
    }
    return events;
}

export const addEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
    await delay(800);
    const currentEvents = await getEvents();
    const newEvent: Event = { ...eventData, id: generateId() };
    const updatedEvents = [newEvent, ...currentEvents];
    saveToStorage(EVENTS_KEY, updatedEvents);
    return newEvent;
}

export const updateEvent = async (updatedEvent: Event): Promise<Event> => {
    await delay(800);
    const currentEvents = await getEvents();
    const eventIndex = currentEvents.findIndex(e => e.id === updatedEvent.id);
    if (eventIndex > -1) {
        currentEvents[eventIndex] = updatedEvent;
        saveToStorage(EVENTS_KEY, currentEvents);
    }
    return updatedEvent;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    await delay(500);
    const currentEvents = await getEvents();
    const updatedEvents = currentEvents.filter(e => e.id !== eventId);
    saveToStorage(EVENTS_KEY, updatedEvents);
};


// --- Team API ---
export const getTeam = async (): Promise<TeamMember[]> => {
    await delay(300);
    const team = getFromStorage<TeamMember>(TEAM_KEY);
    if (team.length === 0) {
        const defaultTeam: TeamMember[] = [
            { id: generateId(), name: 'Alex Chen', role: 'President', imageUrl: `https://i.pravatar.cc/150?u=alexchen`, githubUrl: 'https://github.com', linkedinUrl: 'https://linkedin.com', twitterUrl: 'https://twitter.com' },
            { id: generateId(), name: 'Brenda Smith', role: 'Vice President', imageUrl: `https://i.pravatar.cc/150?u=brendasmith`, githubUrl: 'https://github.com', linkedinUrl: 'https://linkedin.com', twitterUrl: '' },
            { id: generateId(), name: 'Carlos Rodriguez', role: 'Head of Research', imageUrl: `https://i.pravatar.cc/150?u=carlosrodriguez`, githubUrl: 'https://github.com', linkedinUrl: '', twitterUrl: '' },
            { id: generateId(), name: 'Diana Miller', role: 'Events Coordinator', imageUrl: `https://i.pravatar.cc/150?u=dianamiller`, githubUrl: '', linkedinUrl: 'https://linkedin.com', twitterUrl: 'https://twitter.com' },
        ];
        saveToStorage(TEAM_KEY, defaultTeam);
        return defaultTeam;
    }
    return team;
}

export const addTeamMember = async (memberData: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    await delay(800);
    const currentTeam = await getTeam();
    const newMember: TeamMember = { ...memberData, id: generateId() };
    const updatedTeam = [...currentTeam, newMember];
    saveToStorage(TEAM_KEY, updatedTeam);
    return newMember;
}

export const updateTeamMember = async (updatedMember: TeamMember): Promise<TeamMember> => {
    await delay(800);
    const currentTeam = await getTeam();
    const memberIndex = currentTeam.findIndex(m => m.id === updatedMember.id);
    if (memberIndex > -1) {
        currentTeam[memberIndex] = updatedMember;
        saveToStorage(TEAM_KEY, currentTeam);
    }
    return updatedMember;
};

export const deleteTeamMember = async (memberId: string): Promise<void> => {
    await delay(500);
    const currentTeam = await getTeam();
    const updatedTeam = currentTeam.filter(m => m.id !== memberId);
    saveToStorage(TEAM_KEY, updatedTeam);
};


// --- FAQ API ---
export const getFAQs = async (): Promise<FAQ[]> => {
    await delay(300);
    const faqs = getFromStorage<FAQ>(FAQ_KEY);
    if (faqs.length === 0) {
        const defaultFAQs: FAQ[] = [
            { id: generateId(), question: "Who can join the Initiate Science Society?", answer: "Membership is open to all undergraduate and postgraduate students of NIT, regardless of their major. We welcome anyone with a passion for science and technology." },
            { id: generateId(), question: "Is there a membership fee?", answer: "No, there is no membership fee to join Initiate. Our events and workshops may have a small fee for materials, but joining the society itself is completely free." },
            { id: generateId(), question: "How much time commitment is required?", answer: "The time commitment is flexible. You can choose to attend events that fit your schedule or get more involved by joining a project team or the organizing committee. We encourage participation at any level." },
        ];
        saveToStorage(FAQ_KEY, defaultFAQs);
        return defaultFAQs;
    }
    return faqs;
}

export const addFAQ = async (faqData: Omit<FAQ, 'id'>): Promise<FAQ> => {
    await delay(800);
    const currentFAQs = await getFAQs();
    const newFAQ: FAQ = { ...faqData, id: generateId() };
    const updatedFAQs = [newFAQ, ...currentFAQs];
    saveToStorage(FAQ_KEY, updatedFAQs);
    return newFAQ;
}

export const updateFAQ = async (updatedFAQ: FAQ): Promise<FAQ> => {
    await delay(800);
    const currentFAQs = await getFAQs();
    const faqIndex = currentFAQs.findIndex(f => f.id === updatedFAQ.id);
    if (faqIndex > -1) {
        currentFAQs[faqIndex] = updatedFAQ;
        saveToStorage(FAQ_KEY, currentFAQs);
    }
    return updatedFAQ;
};

export const deleteFAQ = async (faqId: string): Promise<void> => {
    await delay(500);
    const currentFAQs = await getFAQs();
    const updatedFAQs = currentFAQs.filter(f => f.id !== faqId);
    saveToStorage(FAQ_KEY, updatedFAQs);
};


// --- Goals API ---
export const getGoals = async (): Promise<Goal[]> => {
    await delay(300);
    const goals = getFromStorage<Goal>(GOALS_KEY);
    if (goals.length === 0) {
        const defaultGoals: Goal[] = [
            { id: generateId(), name: 'Foster Collaboration', description: 'Create a vibrant community where students from various disciplines can connect, share ideas, and work together on exciting projects.', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>` },
            { id: generateId(), name: 'Drive Innovation', description: 'Encourage creative thinking and problem-solving through workshops, hackathons, and challenges that push the boundaries of technology.', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>` },
            { id: generateId(), name: 'Pioneer Research', description: 'Provide resources and mentorship for students to engage in meaningful research, contributing to scientific knowledge and discovery.', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>` },
            { id: generateId(), name: 'Develop Skills', description: 'Offer hands-on learning experiences and skill-building sessions to prepare members for future careers in science and technology.', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>` },
        ];
        saveToStorage(GOALS_KEY, defaultGoals);
        return defaultGoals;
    }
    return goals;
}

export const addGoal = async (goalData: Omit<Goal, 'id'>): Promise<Goal> => {
    await delay(800);
    const currentGoals = await getGoals();
    const newGoal: Goal = { ...goalData, id: generateId() };
    const updatedGoals = [...currentGoals, newGoal];
    saveToStorage(GOALS_KEY, updatedGoals);
    return newGoal;
}

export const updateGoal = async (updatedGoal: Goal): Promise<Goal> => {
    await delay(800);
    const currentGoals = await getGoals();
    const goalIndex = currentGoals.findIndex(g => g.id === updatedGoal.id);
    if (goalIndex > -1) {
        currentGoals[goalIndex] = updatedGoal;
        saveToStorage(GOALS_KEY, currentGoals);
    }
    return updatedGoal;
};

export const deleteGoal = async (goalId: string): Promise<void> => {
    await delay(500);
    const currentGoals = await getGoals();
    const updatedGoals = currentGoals.filter(g => g.id !== goalId);
    saveToStorage(GOALS_KEY, updatedGoals);
};