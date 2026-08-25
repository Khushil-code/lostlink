let items = JSON.parse(
    localStorage.getItem("lostLinkItems")
) || [];
let selectedContactItem = null;
const itemsGrid =
    document.getElementById("itemsGrid");
const emptyState =
    document.getElementById("emptyState");
const searchInput =
    document.getElementById("searchInput");
const statusFilter =
    document.getElementById("statusFilter");
const categoryFilter =
    document.getElementById("categoryFilter");
const locationFilter =
    document.getElementById("locationFilter");
const reportForm =
    document.getElementById("reportForm");
const imageInput =
    document.getElementById("image");
const imagePreview =
    document.getElementById("imagePreview");
document.addEventListener(
    "DOMContentLoaded",
    function () {
        setTodayDate();
        renderItems();
        updateStats();
    }
);

function saveItems() {
    localStorage.setItem(
        "lostLinkItems",
        JSON.stringify(items)
    );
}

function renderItems() {
    const search =
        searchInput.value
            .toLowerCase()
            .trim();
    const status =
        statusFilter.value;
    const category =
        categoryFilter.value;
    const location =
        locationFilter.value;
    const filteredItems =
        items.filter(function (item) {
            const matchesSearch =
                item.name
                    .toLowerCase()
                    .includes(search)
                ||
                item.description
                    .toLowerCase()
                    .includes(search)
                ||
                item.location
                    .toLowerCase()
                    .includes(search);
            const matchesStatus =
                status === "all"
                ||
                item.status === status;
            const matchesCategory =
                category === "all"
                ||
                item.category === category;
            const matchesLocation =
                location === "all"
                ||
                item.location === location;
            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory &&
                matchesLocation
            );
        });

    itemsGrid.innerHTML = "";
    if (filteredItems.length === 0) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";
    filteredItems
        .sort(function (a, b) {
            return b.createdAt - a.createdAt;
        })
        .forEach(function (item) {
            itemsGrid.appendChild(
                createItemCard(item)
            );
        });
}
function createItemCard(item) {
    const card =
        document.createElement("div");
    card.className = "item-card";
    const statusText =
        item.status === "lost"
            ? "LOST"
            : "FOUND";
    const statusClass =
        item.status === "lost"
            ? "status-lost"
            : "status-found";
    let imageHTML;
    if (item.image) {
        imageHTML = `<img src="${item.image}" alt="${escapeHTML(item.name)}">`;
    } else {
        imageHTML = `
            <div class="placeholder-icon">
                ${getCategoryIcon(item.category)}
            </div>
        `;
    }
    const recoveredHTML =
        item.recovered
            ? `
                <div class="recovered-badge">
                    ✓ RECOVERED
                </div>
            `
            : "";
    card.innerHTML = `
        <div class="item-image">
            ${imageHTML}
            <div class="status-badge ${statusClass}">
                ${statusText}
            </div>
            ${recoveredHTML}
        </div>
        <div class="item-info">
            <h3>
                ${escapeHTML(item.name)}
            </h3>
            <p class="item-description"> ${escapeHTML(item.description)} </p>
            <div class="item-meta">
                <span>
                    📍 ${escapeHTML(item.location)}
                </span>
                <span>
                    📅 ${formatDate(item.date)}
                </span>
                <span>
                    ${escapeHTML(item.category)}
                </span>
            </div>
            <div class="item-actions">
                <button class="view-button" onclick="viewDetails(${item.id})"> View </button>
                ${
                    !item.recovered
                    ?
                    `
                        <button
                            class="contact-button"
                            onclick="openContactModal(${item.id})"
                        >
                            ${
                                item.status === "lost"
                                ? "I Found This"
                                : "This Is Mine"
                            }
                        </button>
                    `
                    :
                    `
                        <button
                            class="recover-button"
                            disabled
                        >
                            Recovered ✓
                        </button>
                    `
                }
            </div>
            <div class="item-actions" style="margin-top:8px">
                <button
                    class="recover-button"
                    onclick="markRecovered(${item.id})"
                >
                    ✓ Mark Recovered
                </button>
                <button
                    class="delete-button"
                    onclick="deleteItem(${item.id})"
                >
                    Delete
                </button>
            </div>
        </div>
    `;
    return card;
}
searchInput.addEventListener(
    "input",
    renderItems
);
statusFilter.addEventListener(
    "change",
    renderItems
);
categoryFilter.addEventListener(
    "change",
    renderItems
);
locationFilter.addEventListener(
    "change",
    renderItems
);
function openReportModal(type = "lost") {
    document
        .getElementById("reportModal")
        .classList.add("active");
    const radio =
        document.querySelector(
            `input[name="status"][value="${type}"]`
        );
    if (radio) {
        radio.checked = true;
    }
    document.body.style.overflow = "hidden";
}
function closeReportModal() {
    document
        .getElementById("reportModal")
        .classList.remove("active");
    document.body.style.overflow = "";
}
function setTodayDate() {
    const dateInput =
        document.getElementById("date");
    const today =
        new Date()
            .toISOString()
            .split("T")[0];
    dateInput.value = today;
}
imageInput.addEventListener(
    "change",
    function () {
        const file =
            this.files[0];
        if (!file) {
            imagePreview.innerHTML = `
                📷
                <span>
                    Click to upload an image
                </span>
            `;
            return;
        }
        if (!file.type.startsWith("image/")) {
            showToast(
                "Please select an image file.",
                "❌"
            );
            this.value = "";
            return;
        }
        const reader =
            new FileReader();
        reader.onload =
            function (event) {
                imagePreview.innerHTML = `
                    <img
                        src="${event.target.result}"
                        alt="Preview"
                    >
                `;
            };
        reader.readAsDataURL(file);
    }
);
reportForm.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();
        const status =
            document.querySelector(
                'input[name="status"]:checked'
            ).value;
        const itemName =
            document
                .getElementById("itemName")
                .value
                .trim();
        const category =
            document
                .getElementById("category")
                .value;
        const description =
            document
                .getElementById("description")
                .value
                .trim();
        const location =
            document
                .getElementById("location")
                .value;
        const date =
            document
                .getElementById("date")
                .value;
        const personName =
            document
                .getElementById("personName")
                .value
                .trim();
        const contact =
            document
                .getElementById("contact")
                .value
                .trim();
        const file =
            imageInput.files[0];
        if (file) {
            const reader =
                new FileReader();
            reader.onload =
                function (event) {
                    createNewItem(
                        status,
                        itemName,
                        category,
                        description,
                        location,
                        date,
                        personName,
                        contact,
                        event.target.result
                    );
                };
            reader.readAsDataURL(file);
        } else {
            createNewItem(
                status,
                itemName,
                category,
                description,
                location,
                date,
                personName,
                contact,
                ""
            );
        }
    }
);
function createNewItem(
    status,
    name,
    category,
    description,
    location,
    date,
    personName,
    contact,
    image
) {
    const newItem = {
        id: Date.now(),
        status: status,
        name: name,
        category: category,
        description: description,
        location: location,
        date: date,
        personName: personName,
        contact: contact,
        image: image,
        recovered: false,
        createdAt: Date.now()
    };
    items.push(newItem);
    saveItems();
    renderItems();
    updateStats();
    reportForm.reset();
    imagePreview.innerHTML = `
        📷
        <span>
            Click to upload an image
        </span>
    `;
    setTodayDate();
    closeReportModal();
    showToast(
        "Your item has been reported successfully!",
        "✅"
    );
    document
        .getElementById("items")
        .scrollIntoView({
            behavior: "smooth"
        });
}
function viewDetails(id) {
    const item =
        items.find(
            function (item) {
                return item.id === id;
            }
        );
    if (!item) return;
    const detailsBody =
        document.getElementById(
            "detailsBody"
        );
    const imageHTML =
        item.image
            ?
            `
                <img
                    class="details-image"
                    src="${item.image}"
                    alt="${escapeHTML(item.name)}"
                >
            `
            :
            `
                <div class="details-placeholder">
                    ${getCategoryIcon(item.category)}
                </div>
            `;
    detailsBody.innerHTML = `
        ${imageHTML}
        <span class="section-label">
            ${item.status.toUpperCase()}
        </span>
        <h2 class="details-title">
            ${escapeHTML(item.name)}
        </h2>
        <p class="details-description">
            ${escapeHTML(item.description)}
        </p>
        <div class="details-info">
            <div>
                <strong>Category</strong>
                <span> ${escapeHTML(item.category)} </span>
            </div>

            <div>
                <strong>Location</strong>
                <span>📍 ${escapeHTML(item.location)} </span>
            </div>
            <div>
                <strong>Date</strong>
                <span> ${formatDate(item.date)} </span>
            </div>
            <div>
                <strong>Reported By</strong>
                <span> ${escapeHTML(item.personName)} </span>
            </div>
        </div>
        ${
            item.recovered
            ?
            `
                <div class="recover-button"
                    style="
                        padding:12px;
                        border-radius:10px;
                        text-align:center;
                    "
                >
                    ✓ This item has been recovered
                </div>
            `
            :
            `
                <button
                    class="primary-button"
                    style="width:100%"
                    onclick="openContactModal(${item.id}); closeDetailsModal();"
                >
                    ${
                        item.status === "lost"
                        ? "🤝 I Found This Item"
                        : "🤝 This Is My Item"
                    }
                </button>
            `
        }
    `;
    document
        .getElementById("detailsModal")
        .classList.add("active");
    document.body.style.overflow = "hidden";
}
function closeDetailsModal() {
    document
        .getElementById("detailsModal")
        .classList.remove("active");
    document.body.style.overflow = "";
}
function openContactModal(id) {
    selectedContactItem =
        items.find(
            function (item) {
                return item.id === id;
            }
        );
    if (!selectedContactItem) return;
    document
        .getElementById("contactItemName")
        .textContent =
        "Regarding: " +
        selectedContactItem.name;
    document
        .getElementById("contactModal")
        .classList.add("active");
    document.body.style.overflow = "hidden";
}
function closeContactModal() {
    document
        .getElementById("contactModal")
        .classList.remove("active");
    document.body.style.overflow = "";
    document
        .getElementById("contactForm")
        .reset();
}
document
    .getElementById("contactForm")
    .addEventListener(
        "submit",
        function (event) {
            event.preventDefault();
            if (!selectedContactItem) {
                return;
            }
            const senderName =
                document
                    .getElementById("contactName")
                    .value
                    .trim();
            const senderContact =
                document
                    .getElementById("contactInfo")
                    .value
                    .trim();
            const message =
                document
                    .getElementById("contactMessage")
                    .value
                    .trim();
            closeContactModal();
            showContactResult(
                selectedContactItem,
                senderName,
                senderContact,
                message
            );
        }
    );

function showContactResult(
    item,
    senderName,
    senderContact,
    message
) {
    const detailsBody =
        document.getElementById(
            "detailsBody"
        );
    detailsBody.innerHTML = `
        <div style="
            text-align:center;
            padding:20px 5px;
        ">
            <div style="
                font-size:60px;
                margin-bottom:15px;
            ">
                🤝
            </div>
            <h2 style="
                margin-bottom:10px;
            ">
                Contact Information
            </h2>
            <p style="
                color:#667085;
                font-size:13px;
                margin-bottom:20px;
            ">
                Your message has been prepared for
                the person who reported
                <strong>
                    ${escapeHTML(item.name)}
                </strong>.
            </p>
            <div style="
                background:#f5f6fa;
                padding:18px;
                border-radius:12px;
                text-align:left;
                margin-bottom:15px;
            ">
                <strong>
                    Reporter
                </strong>
                <p>
                    ${escapeHTML(item.personName)}
                </p>
                <strong>
                    Contact
                </strong>
                <p>
                    ${escapeHTML(item.contact)}
                </p>
            </div>
            <div style="
                background:#f5f6fa;
                padding:18px;
                border-radius:12px;
                text-align:left;
                margin-bottom:20px;
            ">
                <strong>
                    Your Message
                </strong>
                <p style="
                    color:#667085;
                    font-size:12px;
                    margin-top:5px;
                ">
                    ${escapeHTML(message)}
                </p>
            </div>
            <button
                class="primary-button"
                style="width:100%"
                onclick="closeDetailsModal()"
            >
                Done
            </button>
        </div>
    `;
    document
        .getElementById("detailsModal")
        .classList.add("active");
    console.log(
        "Contact request:",
        {
            item: item.name,
            sender: senderName,
            senderContact: senderContact,
            message: message,
            reporter: item.personName,
            reporterContact: item.contact
        }
    );
}

function markRecovered(id) {

    const item =
        items.find(
            function (item) {

                return item.id === id;

            }
        );
    if (!item) return;
    const confirmation =
        confirm(
            `Mark "${item.name}" as recovered?`
        );
    if (!confirmation) return;
    item.recovered = true;
    saveItems();
    renderItems();
    updateStats();
    showToast(
        "Item marked as recovered!",
        "✅"
    );
}

function deleteItem(id) {
    const item =
        items.find(
            function (item) {
                return item.id === id;
            }
        );
    if (!item) return;
    const confirmation =
        confirm(
            `Delete "${item.name}"?`
        );
    if (!confirmation) return;
    items =
        items.filter(
            function (item) {
                return item.id !== id;
            }
        );
    saveItems();
    renderItems();
    updateStats();
    showToast(
        "Item deleted.",
        "🗑️"
    );
}

function updateStats() {
    const total =
        items.length;
    const lost =
        items.filter(
            function (item) {
                return item.status === "lost";
            }
        ).length;
    const found =
        items.filter(
            function (item) {
                return item.status === "found";
            }
        ).length;
    const recovered =
        items.filter(
            function (item) {
                return item.recovered;
            }
        ).length;
    document
        .getElementById("totalItems")
        .textContent = total;
    document
        .getElementById("lostItems")
        .textContent = lost;
    document
        .getElementById("foundItems")
        .textContent = found;
    document
        .getElementById("recoveredItems")
        .textContent = recovered;
}
function getCategoryIcon(category) {
    const icons = {
        "Electronics": "📱",
        "Books": "📚",
        "ID / Cards": "🪪",
        "Bags": "🎒",
        "Keys": "🔑",
        "Clothing": "👕",
        "Accessories": "⌚",
        "Other": "📦"
    };
    return icons[category] || "📦";
}
function formatDate(dateString) {
    if (!dateString) return "Unknown";
    const date =
        new Date(dateString);
    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}

function escapeHTML(value) {
    if (value === undefined || value === null) {
        return "";
    }
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showToast(
    message,
    icon = "✅"
) {
    const toast =
        document.getElementById("toast");
    const toastMessage =
        document.getElementById(
            "toastMessage"
        );
    const toastIcon =
        document.getElementById(
            "toastIcon"
        );
    toastMessage.textContent =
        message;
    toastIcon.textContent =
        icon;
    toast.classList.add("show");
    setTimeout(
        function () {
            toast.classList.remove("show");
        },
        3000
    );
}

window.addEventListener(
    "click",
    function (event) {
        const reportModal =
            document.getElementById(
                "reportModal"
            );
        const detailsModal =
            document.getElementById(
                "detailsModal"
            );
        const contactModal =
            document.getElementById(
                "contactModal"
            );
        if (event.target === reportModal) {
            closeReportModal();
        }
        if (event.target === detailsModal) {
            closeDetailsModal();
        }
        if (event.target === contactModal) {
            closeContactModal();
        }
    }
);

document.addEventListener(
    "keydown",
    function (event) {
        if (event.key !== "Escape") {
            return;
        }
        closeReportModal();
        closeDetailsModal();
        closeContactModal();
    }
);
// ==========================================
// LOSTLINK AI SMART MATCH - GEMINI
// ==========================================

const aiMatchButton = document.getElementById("aiMatchBtn");

if (aiMatchButton) {

    aiMatchButton.addEventListener("click", async function () {

        // Get Lost Item Information
        const lostItem = {
            name: document.getElementById("lostName").value.trim(),
            category: document.getElementById("lostCategory").value.trim(),
            description: document.getElementById("lostDescription").value.trim(),
            location: document.getElementById("lostLocation").value.trim(),
            date: document.getElementById("lostDate").value
        };


        // Get Found Item Information
        const foundItem = {
            name: document.getElementById("foundName").value.trim(),
            category: document.getElementById("foundCategory").value.trim(),
            description: document.getElementById("foundDescription").value.trim(),
            location: document.getElementById("foundLocation").value.trim(),
            date: document.getElementById("foundDate").value
        };


        // Check empty fields
        if (
            !lostItem.name ||
            !lostItem.description ||
            !foundItem.name ||
            !foundItem.description
        ) {

            showAIResult(
                "⚠️ Please enter the item name and description for both items.",
                false
            );

            return;
        }


        // Loading state
        aiMatchButton.disabled = true;
        aiMatchButton.innerText =
            "🤖 Gemini is analyzing...";


        showAIResult(
            "🤖 Gemini AI is comparing the two items...",
            false
        );


        try {

            // Send data to Vercel API
            const response = await fetch("/api/match", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    lostItem: lostItem,
                    foundItem: foundItem
                })

            });


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "AI matching failed."
                );

            }


            // Display Gemini result
            displayAIResult(result);


        } catch (error) {

            console.error("AI Error:", error);

            showAIResult(
                "❌ Unable to connect to Gemini AI. Please try again.",
                false
            );

        }


        // Restore button
        aiMatchButton.disabled = false;
        aiMatchButton.innerText =
            "🤖 Find AI Match";

    });

}

function displayAIResult(result) {
    const resultBox =
        document.getElementById("aiResult");
    resultBox.classList.add("show");
    const score =
        Number(result.score) || 0;
    let status;
    if (score >= 80) {
        status =
            "🎯 Strong Possible Match";
    } else if (score >= 60) {
        status =
            "🟡 Possible Match";
    } else {
        status =
            "🔵 Low Match Probability";
    }
    resultBox.innerHTML = `
        <h3>${status}</h3>
        <div class="ai-score">
            ${score}%
        </div>
        <p>
            <strong>AI Match Score</strong>
        </p>
        <p class="ai-reason">
            <strong>Gemini's Analysis:</strong><br>
            ${escapeHTML(result.reason || "No reason provided.")}
        </p>

    `;
}
function showAIResult(message, showBox = true) {
    const resultBox =
        document.getElementById("aiResult");

    resultBox.classList.add("show");
    resultBox.innerHTML = `
        <p>${message}</p>
    `;
}
function escapeHTML(text) {
    const div =
        document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}