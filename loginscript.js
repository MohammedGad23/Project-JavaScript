document.getElementById('signup-form').addEventListener('submit', function(e) {
    
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (username && password) {
        const user = {
            username: username,
            password: password
        };
        
        localStorage.setItem(username, JSON.stringify(user));
        alert('Sign up successful!');

        // Redirect to login form
        document.getElementById('signup-container').classList.remove('active');
        document.getElementById('signup-container').classList.add('hidden');
        document.getElementById('login-container').classList.remove('hidden');
        document.getElementById('login-container').classList.add('active');
        document.getElementById('toggle-btn').textContent = 'Toggle to Sign Up';
    }
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const storedUser = localStorage.getItem(username);

    if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user.password === password) {
            // alert('Login successful!');
            // Redirect to another website
            window.location.href = 'index.html';
        } else {
            alert('Invalid password.');
        }
    } else {
        alert('User not found.');
    }
});

document.getElementById('toggle-btn').addEventListener('click', function() {
    const signupContainer = document.getElementById('signup-container');
    const loginContainer = document.getElementById('login-container');
    const toggleBtn = document.getElementById('toggle-btn');

    if (signupContainer.classList.contains('active')) {
        signupContainer.classList.remove('active');
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        loginContainer.classList.add('active');
        toggleBtn.textContent = 'Toggle to Sign Up';
    } else {
        signupContainer.classList.remove('hidden');
        signupContainer.classList.add('active');
        loginContainer.classList.remove('active');
        loginContainer.classList.add('hidden');
        toggleBtn.textContent = 'Toggle to Login';
    }
});