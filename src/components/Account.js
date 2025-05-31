import React, { useEffect, useState } from 'react';
import userIcon from '../assets/user.png';
import "../styles.css";
import { app } from "../firebase"; 
import { getAuth, onAuthStateChanged, signOut, deleteUser, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

function Account() {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(""); // rola z Firestore
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        navigate("/Registration", { replace: true });
      } else {
        // Pobieranie roli użytkownika z Firestore
        const email = user.email;
        const collectionsToCheck = ['Clients', 'Employees'];

        for (let col of collectionsToCheck) {
          const q = query(collection(db, col), where("email", "==", email));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            setRole(userData.role);
            break;
          }
        }
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  const handleDeleteAccount = async () => {
    if (!currentUser) {
      return alert("Nie jesteś zalogowany");
    }

    const user = auth.currentUser;
    const email = user.email;

    try {
      // Usuwanie dokumentu użytkownika z Firestore
      const collectionsToCheck = ['Clients', 'Employees'];

      for (let col of collectionsToCheck) {
        const q = query(collection(db, col), where("email", "==", email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docId = snapshot.docs[0].id;
          await deleteDoc(doc(db, col, docId));
          break; // zakładamy, że jest tylko w jednej kolekcji
        }
      }

      // Usuwanie konta Firebase Auth
      await deleteUser(user);

      alert("Konto i dane zostały usunięte");
      navigate("/", { replace: true });
    } catch (error) {
      alert("Błąd usuwania konta: " + error.message);
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser) return alert("Nie jesteś zalogowany");
    try {
      await updatePassword(currentUser, newPassword);
      alert("Hasło zostało zmienione");
    } catch (error) {
      alert("Błąd zmiany hasła: " + error.message);
    }
  };

  return (
    <div className="account">
      <div className="account-form">
        <h1>Szczegóły konta</h1>
        <img src={userIcon} alt="icon" />
        {currentUser ? (
          <>
            <p>Email: {currentUser.email}</p>
            <p>Status konta: {role}</p>
          </>
        ) : (
          <p>Brak danych użytkownika.</p>
        )}
        <hr />

        <h1>Modyfikacja konta</h1>

        <div className="button-group">
          <button onClick={() => signOut(auth)} className="prod">Wyloguj się</button>
          <button onClick={handleDeleteAccount} className="prod">Usuń konto</button>
        </div>

        <hr />

        <h3>Zmiana hasła</h3>
        <input
          type="password"
          placeholder="Nowe hasło"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="text"
        />
        <button onClick={handleChangePassword} className="prod change-password-btn">Zmień hasło</button>
      </div>
    </div>
  );
}

export default Account;
