import axios from 'axios';
import notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
   
const apiKey = '39362728-e0fcbbafa7eca094901ef58bb'; 
const searchForm = document.getElementById('search-form'); 
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1; 

function renderImageCards(imageData) {
  const gallery = document.querySelector('.gallery');

  imageData.forEach(image => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    // Create an anchor tag to wrap the image
    const anchor = document.createElement('a');
    anchor.href = image.largeImageURL; // Link to the large image
    anchor.setAttribute('data-lightbox', 'image'); // Set data-lightbox attribute for lightbox

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    // Add a click event listener to the image
    img.addEventListener('click', () => {
      // Initialize SimpleLightbox for this image
      const lightbox = new SimpleLightbox(img);
    });

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    anchor.appendChild(img); // Wrap the image in the anchor
    photoCard.appendChild(anchor); // Add the anchor to the photo card
    photoCard.appendChild(info);

    gallery.appendChild(photoCard);
  });
}

// Event listener for form submission
searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  // Clear existing gallery content
  gallery.innerHTML = '';

  // Get user's search query
  const searchQuery = event.target.searchQuery.value.trim();

  // Make an HTTP request to Pixabay API
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40, // 40 objects per response
      },
    });

    const imageData = response.data.hits;

    if (imageData.length === 0) {
      notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderImageCards(imageData);
      loadMoreBtn.style.display = 'block';
      currentPage++; // Increment page for pagination
    }

    // Show or hide the "Load more" button
    if (currentPage === 2) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
});

// Event listener for "Load more" button
loadMoreBtn.addEventListener('click', async () => {
  // Trigger a new search when loading more
  searchForm.dispatchEvent(new Event('submit'));
});
