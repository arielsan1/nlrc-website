import { 
    auth, provider, signInWithPopup, onAuthStateChanged, signOut, 
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    db, doc, setDoc, getDoc 
} from "./firebase-config.js";

// --- Admin Authentication ---
async function signInAdmin(email, password) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Check if user is in 'admins' collection
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);
        
        if (adminSnap.exists()) {
            window.location.href = 'admin-dashboard.html';
            return user;
        } else {
            // Not an admin
            await signOut(auth);
            throw new Error("Access Denied: Not an authorized administrator.");
        }
    } catch (error) {
        console.error("Admin Login Error:", error);
        alert(error.message);
    }
}

// --- Member Authentication ---
async function signInMember(email, password) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'member-portal.html';
        return result.user;
    } catch (error) {
        console.error("Member Login Error:", error);
        alert(error.message);
    }
}

async function signUpMember(email, password, name) {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Create record in 'members' collection
        await setDoc(doc(db, "members", user.uid), {
            name: name,
            email: email,
            status: 'active',
            tier: 'Community',
            joinedDate: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        });
        
        window.location.href = 'member-portal.html';
        return user;
    } catch (error) {
        console.error("Member Sign-up Error:", error);
        alert(error.message);
    }
}

async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Default to member if not already something else
        const memberRef = doc(db, "members", user.uid);
        const memberSnap = await getDoc(memberRef);
        
        if (!memberSnap.exists()) {
            await setDoc(memberRef, {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                status: 'active',
                tier: 'Community',
                joinedDate: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
        }
        
        return user;
    } catch (error) {
        console.error("Google Sign-in Error:", error);
    }
}

async function handleSignOut() {
    await signOut(auth);
    window.location.href = 'index.html';
}

// Global Exports
window.signInAdmin = signInAdmin;
window.signInMember = signInMember;
window.signUpMember = signUpMember;
window.signInWithGoogle = signInWithGoogle;
window.handleSignOut = handleSignOut;

// --- Auth State Tracking ---
onAuthStateChanged(auth, async (user) => {
    // UI Updates
    const authButtons = document.querySelectorAll('.auth-trigger');
    const adminNames = document.querySelectorAll('.admin-profile-name, .user-full-name');
    const adminPhotos = document.querySelectorAll('.admin-profile-photo, .user-profile-photo');
    
    if (user) {
        authButtons.forEach(btn => {
            btn.innerHTML = `<img src="${user.photoURL || 'https://via.placeholder.com/150'}" class="w-8 h-8 rounded-full border-2 border-secondary" title="${user.displayName || user.email}">`;
            btn.onclick = () => { 
                // Determine where to go based on current page or role
                if (window.location.pathname.includes('admin-')) {
                    // Stay or handle admin profile
                } else {
                    window.location.href = 'member-portal.html';
                }
            };
        });

        adminNames.forEach(n => n.innerText = user.displayName || user.email.split('@')[0]);
        adminPhotos.forEach(p => p.src = user.photoURL || 'https://via.placeholder.com/150');

        // Check for specific role-based access if on protected pages
        if (window.location.pathname.includes('admin-')) {
            const adminSnap = await getDoc(doc(db, "admins", user.uid));
            if (!adminSnap.exists()) {
                window.location.href = 'index.html'; // Redirect non-admins away from admin pages
            }
        }
    } else {
        authButtons.forEach(btn => {
            btn.innerHTML = `<span class="material-symbols-outlined text-3xl text-primary cursor-pointer">account_circle</span>`;
            btn.onclick = () => { window.location.href = 'admin-login.html'; }; // Default for now
        });
        
        // If on a protected page and NOT logged in
        if (window.location.pathname.includes('admin-') && !window.location.pathname.includes('admin-login.html')) {
            window.location.href = 'admin-login.html';
        }
        if (window.location.pathname.includes('member-portal.html')) {
            window.location.href = 'index.html';
        }
    }
});
