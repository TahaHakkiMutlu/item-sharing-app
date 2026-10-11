const { createApp, ref, computed, watch, nextTick } = Vue;

createApp({
    setup() {
        // --- Reactive Data ---
        const isLoggedIn = ref(false);
        const authMode = ref('login'); // 'login' or 'register'
        const authForm = ref({
            fullName: '',
            username: '',
            password: ''
        });
        const currentUser = ref(null); // { username, fullName, points, role }
        const toasts = ref([]);
        let toastId = 0;

        const showModal = ref(false); // For new item modal
        const newItem = ref({
            title: '',
            loc: '',
            tag: 'Ücretsiz',
            cat: '',
            desc: '',
            img: ''
        });

        const categories = ref(['Elektronik', 'Giyim', 'Ev Eşyası', 'Kitap', 'Spor Malzemeleri', 'Hobi', 'Diğer']);
        const locations = ref({
            'Kadıköy': [40.993, 29.028],
            'Beşiktaş': [41.043, 29.006],
            'Şişli': [41.057, 28.985],
            'Fatih': [41.015, 28.948],
            'Üsküdar': [41.025, 29.016],
            'Bakırköy': [40.978, 28.873],
            'Beyoğlu': [41.035, 28.979],
            'Ataşehir': [40.992, 29.100]
        });

        const searchQuery = ref('');
        const filterCat = ref('Hepsi');
        const filterTag = ref('Hepsi');

        const activeTab = ref('discover'); // 'discover', 'map', 'messages', 'ranking', 'profile', 'admin'

        const chatList = ref([]);
        const activeChat = ref(null);
        const msgInput = ref('');
        const adminSearchUser = ref('');
        const adminSearchItem = ref('');
        const hasNewMessage = ref(false); // Placeholder for new message indicator

        const users = ref([
            { username: 'admin', fullName: 'Yönetici Admin', password: 'admin', points: 1000, role: 'admin' },
            { username: 'ayse.yilmaz', fullName: 'Ayşe Yılmaz', password: '123', points: 250, role: 'user' },
            { username: 'mehmet.demir', fullName: 'Mehmet Demir', password: '123', points: 180, role: 'user' },
            { username: 'zeynep.kaya', fullName: 'Zeynep Kaya', password: '123', points: 300, role: 'user' },
            { username: 'ali.can', fullName: 'Ali Can', password: '123', points: 120, role: 'user' },
            { username: 'elif.gul', fullName: 'Elif Gül', password: '123', points: 400, role: 'user' }
        ]);

        const items = ref([
            { id: 1, img: 'https://loremflickr.com/400/300/laptop?lock=1', tag: 'Ücretsiz', cat: 'Elektronik', title: 'Eski Laptop', loc: 'Kadıköy', user: 'ayse.yilmaz', desc: 'Çalışır durumda, bataryası zayıf.' },
            { id: 2, img: 'https://loremflickr.com/400/300/jacket?lock=2', tag: 'Takas', cat: 'Giyim', title: 'Kadın Montu', loc: 'Beşiktaş', user: 'mehmet.demir', desc: 'Az kullanılmış, beden M. Benzer bir ürünle takas edilebilir.' },
            { id: 3, img: 'https://loremflickr.com/400/300/bookshelf?lock=3', tag: 'Ücretsiz', cat: 'Ev Eşyası', title: 'Kitaplık', loc: 'Şişli', user: 'zeynep.kaya', desc: 'Ahşap, demonte edilebilir.' },
            { id: 4, img: 'https://loremflickr.com/400/300/books?lock=4', tag: 'Takas', cat: 'Kitap', title: 'Roman Seti', loc: 'Fatih', user: 'ali.can', desc: '5 adet klasik roman, bilim kurgu kitaplarıyla takas.' },
            { id: 5, img: 'https://loremflickr.com/400/300/dumbbells?lock=5', tag: 'Ücretsiz', cat: 'Spor Malzemeleri', title: 'Dambıl Seti', loc: 'Üsküdar', user: 'elif.gul', desc: '2x5kg dambıl, evde kullanıma uygun.' },
            { id: 6, img: 'https://loremflickr.com/400/300/painting?lock=6', tag: 'Ücretsiz', cat: 'Hobi', title: 'Boyama Seti', loc: 'Bakırköy', user: 'ayse.yilmaz', desc: 'Yeni başlayanlar için, birkaç boya eksik.' },
            { id: 7, img: 'https://loremflickr.com/400/300/smartwatch?lock=7', tag: 'Takas', cat: 'Elektronik', title: 'Akıllı Saat', loc: 'Beyoğlu', user: 'mehmet.demir', desc: 'Kutusuyla birlikte, spor saatiyle takas.' },
            { id: 8, img: 'https://loremflickr.com/400/300/blender?lock=8', tag: 'Ücretsiz', cat: 'Ev Eşyası', title: 'Mutfak Robotu', loc: 'Ataşehir', user: 'zeynep.kaya', desc: 'Az kullanılmış, tüm parçaları mevcut.' },
            { id: 9, img: 'https://loremflickr.com/400/300/bicycle?lock=9', tag: 'Ücretsiz', cat: 'Giyim', title: 'Çocuk Bisikleti', loc: 'Kadıköy', user: 'ali.can', desc: '5-8 yaş arası için uygun.' },
            { id: 10, img: 'https://loremflickr.com/400/300/encyclopedia?lock=10', tag: 'Takas', cat: 'Kitap', title: 'Ansiklopedi Seti', loc: 'Beşiktaş', user: 'elif.gul', desc: 'Eski ama iyi durumda, çocuk kitaplarıyla takas.' },
            { id: 11, img: 'https://loremflickr.com/400/300/yogamat?lock=11', tag: 'Ücretsiz', cat: 'Spor Malzemeleri', title: 'Yoga Matı', loc: 'Şişli', user: 'ayse.yilmaz', desc: 'Temiz, az kullanılmış.' },
            { id: 12, img: 'https://loremflickr.com/400/300/guitar?lock=12', tag: 'Ücretsiz', cat: 'Hobi', title: 'Gitar', loc: 'Fatih', user: 'mehmet.demir', desc: 'Başlangıç seviyesi, telleri değişmeli.' },
            { id: 13, img: 'https://loremflickr.com/400/300/console?lock=13', tag: 'Takas', cat: 'Elektronik', title: 'Oyun Konsolu', loc: 'Üsküdar', user: 'zeynep.kaya', desc: 'Eski model, yeni nesil konsol veya oyunlarla takas.' },
            { id: 14, img: 'https://loremflickr.com/400/300/teapot?lock=14', tag: 'Ücretsiz', cat: 'Ev Eşyası', title: 'Çay Makinesi', loc: 'Bakırköy', user: 'ali.can', desc: 'Çalışır durumda, küçük bir çatlağı var.' },
            { id: 15, img: 'https://loremflickr.com/400/300/jacket,man?lock=15', tag: 'Ücretsiz', cat: 'Giyim', title: 'Erkek Ceket', loc: 'Beyoğlu', user: 'elif.gul', desc: 'Kışlık, beden L.' },
            { id: 16, img: 'https://loremflickr.com/400/300/history,books?lock=16', tag: 'Takas', cat: 'Kitap', title: 'Tarih Kitapları', loc: 'Ataşehir', user: 'ayse.yilmaz', desc: 'Üniversite ders kitapları, güncel romanlarla takas.' },
            { id: 17, img: 'https://loremflickr.com/400/300/tennis?lock=17', tag: 'Ücretsiz', cat: 'Spor Malzemeleri', title: 'Tenis Raketi', loc: 'Kadıköy', user: 'mehmet.demir', desc: 'Orta seviye, kılıfıyla birlikte.' },
            { id: 18, img: 'https://loremflickr.com/400/300/sewing?lock=18', tag: 'Ücretsiz', cat: 'Hobi', title: 'Dikiş Makinesi', loc: 'Beşiktaş', user: 'zeynep.kaya', desc: 'Eski model, bakıma ihtiyacı var.' },
            { id: 19, img: 'https://loremflickr.com/400/300/tablet?lock=19', tag: 'Takas', cat: 'Elektronik', title: 'Tablet', loc: 'Şişli', user: 'ali.can', desc: 'Ekranında küçük bir çizik var, e-okuyucu ile takas.' },
            { id: 20, img: 'https://loremflickr.com/400/300/vase?lock=20', tag: 'Ücretsiz', cat: 'Ev Eşyası', title: 'Vazo Seti', loc: 'Fatih', user: 'elif.gul', desc: '3 adet seramik vazo.' },
            { id: 21, img: 'https://loremflickr.com/400/300/baby,clothes?lock=21', tag: 'Ücretsiz', cat: 'Giyim', title: 'Bebek Kıyafetleri', loc: 'Üsküdar', user: 'ayse.yilmaz', desc: '0-6 ay arası, temiz ve az kullanılmış.' },
            { id: 22, img: 'https://loremflickr.com/400/300/children,books?lock=22', tag: 'Takas', cat: 'Kitap', title: 'Çocuk Hikaye Kitapları', loc: 'Bakırköy', user: 'mehmet.demir', desc: '10 adet, eğitici oyuncaklarla takas.' },
            { id: 23, img: 'https://loremflickr.com/400/300/skates?lock=23', tag: 'Ücretsiz', cat: 'Spor Malzemeleri', title: 'Paten', loc: 'Beyoğlu', user: 'zeynep.kaya', desc: 'Numara 38, dizlik ve kask dahil.' },
            { id: 24, img: 'https://loremflickr.com/400/300/puzzle?lock=24', tag: 'Ücretsiz', cat: 'Hobi', title: 'Puzzle', loc: 'Ataşehir', user: 'ali.can', desc: '1000 parça, bir kez yapıldı.' },
            { id: 25, img: 'https://loremflickr.com/400/300/camera?lock=25', tag: 'Takas', cat: 'Elektronik', title: 'Fotoğraf Makinesi', loc: 'Kadıköy', user: 'elif.gul', desc: 'Eski model dijital, drone ile takas.' },
            { id: 26, img: 'https://loremflickr.com/400/300/lamp?lock=26', tag: 'Ücretsiz', cat: 'Ev Eşyası', title: 'Lambader', loc: 'Beşiktaş', user: 'ayse.yilmaz', desc: 'Çalışır durumda, ampulü yok.' },
            { id: 27, img: 'https://loremflickr.com/400/300/hat?lock=27', tag: 'Ücretsiz', cat: 'Giyim', title: 'Şapka Koleksiyonu', loc: 'Şişli', user: 'mehmet.demir', desc: 'Farklı modellerde 5 adet şapka.' },
            { id: 28, img: 'https://loremflickr.com/400/300/art,books?lock=28', tag: 'Takas', cat: 'Kitap', title: 'Sanat Kitapları', loc: 'Fatih', user: 'zeynep.kaya', desc: 'Resim ve heykel üzerine, müzik aletleriyle takas.' },
            { id: 29, img: 'https://loremflickr.com/400/300/basketball?lock=29', tag: 'Ücretsiz', cat: 'Spor Malzemeleri', title: 'Basketbol Topu', loc: 'Üsküdar', user: 'ali.can', desc: 'Az kullanılmış, iyi durumda.' },
            { id: 30, img: 'https://loremflickr.com/400/300/paints?lock=30', tag: 'Ücretsiz', cat: 'Hobi', title: 'Akrilik Boyalar', loc: 'Bakırköy', user: 'elif.gul', desc: 'Birkaç rengi kullanılmış, çoğu dolu.' }
        ]);

        const selectedItem = ref(null);
        let map = null;
        let markers = [];

        // --- Computed Properties ---
        const filteredItems = computed(() => {
            let filtered = items.value;

            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                filtered = filtered.filter(item =>
                    item.title.toLowerCase().includes(query) ||
                    item.loc.toLowerCase().includes(query) ||
                    item.desc.toLowerCase().includes(query)
                );
            }

            if (filterCat.value !== 'Hepsi') {
                filtered = filtered.filter(item => item.cat === filterCat.value);
            }

            if (filterTag.value !== 'Hepsi') {
                filtered = filtered.filter(item => item.tag === filterTag.value);
            }

            return filtered;
        });

        const adminFilteredUsers = computed(() => {
            if (!adminSearchUser.value) return users.value;
            const q = adminSearchUser.value.toLowerCase();
            return users.value.filter(u => 
                u.username.toLowerCase().includes(q) || 
                u.fullName.toLowerCase().includes(q)
            );
        });

        const adminFilteredItems = computed(() => {
            if (!adminSearchItem.value) return items.value;
            const q = adminSearchItem.value.toLowerCase();
            return items.value.filter(i => 
                i.title.toLowerCase().includes(q) || 
                i.user.toLowerCase().includes(q)
            );
        });

        const sortedUsers = computed(() => {
            return [...users.value].sort((a, b) => b.points - a.points);
        });

        const isAdmin = computed(() => {
            // Hem role kontrolü yapıyoruz hem de kullanıcı adı 'admin' ise güvenli geçiş sağlıyoruz
            return currentUser.value && (currentUser.value.role === 'admin' || currentUser.value.username === 'admin');
        });

        const visibleTabs = computed(() => {
            const tabs = [
                { id: 'discover', name: 'Keşfet', icon: '✨' },
                { id: 'map', name: 'Harita', icon: '🗺️' },
                { id: 'messages', name: 'Mesajlar', icon: '💬' },
                { id: 'ranking', name: 'Sıralama', icon: '🏆' },
                { id: 'profile', name: 'Profilim', icon: '👤' }
            ];
            if (isAdmin.value) {
                tabs.push({ id: 'admin', name: 'Yönetici', icon: '👑' });
            }
            return tabs;
        });

        // --- Methods ---
        const addToast = (msg, type = 'success') => {
            const id = toastId++;
            toasts.value.push({ id, msg, type });
            setTimeout(() => {
                toasts.value = toasts.value.filter(toast => toast.id !== id);
            }, 3000);
        };

        const handleAuth = () => {
            if (authMode.value === 'register') {
                if (!authForm.value.fullName || !authForm.value.username || !authForm.value.password) {
                    addToast('Lütfen tüm alanları doldurun.', 'error');
                    return;
                }
                if (authForm.value.password.length < 6) {
                    addToast('Şifre en az 6 karakter olmalıdır.', 'error');
                    return;
                }
                if (users.value.some(u => u.username === authForm.value.username)) {
                    addToast('Bu kullanıcı adı zaten mevcut.', 'error');
                    return;
                }
                const newUser = {
                    username: authForm.value.username,
                    fullName: authForm.value.fullName,
                    password: authForm.value.password,
                    points: 100, // Initial points for new users
                    role: 'user'
                };
                users.value.push(newUser);
                currentUser.value = newUser;
                isLoggedIn.value = true;
                addToast('Kayıt başarılı! Hoş geldin.', 'success');
                saveUsers();
                saveCurrentUser();
            } else { // login
                const user = users.value.find(u => u.username === authForm.value.username && u.password === authForm.value.password);
                if (user) {
                    // Admin girişi yapılıyorsa rolü burada da garantiye alalım
                    if (user.username === 'admin') user.role = 'admin';
                    currentUser.value = user;
                    isLoggedIn.value = true;
                    addToast('Giriş başarılı! Tekrar hoş geldin.', 'success');
                    saveCurrentUser();
                } else {
                    addToast('Kullanıcı adı veya şifre hatalı.', 'error');
                }
            }
        };

        const loginAsAdmin = () => {
            authMode.value = 'login';
            authForm.value.username = 'admin';
            authForm.value.password = '';
            addToast('Yönetici kullanıcı adı dolduruldu. Lütfen şifrenizi girin.', 'success');
        };

        const logout = () => {
            currentUser.value = null;
            isLoggedIn.value = false;
            authForm.value = { fullName: '', username: '', password: '' };
            localStorage.removeItem('currentUser');
            addToast('Başarıyla çıkış yapıldı.', 'success');
        };

        const addItem = () => {
            if (!newItem.value.title || !newItem.value.loc || !newItem.value.cat || !newItem.value.img) {
                addToast('Lütfen tüm gerekli alanları doldurun.', 'error');
                return;
            }
            const newItemId = items.value.length > 0 ? Math.max(...items.value.map(i => i.id)) + 1 : 1;
            const itemToAdd = {
                ...newItem.value,
                id: newItemId,
                user: currentUser.value.username
            };
            items.value.unshift(itemToAdd); // Add to the beginning
            currentUser.value.points += 100; // Reward points for adding item
            addToast('İlan başarıyla eklendi! (+100 Puan)', 'success');
            showModal.value = false;
            // Reset form
            newItem.value = { title: '', loc: '', tag: 'Ücretsiz', cat: '', desc: '', img: '' };
            saveItems();
            saveUsers(); // To update current user's points
        };

        const startChat = (targetUsername) => {
            if (currentUser.value.username === targetUsername) {
                addToast('Kendinle sohbet başlatamazsın!', 'error');
                return;
            }
            const existingChat = chatList.value.find(chat => chat.name === targetUsername);
            if (existingChat) {
                activeChat.value = existingChat;
            } else {
                const newChat = {
                    name: targetUsername,
                    lastMsg: 'Yeni sohbet başlatıldı.',
                    history: []
                };
                chatList.value.push(newChat);
                activeChat.value = newChat;
            }
            activeTab.value = 'messages';
        };

        const sendMsg = () => {
            if (msgInput.value.trim() && activeChat.value) {
                activeChat.value.history.push({
                    text: msgInput.value,
                    fromMe: true
                });
                activeChat.value.lastMsg = msgInput.value;
                msgInput.value = '';
                // Simulate a reply
                setTimeout(() => {
                    if (activeChat.value) {
                        activeChat.value.history.push({
                            text: 'Mesajınız alındı, en kısa sürede dönüş yapılacaktır.',
                            fromMe: false
                        });
                        activeChat.value.lastMsg = 'Mesajınız alındı...';
                        hasNewMessage.value = true; // Indicate new message
                    }
                }, 1500);
            }
        };

        const deleteItem = (id) => {
            const itemIndex = items.value.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                const deletedItem = items.value[itemIndex];
                const itemOwner = users.value.find(u => u.username === deletedItem.user);
                if (itemOwner) {
                    itemOwner.points -= 50; // Deduct points for item deletion
                    if (itemOwner.points < 0) itemOwner.points = 0; // Prevent negative points
                }
                items.value.splice(itemIndex, 1);
                addToast('İlan başarıyla silindi.', 'success');
                saveItems();
                saveUsers();
            }
        };

        const adjustPoints = (username, amount) => {
            const user = users.value.find(u => u.username === username);
            if (user) {
                user.points = (Number(user.points) || 0) + amount;
                if (user.points < 0) user.points = 0;
                addToast(`${username} puanı güncellendi (${amount > 0 ? '+' : ''}${amount}).`, 'success');
                saveUsers();
            }
        };

        const toggleUserRole = (username) => {
            const user = users.value.find(u => u.username === username);
            if (user && user.username !== 'admin') {
                user.role = user.role === 'admin' ? 'user' : 'admin';
                addToast(`${username} yetkisi değiştirildi: ${user.role.toUpperCase()}`, 'success');
                saveUsers();
            }
        };

        const userDeleteItem = (id) => {
            if (confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
                deleteItem(id);
            }
        };

        const deleteUser = (username) => {
            if (confirm(`'${username}' kullanıcısını silmek istediğinizden emin misiniz?`)) {
                users.value = users.value.filter(u => u.username !== username);
                items.value = items.value.filter(item => item.user !== username); // Delete user's items
                addToast(`Kullanıcı '${username}' başarıyla silindi.`, 'success');
                saveUsers();
                saveItems();
            }
        };

        const saveUsers = () => {
            localStorage.setItem('users', JSON.stringify(users.value));
            if (currentUser.value) {
                const updatedUser = users.value.find(u => u.username === currentUser.value.username);
                if (updatedUser) {
                    currentUser.value = updatedUser; // Update current user data if points changed
                    saveCurrentUser();
                }
            }
        };

        const saveItems = () => {
            localStorage.setItem('items', JSON.stringify(items.value));
        };

        const saveCurrentUser = () => {
            localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
        };

        const loadData = () => {
            try {
                const storedUsers = localStorage.getItem('users');
                if (storedUsers) {
                    let parsedUsers = JSON.parse(storedUsers);
                    // Admin kullanıcısının her zaman listede ve admin rolünde olduğundan emin olalım
                    const adminUser = parsedUsers.find(u => u.username === 'admin');
                    if (!adminUser) {
                        parsedUsers.push({ username: 'admin', fullName: 'Yönetici Admin', password: 'admin', points: 1000, role: 'admin' });
                    } else {
                        adminUser.role = 'admin'; // Rolü zorla güncelle
                    }
                    users.value = parsedUsers;
                    
                    // Eğer giriş yapmış bir kullanıcı varsa, güncel kullanıcı listesinden verilerini yenile
                    if (currentUser.value) {
                        const updatedMe = parsedUsers.find(u => u.username === currentUser.value.username);
                        if (updatedMe) currentUser.value = updatedMe;
                    }
                }
            } catch (e) {
                console.error("Kullanıcı verileri yüklenemedi:", e);
            }
            
            try {
                const storedItems = localStorage.getItem('items');
                if (storedItems) {
                    items.value = JSON.parse(storedItems);
                }
            } catch (e) {
                console.error("İlan verileri yüklenemedi:", e);
            }
            
            const storedCurrentUser = localStorage.getItem('currentUser');
            if (storedCurrentUser) {
                const user = JSON.parse(storedCurrentUser);
                // Eğer kaydedilen kullanıcı admin ise rolünü kontrol et
                if (user.username === 'admin') user.role = 'admin';
                currentUser.value = user;
                isLoggedIn.value = true;
            }
        };

        const initMap = () => {
            if (map) {
                map.remove(); // Destroy existing map instance
            }
            map = L.map('map').setView([41.0082, 28.9784], 12); // Istanbul center
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            markers.forEach(marker => marker.remove()); // Clear existing markers
            markers = [];

            items.value.forEach(item => {
                const coords = locations.value[item.loc];
                if (coords) {
                    const marker = L.marker(coords).addTo(map)
                        .bindPopup(`<b>${item.title}</b><br>${item.loc}<br>Sahibi: ${item.user}`)
                        .on('click', () => {
                            selectedItem.value = item;
                        });
                    markers.push(marker);
                }
            });
        };

        const focusOnMap = (item) => {
            const coords = locations.value[item.loc];
            if (coords) {
                activeTab.value = 'map';
                nextTick(() => {
                    if (map) {
                        map.setView(coords, 15); // Zoom in on the item's location
                        const marker = markers.find(m => m.getLatLng().lat === coords[0] && m.getLatLng().lng === coords[1]);
                        if (marker) {
                            marker.openPopup();
                        }
                    }
                });
            } else {
                addToast('Bu ilanın harita konumu bulunamadı.', 'error');
            }
        };

        // --- Lifecycle Hooks ---
        Vue.onMounted(() => {
            loadData();
            // Initial map setup if tab is already 'map' or if we want to pre-load
            if (activeTab.value === 'map' && isLoggedIn.value) {
                nextTick(initMap);
            }
        });

        // --- Watchers ---
        watch(activeTab, (newTab) => {
            if (newTab === 'map' && isLoggedIn.value) {
                nextTick(initMap);
            }
        });

        // --- Return for Template ---
        return {
            isLoggedIn,
            authMode,
            authForm,
            currentUser,
            toasts,
            showModal,
            newItem,
            categories,
            locations,
            searchQuery,
            filterCat,
            filterTag,
            activeTab,
            chatList,
            activeChat,
            msgInput,
            adminSearchUser,
            adminSearchItem,
            users,
            items,
            selectedItem,
            hasNewMessage,

            filteredItems,
            sortedUsers,
            adminFilteredUsers,
            adminFilteredItems,
            isAdmin,
            visibleTabs,

            loginAsAdmin,
            handleAuth,
            logout,
            addItem,
            startChat,
            sendMsg,
            deleteItem,
            userDeleteItem,
            deleteUser,
            adjustPoints,
            toggleUserRole,
            saveUsers,
            focusOnMap,
            addToast
        };
    }
}).mount('#app');