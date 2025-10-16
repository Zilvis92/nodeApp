// Formų validacija
class FormValidation {
    static initBlogForm() {
        const form = document.getElementById('blog-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            const title = document.getElementById('title').value.trim();
            const santrauka = document.getElementById('santrauka').value.trim();
            const body = document.getElementById('body').value.trim();

            if (!title || !santrauka || !body) {
                e.preventDefault();
                this.showError('Visi laukai yra privalomi!');
                return;
            }

            if (title.length < 3) {
                e.preventDefault();
                this.showError('Pavadinimas turi būti bent 3 simbolių ilgio!');
                return;
            }
        });
    }

    static showError(message) {
        // Pašaliname senas klaidas
        const existingError = document.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        // Sukuriame naują klaidos pranešimą
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error error-message';
        errorDiv.textContent = message;

        const form = document.getElementById('blog-form');
        form.insertBefore(errorDiv, form.firstChild);
    }
}

// Inicializuojame, kai DOM užsikrauna
document.addEventListener('DOMContentLoaded', () => {
    FormValidation.initBlogForm();
});