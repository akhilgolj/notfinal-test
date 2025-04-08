function handleCredentialResponse(response) {
    if (!response || !response.credential) {
        console.error('No credential received from Google Sign-In');
        return;
    }

    const userInfo = parseJwt(response.credential);
    const user = {
        id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUserProfileUI(user);

    fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            googleId: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture
        })
    }).catch(err => console.error('Error initializing user:', err));
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
}

function updateUserProfileUI(user) {
    const userProfile = document.getElementById('user-profile');
    const userName = document.getElementById('user-name');
    const userPicture = document.getElementById('user-picture');
    const gSignInButton = document.querySelector('.g_id_signin');

    if (!userProfile || !userName || !gSignInButton) {
        console.error('Required DOM elements for user profile UI are missing');
        return;
    }

    if (user) {
        userName.textContent = user.name || 'User';
        if (userPicture && user.picture) {
            userPicture.src = user.picture;
        }
        userProfile.style.display = 'flex';
        gSignInButton.style.display = 'none';
    } else {
        userProfile.style.display = 'none';
        gSignInButton.style.display = 'block';
    }
}

function signOut() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cartData');
    updateUserProfileUI(null);
    google.accounts.id.disableAutoSelect();
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUserProfileUI(currentUser);
    }

    google.accounts.id.initialize({
        client_id: '67099757392-80reaf2uk3ngknu4upfg9r3cikncdem9.apps.googleusercontent.com', // <-- Replace this!
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        { theme: 'outline', size: 'large' }
    );

    google.accounts.id.prompt(); // Optional: triggers One Tap if enabled
});
