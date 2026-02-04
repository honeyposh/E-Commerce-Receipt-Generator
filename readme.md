# E-Commerce Receipt Generator

An application that automatically generates PDF receipts, uploads them to Cloudinary, and sends them to customer via email. **Built with Node.js, Express, MongoDB,BullMQ(queues), and Cloudinary.**

This system uses queues to process heayz tasks in the background, making the app **non-blocking** and **scalable**

---

## Features

- Generate PDF receipts with order details
- Upload receipts to Cloudinary
- Send receipt emails to customer automatically
- Uses BullMQ queues for background tasks:
  - PDF generation(pdfQueue)
  - cloud upload (cloudQueue)
  - email sending (emailQueue)
- Retry logic for failed jobs
- Logging of important events and errors using WInston

---

## Tech Stack

- **Backend**: Node.js & Express
- **Database**: MongoDB (with mongoose)
- **Queues**: Bullmq(with Redis)
- **FileStorage**: Cloudinary
- **Email**: Nodemailer/ Gmail
- **PDFKit** (for pdf generation)
- **Logging** Winston

---

## Getting Started

### Prerequisite

- Node.js >= 18
- MongoDB
- Redis
- Cloudinary account
- Email account (Gmail)

### Installation

1. Clone the repository.

2. Install dependencies
   - npm install

3. Create .env file in the root:
   - PORT=8000
   - MONGO_URI=your_mongodb_uri
   - REDIS_HOST=127.0.0.1
   - REDIS_PORT=6379
   - CLOUDINARY_CLOUD_NAME=your_cloud_name
   - CLOUDINARY_API_KEY=your_api_key
   - CLOUDINARY_API_SECRET=your_api_secret
   - EMAIL_USER=your_email
   - EMAIL_PASS=your_email_password

4. Running the App
   - start the main application
     - npm run start
   - start the workers
     - npm run workers

5. The application will start on : http://localhost:8000

## API EndPoints

### Create Receipt

**POST** `/api/receipts`

---

### Get All Receipts

**GET** `/api/receipts`

---

### Sigup

**POST** `/api/signup`

---

### login

**GET** `/api/login`

---

## How It Works

1. **Client sends an order** to the API endpoint
2. **`createReceipt` service**:
   - Saves the receipt in MongoDB.
   - Adds a job to the **PDF queue** (`pdfQueue`) for background processing.
3. **`pdfWorker`**:
   - Generates a PDF for the receipt.
   - Adds a job to the **Cloud queue** (`cloudQueue`) to upload the PDF.
4. **`cloudWorker`**:
   - Uploads the PDF to Cloudinary.
   - Updates the receipt in MongoDB
   - Adds a job to the **Email queue** (`emailQueue`) for sending the receipt.
5. **`emailWorker`**:
   - Sends the receipt via email to the customer.
   - Deletes the local PDF file to clean up storage.
6. **Access Control**
   - Only **business owner** (admin users) can `GET /api/receipts` to fetch receipts
7. Logging:
   - **Winston** logs event and errrors in the system for monitory of failed uploads or email

## API Doumentatio

The complete API documentaion,including request and response examples, is available on postman:

## Author

Odedoyin Oyinloluwa
