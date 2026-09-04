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

  // ================= LOAD DATA =================
  $.get('/api/rooms', function (rooms) {
    const $grid = $('#roomsGrid').empty();
    if (!rooms.length) return $grid.html('<p class="loading">No rooms available right now.</p>');
    rooms.forEach(r => $grid.append(roomCard(r)));
  }).fail(() => $('#roomsGrid').html('<p class="loading">Could not load rooms. Is the server running?</p>'));

  $.get('/api/cabs', function (cabs) {
    const $grid = $('#cabsGrid').empty();
    if (!cabs.length) return $grid.html('<p class="loading">No cabs available right now.</p>');
    cabs.forEach(c => $grid.append(serviceCard(c, 'cab')));
  }).fail(() => $('#cabsGrid').html('<p class="loading">Could not load cabs.</p>'));

  $.get('/api/boats', function (boats) {
    const $grid = $('#boatsGrid').empty();
    if (!boats.length) return $grid.html('<p class="loading">No boats available right now.</p>');
    boats.forEach(b => $grid.append(serviceCard(b, 'boat')));
  }).fail(() => $('#boatsGrid').html('<p class="loading">Could not load boats.</p>'));

  function ratingStars(r) {
    return r ? `<div class="rating">★ ${r.toFixed ? r.toFixed(1) : r}</div>` : '';
  }

  function roomCard(r) {
    const img = (r.images && r.images[0]) || 'https://via.placeholder.com/400x250?text=' + encodeURIComponent(r.name);
    return $(`
      <div class="card">
        <a href="room-detail.html?id=${r._id}" class="card-link">
          <img src="${img}" alt="${r.name}">
        </a>
        <div class="card-body">
          ${ratingStars(r.rating)}
          <h3><a href="room-detail.html?id=${r._id}" class="card-link">${r.name}</a></h3>
          <div class="tags">${(r.amenities || []).join(' • ')}</div>
          <div class="price">
            ${r.discountPrice ? `<del>₹${r.price}</del> <strong>₹${r.discountPrice}</strong>` : `<strong>₹${r.price}</strong>`} /night
          </div>
          <button class="btn-primary book-btn" data-type="room" data-id="${r._id}" data-name="${r.name}">Book Now</button>
        </div>
      </div>
    `);
  }

  function serviceCard(item, type) {
    const img = item.image || 'https://via.placeholder.com/400x250?text=' + encodeURIComponent(item.name);
    const sub = type === 'cab' ? (item.seats + ' seats') : item.duration;
    const detailUrl = `${type}-detail.html?id=${item._id}`;
    return $(`
      <div class="card">
        <a href="${detailUrl}" class="card-link">
          <img src="${img}" alt="${item.name}">
        </a>
        <div class="card-body">
          ${ratingStars(item.rating)}
          <h3><a href="${detailUrl}" class="card-link">${item.name}</a></h3>
          <div class="tags">${item.type} ${sub ? '• ' + sub : ''}</div>
          <div class="price">
            ${item.discountPrice ? `<del>₹${item.price}</del> <strong>₹${item.discountPrice}</strong>` : `<strong>₹${item.price}</strong>`} /trip
          </div>
          <button class="btn-primary book-btn" data-type="${type}" data-id="${item._id}" data-name="${item.name}">Book Now</button>
        </div>
      </div>
    `);
  }

  // ================= PRE-FILL FROM DETAIL PAGE (sessionStorage handoff) =================
  const pending = sessionStorage.getItem('kk_pending_booking');
  if (pending) {
    try {
      const { type, id, name } = JSON.parse(pending);
      selectedItems[type] = { id, name };
      $(`#svcTypeGroup input[value="${type}"]`).prop('checked', true);
      renderSelectedItems();
      $('#formMsg').text(`Booking: ${name}`).css('color', 'var(--primary-dark)');
    } catch (e) { /* ignore malformed data */ }
    sessionStorage.removeItem('kk_pending_booking');
  }

  // ================= BOOK NOW -> select service + item =================
  $(document).on('click', '.book-btn', function () {
    const type = $(this).data('type');
    const id = $(this).data('id');
    const name = $(this).data('name');

    selectedItems[type] = { id, name };
    $(`#svcTypeGroup input[value="${type}"]`).prop('checked', true);
    renderSelectedItems();

    $('html, body').animate({ scrollTop: $('#contact').offset().top - 70 }, 500);
  });

  $(document).on('change', '#svcTypeGroup input[type="checkbox"]', function () {
    const type = $(this).val();
    if (!$(this).is(':checked')) delete selectedItems[type];
    renderSelectedItems();
  });

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
