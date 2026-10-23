(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const setMenu = open => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuButton.focus(); }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.documentElement.classList.add('js-enhanced');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 30px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    reducedMotion.addEventListener('change', event => {
      if (event.matches) { document.documentElement.classList.remove('js-enhanced'); revealObserver.disconnect(); }
    });
  }

  const progress = document.querySelector('.reading-progress');
  let scrollFrame;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0}%`;
    scrollFrame = null;
  };
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.desktop-nav a')];
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navLinks.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('main > section').forEach(section => sectionObserver.observe(section));
  }

  const hero = document.querySelector('.hero');
  const art = document.querySelector('.hero-art');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion.matches) {
    hero.addEventListener('pointermove', event => {
      if (reducedMotion.matches) return;
      const rect = hero.getBoundingClientRect();
      art.style.setProperty('--art-x', `${((event.clientX - rect.left) / rect.width - .5) * 18}px`);
      art.style.setProperty('--art-y', `${((event.clientY - rect.top) / rect.height - .5) * 14}px`);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { art.style.setProperty('--art-x', '0px'); art.style.setProperty('--art-y', '0px'); });
  }

  const projects = {
    wmb: {
      number: '01 / PROJECTS', category: 'FULL-STACK DEVELOPMENT', title: 'Mortgage software at WM Bankers.',
      intro: 'Software development internship at Wholesale Mortgage Bankers (WM Bankers), a mortgage lender in Brea, California.',
      tags: ['Angular', '.NET Core', 'TypeScript', 'REST APIs'],
      sections: [
        ['The context', 'A mortgage lender has a lot of rules: which loan programs a borrower qualifies for, what property types are allowed, which limits apply. Those rules have to come out the same everywhere they show up.'],
        ['What I did', 'I built features in Angular and .NET Core. Most of it meant turning lending rules into backend logic, writing the service layer, and building the REST APIs the frontend uses.'],
        ['Also', 'I checked that the data stayed correct between screens and the backend. I also worked on the public website at wholesalebankers.com, including the loan program pages and the resources section.'],
        ['About the picture', 'The card image is a sketch I made for this site, not a screenshot of WM Bankers’ software.']
      ]
    },
    fox: {
      number: '02 / PROJECTS', category: 'PRODUCT DESIGN + DEVELOPMENT', title: 'Boozy Fox.',
      intro: 'A drinking analytics app my team built in 36 hours at Hack WashU 2022.',
      tags: ['React Native', 'Figma', 'Google Sheets API', 'Hack WashU'],
      sections: [
        ['The idea', 'People log what they drink, and the app turns that crowdsourced data into trends you can browse.'],
        ['What I did', 'I led the frontend and the product design. I designed it in Figma, built it in React Native, and used the Google Sheets API as a quick backend.'],
        ['What happened', 'It won the Hack WashU Business Technology Grand Prize. It also caught the attention of Anheuser-Busch InBev, one of WashU’s big sponsors.'],
        ['About the picture', 'The card image is a sketch with made-up data, not a screenshot of the original app.']
      ]
    },
    ufree: {
      number: '03 / PROJECTS', category: 'FULL-STACK APPLICATION', title: 'uFree.',
      intro: 'A scheduling planner app built with MongoDB, Express, React, and Node.js.',
      tags: ['MongoDB', 'Express', 'React', 'Node.js'],
      sections: [
        ['The idea', 'uFree helps people plan their schedules.'],
        ['What I did', 'I built the REST API and the MongoDB backend. I designed the data models, wrote the filtering and lookup logic, and connected it all to the React frontend.'],
        ['What I learned', 'It was the first project where I owned the whole path from the database to the screen, so I had to think about how the data was stored, how it was requested, and how it was shown.'],
        ['About the picture', 'The card shows the app’s tech stack, not a screenshot of its interface.']
      ]
    }
  };
  const dialog = document.querySelector('.case-dialog');
  let currentProject = 'wmb';
  let lastTrigger = null;
  const renderProject = key => {
    const project = projects[key];
    if (!project) return;
    currentProject = key;
    document.querySelector('#case-number').textContent = project.number;
    document.querySelector('#case-category').textContent = project.category;
    document.querySelector('#case-title').textContent = project.title;
    document.querySelector('#case-intro').textContent = project.intro;
    document.querySelector('#case-tags').replaceChildren(...project.tags.map(tag => {
      const span = document.createElement('span'); span.textContent = tag; return span;
    }));
    document.querySelector('#case-story').replaceChildren(...project.sections.map(([heading, copy]) => {
      const section = document.createElement('section'); section.className = 'case-story-section';
      const title = document.createElement('h3'); title.textContent = heading;
      const paragraph = document.createElement('p'); paragraph.textContent = copy;
      section.append(title, paragraph); return section;
    }));
    const keys = Object.keys(projects);
    const nextKey = keys[(keys.indexOf(key) + 1) % keys.length];
    document.querySelector('.next-project').setAttribute('aria-label', `Next project: ${projects[nextKey].title}`);
    dialog.scrollTop = 0;
  };
  document.querySelectorAll('.project-open').forEach(trigger => {
    trigger.addEventListener('click', () => {
      lastTrigger = trigger; renderProject(trigger.dataset.project); dialog.showModal();
    });
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { if (lastTrigger) lastTrigger.focus({ preventScroll: true }); });
  document.querySelector('.next-project').addEventListener('click', () => {
    const keys = Object.keys(projects);
    renderProject(keys[(keys.indexOf(currentProject) + 1) % keys.length]);
    const title = document.querySelector('#case-title');
    title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true });
  });
})();
