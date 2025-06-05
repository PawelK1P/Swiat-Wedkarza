import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, getDocs, deleteDoc, addDoc, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';  // upewnij się, że ścieżka jest poprawna
import star from '../assets/star.png';
import "./SingleProductPage.css";
import { useCart } from "./CartContext";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function SingleProductPage() {
    const { id } = useParams(); // pobranie ID produktu z URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const {addToCart} = useCart(); // funkcja do dodawania do koszyka
    const auth = getAuth();
    const [currentClientID, setCurrentClientID] = useState();
    const [isEmployee, setIsEmployee] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewStars, setNewReviewStars] = useState(5);
    const hasUserReviewed = reviews.some(review => review.clientID === currentClientID);

    // Pobieranie recenzji dla danego produktu z bazy danych
    const fetchReviews = async () => {
        const q = query(collection(db, 'Reviews'), where("productID", "==", id));
        const querySnapshot = await getDocs(q);
        const reviewsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setReviews(reviewsList);
    };
    // Pobieranie danych produktu po załadowaniu strony lub zmianie ID
    useEffect(() => {
        async function fetchProduct() {
        try {
            const docRef = doc(db, 'Products', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
           setProduct({ id: docSnap.id, ...docSnap.data() });
            } else {
            alert("Produkt nie istnieje");
            navigate('/'); // przekierowanie np. do strony głównej
            }
        } catch (error) {
            console.error("Błąd przy pobieraniu produktu:", error);
        }
        }
        fetchProduct();
        fetchReviews();  // pobieranie recenzji
    }, [id, navigate]);

    //sprawdzanie możliwości usuwania recenzji swojej jako klient lub wszystkich jako pracownik
    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        const qC = query(collection(db, 'Clients'), where("email", "==", user.email));
        const querySnapshotC = await getDocs(qC);
        if (!querySnapshotC.empty) {
            const doc = querySnapshotC.docs[0];
            console.log("Client ID:", doc.id);
            setCurrentClientID(doc.id);
        }

        const qE = query(collection(db, 'Employees'), where("email", "==", user.email));
        const querySnapshotE = await getDocs(qE);
        if (!querySnapshotE.empty) {
            setIsEmployee(true);
        }
    });

    return () => unsubscribe();
    }, [auth, db]);

    if (!product) return null;  // tutaj usunięto komunikat ładowania

    //dodawanie nowych recenzji
    const handleAddReview = async () => {
        if (!currentClientID || !newReviewText.trim()) return;

        const review = {
            review: newReviewText.trim(),
            stars: newReviewStars,
            clientID: currentClientID,
            productID: id
        };

        try {
            await addDoc(collection(db, 'Reviews'), review);
            alert('Recenzja dodana!');
            setNewReviewText('');
            setNewReviewStars(5);
            fetchReviews();
        } catch (error) {
            console.error('Błąd przy dodawaniu recenzji:', error);
        }
    };

    //usuwanie recenzji
    const deleteReview = async (id) => {
        await deleteDoc(doc(db, 'Reviews', id));
        alert('Recenzja została usnunięta');
        fetchReviews();
    };

    return (
        <div className="SingleProduct">
            <div className="ProductImage">
                <img src={product.imageURL} alt={product.Name || "ProductImage"} />
            </div>

            <div className="ProductInfo">
                <span className="ProductName">{product.Name}</span>
                <span className="ProductBrand">Marka: {product.Brand}</span>
                <span className="ProductPrice">Cena: {product.price.toFixed(2)} zł</span>
                <span className="ProductAmount">Ilość: {product.amount}</span>
                <button className="AddToCart" onClick={() => addToCart(product)}>Dodaj do koszyka</button>
                <main className="Reviews-container">
                    <span className="ProductReviews">Recenzje:</span>
                    {reviews.length === 0 ? (
                        <div>Produkt nie ma jeszcze recenzji.</div>
                    ) : (
                    <div className="Reviews">
                        {reviews.map(review => (
                        <div className="Review" key={review.id}>
                            <div className="ReviewStars">
                            {Array.from({length: review.stars}, (_, i) => (
                                <img src={star} alt="Star" key={i} className="StarIcon" />
                            ))}
                            </div>
                            <div className="ReviewText">{review.review}</div>
                            {(review.clientID === currentClientID || isEmployee) && (
                                <button className="ReviewDelete" onClick={() => deleteReview(review.id)}>Usuń recenzję</button>
                            )}
                        </div>
                        ))}
                    </div>
                    )}
                </main>
                {!hasUserReviewed && currentClientID && (
                <div className="AddReviewSection">
                <h3>Dodaj recenzję</h3>
                    <textarea className="ReviewTextarea" value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)}/>
                    <select className="ReviewStarSelect" value={newReviewStars} onChange={(e) => setNewReviewStars(parseInt(e.target.value))}>
                        {[1, 2, 3, 4, 5].map(star => (
                        <option key={star} value={star}>{star} ★</option>
                        ))}
                    </select>
                    <button className="SubmitReviewButton" onClick={handleAddReview} disabled={!newReviewText}>Dodaj recenzję</button>
                </div>
                )}
            </div>
            <div className="ProductDescription">
                {product.description || "Brak opisu produktu."}
            </div>
        </div>
    );
}

export default SingleProductPage;
