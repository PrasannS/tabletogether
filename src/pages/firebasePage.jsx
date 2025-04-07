import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';

import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAPFn9zzoCufbohVJ5VDcUC6gBtPC7IB_o",
  authDomain: "tabletogether.firebaseapp.com",
  projectId: "tabletogether",
  storageBucket: "tabletogether.firebasestorage.app",
  messagingSenderId: "536905524696",
  appId: "1:536905524696:web:e93dcac6f4106ca8a73ead"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// Main App Component
const NotesApp = () => {
  // Firebase configuration - replace with your own config
  // const firebaseConfig = {
  //   apiKey: "AIzaSyAPFn9zzoCufbohVJ5VDcUC6gBtPC7IB_o",
  //   authDomain: "tabletogether.firebaseapp.com",
  //   projectId: "tabletogether",
  //   storageBucket: "tabletogether.firebasestorage.app",
  //   messagingSenderId: "536905524696",
  //   appId: "1:536905524696:web:e93dcac6f4106ca8a73ead"
  // };
  

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);

  // State variables
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch notes from Firestore
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const notesCollection = collection(db, 'notes');
      const notesSnapshot = await getDocs(notesCollection);
      const notesList = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesList);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
    setLoading(false);
  };

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Add a new note
  const addNote = async (e) => {
    e.preventDefault();
    
    if (!currentNote.title.trim() || !currentNote.content.trim()) return;
    
    try {
      await addDoc(collection(db, 'notes'), {
        title: currentNote.title,
        content: currentNote.content,
        createdAt: new Date().toISOString()
      });
      
      // Reset form and refresh notes
      setCurrentNote({ id: null, title: '', content: '' });
      fetchNotes();
    } catch (error) {
      console.error("Error adding note: ", error);
    }
  };

  // Update an existing note
  const updateNote = async (e) => {
    e.preventDefault();
    
    if (!currentNote.id || !currentNote.title.trim() || !currentNote.content.trim()) return;
    
    try {
      const noteRef = doc(db, 'notes', currentNote.id);
      await updateDoc(noteRef, {
        title: currentNote.title,
        content: currentNote.content,
        updatedAt: new Date().toISOString()
      });
      
      // Reset form and refresh notes
      setCurrentNote({ id: null, title: '', content: '' });
      setIsEditing(false);
      fetchNotes();
    } catch (error) {
      console.error("Error updating note: ", error);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  };

  // Set the current note for editing
  const editNote = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setCurrentNote({ id: null, title: '', content: '' });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Notes App</h1>
      
      {/* Note Form */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Edit Note' : 'Add New Note'}
        </h2>
        <form onSubmit={isEditing ? updateNote : addNote}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Note title"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              value={currentNote.content}
              onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              rows="4"
              placeholder="Note content"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {isEditing ? 'Update Note' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Notes List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
        
        {loading ? (
          <p className="text-center p-4">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-center p-4 bg-gray-50 rounded-md">No notes yet. Create your first note above!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {notes.map(note => (
              <div key={note.id} className="border rounded-md p-4 bg-white shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                <p className="text-gray-700 mb-4">{note.content}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => editNote(note)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;