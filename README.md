# Fintola - Financial Analytics Backend

Fintola is a robust backend system designed for financial analytics, featuring a secure Role-Based Access Control (RBAC) architecture. It enables organizations to manage transactions, generate real-time financial insights through MongoDB aggregations, and maintain a strict administrative approval workflow for elevated privileges.

**Live URL:** [https://fintola.onrender.com](https://fintola.onrender.com)

---

## 🚀 Features

* **Authentication & Authorization:** Secure JWT-based authentication with role-specific access (Viewer, Analyst, Admin).
* **Admin Approval Workflow:** Automated system where users can request Admin status, subject to approval/rejection by existing admins with integrated email notifications.
* **Financial Insights:** High-performance analytics including income/expense tracking, category breakdown, and trend analysis using MongoDB Aggregation Pipelines.
* **Transaction Management:** Full CRUD operations with soft-delete functionality and advanced filtering (category, type, date range).
* **User Management:** Centralized dashboard for Admins to manage user statuses (Active/Inactive) and update profiles.
* **Standardized API:** Unified response and error handling patterns for predictable client-side integration.

---

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Security:** JWT (Authentication), Bcrypt (Password Hashing)
* **Email:** Custom Mailer Utility with dynamic templates

---

## 📂 Project Structure

```text
src/
 ├── config/        # Database and Environment configurations
 ├── controllers/   # Request handling logic
 ├── models/        # Mongoose schemas (User, Transaction, AdminRequest)
 ├── routes/        # API endpoint definitions
 ├── middlewares/   # Auth, RBAC, and Global Error handlers
 ├── utils/         # asyncHandler, ApiError, ApiResponse, Mailer
 ├── app.js         # Express app configuration
 └── index.js       # Server entry point
```

---

## 🛡 API Reference

### Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Public | Register a new user |
| `POST` | `/api/v1/auth/signin` | Public | Login and receive JWT |
| `POST` | `/api/v1/auth/signout` | Authenticated | Invalidate session |
| `GET` | `/api/v1/auth/me` | Authenticated | Get current user profile |

### Admin Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/` | Admin | Fetch all users |
| `GET` | `/api/v1/admin/requests` | Admin | Get pending admin requests |
| `PATCH` | `/api/v1/admin/requests/:id`| Admin | Approve/Reject admin request |
| `PATCH` | `/api/v1/admin/users/:id/status`| Admin | Toggle user active/inactive |
| `PATCH` | `/api/v1/admin/users/:id` | Admin | Update user details |

### Transactions & Analytics
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/transactions/create` | Admin | Create a new transaction |
| `GET` | `/api/v1/transactions/view` | All | View transactions (Paginated) |
| `GET` | `/api/v1/transactions/insights`| Admin/Analyst| Aggregated financial data |
| `PATCH` | `/api/v1/transactions/:id` | Admin | Update transaction details |
| `DELETE` | `/api/v1/transactions/:id` | Admin | Soft delete transaction |

---

## ⚙️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/fintola.git
    cd fintola
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_secret_key
    EMAIL_SERVICE=your_email_service
    EMAIL_USER=your_email
    EMAIL_PASS=your_email_password
    ```

4.  **Run the application:**
    ```bash
    # Development mode
    npm run dev

    # Production mode
    npm start
    ```

---

## 📝 Key Implementation Details

* **Aggregation Framework:** Insights are generated on-the-fly using MongoDB `aggregate`, ensuring data is always fresh and reducing storage overhead.
* **Global Error Handling:** A centralized middleware catches all errors passed via `asyncHandler`, returning a consistent `ApiError` format.
* **Query Parser:** Supports complex filtering by category, type, and date range, combined with efficient pagination (`page`, `limit`).

---

## 📋 Assumptions

* Only an existing Admin can approve a user's request for Admin privileges.
* "Insights" contain sensitive data and are restricted from users with only the "Viewer" role.
* Deleted transactions are automatically excluded from all Insight calculations and standard view queries.

---
