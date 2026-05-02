import { 
    auth, provider, signInWithPopup, onAuthStateChanged, signOut, 
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    db, doc, setDoc, getDoc 
} from "./firebase-config.js";

// --- Admin Authentication ---
export async function signInAdmin(email, password) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        const adminSnap = await getDoc(doc(db, "admins", user.uid));
        
        if (adminSnap.exists()) {
            window.location.href = 'admin-dashboard.html';
            return user;
        } else {
            await signOut(auth);
            alert("ACCESS DENIED: Your account (" + email + ") is not in the 'admins' Firestore collection. Please add your UID: " + user.uid + " to the database.");
            return null;
        }
    } catch (error) {
        alert("LOGIN ERROR: " + error.message);
        return null;
    }
}

export async function signInAdminWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        const adminSnap = await getDoc(doc(db, "admins", user.uid));
        
        if (adminSnap.exists()) {
            window.location.href = 'admin-dashboard.html';
            return user;
        } else {
            await signOut(auth);
            alert("ACCESS DENIED: Your Google account (" + user.email + ") is not authorized for Admin access. Please add this UID to your 'admins' collection: " + user.uid);
            return null;
        }
    } catch (error) {
        alert("GOOGLE ERROR: " + error.message);
        return null;
    }
}

// --- Member Authentication ---
export async function signInMember(email, password) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'member-portal.html';
        return result.user;
    } catch (error) {
        alert("MEMBER LOGIN ERROR: " + error.message);
    }
}

export async function signUpMember(email, password, name) {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        await setDoc(doc(db, "members", user.uid), {
            name: name, email: email, status: 'active', tier: 'Community',
            joinedDate: new Date().toISOString(), lastLogin: new Date().toISOString()
        });
        window.location.href = 'member-portal.html';
        return user;
    } catch (error) {
        alert("SIGNUP ERROR: " + error.message);
    }
}

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const memberRef = doc(db, "members", user.uid);
        const memberSnap = await getDoc(memberRef);
        if (!memberSnap.exists()) {
            await setDoc(memberRef, {
                name: user.displayName, email: user.email, photo: user.photoURL,
                status: 'active', tier: 'Community',
                joinedDate: new Date().toISOString(), lastLogin: new Date().toISOString()
            });
        }
        return user;
    } catch (error) {
        console.error("Google Sign-in Error:", error);
    }
}

export async function handleSignOut() {
    await signOut(auth);
    window.location.href = 'index.html';
}

// Global Exports
window.signInAdmin = signInAdmin;
window.signInAdminWithGoogle = signInAdminWithGoogle;
window.signInMember = signInMember;
window.signUpMember = signUpMember;
window.signInWithGoogle = signInWithGoogle;
window.handleSignOut = handleSignOut;

// --- Auth State Tracking ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Protect Admin Pages (but NOT the login page itself)
        if (window.location.pathname.includes('admin-') && !window.location.pathname.includes('admin-login.html')) {
            const adminSnap = await getDoc(doc(db, "admins", user.uid));
            if (!adminSnap.exists()) {
                window.location.href = 'index.html'; 
            }
        }
    } else {
        // Redirect if trying to access protected pages while logged out
        if (window.location.pathname.includes('admin-') && !window.location.pathname.includes('admin-login.html')) {
            window.location.href = 'admin-login.html';
        }
        if (window.location.pathname.includes('member-portal.html')) {
            window.location.href = 'index.html';
        }
    }
});
