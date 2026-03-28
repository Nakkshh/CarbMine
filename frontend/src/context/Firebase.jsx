import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { createContext, useContext, useState, useEffect } from 'react';

const firebaseConfig = {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp    = initializeApp(firebaseConfig);
const firebaseAuth   = getAuth(firebaseApp);
const firestore      = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
    const [user,       setUser]      = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading,    setLoading]   = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            setUser(currentUser);
            setIsLoggedIn(!!currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const addUser = async (CoalName, email, password) => {
        try {
            const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            await setDoc(doc(firestore, 'users', result.user.uid), {
                CoalName,
                email,
                uid:       result.user.uid,
                createdAt: new Date().toISOString()
            });
            return result;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    };

    const signinWithGoogle = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider);
            return result;
        } catch (error) {
            console.error('Google sign-in error:', error);
            throw error;
        }
    };

    const loginUser = async (email, password, rememberMe = false) => {
        await setPersistence(
            firebaseAuth,
            rememberMe ? browserLocalPersistence : browserSessionPersistence
        );
        return signInWithEmailAndPassword(firebaseAuth, email, password);
    };

    const logoutUser    = () => signOut(firebaseAuth);
    const resetPassword = (email) => sendPasswordResetEmail(firebaseAuth, email);

    // ✅ UPDATED: Cloudinary upload instead of Firebase Storage
    const uploadPDFToFirebase = async (pdfBlob) => {
        const uid = firebaseAuth.currentUser?.uid;
        if (!uid) throw new Error('User not logged in');

        const fileName   = `report_${Date.now()}.pdf`;

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', pdfBlob, fileName);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        formData.append('public_id', `carbmine/reports/${uid}/${fileName}`);
        formData.append('resource_type', 'raw');

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
            { method: 'POST', body: formData }
        );

        if (!res.ok) throw new Error('Cloudinary upload failed');
        const data = await res.json();
        const downloadURL = data.secure_url;

        // Save URL to Firestore (same as before)
        await addDoc(collection(firestore, 'users', uid, 'reports'), {
            url:       downloadURL,
            fileName,
            createdAt: serverTimestamp(),
        });

        return downloadURL;
    };

    const fetchUserPDFs = async () => {
        const uid = firebaseAuth.currentUser?.uid;
        if (!uid) return [];
        const snapshot = await getDocs(collection(firestore, 'users', uid, 'reports'));
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg)' }}>
            <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24"
                style={{ color: 'var(--primary)' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>
    );

    return (
        <FirebaseContext.Provider value={{
            user, isLoggedIn,
            addUser, loginUser, signinWithGoogle,
            logoutUser, resetPassword,
            uploadPDFToFirebase, fetchUserPDFs
        }}>
            {children}
        </FirebaseContext.Provider>
    );
};