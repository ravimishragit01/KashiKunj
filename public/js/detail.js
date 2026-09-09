// Used by room-detail.html, cab-detail.html, boat-detail.html
// Call loadItemDetail('room' | 'cab' | 'boat') after DOM ready.
function loadItemDetail(type) {
  $(function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const $content = $('#detailContent');

    if (!id) {
      $content.html('<p class="loading">No item selected. Please go back and choose one.</p>');
      return;
    }

    $.get(`/api/${type}s/${id}`)
      .done(function (item) {
        renderDetail(item);
      })
      .fail(function () {
        $content.html('<p class="loading">Could not load this item. It may have been removed.</p>');
      });

    function stars(r) {
      return r ? `<div class="rating">★ ${Number(r).toFixed(1)}</div>` : '';
    }

    function renderDetail(item) {
      // Collect images array (supports single item.image or item.images array)
      const images = (item.images && item.images.length > 0)
        ? item.images
        : (item.image ? [item.image] : ['https://via.placeholder.com/900x500?text=' + encodeURIComponent(item.name)]);

      let currentImgIdx = 0;
      const sub = type === 'cab' ? `${item.seats} seats` : (type === 'boat' ? item.duration : `${item.capacity} guests`);
      const priceUnit = type === 'room' ? '/night' : '/trip';
      const amenities = (item.amenities || []).join(' • ');

      document.title = `${item.name} | The Kashi Kunj`;

      $content.html(`
        <!-- Multi-image Hero & Thumbnails -->
        <div class="gallery-wrapper">
          <div class="detail-hero" id="mainHeroImgContainer" style="cursor: zoom-in; position: relative;">
            <img id="activeHeroImg" src="${images[0]}" alt="${item.name}">
            <span class="zoom-badge">🔍 Click to zoom</span>
          </div>

          ${images.length > 1 ? `
            <div class="thumbnail-strip">
              ${images.map((img, i) => `
                <img class="thumb-img ${i === 0 ? 'active' : ''}" src="${img}" data-index="${i}" alt="Thumbnail ${i + 1}">
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="detail-body">
          <div class="detail-main">
            ${stars(item.rating)}
            <h1>${item.name}</h1>
            <p class="detail-tags">${item.type || ''} ${sub ? '• ' + sub : ''}</p>
            ${amenities ? `<p class="detail-tags">${amenities}</p>` : ''}
            <p class="detail-desc">${item.description || ''}</p>

            ${item.highlights && item.highlights.length ? `
              <h3>Highlights</h3>
              <ul class="highlight-list">
                ${item.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            ` : ''}

            ${type === 'cab' ? `
              <h3>Places You Can Visit</h3>
              <p class="detail-desc">This cab can be booked for local sightseeing or outstation trips, including:</p>
              <ul class="highlight-list">
                <li>Kashi Vishwanath Temple, Kaal Bhairav Temple, Sarnath, BHU Campus, Ramnagar Fort</li>
                <li>Airport / Railway Station pickup & drop</li>
                <li>Outstation: Prayagraj, Ayodhya, Vindhyachal</li>
              </ul>
              <a href="places.html" class="link-inline">See all Varanasi places to visit →</a>
            ` : ''}
          </div>

          <div class="detail-sidebar">
            <div class="price-box">
              ${item.discountPrice ? `<del>₹${item.price}</del> <strong>₹${item.discountPrice}</strong>` : `<strong>₹${item.price}</strong>`} <span>${priceUnit}</span>
            </div>
            <button class="btn-primary btn-full" id="bookThisBtn">Book This</button>
            <a href="https://wa.me/916392658826?text=${encodeURIComponent('Hi, I want to know more about: ' + item.name)}" target="_blank" class="btn-whatsapp-outline">Ask on WhatsApp</a>
          </div>
        </div>

        <!-- Fullscreen Zoom Lightbox Modal -->
        <div id="imageLightbox" class="lightbox-modal">
          <span class="lightbox-close">&times;</span>
          ${images.length > 1 ? `<button class="lightbox-btn lightbox-prev">&#10094;</button>` : ''}
          <div class="lightbox-content">
            <img id="lightboxTargetImg" src="${images[0]}" alt="Full preview">
            ${images.length > 1 ? `<div id="lightboxCaption" class="lightbox-counter">1 / ${images.length}</div>` : ''}
          </div>
          ${images.length > 1 ? `<button class="lightbox-btn lightbox-next">&#10095;</button>` : ''}
        </div>
      `);

      // Switch image across hero, thumbnails, and modal
      function showImage(idx) {
        currentImgIdx = (idx + images.length) % images.length;
        const targetSrc = images[currentImgIdx];
        $('#activeHeroImg').attr('src', targetSrc);
        $('#lightboxTargetImg').attr('src', targetSrc);
        $('#lightboxCaption').text(`${currentImgIdx + 1} / ${images.length}`);
        $('.thumb-img').removeClass('active').eq(currentImgIdx).addClass('active');
      }

      // Thumbnail Click Event
      $('.thumb-img').on('click', function () {
        showImage($(this).data('index'));
      });

      // Open Modal on Hero Image Click
      $('#mainHeroImgContainer').on('click', function () {
        showImage(currentImgIdx);
        $('#imageLightbox').css('display', 'flex').hide().fadeIn(200);
      });

      // Next / Prev controls
      $('.lightbox-prev').on('click', function (e) { e.stopPropagation(); showImage(currentImgIdx - 1); });
      $('.lightbox-next').on('click', function (e) { e.stopPropagation(); showImage(currentImgIdx + 1); });

      // Close modal on close button or background click
      $('.lightbox-close, #imageLightbox').on('click', function (e) {
        if (!$(e.target).closest('.lightbox-content, .lightbox-btn').length || $(e.target).hasClass('lightbox-close')) {
          $('#imageLightbox').fadeOut(200);
        }
      });

      // Keyboard Controls (Arrows + Escape)
      $(document).off('keydown.itemGallery').on('keydown.itemGallery', function (e) {
        if ($('#imageLightbox').is(':visible')) {
          if (e.key === 'ArrowLeft' && images.length > 1) showImage(currentImgIdx - 1);
          if (e.key === 'ArrowRight' && images.length > 1) showImage(currentImgIdx + 1);
          if (e.key === 'Escape') $('#imageLightbox').fadeOut(200);
        }
      });

      // Retain existing booking flow
      $('#bookThisBtn').on('click', function () {
        sessionStorage.setItem('kk_pending_booking', JSON.stringify({ type, id: item._id, name: item.name }));
        window.location.href = 'index.html#contact';
      });
    }
  });
}