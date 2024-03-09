<br/>
<p align="center">
  <h3 align="center">Next.js  E-Commerce + Dashboard & CMS</h3>

  <p align="center">
    Next.js 13 App Router, React, Tailwind, Shadcn UI, Prisma, MySQL 
    <br/>
    <br/>
    <a href="https://next-store-showcase.vercel.app/">View Demo</a>
    .
    <a href="https://github.com/SkrNeymar/next-store-show/issues">Report Bug</a>
    .
    <a href="https://github.com/SkrNeymar/next-store-show/issues">Request Feature</a>
  </p>
</p>

![License](https://img.shields.io/github/license/SkrNeymar/next-store-show)

[Dashboard Repo](https://github.com/SkrNeymar/next-store-admin)  
[Store Front Repo](https://github.com/SkrNeymar/next-store-front)

## About The Project

Dashboard & CMS

![Screen Shot](https://res.cloudinary.com/djhhzsnda/image/upload/v1709966437/dashboard_lzcssc.png)
![Screen Shot](https://res.cloudinary.com/djhhzsnda/image/upload/v1709966438/api_mxy4pf.png)
![Screen Shot](https://res.cloudinary.com/djhhzsnda/image/upload/v1709966438/variant_tnsbmm.png)

Store Front
![Screen Shot](https://res.cloudinary.com/djhhzsnda/image/upload/v1709966438/storefront_wvzore.png)

## Key Features

### Modern, Responsive User Interface

- **Technologies Used:** Next.js 13 App Router, React, Tailwind CSS, and Shadcn UI.
- **Design:** Sleek and modern interface, fully responsive to ensure a seamless experience across all devices.

### Versatile Dashboard & CMS

- **Dual Functionality:** Serves as both a Content Management System and an Administration Panel.
- **API Management:** Generates individual API routes for each store, enhancing the flexibility and speed of front-end development.

### Comprehensive E-Commerce Features

- **Product Management:** Create, update, and delete product categories and products with ease.
- **Variants & Images:** Manage multiple product variants and handle image uploads and modifications smoothly.

### Advanced Order and Sales Analytics

- **Insightful Charts:** Detailed visualizations for orders, sales, and other critical metrics.
- **Data Driven:** Helps in making informed business decisions based on real-time data.

### Robust Security Measures

- **User Authentication:** Integrated with Clerk Authentication for secure access and data protection.
- **Data Safety:** Ensures the integrity and confidentiality of user and transaction data.

### Efficient Payment Processing

- **Stripe Integration:** A complete Stripe payment process, including order status tracking.
- **Financial Management:** Streamlines the transaction process, enhancing user trust and satisfaction.

### Scalable Database Architecture

- **Database Technology:** Utilizes MySQL for its robustness and scalability.
- **Growth Ready:** Designed to support and grow with your business needs.

## Getting Started

This is an example of how you may give instructions on setting up your project locally.

To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm

```sh

npm  install  npm@latest  -g

```

## Installation Step 1: Setup the admin

### Cloning the repository

```shell

git  clone  https://github.com/SkrNeymar/next-store-admin.git

```

### Install packages

```shell

npm  i

```

### Setup .env file

```js

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
DATABASE_URL=''
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
STRIPE_API_KEY=
FRONTEND_STORE_URL=http://localhost:3001
STRIPE_WEBHOOK_SECRET=

```

### Setup Prisma

```shell

npx prisma generate
npx prisma db push


```

### Start the app

```shell

npm  run  dev

```

## Installation Step 2: Setup the store front

### Cloning the repository

```shell

git  clone  https://github.com/SkrNeymar/next-store-front.git

```

### Install packages

```shell

npm  i

```

### Create new store at dashboard, copy the NEXT_PUBLIC_API_URL at settings page

![Screen Shot](https://res.cloudinary.com/djhhzsnda/image/upload/v1709967414/Snipaste_2024-03-09_16-56-42_qaezq6.png)

### Setup .env file

```js
NEXT_PUBLIC_API_URL
```

### Start the app

```shell

npm  run  dev

```

## License

Distributed under the MIT License. See [LICENSE](https://github.com/SkrNeymar/airbnb-nextjs-clone/blob/main/LICENSE.txt) for more information.
