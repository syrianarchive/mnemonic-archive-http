import { each } from 'lodash/fp';
import translations from '../../../custom-translations.json';

// bullshit to Remove surrounding p tags from images in article.
const nodes = document.body.querySelectorAll('article p img');

each(node => {
  const pn = node.parentNode;
  if (pn.childNodes.length === 1) {
    pn.replaceWith(...pn.childNodes);
  }
})(nodes);

// Put Menu bar in a toggle one in mobile devices
const menuButton = document.getElementById('menuButton');
const menuBox = document.getElementById('menuBox');
if (menuBox && menuButton) {
  menuButton.onclick = () => {
    menuBox.classList.toggle('menu-box');
    menuButton.classList.toggle('fa-bars');
    menuButton.classList.toggle('fa-times');
  };
  document.onscroll = () => {
    menuBox.classList.remove('menu-box');
    menuButton.classList.remove('fa-times');
    menuButton.classList.add('fa-bars');
  };
}

// Add support link in menubox on mobile devices instaed of defualt one
const siteLang = document.getElementsByClassName('en')[0];
function createSupportLink() {
  let donateContent = 'Support';
  let donateUrl = '/en/about/support';
  if (siteLang === undefined) {
    donateContent = 'تعاون';
    donateUrl = '/ar/about/support';
  }
  const donateLink = document.createElement('A');
  const donateText = document.createTextNode(donateContent);
  donateLink.setAttribute('href', donateUrl);
  donateLink.appendChild(donateText);
  donateLink.classList.add('btn', 'btn-link', 'donate-mobile');
  const navbarSections = document.getElementsByClassName('navbar-section');
  const navbarSection = navbarSections[0];
  navbarSection.appendChild(donateLink);
}
createSupportLink();

// Change titles in top sections in mobile devices
function mobileTopTitles() {
  let homePageLink = '/';
  const homeLink = document.createElement('A');
  let homeLinkText = document.createTextNode(translations.en['site name']);
  if (siteLang === undefined) {
    homeLinkText = document.createTextNode(translations.ar['site name']);
    homePageLink = '/ar';
  }
  homeLink.appendChild(homeLinkText);
  homeLink.setAttribute('href', homePageLink);
  homeLink.classList.add('home-page-link');
  const pageTitles = document.getElementsByTagName('h1')[0];
  const firstTitle = pageTitles.firstChild;
  const pageDesc = document.getElementsByClassName('desc')[0];
  pageDesc.textContent = firstTitle.textContent;
  pageTitles.removeChild(firstTitle);
  pageTitles.appendChild(homeLink);
}
if (window.matchMedia('(max-width: 750px)').matches) {
  mobileTopTitles();
}

//
//
// // bullshit to set the card font size based on container width
// const setScaledFont = (f, el) => {
//   const s = el.parentNode.offsetWidth;
//   const fs = s * f;
//   if (fs > 14) {
//     el.style.fontSize = fs + 'px'; //eslint-disable-line
//   } else {
//     el.style.fontSize = '14px'; //eslint-disable-line
//   }
// };
//
// each(el => setScaledFont(0.06, el), document.body.querySelectorAll('.tcontent'));
// each(el => setScaledFont(0.03, el), document.body.querySelectorAll('.card-body'));
//
// window.onresize = () => {
//   each(el => setScaledFont(0.06, el), document.body.querySelectorAll('.tcontent'));
//   each(el => setScaledFont(0.03, el), document.body.querySelectorAll('.card-body'));
// };
