/**
 * Module Gợi Ý Địa Chỉ Tự Động Thông Minh (Address Autocomplete)
 * Hỗ trợ bản đồ Google Maps / OpenStreetMap Geocoding + CSDL Địa chỉ Việt Nam
 * Đồ án: PTTKHDT - GEARS Keycap Shop (ĐH Sài Gòn SGU)
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.AddressAutocomplete = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    // Danh bạ địa chỉ phổ biến tại Việt Nam (TP.HCM, Hà Nội, Đà Nẵng, Bình Dương, Cần Thơ)
    const VIETNAM_STREETS = [
        { street: "Đường 3 Tháng 2", ward: "Phường 14", district: "Quận 10", city: "TP. Hồ Chí Minh" },
        { street: "An Dương Vương", ward: "Phường 3", district: "Quận 5", city: "TP. Hồ Chí Minh" },
        { street: "Cách Mạng Tháng Tám", ward: "Phường 11", district: "Quận 3", city: "TP. Hồ Chí Minh" },
        { street: "Quốc Lộ 13", ward: "Phường Hiệp Bình Phước", district: "TP. Thủ Đức", city: "TP. Hồ Chí Minh" },
        { street: "Nguyễn Văn Cừ", ward: "Phường 4", district: "Quận 5", city: "TP. Hồ Chí Minh" },
        { street: "Nguyễn Trãi", ward: "Phường 7", district: "Quận 5", city: "TP. Hồ Chí Minh" },
        { street: "Điện Biên Phủ", ward: "Phường 25", district: "Quận Bình Thạnh", city: "TP. Hồ Chí Minh" },
        { street: "Huỳnh Tấn Phát", ward: "Phường Tân Phú", district: "Quận 7", city: "TP. Hồ Chí Minh" },
        { street: "Hoàng Hoa Thám", ward: "Phường 13", district: "Quận Tân Bình", city: "TP. Hồ Chí Minh" },
        { street: "Quang Trung", ward: "Phường 10", district: "Quận Gò Vấp", city: "TP. Hồ Chí Minh" },
        { street: "Phạm Văn Đồng", ward: "Phường 1", district: "Quận Gò Vấp", city: "TP. Hồ Chí Minh" },
        { street: "Xô Viết Nghệ Tĩnh", ward: "Phường 21", district: "Quận Bình Thạnh", city: "TP. Hồ Chí Minh" },
        { street: "Võ Văn Ngân", ward: "Phường Linh Chiểu", district: "TP. Thủ Đức", city: "TP. Hồ Chí Minh" },
        { street: "Lê Văn Việt", ward: "Phường Tăng Nhơn Phú A", district: "TP. Thủ Đức", city: "TP. Hồ Chí Minh" },
        { street: "Trần Hưng Đạo", ward: "Phường Cầu Kho", district: "Quận 1", city: "TP. Hồ Chí Minh" },
        { street: "Lý Thường Kiệt", ward: "Phường 7", district: "Quận Tân Bình", city: "TP. Hồ Chí Minh" },
        { street: "Cộng Hòa", ward: "Phường 12", district: "Quận Tân Bình", city: "TP. Hồ Chí Minh" },
        { street: "Bà Huyện Thanh Quan", ward: "Phường Võ Thị Sáu", district: "Quận 3", city: "TP. Hồ Chí Minh" },
        { street: "Nguyễn Thị Minh Khai", ward: "Phường Bến Thành", district: "Quận 1", city: "TP. Hồ Chí Minh" },
        { street: "Lê Duẩn", ward: "Phường Bến Nghé", district: "Quận 1", city: "TP. Hồ Chí Minh" },
        { street: "Nam Kỳ Khởi Nghĩa", ward: "Phường 7", district: "Quận 3", city: "TP. Hồ Chí Minh" },
        { street: "Hải Thượng Lãn Ông", ward: "Phường 10", district: "Quận 5", city: "TP. Hồ Chí Minh" },
        { street: "Nguyễn Oanh", ward: "Phường 17", district: "Quận Gò Vấp", city: "TP. Hồ Chí Minh" },
        { street: "Phan Văn Trị", ward: "Phường 7", district: "Quận Gò Vấp", city: "TP. Hồ Chí Minh" },
        { street: "Tô Hiến Thành", ward: "Phường 13", district: "Quận 10", city: "TP. Hồ Chí Minh" },
        { street: "Sư Vạn Hạnh", ward: "Phường 12", district: "Quận 10", city: "TP. Hồ Chí Minh" },
        { street: "Hùng Vương", ward: "Phường 9", district: "Quận 5", city: "TP. Hồ Chí Minh" },
        { street: "Nguyễn Chí Thanh", ward: "Phường 9", district: "Quận 5", city: "TP. Hồ Chí Minh" },
        { street: "Trần Não", ward: "Phường An Khánh", district: "TP. Thủ Đức", city: "TP. Hồ Chí Minh" },
        { street: "Nguyễn Hữu Thọ", ward: "Phường Tân Phong", district: "Quận 7", city: "TP. Hồ Chí Minh" },
        { street: "Nguyễn Trãi", ward: "Phường Thanh Xuân Bắc", district: "Quận Thanh Xuân", city: "Hà Nội" },
        { street: "Cầu Giấy", ward: "Phường Quan Hoa", district: "Quận Cầu Giấy", city: "Hà Nội" },
        { street: "Hoàng Mai", ward: "Phường Giáp Bát", district: "Quận Hoàng Mai", city: "Hà Nội" },
        { street: "Nguyễn Văn Linh", ward: "Phường Nam Dương", district: "Quận Hải Châu", city: "Đà Nẵng" }
    ];

    function removeAccents(str) {
        if (!str) return '';
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .toLowerCase();
    }

    class AddressAutocomplete {
        constructor(inputElement, options = {}) {
            this.input = typeof inputElement === 'string' ? document.getElementById(inputElement) : inputElement;
            if (!this.input) return;

            this.options = Object.assign({
                isDarkMode: false,
                onSelect: null,
                maxSuggestions: 6
            }, options);

            this.debounceTimer = null;
            this.activeItemIndex = -1;
            this.currentSuggestions = [];

            this.initUI();
            this.bindEvents();
        }

        initUI() {
            // Đảm bảo cha có position: relative
            const parent = this.input.parentElement;
            if (parent && getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }

            // Tạo dropdown
            this.dropdown = document.createElement('div');
            this.dropdown.className = `address-suggestions-dropdown ${this.options.isDarkMode ? 'dark-mode' : ''}`;
            this.dropdown.style.display = 'none';

            if (parent) {
                parent.appendChild(this.dropdown);
            } else {
                document.body.appendChild(this.dropdown);
            }
        }

        bindEvents() {
            this.input.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    this.fetchSuggestions(query);
                }, 220);
            });

            this.input.addEventListener('keydown', (e) => {
                if (this.dropdown.style.display === 'none' || this.currentSuggestions.length === 0) return;

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.setActiveItem(this.activeItemIndex + 1);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.setActiveItem(this.activeItemIndex - 1);
                } else if (e.key === 'Enter') {
                    if (this.activeItemIndex >= 0 && this.activeItemIndex < this.currentSuggestions.length) {
                        e.preventDefault();
                        this.selectSuggestion(this.currentSuggestions[this.activeItemIndex]);
                    }
                } else if (e.key === 'Escape') {
                    this.hideDropdown();
                }
            });

            // Tự đóng khi click ra ngoài
            document.addEventListener('click', (e) => {
                if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
                    this.hideDropdown();
                }
            });

            // Đóng khi người dùng focus sang trường khác
            this.input.addEventListener('blur', () => {
                setTimeout(() => this.hideDropdown(), 250);
            });
        }

        setActiveItem(idx) {
            const items = this.dropdown.querySelectorAll('.address-suggestion-item');
            if (items.length === 0) return;

            if (idx >= items.length) idx = 0;
            if (idx < 0) idx = items.length - 1;

            this.activeItemIndex = idx;
            items.forEach((item, i) => {
                item.classList.toggle('active', i === idx);
            });

            // Scroll vào tầm nhìn
            if (items[idx]) {
                items[idx].scrollIntoView({ block: 'nearest' });
            }
        }

        async fetchSuggestions(rawQuery) {
            if (!rawQuery || rawQuery.length < 2) {
                this.hideDropdown();
                return;
            }

            // Tách số nhà nếu có dạng số/hẻm (VD: "606/107", "273", "12/4A")
            const numMatch = rawQuery.match(/^([0-9]+(?:\/[0-9A-Za-z]+)*)\s*(.*)$/);
            const houseNumber = numMatch ? numMatch[1] : '';
            const remainingQuery = numMatch ? numMatch[2].trim() : rawQuery;

            const results = [];
            const cleanQuery = removeAccents(remainingQuery);

            // 1. Tìm kiếm trong CSDL Địa Chỉ Việt Nam có sẵn (tức thời < 10ms)
            if (cleanQuery.length > 0) {
                for (const item of VIETNAM_STREETS) {
                    const fullText = `${item.street} ${item.ward} ${item.district} ${item.city}`;
                    if (removeAccents(fullText).includes(cleanQuery)) {
                        const fullAddr = `${houseNumber ? houseNumber + ' ' : ''}${item.street}, ${item.ward}, ${item.district}, ${item.city}`;
                        results.push({
                            mainText: `${houseNumber ? houseNumber + ' ' : ''}${item.street}`,
                            subText: `${item.ward}, ${item.district}, ${item.city}`,
                            fullAddress: fullAddr,
                            source: 'Bản đồ VN'
                        });
                    }
                    if (results.length >= this.options.maxSuggestions) break;
                }
            } else if (houseNumber) {
                // Nếu người dùng chỉ mới nhập số nhà/hẻm (VD: "606/107")
                // Gợi ý ngay các tuyến đường trọng điểm kèm số nhà đó!
                for (const item of VIETNAM_STREETS.slice(0, 5)) {
                    const fullAddr = `${houseNumber} ${item.street}, ${item.ward}, ${item.district}, ${item.city}`;
                    results.push({
                        mainText: `${houseNumber} ${item.street}`,
                        subText: `${item.ward}, ${item.district}, ${item.city}`,
                        fullAddress: fullAddr,
                        source: 'Gợi ý số nhà'
                    });
                }
            }

            // 2. Gọi API Geocoding Trực Tuyến (Photon / OpenStreetMap) bổ trợ
            if (remainingQuery.length >= 3 && results.length < this.options.maxSuggestions) {
                try {
                    const apiUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(rawQuery + ' Vietnam')}&limit=4&lang=en`;
                    const res = await fetch(apiUrl);
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.features) {
                            for (const f of data.features) {
                                const props = f.properties || {};
                                const name = props.name || '';
                                const district = props.district || props.county || '';
                                const city = props.city || props.state || '';
                                if (name) {
                                    const fullAddr = [houseNumber ? `${houseNumber} ${name}` : name, district, city, 'Việt Nam'].filter(Boolean).join(', ');
                                    // Tránh trùng
                                    if (!results.some(r => r.fullAddress.toLowerCase() === fullAddr.toLowerCase())) {
                                        results.push({
                                            mainText: houseNumber ? `${houseNumber} ${name}` : name,
                                            subText: [district, city].filter(Boolean).join(', ') || 'Việt Nam',
                                            fullAddress: fullAddr,
                                            source: 'Bản đồ trực tuyến'
                                        });
                                    }
                                }
                            }
                        }
                    }
                } catch (err) {
                    // Bỏ qua nếu ngoại tuyến, đã có dữ liệu dự phòng
                }
            }

            this.currentSuggestions = results.slice(0, this.options.maxSuggestions);
            this.renderDropdown(rawQuery);
        }

        renderDropdown(query) {
            if (this.currentSuggestions.length === 0) {
                this.hideDropdown();
                return;
            }

            this.activeItemIndex = -1;
            let html = `
                <div class="address-suggestion-header">
                    <span><i class="fas fa-map-location-dot"></i> GỢI Ý ĐỊA CHỈ BẢN ĐỒ</span>
                    <span style="font-size: 10px; font-weight: 600; opacity: 0.85;">Chọn để điền tự động</span>
                </div>
            `;

            this.currentSuggestions.forEach((item, index) => {
                html += `
                    <div class="address-suggestion-item" data-index="${index}">
                        <div class="pin-icon">
                            <i class="fas fa-map-pin"></i>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div class="addr-main">${this.escapeHtml(item.mainText)}</div>
                            <div class="addr-sub">${this.escapeHtml(item.subText)}</div>
                        </div>
                        <span style="font-size: 10px; color: #94a3b8; border: 1px solid #cbd5e1; border-radius: 4px; padding: 1px 5px; white-space: nowrap;">
                            ${item.source}
                        </span>
                    </div>
                `;
            });

            this.dropdown.innerHTML = html;
            this.dropdown.style.display = 'block';

            // Gắn click cho các mục gợi ý
            const items = this.dropdown.querySelectorAll('.address-suggestion-item');
            items.forEach((elem) => {
                elem.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    const idx = parseInt(elem.getAttribute('data-index'));
                    if (this.currentSuggestions[idx]) {
                        this.selectSuggestion(this.currentSuggestions[idx]);
                    }
                });
            });
        }

        selectSuggestion(item) {
            this.input.value = item.fullAddress;
            this.hideDropdown();

            // Kích hoạt sự kiện input để gỡ báo đỏ validation
            this.input.dispatchEvent(new Event('input', { bubbles: true }));
            this.input.dispatchEvent(new Event('change', { bubbles: true }));

            // Gỡ viền đỏ nếu đang báo lỗi
            this.input.style.borderColor = '#cbd5e1';
            this.input.style.backgroundColor = '#ffffff';

            if (typeof this.options.onSelect === 'function') {
                this.options.onSelect(item);
            }
        }

        hideDropdown() {
            if (this.dropdown) {
                this.dropdown.style.display = 'none';
                this.activeItemIndex = -1;
            }
        }

        escapeHtml(text) {
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
    }

    // Tự động khởi tạo nếu tìm thấy input trên trang
    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', function () {
            const clientAddrInput = document.getElementById('order-cust-address');
            if (clientAddrInput) {
                new AddressAutocomplete(clientAddrInput, { isDarkMode: false });
            }

            const posAddrInput = document.getElementById('pos-new-cust-address');
            if (posAddrInput) {
                new AddressAutocomplete(posAddrInput, { isDarkMode: true });
            }
        });
    }

    return AddressAutocomplete;
}));
