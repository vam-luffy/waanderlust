# WanderLust

WanderLust is a web application built to help users explore and book travel destinations and experiences. The platform allows users to browse listings, leave reviews, and save their favorite places for future reference.

## Features

- **User Authentication**: Users can register, log in, and manage their accounts securely.
- **Listings**: Users can browse, view, and filter travel listings.
- **Reviews**: Users can leave reviews and ratings for listings.
- **Wishlist**: Users can save listings to their wishlist for later viewing.
- **User Profiles**: Users can customize their profiles and view their listings and saved items.
- **Responsive Design**: Optimized for both desktop and mobile views.

## Installation

To get started with the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vam-luffy/wanderLust.git
   ```

2. **Install dependencies**: Navigate to the project directory and run the following command to install required dependencies:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**: Create a `.env` file in the root directory with the required environment variables. You can use the `.env.example` file as a template.

4. **Set up MongoDB**: Ensure you have MongoDB running locally or use a cloud MongoDB service like MongoDB Atlas. Update the connection string in your `.env` file.

5. **Start the server**: After installing dependencies and setting up MongoDB, run the following command to start the server:
   ```bash
   npm start
   ```

The application should now be running at http://localhost:3000.

## Usage

- **Sign Up/Login**: Create an account or log in to access all features.
- **Browse Listings**: Explore various travel destinations and experiences.
- **View Listing Details**: Click on a listing to see detailed information, photos, and reviews.
- **Add to Wishlist**: Save listings to your wishlist by clicking the heart icon on any listing.
- **View Wishlist**: Access your saved listings from your user profile dashboard.
- **Add Reviews**: Leave reviews and ratings for listings you've visited.
- **Manage Profile**: Update your profile information and view your listings and wishlist.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5, EJS (Embedded JavaScript templating)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Passport.js (passport-local-mongoose for user authentication)
- **File Upload**: Cloudinary, Multer
- **Maps**: Mapbox API

## Contributing

If you want to contribute to this project, feel free to fork the repository and submit a pull request.

Steps to Contribute:
1. Fork the repository.
2. Create a new branch for your feature/fix.
3. Make your changes and commit them with a clear message.
4. Push your changes and open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the contributors and the open-source community.
- Inspired by various travel booking platforms.

### Customization

- **Project Features**: Adjust the project features and description to match your application. You can expand or modify sections based on the actual features of your app.
- **Technologies Used**: If you're using different libraries or technologies, feel free to update this section.
- **Contributing**: If you want to allow contributions, explain the process; otherwise, you can remove this section.
- **License**: If you use a specific license, include the proper file, or simply remove it if you're not using any license.

