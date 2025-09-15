// Portfolio Pagination Script
document.addEventListener('DOMContentLoaded', function() {
    const portfolioContainer = document.querySelector('.portfolio-items');
    const portfolioItems = document.querySelectorAll('.portfolio-items .media-cell');
    const itemsPerPage = 6; // Show 6 items per page
    let currentPage = 1;
    let filteredItems = Array.from(portfolioItems);
    
    // Create pagination controls
    function createPaginationControls() {
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'portfolio-pagination';
        paginationContainer.innerHTML = `
            <button id="prev-page" class="pagination-btn" disabled>Previous</button>
            <span id="page-info" class="page-info">Page 1 of 1</span>
            <button id="next-page" class="pagination-btn">Next</button>
        `;
        
        portfolioContainer.parentNode.insertBefore(paginationContainer, portfolioContainer.nextSibling);
        
        // Add event listeners
        document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
        document.getElementById('next-page').addEventListener('click', () => changePage(1));
    }
    
    // Show items for current page
    function showPage(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Hide all items first
        portfolioItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // Show items for current page
        filteredItems.slice(startIndex, endIndex).forEach(item => {
            item.style.display = 'block';
        });
        
        // Update pagination info
        updatePaginationInfo();
        
        // Reinitialize isotope layout if available
        if (typeof $.fn.isotope === 'function') {
            $(portfolioContainer).isotope('layout');
        }
    }
    
    // Update pagination information
    function updatePaginationInfo() {
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        const pageInfo = document.getElementById('page-info');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        }
    }
    
    // Change page
    function changePage(direction) {
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        const newPage = currentPage + direction;
        
        if (newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            showPage(currentPage);
            
            // Smooth scroll to top of portfolio
            portfolioContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Filter functionality integration
    function initializeFilters() {
        const filterButtons = document.querySelectorAll('#filters a');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active filter
                document.querySelectorAll('#filters li').forEach(li => {
                    li.classList.remove('current');
                });
                this.parentNode.classList.add('current');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter items
                if (filterValue === '*') {
                    filteredItems = Array.from(portfolioItems);
                } else {
                    filteredItems = Array.from(portfolioItems).filter(item => {
                        return item.classList.contains(filterValue.substring(1));
                    });
                }
                
                // Reset to first page and show
                currentPage = 1;
                showPage(currentPage);
                
                // Update isotope if available
                if (typeof $.fn.isotope === 'function') {
                    $(portfolioContainer).isotope({ filter: filterValue });
                }
            });
        });
    }
    
    // Lazy loading for images
    function initializeLazyLoading() {
        const images = document.querySelectorAll('.portfolio-items img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Initialize pagination
    function init() {
        if (portfolioItems.length > 0) {
            createPaginationControls();
            showPage(1);
            initializeFilters();
            initializeLazyLoading();
        }
    }
    
    // Start the pagination
    init();
    
    // Expose functions to global scope for external access
    window.portfolioPagination = {
        refresh: function() {
            currentPage = 1;
            filteredItems = Array.from(portfolioItems);
            showPage(currentPage);
        },
        goToPage: function(page) {
            const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                showPage(currentPage);
            }
        }
    };
});
