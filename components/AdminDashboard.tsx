import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc 
} from 'firebase/firestore';
import { db } from '../firebase'; 
import Modal from './Modal';
import Loader from './Loader';

// --- Type Definitions ---
export interface Submission { id: string; name: string; campusId: string; email: string; interests: string; submissionDate: string; subscribeNewsletter: boolean; }
export interface Event { id: string; name?: string; description?: string; date?: string; venue?: string; status?: 'Upcoming' | 'Past'; imageUrl?: string; order?: number; }
export interface TeamMember { id: string; name?: string; role?: string; imageUrl?: string; githubUrl?: string; instagramUrl?: string; order?: number; }
export interface FAQ { id: string; question?: string; answer?: string; order?: number; }
export interface Goal { id: string; name?: string; description?: string; imageUrl?: string; order?: number; }

type Tab = 'Submissions' | 'Events' | 'Team' | 'FAQs' | 'Goals';
type EditableItem = Event | TeamMember | FAQ | Goal;

const AdminDashboard: React.FC<{ onBack: () => void; onLogout: () => void }> = ({ onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Submissions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // --- Fetching & Sorting Logic ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        const fetchCollection = async (colName: string) => {
            const querySnapshot = await getDocs(collection(db, colName));
            const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
            
            if (colName !== 'submissions') {
                return docs.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
            }
            return docs;
        };

        const [subs, evs, tm, fq, gls] = await Promise.all([
            fetchCollection('submissions'), fetchCollection('events'),
            fetchCollection('team'), fetchCollection('faqs'), fetchCollection('goals')
        ]);
        setSubmissions(subs); setEvents(evs); setTeam(tm); setFAQs(fq); setGoals(gls);
    } catch (error) { console.error("Firestore error:", error); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string, type: Tab) => {
    const col = type.toLowerCase();
    if (window.confirm(`Delete this ${type.slice(0,-1)}?`)) {
        try { 
            await deleteDoc(doc(db, col, id)); 
            fetchData(); 
        } catch (e) { alert("Delete failed"); }
    }
  };

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center p-10"><Loader /></div>;
    switch(activeTab) {
        case 'Submissions': return <SubmissionsTable data={submissions} />;
        case 'Events': return <EventsTable data={events} onEdit={(i) => {setEditingItem(i); setIsModalOpen(true);}} onDelete={(id) => handleDelete(id, 'Events')} />;
        case 'Team': return <TeamTable data={team} onEdit={(i) => {setEditingItem(i); setIsModalOpen(true);}} onDelete={(id) => handleDelete(id, 'Team')} />;
        case 'FAQs': return <FAQsTable data={faqs} onEdit={(i) => {setEditingItem(i); setIsModalOpen(true);}} onDelete={(id) => handleDelete(id, 'FAQs')} />;
        case 'Goals': return <GoalsTable data={goals} onEdit={(i) => {setEditingItem(i); setIsModalOpen(true);}} onDelete={(id) => handleDelete(id, 'Goals')} />;
        default: return null;
    }
  };

  return (
    <div className="relative z-10 min-h-screen container mx-auto px-4 py-24 sm:py-32">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm italic">iNITiate Society Management</p>
        </div>
        <div className="flex space-x-4">
            <button onClick={onBack} className="bg-slate-800 px-6 py-2 rounded-lg text-sm text-white hover:bg-slate-700 transition-colors">Back to Site</button>
            <button onClick={onLogout} className="bg-red-950/40 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-900 transition-colors">Logout</button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex space-x-4 border-b border-slate-700 overflow-x-auto w-full md:w-auto">
            {(['Submissions', 'Events', 'Team', 'FAQs', 'Goals'] as Tab[]).map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`py-2 px-1 whitespace-nowrap transition-colors ${activeTab === t ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-slate-400 hover:text-white'}`}>{t}</button>
            ))}
        </div>
        {activeTab !== 'Submissions' && (
            <button onClick={() => {setEditingItem(null); setIsModalOpen(true);}} className="bg-cyan-600 px-6 py-2 rounded-lg text-sm text-white font-bold hover:bg-cyan-500 transition-colors">Add New Item</button>
        )}
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
        {renderContent()}
      </div>

      <AnimatePresence>
        {isModalOpen && <ManageContentModal tab={activeTab} item={editingItem} onClose={() => setIsModalOpen(false)} onSuccess={fetchData} />}
      </AnimatePresence>
    </div>
  );
};

// --- MODAL & FORM LOGIC ---

const ManageContentModal = ({ tab, item, onClose, onSuccess }: any) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as any;
        
        if (data.order) data.order = Number(data.order);
        const col = tab.toLowerCase();

        try {
            if (item) await updateDoc(doc(db, col, item.id), data);
            else await addDoc(collection(db, col), data);
            onSuccess(); onClose();
        } catch (err) { alert("Database Error"); console.error(err); }
        finally { setLoading(false); }
    };

    const labelStyle = "block text-xs font-bold text-slate-400 uppercase mb-1";
    const inputStyle = "w-full bg-slate-800 p-2 rounded text-white border border-slate-700 mb-4 focus:border-cyan-500 outline-none";

    return (
        <Modal onClose={onClose} title={`${item ? "Edit" : "Add"} ${tab.slice(0, -1)}`}>
            <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                
                <label className={labelStyle}>Sort Order (Lower numbers show first)</label>
                <input type="number" name="order" defaultValue={item?.order || 0} className={inputStyle} />

                {tab !== 'FAQs' && (
                    <>
                        <label className={labelStyle}>Image URL</label>
                        <input name="imageUrl" defaultValue={item?.imageUrl} placeholder="Paste link here..." className={inputStyle} />
                    </>
                )}

                <label className={labelStyle}>{tab === 'FAQs' ? "Question" : "Name / Title"}</label>
                <input name={tab === 'FAQs' ? "question" : "name"} defaultValue={item?.name || item?.question} className={inputStyle} />

                {tab === 'Events' && (
                    <>
                        <label className={labelStyle}>Date</label>
                        <input name="date" defaultValue={item?.date} placeholder="Dec 5, 2025" className={inputStyle} />
                        
                        {/* Venue Field Added Here */}
                        <label className={labelStyle}>Venue</label>
                        <input name="venue" defaultValue={item?.venue} placeholder="Seminar Hall / Main Lab" className={inputStyle} />

                        <label className={labelStyle}>Status</label>
                        <select name="status" defaultValue={item?.status || "Upcoming"} className={inputStyle}>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Past">Past</option>
                        </select>
                    </>
                )}

                {tab === 'Team' && (
                    <>
                        <label className={labelStyle}>Role</label>
                        <input name="role" defaultValue={item?.role} placeholder="President" className={inputStyle} />
                        <label className={labelStyle}>GitHub URL</label>
                        <input name="githubUrl" defaultValue={item?.githubUrl} className={inputStyle} />
                        <label className={labelStyle}>Instagram URL</label>
                        <input name="instagramUrl" defaultValue={item?.instagramUrl} className={inputStyle} />
                    </>
                )}

                <label className={labelStyle}>{tab === 'FAQs' ? "Answer" : "Description"}</label>
                <textarea name={tab === 'FAQs' ? "answer" : "description"} defaultValue={item?.description || item?.answer} rows={4} className={inputStyle} />

                <button type="submit" disabled={loading} className="w-full bg-cyan-600 p-3 rounded-lg text-white font-bold hover:bg-cyan-500 transition-colors">
                    {loading ? "Syncing..." : "Save Changes"}
                </button>
            </form>
        </Modal>
    );
};

// --- SHARED TABLE COMPONENTS ---

const ActionButtons = ({ onEdit, onDelete }: any) => (
    <div className="flex space-x-3">
        <button onClick={onEdit} className="text-cyan-400 text-sm hover:underline">Edit</button>
        <button onClick={onDelete} className="text-red-500 text-sm hover:underline">Delete</button>
    </div>
);

const SubmissionsTable = ({ data }: {data: Submission[]}) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-white">
            <thead className="bg-slate-800/60">
                <tr><th className="px-6 py-3 text-left text-xs uppercase text-slate-400">Name</th><th className="px-6 py-3 text-left text-xs uppercase text-slate-400">Email</th><th className="px-6 py-3 text-left text-xs uppercase text-slate-400">ID</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {data.map(s => (<tr key={s.id} className="hover:bg-white/5"><td className="px-6 py-4">{s.name}</td><td className="px-6 py-4 text-slate-300">{s.email}</td><td className="px-6 py-4 text-slate-300">{s.campusId}</td></tr>))}
            </tbody>
        </table>
    </div>
);

const EventsTable = ({ data, onEdit, onDelete }: any) => (
    <table className="min-w-full divide-y divide-slate-800 text-white">
        <tbody>
            {data.map((e: any) => (
                <tr key={e.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 w-16 text-slate-500 font-mono">#{e.order || 0}</td>
                    <td className="px-6 py-4 font-bold">{e.name || "Untitled"}</td>
                    <td className="px-6 py-4 text-right"><ActionButtons onEdit={() => onEdit(e)} onDelete={() => onDelete(e.id)} /></td>
                </tr>
            ))}
        </tbody>
    </table>
);

const TeamTable = ({ data, onEdit, onDelete }: any) => (
    <table className="min-w-full divide-y divide-slate-800 text-white">
        <tbody>
            {data.map((m: any) => (
                <tr key={m.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 w-16 text-slate-500 font-mono">#{m.order || 0}</td>
                    <td className="px-6 py-4 font-bold">{m.name || "Unknown"}</td>
                    <td className="px-6 py-4 text-cyan-400 text-sm">{m.role}</td>
                    <td className="px-6 py-4 text-right"><ActionButtons onEdit={() => onEdit(m)} onDelete={() => onDelete(m.id)} /></td>
                </tr>
            ))}
        </tbody>
    </table>
);

const FAQsTable = ({ data, onEdit, onDelete }: any) => (
    <table className="min-w-full divide-y divide-slate-800 text-white">
        <tbody>
            {data.map((f: any) => (
                <tr key={f.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 w-16 text-slate-500 font-mono">#{f.order || 0}</td>
                    <td className="px-6 py-4">{f.question || "No Question"}</td>
                    <td className="px-6 py-4 text-right"><ActionButtons onEdit={() => onEdit(f)} onDelete={() => onDelete(f.id)} /></td>
                </tr>
            ))}
        </tbody>
    </table>
);

const GoalsTable = ({ data, onEdit, onDelete }: any) => (
    <table className="min-w-full divide-y divide-slate-800 text-white">
        <tbody>
            {data.map((g: any) => (
                <tr key={g.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 w-16 text-slate-500 font-mono">#{g.order || 0}</td>
                    <td className="px-6 py-4 font-bold">{g.name || "Untitled Goal"}</td>
                    <td className="px-6 py-4 text-right"><ActionButtons onEdit={() => onEdit(g)} onDelete={() => onDelete(g.id)} /></td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default AdminDashboard;