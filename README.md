
# Duty Report Maker App

## Description

Duty Report Maker App is a simple web application built with Node.js, Express, MongoDB, and EJS templating. It allows employees to log in and fill in their duty reports with shift-wise and post-wise details. Each employee can access their own data whenever required, with all records stored securely in the database. The app provides a report page to view all submitted records grouped by date and supports downloading the entire report as a PDF.

---

## Features

- Employee login without session management (stateless).
- Data entry form with fields:
  - Date
  - Shift (Morning, Afternoon, Night, Custom with time frame)
  - Post (predefined list with "Other" option)
  - Partner TW (Individual or named)
- Report page to view all submitted records, date-wise.
- Download reports as PDF.
- Persistent data storage in MongoDB.
- Clean UI built with EJS templates.

---

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- EJS templating
- HTML, CSS, JavaScript

---

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/rajakerkar/Duty-Report-Maker-App.git
   cd Duty-Report-Maker-App
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB connection string and port:

   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open your browser and visit:

   ```
   http://localhost:5000
   ```

---

## Folder Structure

```
/Duty-Report-Maker-App
├── /images           # Screenshots for README
├── /models           # Mongoose models
├── /routes           # Express routes
├── /views            # EJS templates
├── .env              # Environment variables (not in repo)
├── app.js            # Main Express app
├── package.json
└── README.md
```

---

## Screenshots

### 🔐 Login Page

![Login Page](./images/login.png)

### 📝 Data Entry Form

![Insert Form](./images/insert.png)

### 📊 Report Page

![Report Page](./images/report.png)

---

## License

MIT License © 2025 Raj Akerkar

---

## Contact

For questions or contributions, feel free to open an issue or submit a pull request.

````

---

### To add this README.md:

- Place this file in your project root.
- Ensure your screenshots are in `images/` folder (at root) with names: `login.png`, `insert.png`, `report.png`.
- Commit and push:

```bash
git add README.md
git commit -m "Add complete README with screenshots"
git push origin master
````

