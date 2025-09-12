async function loadDemos() {
    const response = await fetch('demos.json');
    const data = await response.json();
  
    const genreList = document.getElementById('genre-list');
    const trackList = document.getElementById('track-list');
    const audio = document.getElementById('audio');
    const trackTitle = document.getElementById('track-title');
  
    // build sidebar
    for (const genre in data) {
      const genreItem = document.createElement('li');
      genreItem.textContent = genre;
  
      const subList = document.createElement('ul');
      subList.style.listStyle = 'none';
      subList.style.paddingLeft = '15px';
  
      for (const sub in data[genre]) {
        const subItem = document.createElement('li');
        subItem.textContent = sub;
  
        subItem.addEventListener('click', () => {
          trackList.innerHTML = '';
          data[genre][sub].forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.addEventListener('click', () => {
              document.querySelectorAll('#track-list li').forEach(el => el.classList.remove('active'));
              li.classList.add('active');
              audio.src = track.url;
              audio.play();
              trackTitle.textContent = track.title;
            });
            trackList.appendChild(li);
          });
        });
  
        subList.appendChild(subItem);
      }
  
      genreItem.appendChild(subList);
      genreList.appendChild(genreItem);
    }
  }
  
  loadDemos();
  