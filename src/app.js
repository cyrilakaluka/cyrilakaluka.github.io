import './sections/index.js';
import './components/index.js';
import { html } from './common/utils.js';

class App extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.#render();
    this.#addScrollToSectionEventListener();
    this.#addIntersectionObserver();
  }

  #render() {
    this.innerHTML = html`
      <app-layout>
        <app-navbar id="navbar" slot="header"></app-navbar>
        <app-hero id="home" slot="hero"></app-hero>
        <app-about-me id="about"></app-about-me>
        <app-skills id="skills"></app-skills>
        <app-resume id="resume"></app-resume>
        <app-contact id="contact"></app-contact>
        <app-footer id="footer" slot="footer"></app-footer>
      </app-layout>
    `;
  }

  #addScrollToSectionEventListener() {
    document.addEventListener('app-scroll-to-section', event => {
      const { sectionId } = event.detail;

      const section = this.querySelector(`#${sectionId}`);
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;

      const navbar = this.querySelector('#navbar');
      const navbarHeight = navbar.offsetHeight;

      window.scrollTo({
        top: sectionTop - navbarHeight,
        behavior: 'smooth'
      });
    });
  }

  #addIntersectionObserver() {
    const observer = new IntersectionObserver(this.#handleIntersection, { threshold: 0.5 });
    const observableSections = Array.from(this.querySelectorAll('app-layout > *:not(#navbar):not(#footer)'));
    observableSections.forEach((section) => observer.observe(section));
  }

  #handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const { id } = entry.target;

      this.dispatchEvent(new CustomEvent('app-intersecting-section', {
        detail: {
          sectionId: id
        },
        bubbles: true,
        composed: true
      }));
    });
  };
}

customElements.define('app-root', App);