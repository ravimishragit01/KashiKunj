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
      const img = item.image || (item.images && item.images[0]) ||
        'https://via.placeholder.com/900x500?text=' + encodeURIComponent(item.name);
      const sub = type === 'cab' ? `${item.seats} seats` : (type === 'boat' ? item.duration : `${item.capacity} guests`);
      const priceUnit = type === 'room' ? '/night' : '/trip';
      const amenities = (item.amenities || []).join(' • ');

      document.title = `${item.name} | The Kashi Kunj`;

      $content.html(`
        <div class="detail-hero"><img src="${img}" alt="${item.name}"></div>
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
      `);

      $('#bookThisBtn').on('click', function () {
        sessionStorage.setItem('kk_pending_booking', JSON.stringify({ type, id: item._id, name: item.name }));
        window.location.href = 'index.html#contact';
      });
    }
  });
}
