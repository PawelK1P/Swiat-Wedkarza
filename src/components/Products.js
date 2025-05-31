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
  const db = getFirestore(app);
  const auth = getAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    Brand: '',
    Category: '',
    Name: '',
    image: '',
    price: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Nie masz dostępu");
        navigate('/');
        return;
      }

      const email = user.email;
      const collectionsToCheck = ['Employees'];
      let foundEmployee = false;

      for (let col of collectionsToCheck) {
        const q = query(collection(db, col), where('email', '==', email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          foundEmployee = true;
          break;
        }
      }

      if (!foundEmployee) {
        alert("Nie masz dostępu");
        navigate('/');
      } else {
        fetchProducts();
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  const fetchProducts = async () => {
    const productsCol = collection(db, 'Products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productList);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    }
  };

  const handleUpdate = async (id, field, value) => {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, { [field]: value });
    fetchProducts();
  };

  const handleAddProduct = async () => {
    const { Brand, Category, Name, image, price } = newProduct;
    if (!Brand || !Category || !Name || !price) {
      alert('Wypełnij wszystkie wymagane pola (Brand, Category, Name, Price)');
      return;
    }
    await addDoc(collection(db, 'products'), {
      Brand,
      Category,
      Name,
      image,
      price: parseFloat(price),
    });
    setNewProduct({ Brand: '', Category: '', Name: '', image: '', price: '' });
    fetchProducts();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Zarządzanie katalogiem produktów</h2>

      <h3>Dodaj nowy produkt</h3>
      <input
        type="text"
        placeholder="Brand"
        value={newProduct.Brand}
        onChange={e => setNewProduct({ ...newProduct, Brand: e.target.value })}
      />
      <input
        type="text"
        placeholder="Category"
        value={newProduct.Category}
        onChange={e => setNewProduct({ ...newProduct, Category: e.target.value })}
      />
      <input
        type="text"
        placeholder="Name"
        value={newProduct.Name}
        onChange={e => setNewProduct({ ...newProduct, Name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={newProduct.image}
        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
      />
      <button onClick={handleAddProduct}>Dodaj produkt</button>

      <hr />

      <h3>Lista produktów</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Category</th>
            <th>Name</th>
            <th>Image</th>
            <th>Price</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>
                <input
                  type="text"
                  value={p.Brand}
                  onChange={e => handleUpdate(p.id, 'Brand', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={p.Category}
                  onChange={e => handleUpdate(p.id, 'Category', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={p.Name}
                  onChange={e => handleUpdate(p.id, 'Name', e.target.value)}
                />
              </td>
              <td>
                {p.image ? <img src={p.image} alt={p.Name} width="50" /> : 'Brak'}
                <br />
                <input
                  type="text"
                  placeholder="Zmień URL obrazka"
                  onBlur={e => handleUpdate(p.id, 'image', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={p.price}
                  onChange={e => handleUpdate(p.id, 'price', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(p.id)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
