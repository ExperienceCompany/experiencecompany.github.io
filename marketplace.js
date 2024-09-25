document.addEventListener('DOMContentLoaded', function() {
    // Mock data
    const categories = [
        { id: 1, name: 'Photography', subcategories: ['Portrait', 'Landscape', 'Event'] },
        { id: 2, name: 'Video', subcategories: ['Wedding', 'Commercial', 'Music Video'] },
    ];

    const providers = [
        { id: 1, name: 'John Doe Photography', category: 'Photography' },
        { id: 2, name: 'Jane Smith Videography', category: 'Video' },
    ];

    const packages = [
        { id: 1, providerId: 1, name: 'Basic Portrait Session', price: 100, description: 'A 1-hour portrait session with 5 edited digital images.' },
        { id: 2, providerId: 1, name: 'Deluxe Portrait Package', price: 250, description: 'A 2-hour portrait session with 15 edited digital images and 5 printed photos.' },
        { id: 3, providerId: 2, name: 'Wedding Video Package', price: 1000, description: 'Full day wedding video coverage with a 5-minute highlight reel and full ceremony video.' },
    ];

    let selectedCategory = null;
    let selectedSubcategory = null;
    let selectedProvider = null;
    let selectedPackages = [];

    // Populate categories
    const categoriesContainer = document.getElementById('categories');
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.onclick = () => selectCategory(category);
        categoriesContainer.appendChild(button);

        const subcategoriesDiv = document.createElement('div');
        subcategoriesDiv.className = 'subcategories';
        subcategoriesDiv.style.display = 'none';
        category.subcategories.forEach(subcategory => {
            const subButton = document.createElement('button');
            subButton.textContent = subcategory;
            subButton.className = 'subcategory';
            subButton.onclick = () => selectSubcategory(subcategory);
            subcategoriesDiv.appendChild(subButton);
        });
        categoriesContainer.appendChild(subcategoriesDiv);
    });

    function selectCategory(category) {
        selectedCategory = category;
        selectedSubcategory = null;
        selectedProvider = null;
        document.querySelectorAll('.subcategories').forEach(el => el.style.display = 'none');
        const subcategoriesDiv = categoriesContainer.querySelector(`button:nth-of-type(${category.id})`).nextElementSibling;
        subcategoriesDiv.style.display = 'block';
        updateProviders();
        updatePackages();
    }

    function selectSubcategory(subcategory) {
        selectedSubcategory = subcategory;
        updateProviders();
        updatePackages();
    }

    function updateProviders() {
        const providersContainer = document.getElementById('providers');
        providersContainer.innerHTML = '<h2>Service Providers</h2>';
        providers.filter(p => p.category === selectedCategory?.name).forEach(provider => {
            const button = document.createElement('button');
            button.textContent = provider.name;
            button.onclick = () => selectProvider(provider);
            providersContainer.appendChild(button);
        });
    }

    function selectProvider(provider) {
        selectedProvider = provider;
        updatePackages();
    }

    function updatePackages() {
        const packagesContainer = document.getElementById('packages');
        packagesContainer.innerHTML = '<h2>Service Packages</h2>';
        packages.filter(p => p.providerId === selectedProvider?.id).forEach(pkg => {
            const div = document.createElement('div');
            div.className = 'package';
            div.innerHTML = `
                <h3>${pkg.name}</h3>
                <p>$${pkg.price}</p>
                <button onclick="addPackage(${pkg.id})">Add to Form</button>
                <button onclick="showPackageDetails(${pkg.id})">View Details</button>
            `;
            packagesContainer.appendChild(div);
        });
    }

    window.addPackage = function(packageId) {
        const pkg = packages.find(p => p.id === packageId);
        if (pkg && !selectedPackages.some(p => p.id === pkg.id)) {
            selectedPackages.push(pkg);
            updateSelectedPackages();
        }
    }

    window.removePackage = function(packageId) {
        selectedPackages = selectedPackages.filter(p => p.id !== packageId);
        updateSelectedPackages();
    }

    function updateSelectedPackages() {
        const selectedPackagesContainer = document.getElementById('selectedPackages');
        selectedPackagesContainer.innerHTML = '<h3>Selected Packages</h3>';
        let total = 0;
        selectedPackages.forEach(pkg => {
            const div = document.createElement('div');
            div.innerHTML = `
                ${pkg.name} - $${pkg.price}
                <button onclick="removePackage(${pkg.id})">Remove</button>
            `;
            selectedPackagesContainer.appendChild(div);
            total += pkg.price;
        });
        const totalDiv = document.createElement('div');
        totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
        selectedPackagesContainer.appendChild(totalDiv);
    }

    window.showPackageDetails = function(packageId) {
        const pkg = packages.find(p => p.id === packageId);
        if (pkg) {
            document.getElementById('popupTitle').textContent = pkg.name;
            document.getElementById('popupDescription').textContent = pkg.description;
            document.getElementById('packagePopup').style.display = 'flex';
        }
    }

    window.closePopup = function() {
        document.getElementById('packagePopup').style.display = 'none';
    }

    document.getElementById('inquiryForm').onsubmit = function(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            details: document.getElementById('details').value,
            packages: selectedPackages
        };
        console.log('Form submitted:', formData);
        // Here you would typically send this data to your backend
        alert('Inquiry submitted!');
    };
});