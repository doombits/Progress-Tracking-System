
import React, { useState } from 'react';
import { Book as BookIcon, Search, Download, Plus, Trash2 } from 'lucide-react';
import { db } from '../../services/dbService';
import { Book, UserRole, User } from '../../types';

interface Props {
    user?: User | null;
}

const LibraryView: React.FC<Props> = ({ user }) => {
    const [books, setBooks] = useState<Book[]>(db.getBooks());
    const [search, setSearch] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    
    // Upload State
    const [newTitle, setNewTitle] = useState('');
    const [newAuthor, setNewAuthor] = useState('');

    const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase()));

    const handleUpload = () => {
        if (!newTitle || !newAuthor) return;
        const newBook: Book = {
            id: Date.now().toString(),
            title: newTitle,
            author: newAuthor,
            category: 'General',
            coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80',
            contentUrl: '#',
            uploadedBy: user?.id
        };
        db.addBook(newBook);
        setBooks(db.getBooks());
        setShowUpload(false);
        setNewTitle('');
        setNewAuthor('');
    };

    return (
        <div className="animate-fade-in p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><BookIcon className="text-blue-600"/> Digital Library</h1>
                    <p className="text-slate-500">Access thousands of books and notes.</p>
                </div>
                {user?.role === UserRole.TEACHER && (
                    <button onClick={() => setShowUpload(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                        <Plus size={20}/> Upload Book
                    </button>
                )}
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"/>
                <input 
                    type="text" 
                    placeholder="Search for books, authors, or categories..." 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Upload New Resource</h2>
                        <input className="input-field mb-4 w-full border p-2 rounded" placeholder="Book Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                        <input className="input-field mb-4 w-full border p-2 rounded" placeholder="Author" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} />
                        <div className="flex gap-2">
                            <button onClick={() => setShowUpload(false)} className="flex-1 bg-slate-200 p-2 rounded font-bold">Cancel</button>
                            <button onClick={handleUpload} className="flex-1 bg-blue-600 text-white p-2 rounded font-bold">Upload</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filtered.map(book => (
                    <div key={book.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:-translate-y-1 transition group relative">
                        <div className="h-48 overflow-hidden relative">
                             <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover"/>
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                 <button className="bg-white p-2 rounded-full text-slate-900"><BookIcon size={20}/></button>
                                 <button className="bg-blue-600 p-2 rounded-full text-white"><Download size={20}/></button>
                             </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-slate-800 dark:text-white truncate">{book.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{book.author}</p>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 uppercase">{book.category}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LibraryView;
