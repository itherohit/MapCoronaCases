AOS.init();

AOS.init({
    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 150, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 800, // values from 0 to 3000, with step 50ms
});


const search = document.querySelector("#searchInput");

if (search) {
    const countryInfo = document.querySelectorAll('div.country-info');
    const countryName = document.querySelectorAll('.country-name-header');
    search.addEventListener('input', (event) => {
        filter = event.target.value.toUpperCase();
        console.log(filter);
        for (i = 0; i < countryInfo.length; i++) {
            txtValue = countryName[i].textContent || countryName[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                countryInfo[i].style.display = "";
            } else {
                countryInfo[i].style.display = "none";
            }
        }
    })
}


const dropBtn = document.querySelector("div.search-drop");
const dropCountry = document.querySelector("div.countries-section");
const searchSection = document.querySelector("div.search-section")

if (dropBtn) {
    dropBtn.addEventListener('click', () => {
        if (dropCountry.classList.contains("animate__fadeOut")) {
            dropCountry.classList.remove("animate__fadeOut");
            dropCountry.classList.add("animate__fadeIn");
            searchSection.classList.remove("lessheight");
        } else {
            dropCountry.classList.add("animate__fadeOut");
            setTimeout(function() { searchSection.classList.add("lessheight"); }, 500);

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
    const line = document.querySelectorAll('.line');
    const navBar = document.querySelector('.Nav-bar');
    const navabout = document.querySelector('.about-link')
    if (window.scrollY >= 30) {
        navBar.classList.add('nav-bg');
        navLinks.classList.remove('nav-black');
        for (let i = 0; i < line.length; i++) {
            line[i].classList.remove('black');
        }
    }
    if (window.scrollY <= 30) {
        navBar.classList.remove('nav-bg');
        if (!navabout) {
            navLinks.classList.add('nav-black');
            for (let i = 0; i < line.length; i++) {
                line[i].classList.add('black');
            }
        }
    }

}