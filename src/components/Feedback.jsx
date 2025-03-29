import { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Feedback({ menuItem }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitFeedback = async () => {
    if (!auth.currentUser) return alert("You must be logged in!");

    await addDoc(collection(db, "feedback"), {
      userId: auth.currentUser.uid,
      menuItem,
      rating,
      comment,
      createdAt: new Date(),
    });
  };

  return (
    <div>
      <textarea onChange={e => setComment(e.target.value)} placeholder="Leave a comment" />
      <input type="number" min="1" max="5" value={rating} onChange={e => setRating(Number(e.target.value))} />
      <button onClick={submitFeedback}>Submit Feedback</button>
    </div>
  );
}
