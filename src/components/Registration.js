import React, { useState } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles.css";
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebase';
import { useNavigate } from "react-router";

function Registration() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    error: ""
  });

  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      error: ""
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      const collectionName = formData.role === 'pracownik' ? 'Employees' : 'Clients';

     await addDoc(collection(db, collectionName), {
    email: formData.email,
    role: formData.role === "pracownik" ? "Pracownik" : "Klient"
    });

      alert("Rejestracja zakończona pomyślnie!");
      navigate("/");
    } catch (error) {
      console.error(error);
      let errorMessage = 'Wystąpił błąd. Spróbuj ponownie później.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Konto z takim adresem email już istnieje.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Nieprawidłowy adres email.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Nieprawidłowe dane logowania. Sprawdź swoje dane.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Hasło jest za słabe. Zmień na inne.';
          break;
        default:
          break;
      }
      setFormData(prevState => ({
        ...prevState,
        error: errorMessage
      }));
    }
  };

  return (
    <>
      <div className="registration">
        <div className="registration-form">
          <h1>Rejestracja</h1>
          <form onSubmit={handleSubmit}>
            <p>E-mail</p>
            <input 
              type="email"
              className="text"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="E-mail"
            />
            <p>Hasło</p>
            <input 
              type="password"
              className="text"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Hasło"
            />
            <p>Typ konta</p>
            <select 
              name="role" 
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="klient">Klient</option>
              <option value="pracownik">Pracownik</option>
            </select>
            <br /><br />
            <input 
              type="submit"
              id="submit"
              value="Zarejestruj się"
            />
          </form>
          {formData.error && <p className="error-message">{formData.error}</p>}
        </div>

        <p>Masz konto? Zaloguj się</p>
        <div className="login">
          <Link to="/Login">Zaloguj się</Link>
        </div>
      </div>
    </>
  );
}

export default Registration;
