// theme.js

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const THEME_KEY = 'user-theme'; // Key for localStorage
    const DARK_CLASS = 'dark-theme'; // CSS class for dark mode

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add(DARK_CLASS);
            if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon'); // Change icon to moon
            localStorage.setItem(THEME_KEY, 'dark');
        } else {
            body.classList.remove(DARK_CLASS);
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun'); // Change icon to sun
            localStorage.setItem(THEME_KEY, 'light');
        }
    };

    const toggleTheme = () => {
        const currentTheme = localStorage.getItem(THEME_KEY) || 'light'; // Default to light
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    };


    const savedTheme = localStorage.getItem(THEME_KEY);

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    } else {
        console.error("Theme toggle button not found!");
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
});