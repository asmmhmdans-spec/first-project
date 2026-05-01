document.getElementById('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    [nameInput, emailInput, passwordInput].forEach(input => {
        input.style.borderColor = "#ddd";
    });
    nameError.textContent = emailError.textContent = passwordError.textContent = "";

    let isValid = true;

    if (name === "" || name.length < 3) {
        nameError.textContent = name === "" ? "Please enter your name" : "Name is too short";
        nameInput.style.borderColor = "red";
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailPattern.test(email)) {
        emailError.textContent = email === "" ? "Please enter your email" : "Email is invalid";
        emailInput.style.borderColor = "red";
        isValid = false;
    }

    if (password === "" || password.length < 6) {
        passwordError.textContent = password === "" ? "Please enter your password" : "Password is too weak";
        passwordInput.style.borderColor = "red";
        isValid = false;
    }

    if (!isValid) return;

    if (window.location.protocol === "file:") {
        emailError.textContent = "Open the project from http://localhost:3000, not by double-clicking form.html.";
        emailInput.style.borderColor = "red";
        return;
    }

    try {
        const result = await apiRequest('/api/auth/register-or-login', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        saveAuthSession(result);
        localStorage.setItem('activeNavItem', 'home-link');
        window.location.href = "index.html";
    } catch (error) {
        emailError.textContent = error.message === "Failed to fetch"
            ? "Server is not running. Run node server.js, then open http://localhost:3000."
            : error.message;
        emailInput.style.borderColor = "red";
    }
});
