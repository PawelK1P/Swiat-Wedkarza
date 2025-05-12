import React, { useEffect, useState } from 'react';
import userIcon from '../assets/user.png';
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles.css";
import { app } from "../firebase"; 
import { getAuth, onAuthStateChanged, signOut, deleteUser, updatePassword  } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Account() {
  const [currentUser , setCurrentUser ] = useState(null); 
  const [newPassword,setNewPassword] = useState('')
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser (user);
      setChecking(false);
      if (!user) {
        navigate("/Registration", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  // funkcja do usuwania konta
  const handleDeleteAccount = async () => {
    if (!currentUser ) {
      return alert("Nie jesteś zalogowany");
    }
    
    const user = auth.currentUser ; // Get the current user from auth
    try {
      await deleteUser (user);
      alert("Konto zostało usunięte");
      navigate("/", { replace: true }); 
    } catch (error) {
      alert("Błąd usuwania konta: " + error.message);
    }
  };

  //funkcja do zmiany hasła
  const handleChangePassword = async() =>{
    if(!currentUser) return alert("Nie jesteś zalogowany");
    try{
      await updatePassword(currentUser,newPassword);
      alert("Hasło zostało zmienione");
    } catch(error){
      alert("Błąd zmiany hasła: "+error.message);
    }
  };


  return (
    <>
      <div className="registration">
        <div className="registration-form">
          <>
            <h1>Szczegóły konta</h1>
            <img src={userIcon} alt="icon" />
            {currentUser  ? ( 
              <>
                <p>Email: {currentUser .email}</p>
                <p>Status konta: {currentUser .role}</p>
              </>
            ) : (
              <p>Brak danych użytkownika.</p> 
            )}
            <hr />
            <h1>Modyfikacja konta</h1>
            <button onClick={() => signOut(auth)} className="prod">Wyloguj się</button> <br></br>
            <button onClick={handleDeleteAccount} className="prod">Usuń konto</button>
            <div classname="login-form">
            <h3>Zmiana hasła</h3>
            <input type="password" placeholder="nowe hasło" value={newPassword} onChange={(e) =>setNewPassword(e.target.value)} /> <br></br>
            <button onClick={handleChangePassword}>Zmień hasło</button>
            </div>

          </>
        </div>
      </div>
    </>
  );
}

export default Account;