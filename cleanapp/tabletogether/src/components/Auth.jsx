import {useState}  from 'react'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';


export default function AuthForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);

    const handleAuth = async () => {
        try {
          if (isNewUser) {
            await createUserWithEmailAndPassword(auth, email, password);
          } else {
            await signInWithEmailAndPassword(auth, email, password);
          }
        } catch (err) {
          alert(err.message);
        }
      };

return (
    <div>
      <h2>{isNewUser ? "Create A New Account" : "Login"}</h2>
      <input type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleAuth}>{isNewUser ? "Create A New Account" : "Login"}</button>
      <button onClick={() => setIsNewUser(!isNewUser)}>Switch</button>
    </div>
  );
}