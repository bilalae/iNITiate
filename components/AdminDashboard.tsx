import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    getSubmissions, Submission, 
    getEvents, Event, addEvent, updateEvent, deleteEvent,
    getTeam, TeamMember, addTeamMember, updateTeamMember, deleteTeamMember,
    getFAQs, FAQ, addFAQ, updateFAQ, deleteFAQ,
    getGoals, Goal, addGoal, updateGoal, deleteGoal
} from '../services/api';
import Modal from './Modal';
import Loader from './Loader';

type Tab = 'Submissions' | 'Events' | 'Team' | 'FAQs' | 'Goals';
type EditableItem = Event | TeamMember | FAQ | Goal;

const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Submissions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        const [submissionsData, eventsData, teamData, faqsData, goalsData] = await Promise.all([
            getSubmissions(),
            getEvents(),
            getTeam(),
            getFAQs(),
            getGoals()
        ]);
        setSubmissions(submissionsData);
        setEvents(eventsData);
        setTeam(teamData);
        setFAQs(faqsData);
        setGoals(goalsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: EditableItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, type: Tab) => {
    if (window.confirm(`Are you sure you want to delete this ${type.slice(0,-1)}?`)) {
        try {
            switch(type) {
                case 'Events': await deleteEvent(id); break;
                case 'Team': await deleteTeamMember(id); break;
                case 'FAQs': await deleteFAQ(id); break;
                case 'Goals': await deleteGoal(id); break;
            }
            fetchData();
        } catch (error) {
            console.error("Failed to delete item:", error);
            alert("Deletion failed. Please try again.");
        }
    }
  };

  const closeModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const renderContent = () => {
    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader /></div>;
    }
    switch(activeTab) {
        case 'Submissions': return <SubmissionsTable data={submissions} />;
        case 'Events': return <EventsTable data={events} onEdit={handleEdit} onDelete={(id) => handleDelete(id, 'Events')} />;
        case 'Team': return <TeamTable data={team} onEdit={handleEdit} onDelete={(id) => handleDelete(id, 'Team')} />;
        case 'FAQs': return <FAQsTable data={faqs} onEdit={handleEdit} onDelete={(id) => handleDelete(id, 'FAQs')} />;
        case 'Goals': return <GoalsTable data={goals} onEdit={handleEdit} onDelete={(id) => handleDelete(id, 'Goals')} />;
        default: return null;
    }
  };

  return (
    <div className="relative z-10 min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Admin Dashboard</h1>
            <button
                onClick={onBack}
                className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors duration-300"
            >
                &larr; Back to Site
            </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="border-b border-slate-700 flex space-x-1 sm:space-x-4">
                {(['Submissions', 'Events', 'Team', 'FAQs', 'Goals'] as Tab[]).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-3 py-2 text-sm sm:text-base font-medium transition-colors ${activeTab === tab ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-slate-400 hover:text-white'}`}>
                        {tab}
                    </button>
                ))}
            </div>
            {activeTab !== 'Submissions' && (
                <button onClick={handleAddNew} className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-300">
                    Add New {activeTab.slice(0, -1)}
                </button>
            )}
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-lg shadow-lg overflow-hidden">
            {renderContent()}
        </div>
      </motion.div>
      <AnimatePresence>
        {isModalOpen && <ManageContentModal tab={activeTab} item={editingItem} onClose={closeModal} onSuccess={fetchData} />}
      </AnimatePresence>
    </div>
  );
};


// --- Tables ---

const ActionButtons: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => (
    <div className="flex items-center space-x-2">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onEdit} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">Edit</motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onDelete} className="text-red-500 hover:text-red-400 text-sm font-medium">Delete</motion.button>
    </div>
);

const SubmissionsTable: React.FC<{data: Submission[]}> = ({ data }) => (
    <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-800/60"><tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Campus ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Interests</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Newsletter</th>
        </tr></thead>
        <tbody className="bg-slate-900 divide-y divide-slate-800">
            {data.length === 0 ? (<tr><td colSpan={6} className="text-center py-8 text-slate-400">No submissions yet.</td></tr>) :
            (data.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{sub.submissionDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{sub.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{sub.campusId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{sub.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 max-w-xs truncate" title={sub.interests}>{sub.interests || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{sub.subscribeNewsletter ? 'Yes' : 'No'}</td>
                </tr>
            )))}
        </tbody>
    </table></div>
);

const EventsTable: React.FC<{data: Event[]; onEdit: (item: Event) => void; onDelete: (id: string) => void;}> = ({ data, onEdit, onDelete }) => (
    <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-800/60"><tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Icon</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
        </tr></thead>
        <tbody className="bg-slate-900 divide-y divide-slate-800">
            {data.map((event) => (
                <tr key={event.id}>
                    <td className="px-6 py-4"><div className="h-8 w-8 text-cyan-400" dangerouslySetInnerHTML={{ __html: event.icon }} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{event.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{event.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${event.status === 'Upcoming' ? 'bg-cyan-900/80 text-cyan-300' : 'bg-slate-700 text-slate-300'}`}>{event.status}</span></td>
                    <td className="px-6 py-4 text-sm text-slate-300 max-w-md truncate" title={event.description}>{event.description}</td>
                    <td className="px-6 py-4"><ActionButtons onEdit={() => onEdit(event)} onDelete={() => onDelete(event.id)} /></td>
                </tr>
            ))}
        </tbody>
    </table></div>
);

const TeamTable: React.FC<{data: TeamMember[]; onEdit: (item: TeamMember) => void; onDelete: (id: string) => void;}> = ({ data, onEdit, onDelete }) => (
     <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-800/60"><tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"></th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Role</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
        </tr></thead>
        <tbody className="bg-slate-900 divide-y divide-slate-800">
            {data.map((member) => (
                <tr key={member.id}>
                    <td className="px-6 py-4"><img src={member.imageUrl} alt={member.name} className="h-10 w-10 rounded-full object-cover" /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400">{member.role}</td>
                    <td className="px-6 py-4"><ActionButtons onEdit={() => onEdit(member)} onDelete={() => onDelete(member.id)} /></td>
                </tr>
            ))}
        </tbody>
    </table></div>
);

const FAQsTable: React.FC<{data: FAQ[]; onEdit: (item: FAQ) => void; onDelete: (id: string) => void;}> = ({ data, onEdit, onDelete }) => (
    <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-800/60"><tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Question</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Answer</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
        </tr></thead>
        <tbody className="bg-slate-900 divide-y divide-slate-800">
            {data.map((faq) => (
                <tr key={faq.id}>
                    <td className="px-6 py-4 text-sm font-medium text-white">{faq.question}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 max-w-md truncate" title={faq.answer}>{faq.answer}</td>
                    <td className="px-6 py-4"><ActionButtons onEdit={() => onEdit(faq)} onDelete={() => onDelete(faq.id)} /></td>
                </tr>
            ))}
        </tbody>
    </table></div>
);

const GoalsTable: React.FC<{data: Goal[]; onEdit: (item: Goal) => void; onDelete: (id: string) => void;}> = ({ data, onEdit, onDelete }) => (
    <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-800/60"><tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Icon</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
        </tr></thead>
        <tbody className="bg-slate-900 divide-y divide-slate-800">
            {data.map((goal) => (
                <tr key={goal.id}>
                    <td className="px-6 py-4"><div className="h-8 w-8 text-cyan-400" dangerouslySetInnerHTML={{ __html: goal.icon }} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{goal.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 max-w-md truncate" title={goal.description}>{goal.description}</td>
                    <td className="px-6 py-4"><ActionButtons onEdit={() => onEdit(goal)} onDelete={() => onDelete(goal.id)} /></td>
                </tr>
            ))}
        </tbody>
    </table></div>
);

// --- Modals ---
const ManageContentModal: React.FC<{tab: Tab, item: EditableItem | null, onClose: () => void, onSuccess: () => void}> = ({ tab, item, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: any) => {
        setIsSubmitting(true);
        try {
            switch(tab) {
                case 'Events': 
                    await (item ? updateEvent({...item, ...formData}) : addEvent(formData));
                    break;
                case 'Team':
                    await (item ? updateTeamMember({...item, ...formData}) : addTeamMember(formData));
                    break;
                case 'FAQs':
                    await (item ? updateFAQ({...item, ...formData}) : addFAQ(formData));
                    break;
                case 'Goals':
                    await (item ? updateGoal({...item, ...formData}) : addGoal(formData));
                    break;
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save item:", error);
            // Here you could set an error state to show to the user
        } finally {
            setIsSubmitting(false);
        }
    };
    
    let formContent;
    switch(tab) {
        case 'Events': formContent = <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} initialData={item as Event | null} />; break;
        case 'Team': formContent = <TeamForm onSubmit={handleSubmit} isSubmitting={isSubmitting} initialData={item as TeamMember | null} />; break;
        case 'FAQs': formContent = <FAQForm onSubmit={handleSubmit} isSubmitting={isSubmitting} initialData={item as FAQ | null} />; break;
        case 'Goals': formContent = <GoalForm onSubmit={handleSubmit} isSubmitting={isSubmitting} initialData={item as Goal | null} />; break;
        default: formContent = null;
    }

    const title = item ? `Edit ${tab.slice(0, -1)}` : `Add New ${tab.slice(0, -1)}`;

    return (
        <Modal onClose={onClose} title={title}>
            {formContent}
        </Modal>
    );
}

// --- Forms ---
const inputClass = "block w-full px-4 py-2 text-base text-white placeholder-slate-400 bg-slate-800 border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500";
const buttonClass = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed";

const svgFileToString = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        const result = reader.result as string;
        // Basic sanitization and styling for consistency
        const parser = new DOMParser();
        const doc = parser.parseFromString(result, "image/svg+xml");
        const svgElement = doc.documentElement;
        if (svgElement.tagName.toLowerCase() !== 'svg') {
            return reject(new Error("Invalid SVG file."));
        }
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        const updatedSvgContent = new XMLSerializer().serializeToString(svgElement);
        resolve(updatedSvgContent);
    };
    reader.onerror = error => reject(error);
});

const EventForm: React.FC<{onSubmit: (data: any) => void, isSubmitting: boolean, initialData: Event | null}> = ({ onSubmit, isSubmitting, initialData }) => {
    const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>`;
    const [data, setData] = useState({ 
        name: initialData?.name || '', 
        description: initialData?.description || '', 
        date: initialData?.date || '', 
        status: initialData?.status || 'Upcoming' as 'Upcoming' | 'Past',
        icon: initialData?.icon || defaultIcon,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setData({...data, [e.target.name]: e.target.value });
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'image/svg+xml') {
            try {
                const svgString = await svgFileToString(file);
                setData({...data, icon: svgString });
            } catch (error) {
                console.error("Error processing SVG file:", error);
                alert("Could not process SVG file. Please ensure it's a valid SVG.");
            }
        } else if (file) {
            alert("Please upload a valid .svg file.");
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(data); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
                <p className="text-sm text-slate-400">Icon Preview:</p>
                <div className="h-16 w-16 p-2 rounded-lg bg-slate-800 text-cyan-400" dangerouslySetInnerHTML={{ __html: data.icon }} />
                <input type="file" accept=".svg" onChange={handleFileChange} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/60 file:text-cyan-300 hover:file:bg-cyan-900" />
            </div>
            <input name="name" value={data.name} onChange={handleChange} placeholder="Event Name" required className={inputClass} />
            <textarea name="description" value={data.description} onChange={handleChange} placeholder="Description" required className={inputClass} />
            <input name="date" type="text" value={data.date} onChange={handleChange} placeholder="Date (e.g., October 15, 2024)" required className={inputClass} />
            <select name="status" value={data.status} onChange={handleChange} required className={inputClass}>
                <option>Upcoming</option>
                <option>Past</option>
            </select>
            <button type="submit" disabled={isSubmitting} className={buttonClass}>{isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Event')}</button>
        </form>
    );
};

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const TeamForm: React.FC<{onSubmit: (data: any) => void, isSubmitting: boolean, initialData: TeamMember | null}> = ({ onSubmit, isSubmitting, initialData }) => {
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzQ3NTU2OSI+PHBhdGggZD0iTTEyIDJjLTUuNTIgMC0xMCA0LjQ4LTEwIDEwczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMHMtNC40OC0xMC0xMC0xMHptMCAzYzEuNjYgMCAzIDEuMzQgMyAzcy0xLjM0IDMtMyAzLTMtMS4zNC0zLTMgMS4zNC0zIDMtM3ptMCAxNC4yYy0yLjUgMC00LjcxLTEuMjgtNi0zLjIyLjAzLTEuOTggNC0zLjA4IDYtMy4wOHM1Ljk3IDEuMSA2IDMuMDhjLTEuMjkgMS45NC0zLjUgMy4yMi02IDMuMjJ6Ii8+PC9zdmc+';
    const [data, setData] = useState({ 
        name: initialData?.name || '', 
        role: initialData?.role || '', 
        imageUrl: initialData?.imageUrl || defaultImage,
        githubUrl: initialData?.githubUrl || '',
        linkedinUrl: initialData?.linkedinUrl || '',
        twitterUrl: initialData?.twitterUrl || '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setData({...data, [e.target.name]: e.target.value });
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await toBase64(file);
            setData({...data, imageUrl: base64 });
        }
    };

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(data); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
                <img src={data.imageUrl} alt="Profile preview" className="h-24 w-24 rounded-full object-cover bg-slate-700"/>
                <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/60 file:text-cyan-300 hover:file:bg-cyan-900" />
            </div>
            <input name="name" value={data.name} onChange={handleChange} placeholder="Full Name" required className={inputClass} />
            <input name="role" value={data.role} onChange={handleChange} placeholder="Role (e.g., President)" required className={inputClass} />
            <input name="githubUrl" value={data.githubUrl} onChange={handleChange} placeholder="GitHub URL (optional)" className={inputClass} />
            <input name="linkedinUrl" value={data.linkedinUrl} onChange={handleChange} placeholder="LinkedIn URL (optional)" className={inputClass} />
            <input name="twitterUrl" value={data.twitterUrl} onChange={handleChange} placeholder="Twitter URL (optional)" className={inputClass} />
            <button type="submit" disabled={isSubmitting} className={buttonClass}>{isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Team Member')}</button>
        </form>
    );
};

const FAQForm: React.FC<{onSubmit: (data: any) => void, isSubmitting: boolean, initialData: FAQ | null}> = ({ onSubmit, isSubmitting, initialData }) => {
    const [data, setData] = useState({ question: initialData?.question || '', answer: initialData?.answer || '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setData({...data, [e.target.name]: e.target.value });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(data); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="question" value={data.question} onChange={handleChange} placeholder="Question" required className={inputClass} />
            <textarea name="answer" value={data.answer} onChange={handleChange} placeholder="Answer" required className={inputClass} />
            <button type="submit" disabled={isSubmitting} className={buttonClass}>{isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Add FAQ')}</button>
        </form>
    );
};


const GoalForm: React.FC<{onSubmit: (data: any) => void, isSubmitting: boolean, initialData: Goal | null}> = ({ onSubmit, isSubmitting, initialData }) => {
    const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>`;
    const [data, setData] = useState({ name: initialData?.name || '', description: initialData?.description || '', icon: initialData?.icon || defaultIcon });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setData({...data, [e.target.name]: e.target.value });
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'image/svg+xml') {
            try {
                const svgString = await svgFileToString(file);
                setData({...data, icon: svgString });
            } catch (error) {
                console.error("Error processing SVG file:", error);
                alert("Could not process SVG file. Please ensure it's a valid SVG.");
            }
        } else if (file) {
            alert("Please upload a valid .svg file.");
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(data); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div className="flex flex-col items-center space-y-2">
                <p className="text-sm text-slate-400">Icon Preview:</p>
                <div className="h-16 w-16 p-2 rounded-lg bg-slate-800 text-cyan-400" dangerouslySetInnerHTML={{ __html: data.icon }} />
                <input type="file" accept=".svg" onChange={handleFileChange} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/60 file:text-cyan-300 hover:file:bg-cyan-900" />
            </div>
            <input name="name" value={data.name} onChange={handleChange} placeholder="Goal Name" required className={inputClass} />
            <textarea name="description" value={data.description} onChange={handleChange} placeholder="Description" required className={inputClass} />
            <button type="submit" disabled={isSubmitting} className={buttonClass}>{isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Goal')}</button>
        </form>
    );
};

export default AdminDashboard;