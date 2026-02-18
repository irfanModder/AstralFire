const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loadingScreen = document.getElementById('loadingScreen');
const sidebar = document.getElementById('sidebar');


loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('usernameInput').value.trim();
    if (user === "") return;

    document.getElementById('loadingUsername').textContent = user;
    loadingScreen.classList.add('active');

    
    setTimeout(() => {
        loadingScreen.classList.remove('active');
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        
        document.getElementById('usernameDisplay').textContent = user;
        document.getElementById('welcomeUsername').textContent = user;
        document.getElementById('userAvatar').textContent = user.charAt(0).toUpperCase();
        
        initDashboard();
    }, 10000); 
});

function initDashboard() {
    
    const links = document.querySelectorAll('.sidebar-menu a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            document.querySelectorAll('.dashboard-content').forEach(c => c.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            
            if (target === 'listOrder') renderOrder();
        });
    });

    
    document.getElementById('sidebarToggleX').addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}


const orderBtn = document.getElementById('orderDiamondBtn');
if (orderBtn) {
    orderBtn.addEventListener('click', () => {
        const selected = [];
        document.querySelectorAll('#promoList input:checked').forEach(i => selected.push(i.value));
        if (selected.length === 0) return alert('Pilih Diamond dulu!');
        
        localStorage.setItem('orders', JSON.stringify(selected));
        alert('Item masuk ke List Order!');
    });
}

function renderOrder() {
    const box = document.getElementById('orderItemsList');
    const items = JSON.parse(localStorage.getItem('orders') || '[]');
    box.innerHTML = items.map(i => `<div class="list-item">${i}</div>`).join('');
}

document.getElementById('goBuyBtn')?.addEventListener('click', () => {
    const items = JSON.parse(localStorage.getItem('orders') || '[]');
    window.open(`https://wa.me/6282313154822?text=Halo%20bang%20mau%20order%20${items.join(', ')}`, '_blank');
});


document.getElementById('logoutBtn').addEventListener('click', () => location.reload());
