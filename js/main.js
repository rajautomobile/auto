// Mobile Menu Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = navToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        span.style.transition = 'transform 0.3s ease';
        if (navLinks.classList.contains('active')) {
            span.style.transform = index === 1 ? 'scaleX(0)' : 
                                 index === 0 ? 'rotate(45deg) translate(6px, 6px)' : 
                                 'rotate(-45deg) translate(6px, -6px)';
        } else {
            span.style.transform = 'none';
        }
    });
});

// Animated Counter
const counters = document.querySelectorAll('.counter');
const speed = 200;

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    
    const updateCount = () => {
        const increment = target / speed;
        if (count < target) {
            count += increment;
            counter.innerText = Math.ceil(count).toLocaleString();
            setTimeout(updateCount, 1);
        } else {
            counter.innerText = target.toLocaleString();
        }
    };
    
    updateCount();
};

// Intersection Observer for Counter Animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            animateCounter(entry.target);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// Scroll Animation
const scrollElements = document.querySelectorAll('.animate-on-scroll');

const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= 
        ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
    );
};

const displayScrollElement = (element) => {
    element.classList.add('visible');
};

const hideScrollElement = (element) => {
    element.classList.remove('visible');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 100)) {
            displayScrollElement(el);
        } else {
            hideScrollElement(el);
        }
    });
};

window.addEventListener('scroll', () => {
    handleScrollAnimation();
});

// Initialize scroll animation check
handleScrollAnimation();

// Language Switcher
const langBtn = document.getElementById('langBtn');
const langDropdown = document.getElementById('langDropdown');
const langOptions = document.querySelectorAll('.lang-option');
const currentLang = document.querySelector('.current-lang');

// Get saved language from localStorage or default to 'en'
let currentLanguage = localStorage.getItem('language') || 'en';

// Initialize language
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage, true);
});

// Toggle language dropdown
langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langBtn.classList.toggle('active');
    langDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-switcher')) {
        langBtn.classList.remove('active');
        langDropdown.classList.remove('active');
    }
});

// Handle language selection
langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = option.getAttribute('data-lang');
        setLanguage(lang);
        langBtn.classList.remove('active');
        langDropdown.classList.remove('active');
    });
});

// Function to set language
function setLanguage(lang, isInitialLoad = false) {
    if (!translations[lang]) return;
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // Update active state in dropdown
    langOptions.forEach(option => {
        option.classList.toggle('active', option.getAttribute('data-lang') === lang);
    });
    
    // Update current language display and letter
    const langNames = {
        'en': { name: 'English', letter: 'E' },
        'gu': { name: 'ગુજરાતી', letter: 'ગુ' },
        'hi': { name: 'हिंदी', letter: 'हि' }
    };
    currentLang.textContent = langNames[lang].name;
    document.querySelector('.current-letter').textContent = langNames[lang].letter;
    
    // Update all translatable elements with smooth transition
    document.querySelectorAll('[data-trans]').forEach(element => {
        const key = element.getAttribute('data-trans');
        if (translations[lang] && translations[lang][key]) {
            if (!isInitialLoad) {
                // Add fade-out effect
                element.style.opacity = '0';
                element.style.transform = 'translateY(-5px)';
                
                setTimeout(() => {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translations[lang][key];
                    } else {
                        element.textContent = translations[lang][key];
                    }
                    // Add fade-in effect
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 200);
            } else {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        }
    });

    // Update all button texts
    document.querySelectorAll('.read-more-btn').forEach(button => {
        const isExpanded = button.classList.contains('active');
        button.textContent = isExpanded ? translations[lang].btn_read_less : translations[lang].btn_read_more;
    });

    // Update WhatsApp message templates
    updateWhatsAppTemplates(lang);
}

// Function to update WhatsApp message templates
function updateWhatsAppTemplates(lang) {
    const greetings = {
        'en': 'Hello Raj Automobile! 👋\n\n',
        'gu': 'નમસ્તે રાજ ઓટોમોબાઇલ! 👋\n\n',
        'hi': 'नमस्ते राज ऑटोमोबाइल! 👋\n\n'
    };

    const serviceTemplates = {
        'en': {
            intro: "I'm interested in your",
            details: "Please provide details about:\n✓ Service scope\n✓ Estimated cost\n✓ Available time slots\n✓ Service duration"
        },
        'gu': {
            intro: "હું તમારી આ સેવામાં રસ ધરાવું છું",
            details: "કૃપા કરીને આ વિશે માહિતી આપો:\n✓ સેવાનો વ્યાપ\n✓ અંદાજિત ખર્ચ\n✓ ઉપલબ્ધ સમય\n✓ સેવાનો સમયગાળો"
        },
        'hi': {
            intro: "मैं आपकी इस सेवा में रुचि रखता/रखती हूं",
            details: "कृपया इन विवरणों के बारे में बताएं:\n✓ सेवा का दायरा\n✓ अनुमानित लागत\n✓ उपलब्ध समय\n✓ सेवा की अवधि"
        }
    };

    const productTemplates = {
        'en': {
            intro: "I'm interested in",
            details: "Please provide:\n✓ Price details\n✓ Availability\n✓ Warranty information\n✓ Installation service"
        },
        'gu': {
            intro: "હું આ ઉત્પાદનમાં રસ ધરાવું છું",
            details: "કૃપા કરીને આપો:\n✓ કિંમતની વિગતો\n✓ ઉપલબ્ધતા\n✓ વૉરંટી માહિતી\n✓ ઇન્સ્ટોલેશન સેવા"
        },
        'hi': {
            intro: "मैं इस उत्पाद में रुचि रखता/रखती हूं",
            details: "कृपया प्रदान करें:\n✓ मूल्य विवरण\n✓ उपलब्धता\n✓ वारंटी जानकारी\n✓ इंस्टॉलेशन सेवा"
        }
    };

    // Store templates in global scope for use in WhatsApp integration
    window.whatsappTemplates = {
        greeting: greetings[lang],
        service: serviceTemplates[lang],
        product: productTemplates[lang]
    };
}

// Enhanced Read More Button Functionality
const readMoreButtons = document.querySelectorAll('.read-more-btn');
let activeServiceCard = null;

readMoreButtons.forEach(button => {
    button.addEventListener('click', function() {
        const details = this.previousElementSibling;
        const isExpanded = details.classList.contains('active');
        
        // Close any other open details
        document.querySelectorAll('.service-details.active').forEach(openDetails => {
            if (openDetails !== details) {
                openDetails.classList.remove('active');
                openDetails.nextElementSibling.classList.remove('active');
                openDetails.nextElementSibling.textContent = translations[currentLanguage].btn_read_more;
            }
        });

        // Toggle current details
        details.classList.toggle('active');
        this.classList.toggle('active');
        
        // Update button text based on state and current language
        this.textContent = isExpanded ? translations[currentLanguage].btn_read_more : translations[currentLanguage].btn_read_less;
    });
});

// Add resize observer to handle dynamic content height changes
const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
        const details = entry.target;
        if (details.classList.contains('active')) {
            details.style.maxHeight = details.scrollHeight + 'px';
        }
    });
});

document.querySelectorAll('.service-details').forEach(details => {
    resizeObserver.observe(details);
});

// Close active service details when clicking outside
document.addEventListener('click', (e) => {
    if (activeServiceCard && !e.target.closest('.service-card')) {
        const details = activeServiceCard.querySelector('.service-details');
        const button = activeServiceCard.querySelector('.read-more-btn');
        
        details.style.maxHeight = '0';
        details.style.opacity = '0';
        details.style.transform = 'scaleY(0)';
        button.textContent = translations[currentLanguage].btn_read_more;
        button.classList.remove('active');
        
        setTimeout(() => {
            details.classList.remove('active');
        }, 500);
        
        activeServiceCard = null;
    }
});

// Enhanced WhatsApp Integration
const inquiryButtons = document.querySelectorAll('.inquiry-btn');

inquiryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const service = button.getAttribute('data-service');
        const productCard = button.closest('.product-card');
        let message = '';
        
        if (service) {
            message = window.whatsappTemplates.greeting +
                     window.whatsappTemplates.service.intro + ' ' + service + '.\n\n' +
                     window.whatsappTemplates.service.details + '\n\nThank you!';
        } else {
            const productName = productCard.querySelector('h3').textContent;
            const productDesc = productCard.querySelector('p').textContent;
            message = window.whatsappTemplates.greeting +
                     window.whatsappTemplates.product.intro + ' ' + productName + '.\n\n' +
                     'Product: ' + productName + '\n' +
                     'Description: ' + productDesc + '\n\n' +
                     window.whatsappTemplates.product.details + '\n\nThank you!';
        }
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/9824143503?text=${encodedMessage}`, '_blank');
    });
});

// Enhanced Contact Form
const contactForm = document.getElementById('contactForm');
const departmentPhones = {
    'general': '9824143503',
    'body': '9724016252',
    'electrical': '9824965534',
    'engine': '9898968725'
};

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const department = formData.get('department');
    const cartype = formData.get('cartype');
    const message = formData.get('message');
    
    // Prepare WhatsApp message
    const whatsappMessage = `New Inquiry from Website!\n\nName: ${name}\nEmail: ${email}\nDepartment: ${department}\ncartype: ${cartype}\nMessage: ${message}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = departmentPhones[department];
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.\n\nRedirecting you to WhatsApp...');
    
    // Reset form
    contactForm.reset();
    
    // Redirect to WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
});

// Smooth Scroll with Offset for Fixed Header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Intersection Observer for Animations
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .product-card, .counter-item').forEach(el => {
    animateOnScroll.observe(el);
});

// Hero Slider Functionality
const slider = {
    slides: document.querySelectorAll('.slide'),
    dots: document.querySelectorAll('.dot'),
    currentSlide: 0,
    slideInterval: null,

    init() {
        // Add click events for navigation
        document.querySelector('.prev').addEventListener('click', () => this.prevSlide());
        document.querySelector('.next').addEventListener('click', () => this.nextSlide());
        
        // Add click events for dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Start auto-sliding
        this.startSlideShow();

        // Pause on hover
        document.querySelector('.slider-container').addEventListener('mouseenter', () => this.pauseSlideShow());
        document.querySelector('.slider-container').addEventListener('mouseleave', () => this.startSlideShow());
    },

    showSlide(index) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // Update current slide index
        this.currentSlide = index;

        // Handle wrap-around
        if (this.currentSlide >= this.slides.length) this.currentSlide = 0;
        if (this.currentSlide < 0) this.currentSlide = this.slides.length - 1;

        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    },

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    },

    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    },

    goToSlide(index) {
        this.showSlide(index);
    },

    startSlideShow() {
        if (this.slideInterval) clearInterval(this.slideInterval);
        this.slideInterval = setInterval(() => this.nextSlide(), 5000);
    },

    pauseSlideShow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
};

// Initialize slider
slider.init();

// Enhanced Product Card Animations
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const image = card.querySelector('.product-image img');
        if (image) {
            image.style.transform = 'scale(1.1)';
        }
    });

    card.addEventListener('mouseleave', () => {
        const image = card.querySelector('.product-image img');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    });
}); 
