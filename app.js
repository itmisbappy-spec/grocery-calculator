// Language Configuration
const lang = {
    bn: {
        appName: 'গ্রোসারি ক্যালকুলেটর',
        dashboard: 'ড্যাশবোর্ড',
        newProduct: 'নতুন পণ্য যোগ করুন',
        sales: 'পণ্য বিক্রয়',
        reports: 'রিপোর্ট দেখুন',
        productName: 'পণ্যের নাম',
        barcode: 'বারকোড',
        purchasePrice: 'ক্রয় মূল্য',
        sellingPrice: 'বিক্রয় মূল্য',
        quantity: 'পরিমাণ',
        unit: 'ইউনিট',
        invoiceNo: 'চালান নাম্বার',
        save: 'সংরক্ষণ',
        cancel: 'বাতিল',
        delete: 'ডিলিট',
        viewList: 'লিস্ট দেখুন',
        print: 'প্রিন্ট',
        skip: 'এড়িয়ে যান',
        addMore: 'আরো যোগ করুন',
        runningList: 'চলমান তালিকা',
        noItems: 'কোনো আইটেম নেই',
        lastPrice: 'সর্বশেষ ক্রয় মূল্য',
        stock: 'স্টক',
        successMsg: 'সফলভাবে সংরক্ষিত হয়েছে',
        errorMsg: 'কোনো ত্রুটি ঘটেছে',
        openingStock: 'অপেনিং স্টক',
        lowStock: 'কম স্টক',
        totalPurchase: 'মোট ক্রয়',
        totalSales: 'মোট বিক্রয়',
        daily: 'দৈনিক',
        monthly: 'মাসিক',
        profit: 'লাভ',
        loss: 'ক্ষতি',
        date: 'তারিখ',
        invoiceNumber: 'চালান নাম্বার',
        selectProduct: 'পণ্য নির্বাচন করুন',
        optional: 'ঐচ্ছিক',
        locked: 'লক করা',
    },
    en: {
        appName: 'Grocery Calculator',
        dashboard: 'Dashboard',
        newProduct: 'Add New Product',
        sales: 'Product Sales',
        reports: 'View Reports',
        productName: 'Product Name',
        barcode: 'Barcode',
        purchasePrice: 'Purchase Price',
        sellingPrice: 'Selling Price',
        quantity: 'Quantity',
        unit: 'Unit',
        invoiceNo: 'Invoice No',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        viewList: 'View List',
        print: 'Print',
        skip: 'Skip',
        addMore: 'Add More',
        runningList: 'Running List',
        noItems: 'No items',
        lastPrice: 'Last Purchase Price',
        stock: 'Stock',
        successMsg: 'Saved successfully',
        errorMsg: 'An error occurred',
        openingStock: 'Opening Stock',
        lowStock: 'Low Stock',
        totalPurchase: 'Total Purchase',
        totalSales: 'Total Sales',
        daily: 'Daily',
        monthly: 'Monthly',
        profit: 'Profit',
        loss: 'Loss',
        date: 'Date',
        invoiceNumber: 'Invoice Number',
        selectProduct: 'Select Product',
        optional: 'Optional',
        locked: 'Locked',
    }
};

const units = ['কেজি/kg', 'লিটার/Liter', 'পিস/Piece', 'ব্যাগ/Bag', 'বোতল/Bottle', 'প্যাকেট/Packet'];

let currentLang = localStorage.getItem('language') || 'bn';
let currentPage = 'dashboard';
let runningItems = [];

// Database functions
function getDB() {
    return JSON.parse(localStorage.getItem('groceryDB')) || {
        products: [],
        purchases: [],
        sales: []
    };
}

function saveDB(db) {
    localStorage.setItem('groceryDB', JSON.stringify(db));
}

function t(key) {
    return lang[currentLang][key] || key;
}

function toggleLanguage() {
    currentLang = currentLang === 'bn' ? 'en' : 'bn';
    localStorage.setItem('language', currentLang);
    render();
}

function render() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="header">
                <h1>${t('appName')}</h1>
                <button class="lang-toggle" onclick="toggleLanguage()">
                    ${currentLang === 'bn' ? 'English' : 'বাংলা'}
                </button>
            </div>
            <div class="content" id="mainContent">
                ${renderPage()}
            </div>
        </div>
    `;
}

function renderPage() {
    switch (currentPage) {
        case 'dashboard':
            return renderDashboard();
        case 'newProduct':
            return renderNewProduct();
        case 'sales':
            return renderSales();
        case 'reports':
            return renderReports();
        default:
            return renderDashboard();
    }
}

function renderDashboard() {
    return `
        <div class="dashboard">
            <h2 class="dashboard-title">${t('dashboard')}</h2>
            <div class="dashboard-buttons">
                <button class="btn btn-primary" onclick="goToPage('newProduct')">
                    ➕ ${t('newProduct')}
                </button>
                <button class="btn btn-success" onclick="goToPage('sales')">
                    💰 ${t('sales')}
                </button>
                <button class="btn btn-warning" onclick="goToPage('reports')">
                    📊 ${t('reports')}
                </button>
            </div>
        </div>
    `;
}

function renderNewProduct() {
    const db = getDB();
    const lastInvoice = db.purchases.length > 0 ? db.purchases[db.purchases.length - 1].invoiceNo : '';
    const lastProduct = db.products.length > 0 ? db.products[db.products.length - 1] : null;

    return `
        <button class="btn btn-back" onclick="goToPage('dashboard')">← ${t('dashboard')}</button>
        
        <h2>${t('newProduct')}</h2>
        
        <div class="running-list" id="runningListContainer">
            <h3>${t('runningList')}</h3>
            <div id="runningListContent">${renderRunningList()}</div>
        </div>

        <form onsubmit="addProductToList(event)">
            <div class="form-group">
                <label>${t('productName')}</label>
                <input type="text" id="productName" placeholder="${t('productName')}" autocomplete="off">
                <div class="suggestions" id="productSuggestions"></div>
            </div>

            <div class="form-group">
                <label>${t('barcode')}</label>
                <input type="text" id="barcode" placeholder="${t('barcode')}">
            </div>

            <div class="form-group">
                <label>${t('purchasePrice')}</label>
                <input type="number" id="purchasePrice" placeholder="0.00" step="0.01">
                <small id="lastPriceHint" style="color: #999; margin-top: 5px; display: block;"></small>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>${t('quantity')}</label>
                    <input type="number" id="quantity" placeholder="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>${t('unit')}</label>
                    <select id="unit" required>
                        ${units.map(u => `<option value="${u}">${u}</option>`).join('')}
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>${t('invoiceNo')} <small>(${t('optional')})</small></label>
                <input type="text" id="invoiceNo" placeholder="INV-001" value="${lastInvoice}">
            </div>

            <div class="button-row">
                <button type="submit" class="btn btn-success" style="flex: 1;">
                    ➕ ${t('addMore')}
                </button>
                <button type="button" class="btn btn-primary" onclick="savePurchases()" style="flex: 1;">
                    💾 ${t('save')}
                </button>
                <button type="button" class="btn btn-secondary" onclick="resetPurchaseForm()" style="flex: 1;">
                    🔄 ${t('cancel')}
                </button>
            </div>

            <div class="button-row">
                <button type="button" class="btn btn-info" onclick="showPurchaseList()" style="flex: 1;">
                    📋 ${t('viewList')}
                </button>
                <button type="button" class="btn btn-warning" onclick="printPurchases()" style="flex: 1;">
                    🖨️ ${t('print')}
                </button>
                <button type="button" class="btn btn-secondary" onclick="goToPage('dashboard')" style="flex: 1;">
                    ⏭️ ${t('skip')}
                </button>
            </div>
        </form>
    `;
}

function renderSales() {
    const db = getDB();
    const lastInvoice = db.sales.length > 0 ? db.sales[db.sales.length - 1].invoiceNo : '';

    return `
        <button class="btn btn-back" onclick="goToPage('dashboard')">← ${t('dashboard')}</button>
        
        <h2>${t('sales')}</h2>
        
        <div class="running-list" id="runningListContainer">
            <h3>${t('runningList')}</h3>
            <div id="runningListContent">${renderSalesRunningList()}</div>
        </div>

        <form onsubmit="addSaleToList(event)">
            <div class="form-group">
                <label>${t('productName')}</label>
                <input type="text" id="saleProductName" placeholder="${t('productName')}" autocomplete="off">
                <div class="suggestions" id="saleSuggestions"></div>
            </div>

            <div class="form-group">
                <label>${t('barcode')} <small>(${t('optional')})</small></label>
                <input type="text" id="saleBarcode" placeholder="${t('barcode')}">
            </div>

            <div class="form-group">
                <label>${t('lastPrice')} (${t('locked')})</label>
                <input type="number" id="lastPurchasePrice" disabled placeholder="0.00">
            </div>

            <div class="form-group">
                <label>${t('sellingPrice')}</label>
                <input type="number" id="sellingPrice" placeholder="0.00" step="0.01" required>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>${t('quantity')}</label>
                    <input type="number" id="saleQuantity" placeholder="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>${t('unit')}</label>
                    <input type="text" id="saleUnit" disabled placeholder="${t('unit')}">
                </div>
            </div>

            <div class="button-row">
                <button type="submit" class="btn btn-success" style="flex: 1;">
                    ➕ ${t('addMore')}
                </button>
                <button type="button" class="btn btn-primary" onclick="saveSales()" style="flex: 1;">
                    💾 ${t('save')}
                </button>
                <button type="button" class="btn btn-secondary" onclick="resetSalesForm()" style="flex: 1;">
                    🔄 ${t('cancel')}
                </button>
            </div>

            <div class="button-row">
                <button type="button" class="btn btn-info" onclick="showSalesList()" style="flex: 1;">
                    📋 ${t('viewList')}
                </button>
                <button type="button" class="btn btn-warning" onclick="printSales()" style="flex: 1;">
                    🖨️ ${t('print')}
                </button>
                <button type="button" class="btn btn-secondary" onclick="goToPage('dashboard')" style="flex: 1;">
                    ⏭️ ${t('skip')}
                </button>
            </div>
        </form>
    `;
}

function renderReports() {
    const db = getDB();
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = today.substring(0, 7);

    // Calculate opening stock
    let openingStock = {};
    db.products.forEach(product => {
        openingStock[product.id] = { name: product.name, stock: product.stock, unit: product.unit };
    });

    // Low stock items
    const lowStockItems = db.products.filter(p => p.stock < 10);

    // Daily stats
    const dailyPurchases = db.purchases.filter(p => p.date === today);
    const dailySales = db.sales.filter(s => s.date === today);
    const dailyPurchaseTotal = dailyPurchases.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);
    const dailySalesTotal = dailySales.reduce((sum, s) => sum + (s.quantity * s.sellingPrice), 0);
    const dailyProfit = dailySalesTotal - dailyPurchaseTotal;

    // Monthly stats
    const monthlyPurchases = db.purchases.filter(p => p.date.substring(0, 7) === thisMonth);
    const monthlySales = db.sales.filter(s => s.date.substring(0, 7) === thisMonth);
    const monthlyPurchaseTotal = monthlyPurchases.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);
    const monthlySalesTotal = monthlySales.reduce((sum, s) => sum + (s.quantity * s.sellingPrice), 0);
    const monthlyProfit = monthlySalesTotal - monthlyPurchaseTotal;

    return `
        <button class="btn btn-back" onclick="goToPage('dashboard')">← ${t('dashboard')}</button>
        
        <h2>📊 ${t('reports')}</h2>

        <div style="margin-bottom: 20px;">
            <h3>${t('openingStock')}</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>${t('productName')}</th>
                            <th>${t('stock')}</th>
                            <th>${t('unit')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.values(openingStock).map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.stock}</td>
                                <td>${item.unit}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        ${lowStockItems.length > 0 ? `
            <div class="alert alert-low-stock">
                <strong>⚠️ ${t('lowStock')}:</strong>
                ${lowStockItems.map(p => `${p.name} (${p.stock} ${p.unit})`).join(', ')}
            </div>
        ` : ''}

        <div style="margin-bottom: 20px;">
            <h3>${t('daily')} - ${today}</h3>
            <div class="info-box">
                <strong>${t('totalPurchase')}:</strong> ${dailyPurchaseTotal.toFixed(2)} টাকা<br>
                <strong>${t('totalSales')}:</strong> ${dailySalesTotal.toFixed(2)} টাকা<br>
                <strong>${dailyProfit >= 0 ? t('profit') : t('loss')}:</strong> ${Math.abs(dailyProfit).toFixed(2)} টাকা
            </div>
        </div>

        <div style="margin-bottom: 20px;">
            <h3>${t('monthly')} - ${thisMonth}</h3>
            <div class="info-box">
                <strong>${t('totalPurchase')}:</strong> ${monthlyPurchaseTotal.toFixed(2)} টাকা<br>
                <strong>${t('totalSales')}:</strong> ${monthlySalesTotal.toFixed(2)} টাকা<br>
                <strong>${monthlyProfit >= 0 ? t('profit') : t('loss')}:</strong> ${Math.abs(monthlyProfit).toFixed(2)} টাকা
            </div>
        </div>

        <div class="button-row">
            <button class="btn btn-warning" onclick="printReports()" style="flex: 1;">
                🖨️ ${t('print')}
            </button>
            <button class="btn btn-secondary" onclick="goToPage('dashboard')" style="flex: 1;">
                ⏭️ ${t('skip')}
            </button>
        </div>
    `;
}

function renderRunningList() {
    if (runningItems.length === 0) {
        return `<div class="empty-state"><div class="empty-state-icon">📭</div>${t('noItems')}</div>`;
    }

    return runningItems.map((item, index) => `
        <div class="list-item">
            <div class="list-item-info">
                <div class="list-item-name">${item.productName}</div>
                <div class="list-item-details">
                    ${t('quantity')}: ${item.quantity} ${item.unit} | ${t('purchasePrice')}: ${item.purchasePrice} টাকা
                </div>
            </div>
            <button type="button" class="btn btn-danger" onclick="removeFromRunningList(${index})">${t('delete')}</button>
        </div>
    `).join('');
}

function renderSalesRunningList() {
    if (runningItems.length === 0) {
        return `<div class="empty-state"><div class="empty-state-icon">📭</div>${t('noItems')}</div>`;
    }

    return runningItems.map((item, index) => `
        <div class="list-item">
            <div class="list-item-info">
                <div class="list-item-name">${item.productName}</div>
                <div class="list-item-details">
                    ${t('quantity')}: ${item.quantity} ${item.unit} | ${t('sellingPrice')}: ${item.sellingPrice} টাকা | ${t('profit')}: ${((item.sellingPrice - item.purchasePrice) * item.quantity).toFixed(2)} টাকা
                </div>
            </div>
            <button type="button" class="btn btn-danger" onclick="removeFromRunningList(${index})">${t('delete')}</button>
        </div>
    `).join('');
}

function goToPage(page) {
    currentPage = page;
    runningItems = [];
    render();
}

function addProductToList(e) {
    e.preventDefault();
    const productName = document.getElementById('productName').value.trim();
    const barcode = document.getElementById('barcode').value.trim();
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const quantity = parseFloat(document.getElementById('quantity').value);
    const unit = document.getElementById('unit').value;
    const invoiceNo = document.getElementById('invoiceNo').value.trim();

    if (!productName || !purchasePrice || !quantity) {
        alert(t('errorMsg'));
        return;
    }

    runningItems.push({
        productName,
        barcode,
        purchasePrice,
        quantity,
        unit,
        invoiceNo
    });

    document.getElementById('productName').value = '';
    document.getElementById('barcode').value = '';
    document.getElementById('purchasePrice').value = '';
    document.getElementById('quantity').value = '';

    document.getElementById('runningListContent').innerHTML = renderRunningList();
}

function addSaleToList(e) {
    e.preventDefault();
    const productName = document.getElementById('saleProductName').value.trim();
    const quantity = parseFloat(document.getElementById('saleQuantity').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const purchasePrice = parseFloat(document.getElementById('lastPurchasePrice').value);
    const unit = document.getElementById('saleUnit').value;

    if (!productName || !quantity || !sellingPrice) {
        alert(t('errorMsg'));
        return;
    }

    runningItems.push({
        productName,
        quantity,
        sellingPrice,
        purchasePrice,
        unit
    });

    document.getElementById('saleProductName').value = '';
    document.getElementById('saleQuantity').value = '';
    document.getElementById('sellingPrice').value = '';
    document.getElementById('lastPurchasePrice').value = '';
    document.getElementById('saleUnit').value = '';

    document.getElementById('runningListContent').innerHTML = renderSalesRunningList();
}

function removeFromRunningList(index) {
    runningItems.splice(index, 1);
    if (currentPage === 'newProduct') {
        document.getElementById('runningListContent').innerHTML = renderRunningList();
    } else {
        document.getElementById('runningListContent').innerHTML = renderSalesRunningList();
    }
}

function savePurchases() {
    if (runningItems.length === 0) {
        alert(t('errorMsg'));
        return;
    }

    const db = getDB();
    const today = new Date().toISOString().split('T')[0];

    runningItems.forEach(item => {
        // Add or update product
        let product = db.products.find(p => p.name === item.productName);
        if (!product) {
            product = {
                id: Date.now(),
                name: item.productName,
                barcode: item.barcode,
                unit: item.unit,
                stock: 0,
                lastPurchasePrice: item.purchasePrice,
                invoiceNo: item.invoiceNo
            };
            db.products.push(product);
        } else {
            product.lastPurchasePrice = item.purchasePrice;
            product.invoiceNo = item.invoiceNo;
        }

        product.stock += item.quantity;

        // Record purchase
        db.purchases.push({
            id: Date.now() + Math.random(),
            date: today,
            productId: product.id,
            productName: item.productName,
            quantity: item.quantity,
            purchasePrice: item.purchasePrice,
            unit: item.unit,
            invoiceNo: item.invoiceNo
        });
    });

    saveDB(db);
    alert(t('successMsg'));
    runningItems = [];
    render();
}

function saveSales() {
    if (runningItems.length === 0) {
        alert(t('errorMsg'));
        return;
    }

    const db = getDB();
    const today = new Date().toISOString().split('T')[0];

    runningItems.forEach(item => {
        let product = db.products.find(p => p.name === item.productName);
        if (product) {
            product.stock -= item.quantity;
            if (product.stock < 0) product.stock = 0;
        }

        db.sales.push({
            id: Date.now() + Math.random(),
            date: today,
            productName: item.productName,
            quantity: item.quantity,
            purchasePrice: item.purchasePrice,
            sellingPrice: item.sellingPrice,
            unit: item.unit
        });
    });

    saveDB(db);
    alert(t('successMsg'));
    runningItems = [];
    render();
}

function resetPurchaseForm() {
    document.getElementById('productName').value = '';
    document.getElementById('barcode').value = '';
    document.getElementById('purchasePrice').value = '';
    document.getElementById('quantity').value = '';
    runningItems = [];
    document.getElementById('runningListContent').innerHTML = renderRunningList();
}

function resetSalesForm() {
    document.getElementById('saleProductName').value = '';
    document.getElementById('saleQuantity').value = '';
    document.getElementById('sellingPrice').value = '';
    runningItems = [];
    document.getElementById('runningListContent').innerHTML = renderSalesRunningList();
}

function printPurchases() {
    window.print();
}

function printSales() {
    window.print();
}

function printReports() {
    window.print();
}

function showPurchaseList() {
    const db = getDB();
    alert('Full List:\n' + db.purchases.map(p => `${p.productName}: ${p.quantity} x ${p.purchasePrice}`).join('\n'));
}

function showSalesList() {
    const db = getDB();
    alert('Full List:\n' + db.sales.map(s => `${s.productName}: ${s.quantity} x ${s.sellingPrice}`).join('\n'));
}

// Initialize with product suggestions
document.addEventListener('DOMContentLoaded', () => {
    render();

    // Add event listeners for autocomplete after rendering
    setTimeout(() => {
        const productNameInput = document.getElementById('productName');
        if (productNameInput) {
            productNameInput.addEventListener('input', updateProductSuggestions);
        }

        const saleProductInput = document.getElementById('saleProductName');
        if (saleProductInput) {
            saleProductInput.addEventListener('input', updateSaleSuggestions);
        }
    }, 100);
});

function updateProductSuggestions(e) {
    const input = e.target.value.toLowerCase();
    const db = getDB();
    const suggestions = db.products.filter(p => p.name.toLowerCase().includes(input));
    const container = document.getElementById('productSuggestions');

    if (input.length === 0 || suggestions.length === 0) {
        container.classList.remove('active');
        return;
    }

    container.classList.add('active');
    container.innerHTML = suggestions.map(s => `
        <div class="suggestion-item" onclick="selectProduct('${s.name}', '${s.barcode}', ${s.lastPurchasePrice}, '${s.unit}')">
            <strong>${s.name}</strong>
            <small>${t('lastPrice')}: ${s.lastPurchasePrice} | ${t('stock')}: ${s.stock}</small>
        </div>
    `).join('');
}

function updateSaleSuggestions(e) {
    const input = e.target.value.toLowerCase();
    const db = getDB();
    const suggestions = db.products.filter(p => p.name.toLowerCase().includes(input) && p.stock > 0);
    const container = document.getElementById('saleSuggestions');

    if (input.length === 0 || suggestions.length === 0) {
        container.classList.remove('active');
        return;
    }

    container.classList.add('active');
    container.innerHTML = suggestions.map(s => `
        <div class="suggestion-item" onclick="selectSaleProduct('${s.name}', '${s.barcode}', ${s.lastPurchasePrice}, '${s.unit}', ${s.stock})">
            <strong>${s.name}</strong>
            <small>${t('stock')}: ${s.stock} | ${t('lastPrice')}: ${s.lastPurchasePrice}</small>
        </div>
    `).join('');
}

function selectProduct(name, barcode, price, unit) {
    document.getElementById('productName').value = name;
    document.getElementById('barcode').value = barcode;
    document.getElementById('purchasePrice').value = price;
    document.getElementById('unit').value = unit;
    document.getElementById('productSuggestions').classList.remove('active');
}

function selectSaleProduct(name, barcode, price, unit, stock) {
    document.getElementById('saleProductName').value = name;
    document.getElementById('saleBarcode').value = barcode;
    document.getElementById('lastPurchasePrice').value = price;
    document.getElementById('saleUnit').value = unit;
    document.getElementById('saleSuggestions').classList.remove('active');
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.id !== 'productName' && e.target.id !== 'saleProductName') {
        document.querySelectorAll('.suggestions').forEach(s => s.classList.remove('active'));
    }
});