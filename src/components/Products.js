import React, { useEffect, useState } from 'react';
import { app } from '../firebase';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Products() {
  // inicjalizacja firebase
  const db = getFirestore(app);
  const auth = getAuth();
  const navigate = useNavigate();
  // lista produktów
  const [products, setProducts] = useState([]);
  // dane nowego produktu
  const [newProduct, setNewProduct] = useState({
    Brand: '',
    Category: '',
    Name: '',
    amount: '',
    price: '',
    imageURL: ''
  });

  // ID edytowanego produktu i jego dane
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProductData, setEditedProductData] = useState({});
  // Lista dostępnych kategorii produktów
  const categories = ['Odzież', 'Kołowrotki', 'Przynęty', 'Wędki', 'Żyłki', 'Haczyki'];

  // sprawdzenie, czy użytkownik jest pracownikiem
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Nie masz dostępu");
        navigate('/');
        return;
      }

      // Sprawdzenie, czy użytkownik istnieje w kolekcji Employees i czy ma dostęp do katalogu
      const q = query(collection(db, 'Employees'), where('email', '==', user.email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        alert("Nie masz dostępu");
        navigate('/');
      } else {
        fetchProducts();
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

   // Funkcja do pobrania produktów z Firestore
  const fetchProducts = async () => {
    const productsCol = collection(db, 'Products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productList);
  };

  // Usuwanie produktu
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'Products', id));
    alert('Produkt został usunięty.');
    fetchProducts();
  };

   // Dodawanie nowego produktu
  const handleAddProduct = async () => {
    const { Brand, Category, Name, amount, price, imageURL} = newProduct;
    // Walidacja pól nowego produktu
    if (!Brand || !Category || !Name || !price || !amount || !imageURL) {
      alert('Wypełnij wszystkie wymagane pola (Brand, Category, Name, Price, Amount, imageURL)');
      return;
    }
        // Dodanie nowego produktu do Firestore
    await addDoc(collection(db, 'Products'), {
      Brand,
      Category,
      Name,
      amount,
      price: parseFloat(price),
      imageURL
    });
    alert('Produkt został dodany.');
     // Reset formularza i odświeżanie listy
    setNewProduct({ Brand: '', Category: '', Name: '', amount: '', price: '', imageURL: ''});
    fetchProducts();
  };

  // Rozpoczynanie edycji produktu
  const startEditing = (product) => {
    setEditingProductId(product.id);
    setEditedProductData({ ...product });
  };

  // Anulowanie edycji
  const cancelEditing = () => {
    setEditingProductId(null);
    setEditedProductData({});
  };

  // Zapisywanie zmian w edytowanym produkcie
  const saveChanges = async () => {
    const productRef = doc(db, 'Products', editingProductId);
    const { id, ...dataToUpdate } = editedProductData;
    await updateDoc(productRef, dataToUpdate);
    alert('Zapisano zmiany produktu.');
    setEditingProductId(null);
    setEditedProductData({});
    fetchProducts();
  };

  return (
    <div className='products'>
      <h1>Zarządzanie katalogiem produktów</h1>

      <h3>Dodaj nowy produkt</h3>
      <input
        type="text"
        placeholder="Brand"
        value={newProduct.Brand}
        onChange={e => setNewProduct({ ...newProduct, Brand: e.target.value })}
      />
      <select
        value={newProduct.Category}
        onChange={e => setNewProduct({ ...newProduct, Category: e.target.value })}
      >
        <option value="">Wybierz kategorię</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Name"
        value={newProduct.Name}
        onChange={e => setNewProduct({ ...newProduct, Name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Amount"
        value={newProduct.amount}
        onChange={e => setNewProduct({ ...newProduct, amount: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
      />
      <input
        type="text"
        placeholder="imageURL"
        value={newProduct.imageURL}
        onChange={e => setNewProduct({ ...newProduct, imageURL: e.target.value })}
      />
      <button onClick={handleAddProduct} className='prod'>Dodaj produkt</button>

      <hr />

      <h3>Lista produktów</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Category</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Price</th>
            <th>imageURL</th>
            <th>Management</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              {editingProductId === p.id ? (
                <>
                  <td>
                    <input
                      value={editedProductData.Brand}
                      onChange={e =>
                        setEditedProductData({ ...editedProductData, Brand: e.target.value })
                      }
                    />
                  </td>
                  <td>
                 <select
                  value={editedProductData.Category}
                  onChange={e =>
                setEditedProductData({ ...editedProductData, Category: e.target.value })
                }
                >
                <option value="">Wybierz kategorię</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
                  </td>
                  <td>
                    <input
                      value={editedProductData.Name}
                      onChange={e =>
                        setEditedProductData({ ...editedProductData, Name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editedProductData.amount}
                      onChange={e =>
                        setEditedProductData({ ...editedProductData, amount: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editedProductData.price}
                      onChange={e =>
                        setEditedProductData({ ...editedProductData, price: parseFloat(e.target.value) })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editedProductData.imageURL}
                      onChange={e =>
                        setEditedProductData({ ...editedProductData, imageURL: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button onClick={saveChanges} className='prod'>Zapisz</button>
                    <button onClick={cancelEditing} className='prod'>Anuluj</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.Brand}</td>
                  <td>{p.Category}</td>
                  <td>{p.Name}</td>
                  <td>{p.amount}</td>
                  <td>{p.price}</td>
                  <td>{p.imageURL}</td>
                  <td>
                    <button onClick={() => startEditing(p)} className="prod">Edytuj</button>
                    <button onClick={() => handleDelete(p.id)} className="prod">Usuń</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
