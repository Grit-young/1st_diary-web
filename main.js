// ===========================
// 심리다이어리 쇼핑몰 JavaScript
// ===========================

// 제품 데이터
const products = [
    {
        id: 1,
        name: '심리다이어리 베이직',
        category: 'Basic Edition',
        description: '매일의 감정을 체크리스트로 기록하는 기본형 다이어리',
        price: 28000,
        originalPrice: 35000,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
        badge: 'bestseller',
        features: ['12개월', 'B6 사이즈', '앱 연동', '체크리스트']
    },
    {
        id: 2,
        name: '심리다이어리 프리미엄',
        category: 'Premium Edition',
        description: '고급 하드커버와 확장된 콘텐츠가 담긴 프리미엄 에디션',
        price: 42000,
        originalPrice: 50000,
        image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600',
        badge: 'new',
        features: ['12개월', 'A5 사이즈', '앱 연동', '프리미엄 종이', '스티커 세트']
    },
    {
        id: 3,
        name: '심리다이어리 미니',
        category: 'Mini Edition',
        description: '휴대하기 편한 미니 사이즈로 언제 어디서나 기록',
        price: 22000,
        originalPrice: 28000,
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600',
        badge: null,
        features: ['12개월', 'A6 사이즈', '앱 연동', '포켓 사이즈']
    },
    {
        id: 4,
        name: '심리다이어리 세트',
        category: 'Complete Set',
        description: '다이어리 + 꾸미기 키트 + 프리미엄 펜 포함 올인원 세트',
        price: 65000,
        originalPrice: 80000,
        image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600',
        badge: 'bestseller',
        features: ['12개월', 'A5 사이즈', '앱 연동', '꾸미기 키트', '프리미엄 펜']
    },
    {
        id: 5,
        name: '감정 트래킹 노트',
        category: 'Emotion Tracker',
        description: '감정 변화를 시각적으로 추적하는 전용 노트',
        price: 18000,
        originalPrice: 22000,
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600',
        badge: null,
        features: ['6개월', 'B6 사이즈', '감정 그래프', '주간 리뷰']
    },
    {
        id: 6,
        name: '마인드풀니스 저널',
        category: 'Mindfulness Journal',
        description: '명상과 마음챙김을 위한 특별 에디션',
        price: 32000,
        originalPrice: 40000,
        image: 'https://images.unsplash.com/photo-1506784242126-2a0b0b89c56a?w=600',
        badge: 'new',
        features: ['12개월', 'A5 사이즈', '명상 가이드', '감사 일기']
    }
];

// 장바구니 데이터
let cart = [];

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================
    // 초기화
    // ===========================
    initializeApp();
    
    function initializeApp() {
        loadCart();
        renderProducts();
        setupEventListeners();
        initializeAnimations();
        updateCartUI();
    }
    
    // ===========================
    // 제품 렌더링
    // ===========================
    function renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-aos="fade-up">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `
                        <span class="product-badge ${product.badge}">
                            ${product.badge === 'bestseller' ? 'BEST' : 'NEW'}
                        </span>
                    ` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-features">
                        ${product.features.map(feature => `<span>${feature}</span>`).join('')}
                    </div>
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="price-original">${formatPrice(product.originalPrice)}</span>
                            <span class="price-current">${formatPrice(product.price)}</span>
                        </div>
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i>
                            담기
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // ===========================
    // 장바구니 기능
    // ===========================
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartUI();
        showNotification(`${product.name}이(가) 장바구니에 추가되었습니다!`);
    }
    
    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
        renderCartItems();
    }
    
    window.updateQuantity = function(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
            renderCartItems();
        }
    }
    
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>장바구니가 비어있습니다</p>
                </div>
            `;
            return;
        }
        
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    function updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
        
        if (cartTotal) {
            cartTotal.textContent = formatPrice(totalPrice);
        }
        
        renderCartItems();
    }
    
    function saveCart() {
        localStorage.setItem('mindiary_cart', JSON.stringify(cart));
    }
    
    function loadCart() {
        const savedCart = localStorage.getItem('mindiary_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }
    
    // ===========================
    // 장바구니 모달
    // ===========================
    function setupEventListeners() {
        const cartBtn = document.getElementById('cartBtn');
        const cartModal = document.getElementById('cartModal');
        const cartClose = document.getElementById('cartClose');
        const cartOverlay = document.getElementById('cartOverlay');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                cartModal.classList.add('active');
            });
        }
        
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                cartModal.classList.remove('active');
            });
        }
        
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                cartModal.classList.remove('active');
            });
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    alert('장바구니가 비어있습니다.');
                    return;
                }
                
                const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                alert(`총 ${formatPrice(totalPrice)}의 상품을 결제하시겠습니까?\n\n실제 결제 기능은 개발 중입니다.`);
            });
        }
        
        // 네비게이션 메뉴 토글
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
        
        // 메뉴 링크 클릭 시 메뉴 닫기
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
        
        // FAQ 아코디언
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // 모든 FAQ 닫기
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                // 클릭한 FAQ 열기
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
        
        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Back to Top
        const backToTop = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // ===========================
    // 애니메이션
    // ===========================
    function initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }
    
    // ===========================
    // 유틸리티 함수
    // ===========================
    function formatPrice(price) {
        return price.toLocaleString('ko-KR') + '원';
    }
    
    function showNotification(message) {
        // 간단한 알림 메시지
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #8A9A5B;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 애니메이션 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('심리다이어리 쇼핑몰 초기화 완료');
});