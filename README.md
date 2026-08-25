# 🔗 LostLink — College Lost & Found Platform

LostLink is a web-based **College Lost & Found platform** designed to help students report, search, and recover lost belongings within their college campus.

Instead of relying on WhatsApp groups or word of mouth, LostLink provides one central place where students can report lost items and found items, search for matching belongings, and connect with the person who reported them.

---

## 🚀 Problem Statement

Students frequently lose items such as:

- 📱 Mobile phones
- 🎧 Earphones and headphones
- 🎒 Bags
- 📚 Books and notebooks
- 🪪 ID cards
- 🔑 Keys
- 💳 Cards
- 💻 Laptop accessories
- ⌚ Watches and other personal belongings

Usually, students depend on WhatsApp groups or announcements to find their belongings. These messages can quickly get buried among other messages.

### 💡 Our Solution

**LostLink** creates a centralized digital Lost & Found system for college campuses.

A student can:

1. Report a lost item.
2. Upload an image.
3. Add the location and date.
4. Search reported items.
5. Find a possible matching item.
6. Contact the person who reported/found the item.
7. Mark the item as recovered.

---

## ✨ Features

### 🔴 Report Lost Items

Students can report items they have lost by providing:

- Item name
- Category
- Description
- Location
- Date
- Image
- Name
- Contact information

### 🟢 Report Found Items

Students who find an item can upload its details so that the owner can identify it.

### 🔍 Search & Filter

Users can search items by:

- Item name
- Description
- Category
- Location
- Lost/Found status

### 📸 Image Upload

Users can upload an image of the lost or found item.

### 🤝 Contact System

The **"I Found This"** / **"This Is My Item"** button allows users to initiate contact with the person who reported the item.

### ✅ Recovery Tracking

Items can be marked as **Recovered** once they are returned to their owner.

### 📊 Dashboard Statistics

LostLink displays:

- Total reports
- Lost items
- Found items
- Recovered items

### 💾 Local Storage

The current prototype uses browser `localStorage` to save reports.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive design |
| JavaScript | Website functionality |
| LocalStorage | Temporary browser-based data storage |

---

## 📁 Project Structure

```text
lostlink/
│
├── index.html      # Main website
├── style.css       # Website styling
├── script.js       # Application functionality
└── README.md       # Project documentation
