$(function () {

  // ⚠️ Add The Kashi Kunj's real WhatsApp number(s) — country code, no + or spaces.
  const WHATSAPP_NUMBERS = ['916392658826'];

  let selectedItems = {}; // { room: {id,name}, cab: {...}, boat: {...} }

  // ---------- Mobile menu ----------
  $('#hamburger').on('click', function () {
    $('.nav-links').toggleClass('open');
  });

  // ================= HERO CAROUSEL =================
  const $slides = $('.slide');
  const $dots = $('#carouselDots');
  let current = 0;
  let timer;

  $slides.each(function (i) {
    $dots.append(`<span class="dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`);
  });

  function goToSlide(i) {
    $slides.removeClass('active').eq(i).addClass('active');
    $dots.find('.dot').removeClass('active').eq(i).addClass('active');
    current = i;
  }
  function nextSlide() { goToSlide((current + 1) % $slides.length); }
  function prevSlide() { goToSlide((current - 1 + $slides.length) % $slides.length); }
  function startAutoplay() { timer = setInterval(nextSlide, 5000); }
  function resetAutoplay() { clearInterval(timer); startAutoplay(); }

  $('#nextSlide').on('click', () => { nextSlide(); resetAutoplay(); });
  $('#prevSlide').on('click', () => { prevSlide(); resetAutoplay(); });
  $(document).on('click', '.dot', function () { goToSlide($(this).data('i')); resetAutoplay(); });
  startAutoplay();

  // ================= PLACES TO VISIT (homepage grid) =================
  if (typeof PLACES !== 'undefined') {
    const $pg = $('#placesGrid');
    PLACES.slice(0, 6).forEach(p => {
      $pg.append(`
        <a class="attraction-card" href="place-detail.html?slug=${p.slug}">
          <img src="${p.image}" alt="${p.name}">
          <p>${p.name}</p>
        </a>
      `);
    });
  }

  // ================= ENRICHED RATINGS & CARDS =================
  function ratingStars(r) {
    const score = Number(r || 4.8).toFixed(1);
    return `
      <div class="card-rating">
        <span class="star-icon">★</span>
        <span class="rating-num">${score}</span>
        <span class="rating-badge">Verified</span>
      </div>
    `;
  }

  function roomCard(r) {
    const img = (r.images && r.images[0]) || r.image || 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(r.name);
    const discountPercent = r.discountPrice && r.price 
      ? Math.round(((r.price - r.discountPrice) / r.price) * 100) 
      : null;

    return $(`
      <div class="card modern-card">
        <div class="card-media">
          <a href="room-detail.html?id=${r._id}" class="card-link">
            <img src="${img}" alt="${r.name}" loading="lazy">
          </a>
          <span class="media-badge tag-type">${r.type || 'Deluxe Room'}</span>
          ${discountPercent ? `<span class="media-badge tag-discount">${discountPercent}% OFF</span>` : ''}
        </div>

        <div class="card-body">
          <div class="card-header-row">
            ${ratingStars(r.rating)}
            <span class="card-spec">👥 ${r.capacity || 2} Guests Max</span>
          </div>

          <h3 class="card-title">
            <a href="room-detail.html?id=${r._id}">${r.name}</a>
          </h3>

          <div class="tags-container">
            ${(r.amenities && r.amenities.length ? r.amenities : ['Free WiFi', 'AC', 'Geyser']).slice(0, 3).map(a => `
              <span class="feature-tag">✓ ${a}</span>
            `).join('')}
          </div>

          <div class="card-footer-row">
            <div class="price-wrap">
              <span class="price-label">Price starting at</span>
              <div class="price">
                ${r.discountPrice ? `<del>₹${r.price}</del> <strong>₹${r.discountPrice}</strong>` : `<strong>₹${r.price}</strong>`}
                <span class="price-unit">/night</span>
              </div>
            </div>
            <button class="btn-primary book-btn" data-type="room" data-id="${r._id}" data-name="${r.name}">Book Now</button>
          </div>
        </div>
      </div>
    `);
  }

  function serviceCard(item, type) {
    const img = (item.images && item.images[0]) || item.image || 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(item.name);
    const detailUrl = `${type}-detail.html?id=${item._id}`;
    const sub = type === 'cab' ? `💺 ${item.seats || 4} Seater AC` : `⏱️ ${item.duration || '1.5-2 Hrs'}`;
    const badgeClass = type === 'boat' ? 'tag-boat' : 'tag-type';
    const badgeText = item.type || (type === 'cab' ? 'Chauffeur Driven' : 'Ganges Cruise');
    const actionText = type === 'cab' ? 'Book Ride' : 'Book Boat';
    const priceUnit = '/trip';

    // Highlight tags specific to service type
    const tagsHtml = type === 'cab' 
      ? `<span class="feature-tag">🧳 Luggage Space</span><span class="feature-tag">❄️ Chilled AC</span><span class="feature-tag">📍 Airport & City</span>`
      : `<span class="feature-tag">🌅 Sunrise / Aarti</span><span class="feature-tag">🛶 Private Boat</span><span class="feature-tag">🦺 Life Jackets</span>`;

    return $(`
      <div class="card modern-card">
        <div class="card-media">
          <a href="${detailUrl}" class="card-link">
            <img src="${img}" alt="${item.name}" loading="lazy">
          </a>
          <span class="media-badge ${badgeClass}">${badgeText}</span>
        </div>

        <div class="card-body">
          <div class="card-header-row">
            ${ratingStars(item.rating)}
            <span class="card-spec">${sub}</span>
          </div>

          <h3 class="card-title">
            <a href="${detailUrl}">${item.name}</a>
          </h3>

          <div class="tags-container">
            ${tagsHtml}
          </div>

          <div class="card-footer-row">
            <div class="price-wrap">
              <span class="price-label">Tariff from</span>
              <div class="price">
                ${item.discountPrice ? `<del>₹${item.price}</del> <strong>₹${item.discountPrice}</strong>` : `<strong>₹${item.price}</strong>`}
                <span class="price-unit">${priceUnit}</span>
              </div>
            </div>
            <button class="btn-primary book-btn" data-type="${type}" data-id="${item._id}" data-name="${item.name}">${actionText}</button>
          </div>
        </div>
      </div>
    `);
  }

  // ================= LOAD DATA =================
  // ================= LOADER HELPER =================
  function renderLoader(message = 'Loading options...') {
    return `
      <div class="loader-container">
        <div class="spinner"></div>
        <p class="loader-text">${message}</p>
      </div>
    `;
  }
  $(document).ready(function () {
  loadAdvertisements();
});

function loadAdvertisements() {
  $.ajax({
    url: "/api/ads", // Your backend route returning DB records
    method: "GET",
    dataType: "json",
    success: function (response) {
      const container = $("#adContainer");
      container.empty();

      if (!response || response.length === 0) {
        $("#ads-section").hide(); // Hide section if no active ads
        return;
      }

      response.forEach(function (ad) {
        const adHtml = `
          <div class="ad-card">
            <div class="ad-img-wrapper">
              <span class="ad-badge">${ad.badge || "Special"}</span>
              <img src="${ad.imageUrl}" alt="${ad.title || "Special Offer"}" loading="lazy">
            </div>
            <div class="ad-content">
              <h3>${ad.title}</h3>
              <p>${ad.description}</p>
              <a href="${ad.targetLink || "#contact"}" class="btn-primary book-btn">${ad.buttonText || "Claim Offer"}</a>
            </div>
          </div>
        `;
        container.append(adHtml);
      });
    },
    error: function (err) {
      console.error("Failed to load advertisements:", err);
      $("#adContainer").html('<p style="text-align:center; color:#999;">Offers temporarily unavailable.</p>');
    }
  });
}
// ================= LOAD DATA (HOMEPAGE & ALL LISTINGS) =================

  // 1. Rooms
  if ($('#roomsGrid').length) {
    const $grid = $('#roomsGrid').html(renderLoader('Loading available stays...'));
    $.get('/api/rooms', function (rooms) {
      $grid.empty();
      if (!rooms.length) return $grid.html('<p class="no-data">No rooms available right now.</p>');
      rooms.slice(0, 3).forEach(r => $grid.append(roomCard(r)));
      if (rooms.length > 3) $('#roomsViewAll').show();
    }).fail(() => $grid.html('<p class="loading-error">Could not load rooms. Please check your connection.</p>'));
  }

  if ($('#allRoomsGrid').length) {
    const $grid = $('#allRoomsGrid').html(renderLoader('Loading all stays...'));
    $.get('/api/rooms', function (rooms) {
      $grid.empty();
      if (!rooms.length) return $grid.html('<p class="no-data">No rooms available right now.</p>');
      rooms.forEach(r => $grid.append(roomCard(r)));
    }).fail(() => $grid.html('<p class="loading-error">Could not load rooms.</p>'));
  }

  // 2. Cabs
  if ($('#cabsGrid').length) {
    const $grid = $('#cabsGrid').html(renderLoader('Loading verified cabs...'));
    $.get('/api/cabs', function (cabs) {
      $grid.empty();
      if (!cabs.length) return $grid.html('<p class="no-data">No cabs available right now.</p>');
      cabs.slice(0, 3).forEach(c => $grid.append(serviceCard(c, 'cab')));
      if (cabs.length > 3) $('#cabsViewAll').show();
    }).fail(() => $grid.html('<p class="loading-error">Could not load cabs.</p>'));
  }

  if ($('#allCabsGrid').length) {
    const $grid = $('#allCabsGrid').html(renderLoader('Loading all cabs...'));
    $.get('/api/cabs', function (cabs) {
      $grid.empty();
      if (!cabs.length) return $grid.html('<p class="no-data">No cabs available right now.</p>');
      cabs.forEach(c => $grid.append(serviceCard(c, 'cab')));
    }).fail(() => $grid.html('<p class="loading-error">Could not load cabs.</p>'));
  }

  // 3. Boats
  if ($('#boatsGrid').length) {
    const $grid = $('#boatsGrid').html(renderLoader('Loading boat rides...'));
    $.get('/api/boats', function (boats) {
      $grid.empty();
      if (!boats.length) return $grid.html('<p class="no-data">No boats available right now.</p>');
      boats.slice(0, 3).forEach(b => $grid.append(serviceCard(b, 'boat')));
      if (boats.length > 3) $('#boatsViewAll').show();
    }).fail(() => $grid.html('<p class="loading-error">Could not load boats.</p>'));
  }

  if ($('#allBoatsGrid').length) {
    const $grid = $('#allBoatsGrid').html(renderLoader('Loading all boat rides...'));
    $.get('/api/boats', function (boats) {
      $grid.empty();
      if (!boats.length) return $grid.html('<p class="no-data">No boats available right now.</p>');
      boats.forEach(b => $grid.append(serviceCard(b, 'boat')));
    }).fail(() => $grid.html('<p class="loading-error">Could not load boats.</p>'));
  }
// ================= PRE-FILL FROM DETAIL PAGE / SUBPAGES =================
  const pending = sessionStorage.getItem('kk_pending_booking');
  if (pending) {
    try {
      const { type, id, name } = JSON.parse(pending);
      selectedItems[type] = { id, name };
      $(`#svcTypeGroup input[value="${type}"]`).prop('checked', true);
      renderSelectedItems();
      $('#formMsg').text(`Selected: ${name}`).css('color', 'var(--primary)');
      
      // Auto-scroll to the form once landing on index.html
      setTimeout(function () {
        if ($('#contact').length) {
          $('html, body').stop().animate({
            scrollTop: $('#contact').offset().top - 75
          }, 600);
        }
      }, 400);
    } catch (e) { /* ignore malformed data */ }
    sessionStorage.removeItem('kk_pending_booking');
  }

  // ================= BOOK NOW -> select service + item =================
  // ================= BOOK NOW (HOMEPAGE SCROLL OR REDIRECT) =================
  $(document).on('click', '.book-btn', function () {
    const type = $(this).data('type');
    const id = $(this).data('id');
    const name = $(this).data('name');

    if ($('#contact').length) {
      selectedItems[type] = { id, name };
      $(`#svcTypeGroup input[value="${type}"]`).prop('checked', true);
      renderSelectedItems();
      $('html, body').animate({ scrollTop: $('#contact').offset().top - 70 }, 500);
    } else {
      // If clicked on rooms.html, cabs.html, or boats.html, redirect to contact on index
      sessionStorage.setItem('kk_pending_booking', JSON.stringify({ type, id, name }));
      window.location.href = 'index.html#contact';
    }
  });
  // ================= PROMO BANNER COMBO CLICK =================
  $(document).on('click', '.promo-btn-main', function (e) {
    e.preventDefault();

    const type = 'tour';
    const comboName = 'Sunrise Boat + Stay Combo (25% Off)';
    const comboId = 'combo-sunrise-boat-stay';

    // Set selected item
    selectedItems[type] = { id: comboId, name: comboName };

    // Check the "Tour Package" checkbox
    $(`#svcTypeGroup input[value="${type}"]`).prop('checked', true);

    // Refresh tags and set notification
    renderSelectedItems();
    $('#formMsg').text(`Selected: ${comboName}`).css('color', 'var(--primary)');

    // Optional: Pre-fill custom note in textarea if empty
    if (!$('#message').val()) {
      $('#message').val('Hi, I want to book the Sunrise Ganga Boat Ride + Stay Combo offer.');
    }

    // Smooth scroll down to the booking form
    if ($('#contact').length) {
      $('html, body').stop().animate({
        scrollTop: $('#contact').offset().top - 75
      }, 500);
    }
  });

  $(document).on('change', '#svcTypeGroup input[type="checkbox"]', function () {
    const type = $(this).val();
    if (!$(this).is(':checked')) delete selectedItems[type];
    renderSelectedItems();
    
  })

  function renderSelectedItems() {
    const $box = $('#selectedItemsBox').empty();
    Object.keys(selectedItems).forEach(type => {
      const item = selectedItems[type];
      $box.append(`
        <span class="selected-tag" data-type="${type}">
          ${item.name} <span class="remove-tag" data-type="${type}">✕</span>
        </span>
      `);
    });
  }

  $(document).on('click', '.remove-tag', function () {
    const type = $(this).data('type');
    delete selectedItems[type];
    $(`#svcTypeGroup input[value="${type}"]`).prop('checked', false);
    renderSelectedItems();
    $('#formMsg').text('');
  });

  // ================= SUBMIT: WhatsApp instantly, save in background =================
  $('#bookingForm').on('submit', function (e) {
    e.preventDefault();

    const types = $('#svcTypeGroup input:checked').map(function () { return this.value; }).get();
    if (!types.length) {
      $('#formMsg').text('⚠️ Please select at least one: Room, Cab or Boat.').css('color', '#c0392b');
      return;
    }

    const formData = {};
    $(this).serializeArray().forEach(f => formData[f.name] = f.value);
    if (!formData.name || !formData.phone) {
      $('#formMsg').text('⚠️ Please fill your name and phone number.').css('color', '#c0392b');
      return;
    }

    $('#formMsg').text('Submitting...').css('color', '#888');

    // Open WhatsApp immediately (must be synchronous or browsers block the popup)
    sendToWhatsApp(types, formData);

    const requests = types.map(type => {
      const item = selectedItems[type] || {};
      return $.ajax({
        url: '/api/bookings',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          bookingType: type,
          itemId: item.id,
          itemName: item.name || `General ${type} enquiry`,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests,
          message: formData.message
        })
      });
    });

    $.when.apply($, requests)
      .done(function () {
        $('#formMsg').text('✅ Request saved and sent via WhatsApp!').css('color', 'green');
        $('#bookingForm')[0].reset();
        selectedItems = {};
        renderSelectedItems();
      })
      .fail(function (jqXHR) {
        console.error('Booking save failed:', jqXHR.responseJSON || jqXHR.responseText);
        $('#formMsg').text('⚠️ Sent via WhatsApp, but could not save to our system — please call us to confirm.').css('color', '#c0392b');
      });
  });

  function sendToWhatsApp(types, formData) {
    const lines = [
      `*New Booking Enquiry - The Kashi Kunj*`,
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      formData.email ? `Email: ${formData.email}` : null,
      `Services: ${types.map(t => {
        const item = selectedItems[t];
        return item ? `${t} (${item.name})` : t;
      }).join(', ')}`,
      formData.checkIn ? `Check-in: ${formData.checkIn}` : null,
      formData.checkOut ? `Check-out: ${formData.checkOut}` : null,
      formData.guests ? `Guests: ${formData.guests}` : null,
      formData.message ? `Message: ${formData.message}` : null
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    WHATSAPP_NUMBERS.forEach(number => {
      window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    });
  }

  // ================= FAQ ACCORDION =================
  $(document).on('click', '.faq-q', function () {
    $(this).closest('.faq-item').toggleClass('open')
      .siblings('.faq-item').removeClass('open');
  });

  // ================= BACK TO TOP =================
  $(window).on('scroll', function () {
    $('#backToTop').toggleClass('show', $(window).scrollTop() > 400);
  });
  $('#backToTop').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 400);
  });

});


