const dropBtn = document.querySelector("div.search-drop");
const dropCountry = document.querySelector("div.countries-section");

if (dropBtn) {
    dropBtn.addEventListener('click', () => {
        if (dropCountry.classList.contains("animate__fadeOut")) {
            dropCountry.classList.remove("animate__fadeOut");
            dropCountry.classList.add("animate__fadeIn");
        } else {
            dropCountry.classList.add("animate__fadeOut");
        }
    })
}



const hamburger = document.querySelector("div.hamburger");
const navLinks = document.querySelector("ul.nav-links");
const links = document.querySelectorAll("ul.nav-links li");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        links.forEach(link => {
            link.classList.toggle("faded");
        });
        if (navLinks.classList.contains("open")) {
            hamburger.innerHTML = "<h6 style='color:white;text-align:center;font-size:2rem;'><i class='fas fa-times'></i></h6>"
        } else {
            hamburger.innerHTML = "<div class='line black'></div><div class='line black'></div><div class='line black'></div>"
        }
    });
}

window.onscroll = () => {
    const symptoms1 = document.querySelector('#symptoms1');
    const symptoms2 = document.querySelector('#symptoms2');
    const transmission = document.querySelector('#transmission')
    const line = document.querySelectorAll('.line');
    const navBar = document.querySelector('.Nav-bar');
    if (window.scrollY >= 10)
        symptoms1.classList.add('animate__fadeInUp');
    if (window.scrollY >= 30) {
        navBar.classList.add('nav-bg');
        navLinks.classList.remove('nav-black');
        for (let i = 0; i < line.length; i++) {
            line[i].classList.remove('black');
        }
    }
    if (window.scrollY <= 30) {
        navBar.classList.remove('nav-bg');
        navLinks.classList.add('nav-black');
        for (let i = 0; i < line.length; i++) {
            line[i].classList.add('black');
        }
    }
    if (window.scrollY >= 400) {
        symptoms2.classList.add('animate__fadeInUp');
    }
    if (window.scrollY >= 800) {
        transmission.classList.add('animate__fadeInUp');
    }
}