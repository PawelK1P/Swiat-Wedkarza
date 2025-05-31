import React, { useState } from 'react'; //useState zarządza komponentem
import "../styles.css";
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // metoda służąca do logowania
import { app } from '../firebase';
import { useNavigate } from "react-router";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    error: ""
  });
// autoryzacja domeny
  const auth = getAuth(app);
  const navigate = useNavigate(); // służy do nawigacji po zalogowaniu
    // Obsługa zmiany wartości w formularzu:
    const handleChange = (e) => { 
      const { name, value } = e.target; 
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        error: ""
      })); 
    };
      // Obsługa wysyłania formularza: 
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
          await signInWithEmailAndPassword(auth, formData.email, formData.password);
          alert("Zalogowano pomyślnie!");
          navigate("/"); // przekierowanie na stronę główną
        } catch (error) {
          console.log(error); // Logowanie błędu w konsoli
          let errorMessage = 'Wystąpił błąd. Spróbuj ponownie później.';
          switch (error.code) {
            case 'auth/wrong-password':
              errorMessage = 'Nieprawidłowe hasło. Spróbuj ponownie.';
              break;
            case 'auth/user-not-found':
              errorMessage = 'Nie znaleziono użytkownika z tym adresem e-mail.';
              break;
            case 'auth/invalid-credential':
              errorMessage = 'Nieprawidłowe dane logowania. Sprawdź swoje dane.';
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
      <div className="login">
      <div className="login-form">
        <h1>Logowanie</h1>
        <form onSubmit={handleSubmit}>
          <p>E-mail</p>
          <input 
            type="email" className='text'
            name="email"
            id="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder='E-mail' 
          />
          <p>Hasło</p>
          <input 
            type="password" className='text'
            name="password"
            id="password" 
            value={formData.password} 
            onChange={handleChange} 
            required
            placeholder='Hasło' 
          />         
          <br /><br />
          <input 
            type="submit"
            id="submit" 
            value="Zaloguj się" 
          />
        </form>
        {formData.error && <p className="error-message">{formData.error}</p>}
        </div>
        <p>Nie masz konta? Utwórz je</p><div className='login'><Link to="/Registration">Rejestracja</Link></div>
      </div>
      
    </>
  );
};

export default Login;