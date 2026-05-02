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
onAuthStateChanged(auth, async (user) => {
    // 1. General Header (Account Icon)
    const authButtons = document.querySelectorAll('.auth-trigger');
    authButtons.forEach(btn => {
        if (user) {
            btn.innerHTML = `<img src="${user.photoURL}" class="w-8 h-8 rounded-full border-2 border-secondary" title="${user.displayName}">`;
            btn.onclick = () => { window.location.href = 'member-portal.html'; };
        } else {
            btn.innerHTML = `<span class="material-symbols-outlined text-3xl text-primary cursor-pointer">account_circle</span>`;
            btn.onclick = signInWithGoogle;
        }
    });

    // 2. Navbar Link Update (Change Admin Console to Member Hub if logged in)
    const adminLinks = document.querySelectorAll('a[href="admin-login.html"], a[href="admin-dashboard.html"]');
    adminLinks.forEach(link => {
        if (user) {
            link.href = "member-portal.html";
            link.innerText = "Member Hub";
            link.classList.remove('text-slate-400');
            link.classList.add('text-primary');
        } else {
            link.href = "admin-login.html";
            link.innerText = "Admin Console";
        }
    });

    // 3. Profile Info for Portals
    const adminNames = document.querySelectorAll('.admin-profile-name, .user-full-name');
    const adminPhotos = document.querySelectorAll('.admin-profile-photo, .user-profile-photo');
    
    if (user) {
        adminNames.forEach(n => n.innerText = user.displayName);
        adminPhotos.forEach(p => {
            p.src = user.photoURL;
            p.title = user.displayName;
        });

        // If user just signed in on a login page, redirect them
        if (window.location.pathname.includes('login.html')) {
             window.location.href = 'member-portal.html';
        }
    } else if (window.location.pathname.includes('admin-') || window.location.pathname.includes('member-portal')) {
        // If on a protected page and NOT logged in, redirect to home or login
        if (!window.location.pathname.includes('admin-login.html')) {
            window.location.href = 'index.html';
        }
    }
});
