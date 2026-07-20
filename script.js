const faqButtons = document.querySelectorAll('.FAQ-button');

faqButtons.forEach(btn => { 
    btn.addEventListener('click', () => {
        btn.closest('.FAQ-section').classList.toggle('active');
    })
})