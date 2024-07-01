document.addEventListener('DOMContentLoaded', () => {
  const mashButton = document.getElementById('mash-button');
  const mixButton = document.getElementById('mix-button');
  const resultsSection = document.querySelector('.results');
  const detailsSection = document.querySelector('.details');

  // Define array of genre options
  const genres = [
    { value: 'history', label: 'History' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'science_fiction', label: 'Science Fiction' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'biography', label: 'Biography' },
    { value: 'self-help', label: 'Self-help' },
    { value: 'cooking', label: 'Cooking' },
  ];

  // Populate genre select options
  const genre1Select = document.getElementById('genre1');
  const genre2Select = document.getElementById('genre2');

  genres.forEach(genre => {
    const option1 = document.createElement('option');
    option1.value = genre.value;
    option1.textContent = genre.label;

    const option2 = document.createElement('option');
    option2.value = genre.value;
    option2.textContent = genre.label;

    genre1Select.appendChild(option1);
    genre2Select.appendChild(option2);
  });

  // Add event listener to mash button
  mashButton.addEventListener('click', async () => {
    const genre1 = genre1Select.value;
    const genre2 = genre2Select.value;

    if (genre1 === genre2) {
      alert('Nothing to MASH. Please select different genres.');
      return;
    }

    try {
      await displaySearchResults(genre1, genre2, 'mashup');
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again later.');
    }
  });

  // Add event listener to mix button
  mixButton.addEventListener('click', async () => {
    const genre1 = genre1Select.value;
    const genre2 = genre2Select.value;
  
    if (!genre1 || !genre2) {
      alert('Please select both Genre 1 and Genre 2.');
      return;
    }

    if (genre1 === genre2) {
      alert('Hardly a MIX. Please select different genres.');
      return;
    }
  
    try {
      await displaySearchResults(genre1, genre2, 'mix');
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again later.');
    }
  });

  /*
  * Display search results based on selected genres
  */
  async function displaySearchResults(genre1, genre2, mode) {
    try {
      const books = await fetchBooks(genre1, genre2, mode);

      // Shuffle the books array
      const shuffledBooks = books.sort(() => 0.5 - Math.random());
      
      // Get up to 10 books from the shuffled array
      const limitedBooks = shuffledBooks.slice(0, 10);
      
      resultsSection.innerHTML = '';
      
      limitedBooks.forEach(book => {
        const article = document.createElement('article');
        article.classList.add('result', 'border', 'border-gray-200', 'rounded-md', 'p-4', 'flex', 'flex-col', 'items-center', 'relative', 'bg-white', 'shadow-md');
        
        // Use book's key to fetch cover image if it exists
        const coverUrl = `https://covers.openlibrary.org/b/olid/${book.key}-M.jpg`;
        const coverDiv = document.createElement('div');
        coverDiv.classList.add('bg-red-500', 'w-32', 'h-48', 'mb-2', 'rounded-md', 'flex', 'items-center', 'justify-center', 'text-white', 'text-4xl');
        coverDiv.style.backgroundImage = `url(${coverUrl})`;
        coverDiv.style.backgroundSize = 'cover';
        coverDiv.style.backgroundPosition = 'center';
        coverDiv.style.backgroundRepeat = 'no-repeat';
        article.appendChild(coverDiv);
        
        const titleH2 = document.createElement('h2');
        titleH2.classList.add('text-lg', 'font-semibold');
        titleH2.textContent = book.title;
        article.appendChild(titleH2);
        
        const authorP = document.createElement('p');
        authorP.classList.add('text-gray-700');
        authorP.textContent = `by ${book.author_name ? book.author_name : 'Unknown'}`;
        article.appendChild(authorP);
        
        const detailsLink = document.createElement('a');
        detailsLink.href = '#';
        detailsLink.textContent = 'Details';
        detailsLink.classList.add('text-blue-500', 'hover:underline', 'absolute', 'bottom-2', 'right-2');
        detailsLink.addEventListener('click', (event) => {
          event.preventDefault();
          displayBookDetails(book);
        });
        article.appendChild(detailsLink);
        
        resultsSection.appendChild(article);
      });
    } catch (error) {
      console.error('Error displaying search results:', error);
    }
  }

  /*
  * Display detailed information for a selected book
  */
  function displayBookDetails(book) {
    // Change visibility of elements to show book details
    genre1Select.classList.add('hidden');
    genre2Select.classList.add('hidden');
    mashButton.classList.add('hidden'); 
    mixButton.classList.add('hidden');
    resultsSection.classList.add('hidden');
    detailsSection.classList.remove('hidden');
    detailsSection.innerHTML = ''; // Clear previous details

    // Create back button to return to mashup results
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Results';
    backButton.classList.add('bg-orange-500', 'text-white', 'hover:bg-orange-700', 'px-4', 'py-2', 'rounded-md', 'mt-4', 'mb-4');
    backButton.addEventListener('click', () => {
        // Reset hidden elements
        genre1Select.classList.remove('hidden');
        genre2Select.classList.remove('hidden');
        mashButton.classList.remove('hidden');
        mixButton.classList.remove('hidden');
        resultsSection.classList.remove('hidden');
        detailsSection.classList.add('hidden');
    });

    // Use book's cover edition key to fetch cover image
    const coverUrl = `https://covers.openlibrary.org/b/olid/${book.key}-M.jpg`;
  
    // Create cover image container that is red by default
    const coverContainer = document.createElement('figure');
    coverContainer.classList.add('cover-container', 'w-full', 'flex', 'justify-center', 'items-center', 'mb-6');
    const coverDiv = document.createElement('div');
    coverDiv.classList.add('bg-red-500', 'w-32', 'h-48', 'rounded-md', 'flex', 'items-center', 'justify-center', 'text-white', 'text-4xl');
    coverDiv.style.backgroundImage = `url(${coverUrl})`;
    coverDiv.style.backgroundSize = 'cover';
    coverDiv.style.backgroundPosition = 'center';
    coverDiv.style.backgroundRepeat = 'no-repeat';
    coverContainer.appendChild(coverDiv);

    // Create article to display book details
    const bookArticle = document.createElement('article');
    bookArticle.classList.add('info', 'px-4', 'py-6', 'mx-4', 'mt-4', 'bg-white', 'shadow-md', 'rounded-md');
    const titleH2 = document.createElement('h2');
    titleH2.classList.add('text-2xl', 'font-bold', 'mb-2', 'text-center');
    titleH2.textContent = book.title;
    const authorP = document.createElement('p');
    authorP.classList.add('text-lg', 'text-gray-700', 'mb-2');
    authorP.textContent = `by ${book.author_name ? book.author_name : 'Unknown'}`;

    // Create details section to display book details
    const detailsSectionElement = document.createElement('section');
    detailsSectionElement.classList.add('details-grid', 'grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4');
  
    // Create elements for each book detail
    const createDetailElement = (label, value) => {
        const detailElement = document.createElement('div');
        detailElement.classList.add('border-t', 'pt-2');
        const detailLabel = document.createElement('h3');
        detailLabel.classList.add('text-gray-700', 'font-semibold', 'mb-1');
        detailLabel.textContent = `${label}: `;
        const detailValue = document.createElement('p');
        detailValue.textContent = value ? value : 'Unknown';
        detailElement.appendChild(detailLabel);
        detailElement.appendChild(detailValue);
        return detailElement;
    };

    // Create and append details
    detailsSectionElement.appendChild(createDetailElement('Published', book.first_publish_year));
    detailsSectionElement.appendChild(createDetailElement('Pages', book.number_of_pages));
    detailsSectionElement.appendChild(createDetailElement('ISBN', book.isbn));
    detailsSectionElement.appendChild(createDetailElement('Language', book.language));
  
    // Append elements to details section
    bookArticle.appendChild(titleH2);
    bookArticle.appendChild(authorP);
    bookArticle.appendChild(detailsSectionElement);
  
    // Append elements to the main details section
    detailsSection.appendChild(backButton);
    detailsSection.appendChild(coverContainer);
    detailsSection.appendChild(bookArticle);
  }

  /*
  * Fetch books based on selected genres
  */
  async function fetchBooks(subject1, subject2, mode) {
    let urls = [];

    // Mash requires both genres to be present in the book, Mix requires either genre
    if (mode === 'mashup') {
      urls = [`https://openlibrary.org/search.json?q=subject:${subject1}+subject:${subject2}&sort=new&limit=100`];
    } else if (mode === 'mix') {
      urls = [
        `https://openlibrary.org/search.json?q=subject:${subject1}&sort=new&limit=50`,
        `https://openlibrary.org/search.json?q=subject:${subject2}&sort=new&limit=50`
      ];
    }

    try {
      // Fetch data from Open Library API using the provided URLs
      const responses = await Promise.all(urls.map(url => fetch(url)));
      const dataArr = await Promise.all(responses.map(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }));

      const data = dataArr.flatMap(data => data.docs);

      // Extract book details
      const books = data.filter((book) => {
        // Filter out books that are missing required fields for details
        return book.author_name && book.isbn && book.first_publish_year && book.number_of_pages_median && book.language;
      }).map((book) => {
        const filteredBook = {
          key: book.cover_edition_key || book.key,
          title: book.title,
          author_name: book.author_name[0],
          isbn: book.isbn[0],
          first_publish_year: book.publish_year,
          number_of_pages_median: book.number_of_pages ? book.number_of_pages[0] : 'Unknown',
          language: book.language ? book.language[0] : 'Unknown',
        };
        return filteredBook;
      });

      return books;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }
});
