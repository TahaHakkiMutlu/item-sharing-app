import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "esyanipaylas-340d9.firebaseapp.com",
  projectId: "esyanipaylas-340d9",
  storageBucket: "esyanipaylas-340d9.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const kayitOl = async (kullaniciAdi, sifre, adSoyad) => {
  const q = query(collection(db, "kullanicilar"), where("username", "==", kullaniciAdi));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    alert("Bu kullanıcı adı zaten alınmış!");
    return;
  }

  const fakeEmail = `${kullaniciAdi}@esyanipaylas.com`;

  try {
    const res = await createUserWithEmailAndPassword(auth, fakeEmail, sifre);

    await setDoc(doc(db, "kullanicilar", res.user.uid), {
      username: kullaniciAdi,
      adSoyad: adSoyad,
      uid: res.user.uid
    });
    alert("Kayıt Başarılı!");
  } catch (err) {
    alert("Hata: " + err.message);
  }
};