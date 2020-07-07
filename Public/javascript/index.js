// var map;
// function initMap() {
//     console.log("jijiji");
//     map = new google.maps.Map(document.querySelector("#map"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//     styles: [
//             {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
//             {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
//             {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
//             {
//               featureType: 'administrative.locality',
//               elementType: 'labels.text.fill',
//               stylers: [{color: '#d59563'}]
//             },
//             {
//               featureType: 'poi',
//               elementType: 'labels.text.fill',
//               stylers: [{color: '#d59563'}]
//             },
//             {
//               featureType: 'poi.park',
//               elementType: 'geometry',
//               stylers: [{color: '#263c3f'}]
//             },
//             {
//               featureType: 'poi.park',
//               elementType: 'labels.text.fill',
//               stylers: [{color: '#6b9a76'}]
//             },
//             {
//               featureType: 'road',
//               elementType: 'geometry',
//               stylers: [{color: '#38414e'}]
//             },
//             {
//               featureType: 'road',
//               elementType: 'geometry.stroke',
//               stylers: [{color: '#212a37'}]
//             },
//             {
//               featureType: 'road',
//               elementType: 'labels.text.fill',
//               stylers: [{color: '#9ca5b3'}]
//             },
//             {
//               featureType: 'road.highway',
//               elementType: 'geometry',
//               stylers: [{color: '#746855'}]
//             },
//             {
//               featureType: 'road.highway',
//               elementType: 'geometry.stroke',
//               stylers: [{color: '#1f2835'}]
//             },
//             {
//               featureType: 'road.highway',
//               elementType: 'labels.text.fill',
//               stylers: [{color: '#f3d19c'}]
//             },
//             {
//               featureType: 'transit',
//               elementType: 'geometry',
//               stylers: [{color: '#2f3948'}]
//             },
//             {
//               featureType: 'transit.station',
//               elementType: 'labels.text.fill',
//               stylers: [{color: '#d59563'}]
//             },
//             {
//               featureType: 'water',
//               elementType: 'geometry',
//               stylers: [{color: '#17263c'}]
//             },
//             {
//               featureType: 'water',
//               elementType: 'labels.text.fill',
//               stylers: [{color: '#515c6d'}]
//             },
//             {
//               featureType: 'water',
//               elementType: 'labels.text.stroke',
//               stylers: [{color: '#17263c'}]
//             }
//           ]
//   });
// }

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
    if (symptoms1) {
        if (window.scrollY >= 10)
            symptoms1.classList.add('animate__fadeInUp');
        if (window.scrollY >= 400) {
            symptoms2.classList.add('animate__fadeInUp');
        }
        if (window.scrollY >= 800) {
            transmission.classList.add('animate__fadeInUp');
        }
    }
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

}