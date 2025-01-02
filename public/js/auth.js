class Auth {
    static async login(email, password) {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('room-container').style.display = 'block';
            return true;
        }
        alert('Login failed');
        return false;
    }

    static async register(email, password) {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.success) {
            alert('Registration successful! Please login.');
        } else {
            alert('Registration failed');
        }
        return data;
    }
}
