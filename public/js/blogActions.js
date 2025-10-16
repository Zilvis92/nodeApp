// Funkcija trynimui
async function deleteBlog(blogId) {
    if (confirm('Ar tikrai norite ištrinti šią pamoką?')) {
        try {
            const response = await fetch(`/blogs/${blogId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Pamoka sėkmingai ištrinta!');
                window.location.href = '/';
            } else {
                alert('Klaida: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Įvyko klaida bandant ištrinti pamoką');
        }
    }
}

// Event listener delete mygtukams
document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const blogId = this.getAttribute('data-blog-id');
            deleteBlog(blogId);
        });
    });
});