document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginScreen = document.getElementById('loginScreen');
    const loadingScreen = document.getElementById('loadingScreen');
    const dashboard = document.getElementById('dashboard');
    const usernameInput = document.getElementById('usernameInput');
    const errorMessage = document.getElementById('errorMessage');
    
    // Sidebar Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    const dashboardContents = document.querySelectorAll('.dashboard-content');
    const sidebarToggle = document.getElementById('sidebarToggleX');
    
    // LOGIN LOGIC
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        
        if (username === "") {
            errorMessage.style.display = 'block';
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
            return;
        }

        // Show Loading
        loginScreen.style.display = 'none';
        loadingScreen.classList.add('active');
        document.getElementById('loadingUsername').textContent = username;

        // Loading Animations sequence
        const texts = ['loadingText1', 'loadingText2', 'loadingText3'];
        texts.forEach((id, index) => {
            setTimeout(() => {
                document.getElementById(id).classList.add('show');
            }, index * 2500);
        });

        // 10 Seconds delay as in original file
        setTimeout(() => {
            loadingScreen.classList.remove('active');
            dashboard.style.display = 'block';
            
            // Set User Data
            document.getElementById('usernameDisplay').textContent = username;
            document.getElementById('welcomeUsername').textContent = username;
            document.getElementById('userAvatar').textContent = username.charAt(0).toUpperCase();
            
            showNotification(`Welcome back, ${username}!`);
        }, 10000);
    });

    // SIDEBAR NAVIGATION
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            
            // Update Active Link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show Content
            dashboardContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetId) {
                    content.classList.add('active');
                }
            });

            // Close sidebar on mobile
            if (window.innerWidth <= 992) {
                sidebar.classList.add('collapsed');
            }
        });
    });

    // SIDEBAR TOGGLE
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // ORDER DIAMOND LOGIC
    const orderBtn = document.getElementById('orderDiamondBtn');
    const promoCheckboxes = document.querySelectorAll('#promoList input[type="checkbox"]');
    
    orderBtn.addEventListener('click', () => {
        const idAcc = document.getElementById('diamondId').value;
        const selectedItems = [];
        
        if (!idAcc) {
            alert('Masukkan ID Account dulu bang!');
            return;
        }

        promoCheckboxes.forEach(cb => {
            if (cb.checked) {
                selectedItems.push(cb.value);
            }
        });

        if (selectedItems.length === 0) {
            alert('Pilih item diamond-nya dulu!');
            return;
        }

        // Save to List Order
        let currentOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        selectedItems.forEach(item => {
            currentOrders.push({
                id: idAcc,
                item: item,
                date: new Date().toLocaleString()
            });
        });
        
        localStorage.setItem('userOrders', JSON.stringify(currentOrders));
        showNotification('Item berhasil ditambahkan ke List Order!');
        
        // Reset inputs
        document.getElementById('diamondId').value = '';
        promoCheckboxes.forEach(cb => cb.checked = false);
        
        renderOrders();
    });

    function renderOrders() {
        const orderListContainer = document.getElementById('orderItemsList');
        const goBuyBtn = document.getElementById('goBuyBtn');
        const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        
        if (orders.length === 0) {
            orderListContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5); padding: 20px;">Belum ada pesanan</p>';
            goBuyBtn.style.display = 'none';
            return;
        }

        goBuyBtn.style.display = 'block';
        orderListContainer.innerHTML = orders.map((order, index) => `
            <div class="list-item" style="margin-bottom: 10px;">
                <div>
                    <h3 class="list-title">${order.item}</h3>
                    <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5);">ID: ${order.id} | ${order.date}</p>
                </div>
                <button onclick="removeOrder(${index})" style="background: none; border: none; color: #ff4d4d; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Global remove function for renderOrders
    window.removeOrder = (index) => {
        let orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        orders.splice(index, 1);
        localStorage.setItem('userOrders', JSON.stringify(orders));
        renderOrders();
    };

    // WA REDIRECT FOR ORDER
    document.getElementById('goBuyBtn').addEventListener('click', () => {
        const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        let msg = "Halo Irfan, saya mau beli:\n\n";
        orders.forEach((o, i) => {
            msg += `${i+1}. ${o.item} (ID: ${o.id})\n`;
        });
        window.open(`https://wa.me/6282313154822?text=${encodeURIComponent(msg)}`, '_blank');
    });

    // QRIS NOTIFICATION
    document.getElementById('qrisBtn').addEventListener('click', () => {
        window.open('https://wa.me/6282313154822?text=Bang%20minta%20QRIS%20buat%20pembayaran', '_blank');
    });

    // LOGOUT
    document.getElementById('logoutBtn').addEventListener('click', () => {
        location.reload();
    });

    // UTILITY: NOTIFICATION
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(to right, #6a11cb, #2575fc);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 9999;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        `;
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .shake { animation: shake 0.5s ease-in-out; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }

    // Initial call
    renderOrders();
});
