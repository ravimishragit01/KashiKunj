$(function () {
  // ⚠️ Add The Kashi Kunj's real WhatsApp number(s) — country code, no + or spaces.
  const WHATSAPP_NUMBERS = ["916392658826"];

  let selectedItems = {}; // { room: {id,name}, cab: {...}, boat: {...} }

  // ---------- Mobile menu ----------
  $("#hamburger").on("click", function () {
    $(".nav-links").toggleClass("open");
  });

  // ================= HERO CAROUSEL =================
  const $slides = $(".slide");
  const $dots = $("#carouselDots");
  let current = 0;
  let timer;

  $slides.each(function (i) {
    $dots.append(
      `<span class="dot${i === 0 ? " active" : ""}" data-i="${i}"></span>`,
    );
  });

  function goToSlide(i) {
    $slides.removeClass("active").eq(i).addClass("active");
    $dots.find(".dot").removeClass("active").eq(i).addClass("active");
    current = i;
  }
  function nextSlide() {
    goToSlide((current + 1) % $slides.length);
  }
  function prevSlide() {
    goToSlide((current - 1 + $slides.length) % $slides.length);
  }
  function startAutoplay() {
    timer = setInterval(nextSlide, 8000);
  }
  function resetAutoplay() {
    clearInterval(timer);
    startAutoplay();
  }

  $("#nextSlide").on("click", () => {
    nextSlide();
    resetAutoplay();
  });
  $("#prevSlide").on("click", () => {
    prevSlide();
    resetAutoplay();
  });
  $(document).on("click", ".dot", function () {
    goToSlide($(this).data("i"));
    resetAutoplay();
  });
  startAutoplay();

  // ================= PLACES TO VISIT (HOMEPAGE DYNAMIC LOAD) =================
  if ($("#placesGrid").length) {
    const $pg = $("#placesGrid");
    $pg.html(renderLoader("Loading top attractions..."));

    $.get("/api/places", function (places) {
      $pg.empty();
      if (!places || !places.length) {
        $pg.html('<p class="no-data">No attractions listed currently.</p>');
        return;
      }

      // Display first 6 attractions on the homepage
      places.slice(0, 6).forEach(function (p) {
        $pg.append(`
        <a class="attraction-card" href="place-detail.html?slug=${p.slug}">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <p>${p.name}</p>
        </a>
      `);
      });
    }).fail(function () {
      $pg.html(
        '<p class="loading-error">Could not load attractions. Please check your connection.</p>',
      );
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
    const img =
      (r.images && r.images[0]) ||
      r.image ||
      "https://via.placeholder.com/600x400?text=" + encodeURIComponent(r.name);
    const discountPercent =
      r.discountPrice && r.price
        ? Math.round(((r.price - r.discountPrice) / r.price) * 100)
        : null;

    return $(`
      <div class="card modern-card">
        <div class="card-media">
          <a href="room-detail.html?id=${r._id}" class="card-link">
            <img src="${img}" alt="${r.name}" loading="lazy">
          </a>
          <span class="media-badge tag-type">${r.type || "Deluxe Room"}</span>
          ${discountPercent ? `<span class="media-badge tag-discount">${discountPercent}% OFF</span>` : ""}
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
            ${(r.amenities && r.amenities.length
              ? r.amenities
              : ["Free WiFi", "AC", "Geyser"]
            )
              .slice(0, 3)
              .map(
                (a) => `
              <span class="feature-tag">✓ ${a}</span>
            `,
              )
              .join("")}
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
    const img =
      (item.images && item.images[0]) ||
      item.image ||
      "https://via.placeholder.com/600x400?text=" +
        encodeURIComponent(item.name);
    const detailUrl = `${type}-detail.html?id=${item._id}`;
    const sub =
      type === "cab"
        ? `💺 ${item.seats || 4} Seater AC`
        : `⏱️ ${item.duration || "1.5-2 Hrs"}`;
    const badgeClass = type === "boat" ? "tag-boat" : "tag-type";
    const badgeText =
      item.type || (type === "cab" ? "Chauffeur Driven" : "Ganges Cruise");
    const actionText = type === "cab" ? "Book Ride" : "Book Boat";
    const priceUnit = "/person";

    // Highlight tags specific to service type
    const tagsHtml =
      type === "cab"
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
            ${item.tagsHtml ? item.tagsHtml : tagsHtml}
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
  // ================= AD CARD BUILDER =================
  function adCard(ad) {
    let imgSrc = ad.imageUrl || "";
    if (imgSrc && !imgSrc.startsWith("http") && !imgSrc.startsWith("/")) {
      imgSrc = "/" + imgSrc;
    }

    return $(`
    <div class="ad-card">
      <div class="ad-img-wrapper">
        <span class="ad-badge">${ad.badge || "Special"}</span>
        <img src="${imgSrc}" alt="${ad.name || "Special Offer"}" onerror="this.src='/images/banner/kashi2.png';">
      </div>
      <div class="ad-content">
        <h3>${ad.name}</h3>
        <p>${ad.description}</p>
        <a href="${ad.targetLink || "#contact"}" data-id="${ad._id}" data-name="${ad.name}" class="btn-primary book-btn">${ad.buttonText || "Claim Offer"}</a>
      </div>
    </div>
  `);
  }

  // ================= LOAD DATA =================
  function renderLoader(message = "Loading options...") {
    return `
      <div class="loader-container">
        <div class="spinner"></div>
        <p class="loader-text">${message}</p>
      </div>
    `;
  }

  // ================= LOAD DATA (HOMEPAGE & ALL LISTINGS) =================
  // ================= LOAD ADVERTISEMENTS (HOMEPAGE & ALL LISTINGS) =================

  // 1. Featured Homepage Offers
  if ($("#adContainer").length) {
    const $grid = $("#adContainer").html(
      renderLoader("Loading special offers..."),
    );
    $.get("/api/ads", function (ads) {
      $grid.empty();
      if (!ads || !ads.length) {
        $("#ads-section").hide();
        return;
      }
      ads.slice(0, 3).forEach((ad) => $grid.append(adCard(ad)));
      if (ads.length > 3 && $("#adsViewAll").length) $("#adsViewAll").show();
    }).fail(() => {
      $grid.html(
        '<p class="loading-error">Offers temporarily unavailable.</p>',
      );
    });
  }

  // 2. All Offers (For dedicated offers page if present)
  if ($("#allAdsGrid").length) {
    const $grid = $("#allAdsGrid").html(renderLoader("Loading all offers..."));
    $.get("/api/ads", function (ads) {
      $grid.empty();
      if (!ads || !ads.length)
        return $grid.html(
          '<p class="no-data">No special promotions active right now.</p>',
        );
      ads.forEach((ad) => $grid.append(adCard(ad)));
    }).fail(() => {
      $grid.html('<p class="loading-error">Could not load offers.</p>');
    });
  }

  // 1. Rooms
  if ($("#roomsGrid").length) {
    const $grid = $("#roomsGrid").html(
      renderLoader("Loading available stays..."),
    );
    $.get("/api/rooms", function (rooms) {
      $grid.empty();
      if (!rooms.length)
        return $grid.html(
          '<p class="no-data">No rooms available right now.</p>',
        );
      rooms.slice(0, 3).forEach((r) => $grid.append(roomCard(r)));
      if (rooms.length > 3) $("#roomsViewAll").show();
    }).fail(() =>
      $grid.html(
        '<p class="loading-error">Could not load rooms. Please check your connection.</p>',
      ),
    );
  }

  if ($("#allRoomsGrid").length) {
    const $grid = $("#allRoomsGrid").html(renderLoader("Loading all stays..."));
    $.get("/api/rooms", function (rooms) {
      $grid.empty();
      if (!rooms.length)
        return $grid.html(
          '<p class="no-data">No rooms available right now.</p>',
        );
      rooms.forEach((r) => $grid.append(roomCard(r)));
    }).fail(() =>
      $grid.html('<p class="loading-error">Could not load rooms.</p>'),
    );
  }

  // 2. Cabs
  if ($("#cabsGrid").length) {
    const $grid = $("#cabsGrid").html(renderLoader("Loading verified cabs..."));
    $.get("/api/cabs", function (cabs) {
      $grid.empty();
      if (!cabs.length)
        return $grid.html(
          '<p class="no-data">No cabs available right now.</p>',
        );
      cabs.slice(0, 3).forEach((c) => $grid.append(serviceCard(c, "cab")));
      if (cabs.length > 3) $("#cabsViewAll").show();
    }).fail(() =>
      $grid.html('<p class="loading-error">Could not load cabs.</p>'),
    );
  }

  if ($("#allCabsGrid").length) {
    const $grid = $("#allCabsGrid").html(renderLoader("Loading all cabs..."));
    $.get("/api/cabs", function (cabs) {
      $grid.empty();
      if (!cabs.length)
        return $grid.html(
          '<p class="no-data">No cabs available right now.</p>',
        );
      cabs.forEach((c) => $grid.append(serviceCard(c, "cab")));
    }).fail(() =>
      $grid.html('<p class="loading-error">Could not load cabs.</p>'),
    );
  }

  // 3. Boats
  if ($("#boatsGrid").length) {
    const $grid = $("#boatsGrid").html(renderLoader("Loading boat rides..."));
    $.get("/api/boats", function (boats) {
      $grid.empty();
      if (!boats.length)
        return $grid.html(
          '<p class="no-data">No boats available right now.</p>',
        );
      boats.slice(0, 3).forEach((b) => $grid.append(serviceCard(b, "boat")));
      if (boats.length > 3) $("#boatsViewAll").show();
    }).fail(() =>
      $grid.html('<p class="loading-error">Could not load boats.</p>'),
    );
  }

  if ($("#allBoatsGrid").length) {
    const $grid = $("#allBoatsGrid").html(
      renderLoader("Loading all boat rides..."),
    );
    $.get("/api/boats", function (boats) {
      $grid.empty();
      if (!boats.length)
        return $grid.html(
          '<p class="no-data">No boats available right now.</p>',
        );
      boats.forEach((b) => $grid.append(serviceCard(b, "boat")));
    }).fail(() =>
      $grid.html('<p class="loading-error">Could not load boats.</p>'),
    );
  }

  // ================= LOAD DYNAMIC BLOG POSTS (Homepage) =================
  if ($("#blogGrid").length) {
    $.get("/api/blogs", function (blogs) {
      const $grid = $("#blogGrid").empty();
      if (!blogs.length)
        return $grid.html('<p class="no-data">No articles published yet.</p>');

      // Show only the first 3 blogs on the homepage
      blogs.slice(0, 3).forEach((b) => {
        $grid.append(`
          <div class="card modern-card blog-card">
            <div class="card-media">
              <a href="blog-detail.html?slug=${b.slug}" class="card-link">
                <img src="${b.image}" alt="${b.title}" loading="lazy">
              </a>
              <span class="media-badge tag-type">${b.category}</span>
            </div>
            <div class="card-body">
              <div class="card-header-row">
                <span class="card-spec">⏱️ ${b.readTime}</span>
              </div>
              <h3 class="card-title">
                <a href="blog-detail.html?slug=${b.slug}">${b.title}</a>
              </h3>
              <p class="card-excerpt" style="font-size: 0.9rem; color: #666; margin-bottom: 16px; line-height: 1.5;">${b.excerpt}</p>
              <div class="card-footer-row">
                <span style="font-size: 0.85rem; color: #888;">By ${b.author}</span>
                <a href="blog-detail.html?slug=${b.slug}" class="btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">Read Article →</a>
              </div>
            </div>
          </div>
        `);
      });

      // Show the "Explore All Blogs" button if there are more than 3 articles
      if (blogs.length > 3) {
        $("#blogViewAll").show();
      }
    }).fail(() =>
      $("#blogGrid").html(
        '<p class="loading-error">Could not load travel articles.</p>',
      ),
    );
  }
  // ================= PRE-FILL FROM DETAIL PAGE / SUBPAGES =================
  const pending = sessionStorage.getItem("kk_pending_booking");
  if (pending) {
    try {
      const { type, id, name } = JSON.parse(pending);
      selectedItems[type] = { id, name };
      $(`#svcTypeGroup input[value="${type}"]`).prop("checked", true);
      renderSelectedItems();
      $("#formMsg").text(`Selected: ${name}`).css("color", "var(--primary)");

      // Auto-scroll to the form once landing on index.html
      setTimeout(function () {
        if ($("#contact").length) {
          $("html, body")
            .stop()
            .animate(
              {
                scrollTop: $("#contact").offset().top - 75,
              },
              600,
            );
        }
      }, 400);
    } catch (e) {
      /* ignore malformed data */
    }
    sessionStorage.removeItem("kk_pending_booking");
  }

  // ================= BOOK NOW -> select service + item =================
  // ================= BOOK NOW (HOMEPAGE SCROLL OR REDIRECT) =================
  let selectedBoatSeats = {}; // Tracks selected seats for boats
  $(document).on("click", ".book-btn", function () {
    const type = $(this).data("type");
    const id = $(this).data("id");
    const name = $(this).data("name");

    if (type === "boat") {
      // Fetch fresh boat data to check live booked seats from MongoDB
      $.get(`/api/boats/${id}`, function (boat) {
        // 1. Check if the boat is a Maharaja Boat or a Cruise
        const boatNameStr = (boat.name || "").toLowerCase();
        const boatTypeStr = (boat.type || "").toLowerCase();
        const requiresSeatSelection =
          boatNameStr.includes("maharaja") ||
          boatTypeStr.includes("maharaja") ||
          boatNameStr.includes("cruise") ||
          boatTypeStr.includes("cruise");

        // 2. If it is a premium boat, open the seat map. Otherwise, book directly.
        if (requiresSeatSelection) {
          openSeatSelectorModal(boat);
        } else {
          proceedWithSelection(type, id, name, []);
        }
      }).fail(() => {
        // Fallback if fetch fails
        proceedWithSelection(type, id, name, []);
      });
    } else {
      proceedWithSelection(type, id, name, []);
    }
  });

  function proceedWithSelection(type, id, name, seats = []) {
    const seatText = seats.length ? ` (Seats: ${seats.join(", ")})` : "";
    const finalName = name + seatText; // Appends seats so WhatsApp gets it

    if ($("#contact").length) {
      selectedItems[type] = { id, name: finalName, rawName: name, seats };
      $(`#svcTypeGroup input[value="${type}"]`).prop("checked", true);
      renderSelectedItems();
      $("html, body").animate(
        { scrollTop: $("#contact").offset().top - 70 },
        500,
      );
    } else {
      // Redirect from subpages
      sessionStorage.setItem(
        "kk_pending_booking",
        JSON.stringify({ type, id, name: finalName, seats }),
      );
      window.location.href = "index.html#contact";
    }
  }
  // ================= INTERACTIVE BOAT SEAT SELECTOR (HORIZONTAL + ZONE PRICES) =================
  function openSeatSelectorModal(boat) {
    const total = boat.totalSeats || 12;
    const booked = boat.bookedSeats || [];
    const perTop = boat.seatsLeft || 2; // seats on the top side
    const perBottom = boat.seatsRight || 2; // seats on the bottom side
    const perCol = perTop + perBottom;
    const cols = Math.ceil(total / perCol);
    const preSelected = selectedBoatSeats[boat._id] || [];

    // ---- PRICE TABLE (edit here, or override per boat with boat.prices) ----
    const P = Object.assign(
      {
        riverFront: 6500,
        riverBack: 6300,
        middleFront: 5900,
        middleBack: 5800,
      },
      boat.prices || {},
    );
    const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
    const zoneLabel = (name, front, back) =>
      front === back
        ? `${name} ${fmt(front)}`
        : `${name} ${fmt(front)} front · ${fmt(back)} back`;

    $("#seatModal").remove();

    let seatNo = 1;
    const makeSeat = (isRiver, isFront) => {
      if (seatNo > total) return '<span class="seat-gap"></span>';
      const id = `S${seatNo++}`;
      const price = isRiver
        ? isFront
          ? P.riverFront
          : P.riverBack
        : isFront
          ? P.middleFront
          : P.middleBack;
      const isBooked = booked.includes(id);
      const isSelected = preSelected.includes(id);
      let cls = "seat-btn " + (isRiver ? "river" : "middle");
      if (isBooked) cls += " booked";
      if (isSelected) cls += " selected";
      const zone = `${isRiver ? "River side" : "Middle"} · ${isFront ? "Front" : "Back"}`;
      return `<button type="button" class="${cls}" data-seat="${id}" data-price="${price}"
              title="${id} · ${zone} · ${fmt(price)}" ${isBooked ? "disabled" : ""}>
              <span class="seat-num">${id}</span>
              <span class="seat-price">₹${price}</span>
            </button>`;
    };

    // columns run back -> front (left -> right); second half of the columns = front
    const frontStart = Math.floor(cols / 2);
    let colsHtml = "";
    for (let c = 0; c < cols; c++) {
      const isFront = cols > 1 && c >= frontStart;
      let top = "",
        bottom = "";
      for (let i = 0; i < perTop; i++) top += makeSeat(i === 0, isFront);
      for (let i = 0; i < perBottom; i++)
        bottom += makeSeat(i === perBottom - 1, isFront);
      colsHtml += `<div class="boat-col">${top}<span class="boat-aisle"></span>${bottom}</div>`;
    }

    const modalMarkup = `
    <div class="seat-modal-overlay" id="seatModal">
      <div class="seat-modal-content">
        <span class="seat-modal-close" id="closeSeatModal">&times;</span>
        <h3 style="margin-bottom:4px;">Choose Your Seats</h3>
        <p style="font-size:.85rem;color:#666;margin-bottom:10px;">${boat.name}</p>

        <div class="boat-scroll">
          <div class="boat-hull" style="--top:${perTop}; --bottom:${perBottom};">
            <div class="boat-stern-label">BACK</div>
            <div class="boat-canopy-line"></div>

            <div class="boat-deck" id="seatGridContainer">
              ${colsHtml}
            </div>

            <div class="boat-captain">
              <span class="steer">☸</span>
              <small>Boatman</small>
            </div>
            <div class="boat-bow-label">FRONT ⚑</div>
          </div>
        </div>

        <div class="seat-legend">
          <span><i class="legend-box legend-river"></i> ${zoneLabel("River side", P.riverFront, P.riverBack)}</span>
          <span><i class="legend-box legend-available"></i> ${zoneLabel("Middle", P.middleFront, P.middleBack)}</span>
          <span><i class="legend-box legend-selected"></i> Selected</span>
          <span><i class="legend-box legend-booked"></i> Sold Out</span>
        </div>

        <p class="seat-summary">
          Seats (<strong id="seatCount">0</strong>): <span id="seatList">-</span><br>
          Total: <strong id="seatTotal" class="seat-total">₹0</strong>
        </p>

        <button type="button" class="btn-primary" id="confirmSeatsBtn" style="width:100%;">
          Confirm Seats &amp; Continue →
        </button>
      </div>
    </div>
  `;

    $("body").append(modalMarkup);

    const getChosen = () =>
      $("#seatGridContainer .seat-btn.selected")
        .map(function () {
          return $(this).data("seat");
        })
        .get();

    const getTotal = () => {
      let sum = 0;
      $("#seatGridContainer .seat-btn.selected").each(function () {
        sum += Number($(this).data("price"));
      });
      return sum;
    };

    const refreshSummary = () => {
      const chosen = getChosen();
      $("#seatCount").text(chosen.length);
      $("#seatList").text(chosen.length ? chosen.join(", ") : "-");
      $("#seatTotal").text(fmt(getTotal()));
    };
    refreshSummary();

    $("#seatGridContainer").on("click", ".seat-btn:not(.booked)", function () {
      $(this).toggleClass("selected");
      refreshSummary();
    });

    $("#closeSeatModal").on("click", () => $("#seatModal").remove());
    $("#seatModal").on("click", function (e) {
      if (e.target === this) $("#seatModal").remove();
    });
    $(document).one("keydown.seatModal", function (e) {
      if (e.key === "Escape") $("#seatModal").remove();
    });

    $("#confirmSeatsBtn").on("click", function () {
      const chosen = getChosen();
      if (!chosen.length) {
        alert("Please select at least one seat before continuing.");
        return;
      }
      const totalPrice = getTotal();
      selectedBoatSeats[boat._id] = chosen;
      $("#seatModal").remove();
      proceedWithSelection("boat", boat._id, boat.name, chosen, totalPrice);
    });
  }
  // ================= FORM DATES DYNAMIC TOGGLE =================
  function syncDateFields() {
    const selectedTypes = $("#svcTypeGroup input:checked")
      .map(function () {
        return this.value;
      })
      .get();

    const isOnlyBoat =
      selectedTypes.length === 1 && selectedTypes[0] === "boat";
    const hasRoom = selectedTypes.includes("room");

    if (isOnlyBoat) {
      // Hide both dates completely and make non-mandatory
      $("#checkInRow, #checkOutRow").hide();
      $("#checkIn, #checkOut").prop("required", false).val("");
    } else if (hasRoom) {
      // Room stay selected: both Check-in and Check-out are required
      $("#checkInRow, #checkOutRow").show();
      $("#checkInLabel").text("Check-in Date *");
      $("#checkOutLabel").text("Check-out Date *");
      $("#checkIn, #checkOut").prop("required", true);
    } else {
      // Cab or Tour only: Single travel date needed
      $("#checkInRow").show();
      $("#checkInLabel").text("Travel / Pickup Date *");
      $("#checkIn").prop("required", true);

      $("#checkOutRow").hide();
      $("#checkOut").prop("required", false).val("");
    }
  }

  // 1. Checkbox toggle event
  $(document).on("change", '#svcTypeGroup input[type="checkbox"]', function () {
    syncDateFields();
  });

  // 2. Remove tag event
  $(document).on("click", ".remove-tag", function () {
    setTimeout(syncDateFields, 50);
  });

  // 3. Card "Book Now" click event
  $(document).on("click", ".book-btn", function () {
    setTimeout(syncDateFields, 50);
  });

  // 4. Initial call on page ready
  syncDateFields();
  // ================= PROMO BANNER COMBO CLICK =================
  $(document).on("click", ".promo-btn-main", function (e) {
    e.preventDefault();

    const type = "tour";
    const comboName = "Sunrise Boat + Stay Combo (25% Off)";
    const comboId = "combo-sunrise-boat-stay";

    // Set selected item
    selectedItems[type] = { id: comboId, name: comboName };

    // Check the "Tour Package" checkbox
    $(`#svcTypeGroup input[value="${type}"]`).prop("checked", true);

    // Refresh tags and set notification
    renderSelectedItems();
    $("#formMsg").text(`Selected: ${comboName}`).css("color", "var(--primary)");

    // Optional: Pre-fill custom note in textarea if empty
    if (!$("#message").val()) {
      $("#message").val(
        "Hi, I want to book the Sunrise Ganga Boat Ride + Stay Combo offer.",
      );
    }

    // Smooth scroll down to the booking form
    if ($("#contact").length) {
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $("#contact").offset().top - 75,
          },
          500,
        );
    }
  });

  $(document).on("change", '#svcTypeGroup input[type="checkbox"]', function () {
    const type = $(this).val();
    if (!$(this).is(":checked")) delete selectedItems[type];
    renderSelectedItems();
  });

  function renderSelectedItems() {
    const $box = $("#selectedItemsBox").empty();
    Object.keys(selectedItems).forEach((type) => {
      const item = selectedItems[type];
      $box.append(`
        <span class="selected-tag" data-type="${type}">
          ${item.name} <span class="remove-tag" data-type="${type}">✕</span>
        </span>
      `);
    });
  }

  $(document).on("click", ".remove-tag", function () {
    const type = $(this).data("type");
    delete selectedItems[type];
    $(`#svcTypeGroup input[value="${type}"]`).prop("checked", false);
    renderSelectedItems();
    $("#formMsg").text("");
  });

  // ================= SUBMIT: WhatsApp instantly, save in background =================
  $("#bookingForm").on("submit", function (e) {
    e.preventDefault();

    const types = $("#svcTypeGroup input:checked")
      .map(function () {
        return this.value;
      })
      .get();
    if (!types.length) {
      $("#formMsg")
        .text("⚠️ Please select at least one: Room, Cab or Boat.")
        .css("color", "#c0392b");
      return;
    }

    const formData = {};
    $(this)
      .serializeArray()
      .forEach((f) => (formData[f.name] = f.value));
    if (!formData.name || !formData.phone) {
      $("#formMsg")
        .text("⚠️ Please fill your name and phone number.")
        .css("color", "#c0392b");
      return;
    }

    $("#formMsg").text("Submitting...").css("color", "#888");

    // Open WhatsApp immediately (must be synchronous or browsers block the popup)
    sendToWhatsApp(types, formData);

    const requests = types.map((type) => {
      const item = selectedItems[type] || {};
      return $.ajax({
        url: "/api/bookings",
        method: "POST",
        contentType: "application/json",
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
          message: formData.message,
        }),
      });
    });

    $.when
      .apply($, requests)
      .done(function () {
        $("#formMsg")
          .text("✅ Request saved and sent via WhatsApp!")
          .css("color", "green");
        $("#bookingForm")[0].reset();
        selectedItems = {};
        renderSelectedItems();
      })
      .fail(function (jqXHR) {
        console.error(
          "Booking save failed:",
          jqXHR.responseJSON || jqXHR.responseText,
        );
        $("#formMsg")
          .text(
            "⚠️ Sent via WhatsApp, but could not save to our system — please call us to confirm.",
          )
          .css("color", "#c0392b");
      });
  });

  function sendToWhatsApp(types, formData) {
    const lines = [
      `*New Booking Enquiry - The Kashi Kunj*`,
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      formData.email ? `Email: ${formData.email}` : null,
      `Services: ${types
        .map((t) => {
          const item = selectedItems[t];
          return item ? `${t} (${item.name})` : t;
        })
        .join(", ")}`,
      formData.checkIn ? `Check-in: ${formData.checkIn}` : null,
      formData.checkOut ? `Check-out: ${formData.checkOut}` : null,
      formData.guests ? `Guests: ${formData.guests}` : null,
      formData.message ? `Message: ${formData.message}` : null,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    WHATSAPP_NUMBERS.forEach((number) => {
      window.open(`https://wa.me/${number}?text=${text}`, "_blank");
    });
  }

  // ================= FAQ ACCORDION =================
  $(document).on("click", ".faq-q", function () {
    $(this)
      .closest(".faq-item")
      .toggleClass("open")
      .siblings(".faq-item")
      .removeClass("open");
  });

  // ================= BACK TO TOP =================
  $(window).on("scroll", function () {
    $("#backToTop").toggleClass("show", $(window).scrollTop() > 400);
  });
  $("#backToTop").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 400);
  });

  // ================= LOAD DYNAMIC REVIEWS =================
  if ($("#testimonialGrid").length) {
    // URL changed to /api/review to match server.js
    $.get("/api/review", function (reviews) {
      const $grid = $("#testimonialGrid").empty();

      if (!reviews.length) {
        return $grid.html(
          '<p class="no-data">No reviews yet. Be the first to leave one!</p>',
        );
      }

      reviews.forEach((review) => {
        // Generate solid stars based on the rating number
        const starIcons =
          "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

        $grid.append(`
          <div class="testimonial-card">
            <div class="stars">${starIcons}</div>
            <p>"${review.text}"</p>
            <div class="guest-author">
              <div class="guest-avatar">${review.initial}</div>
              <div>
                <strong>${review.guestName}</strong>
                <span>${review.location}</span>
              </div>
            </div>
          </div>
        `);
      });
    }).fail(() =>
      $("#testimonialGrid").html(
        '<p class="loading-error">Could not load guest experiences.</p>',
      ),
    );
  }

  // ================= LEAFLET NEIGHBORHOOD MAP =================
  if ($("#kashiMap").length) {
    // 1. Initialize map and coordinates
    const kashiKunjCoords = [25.28845019067022, 83.00495935321072];
    const assiCoords = [25.2881, 83.0071]; // Assi Ghat Coordinates

    const map = L.map("kashiMap", { scrollWheelZoom: false }).setView(
      kashiKunjCoords,
      17,
    );

    // 2. Load 100% Free OpenStreetMap tiles
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // 3. Custom Glowing Orange Marker for The Kashi Kunj
    const kkIcon = L.divIcon({
      className: "custom-div-icon",
      html: '<div class="kk-marker"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // NOTE: { autoClose: false, closeOnClick: false } keeps the popup permanently open
    L.marker(kashiKunjCoords, { icon: kkIcon })
      .addTo(map)
      .bindPopup(
        `
        <div style="min-width: 210px; line-height: 1.6;">
          <b style="font-size: 1.1rem; color: #d97b06;">The Kashi Kunj</b><br>
          <span style="font-size: 0.9rem; color: #444;">
            📍 <b>Main Road Property</b> (Easy transport)<br>
            🚶‍♂️ <b>Assi Ghat:</b> 30 meters (&lt; 1 min walk)<br>
          </span>
        </div>
      `,
        { autoClose: false, closeOnClick: false },
      )
      .openPopup();

    // 4. Custom Glowing Blue Marker for Assi Ghat
    const assiIcon = L.divIcon({
      className: "custom-div-icon",
      html: '<div class="assi-marker"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    L.marker(assiCoords, { icon: assiIcon })
      .addTo(map)
      .bindPopup(
        `<b style="color: #3b82f6; font-size: 1.05rem;">Assi Ghat</b>`,
        { autoClose: false, closeOnClick: false },
      )
      .openPopup(); // Opens simultaneously with The Kashi Kunj

    // 5. Other Landmarks (Blue for Temples, Red for Food)
    const landmarks = [
      {
        coords: [25.2878, 83.0073],
        name: "Pizzeria Vaatika Cafe",
        color: "#ef4444",
      },
      {
        coords: [25.3108, 83.0107],
        name: "Kashi Vishwanath Temple",
        color: "#3b82f6",
      },
      {
        coords: [25.2905, 83.006],
        name: "Tulsi Manas Temple",
        color: "#3b82f6",
      },
    ];

    landmarks.forEach((lm) => {
      const markerHtml = `<div style="background-color: ${lm.color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`;
      const icon = L.divIcon({
        className: "",
        html: markerHtml,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker(lm.coords, { icon: icon })
        .addTo(map)
        .bindPopup(`<b>${lm.name}</b>`);
    });

    // 6. Draw Walking Route to Assi Ghat (Tracing the road)
    const walkingRoute = [
      kashiKunjCoords, // Start: The Kashi Kunj
      [25.2884, 83.0056], // Waypoint 1: First bend on the street
      [25.28825, 83.0064], // Waypoint 2: Following Assi Ghat Road
      assiCoords, // Destination: Assi Ghat
    ];

    L.polyline(walkingRoute, {
      color: "#d97b06",
      weight: 4,
      opacity: 0.8,
      dashArray: "8, 8",
      lineJoin: "round",
    }).addTo(map);
  }
});
