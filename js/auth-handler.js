import { auth, provider, signInWithPopup, onAuthStateChanged, signOut, db, doc, setDoc, getDoc } from "./firebase-config.js";

async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Sync with Firestore members collection
        const userRef = doc(db, "members", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                lastLogin: new Date().toISOString(),
                joinedDate: new Date().toISOString(),
                status: 'active',
                tier: 'Community'
            });
        } else {
            await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
        }
        
        return user;
    } catch (error) {
        console.error("Sign-in error:", error);
    }
}

async function handleSignOut() {
    await signOut(auth);
    window.location.reload();
}

window.signInWithGoogle = signInWithGoogle;
window.handleSignOut = handleSignOut;

// Track Auth State for UI updates
onAuthStateChanged(auth, (user) => {
    const authButtons = document.querySelectorAll('.auth-trigger');
    authButtons.forEach(btn => {
        if (user) {
            btn.innerHTML = `<img src="${user.photoURL}" class="w-8 h-8 rounded-full border-2 border-secondary" title="${user.displayName}">`;
            btn.onclick = () => { if(confirm('Sign out?')) handleSignOut(); };
        } else {
            btn.innerHTML = `<span class="material-symbols-outlined text-3xl text-primary cursor-pointer">account_circle</span>`;
            btn.onclick = signInWithGoogle;
        }
    });
});
