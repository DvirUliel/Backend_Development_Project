# Cost Manager RESTful Web Services

This project is a RESTful web service that manages cost tracking for users. It provides APIs to add cost items, generate monthly reports, retrieve user details, and fetch information about the development team.

**Project Details:**
- **Database**: MongoDB (MongoDB Atlas)
- **Framework**: Express.js, Mongoose
- **Language**: JavaScript (Node.js)

### Features
- **Add Cost Items**: Allows adding a new cost item to the database.
- **Get Monthly Report**: Retrieve all cost items for a specific user in a given month and year.
- **Get User Details**: Fetch the details of a specific user including their total costs.
- **Get Developers Team**: Return a list of developers involved in the project.

### Tools
- **Communication Tool**: Slack 
- **Issue Tracking**: Jira 

### Database Structure
- **Users Collection**: Stores user data with fields:
  - `id`: Unique identifier
  - `first_name`: User's first name
  - `last_name`: User's last name
  - `birthday`: User's birthdate
  - `marital_status`: User's marital status

- **Costs Collection**: Stores cost items with fields:
  - `description`: Description of the cost
  - `category`: Category of the cost (e.g., food, health, etc.)
  - `userid`: Reference to the user who incurred the cost
  - `sum`: Amount spent
  - `date`: Date when the cost was incurred

### Endpoints

1. **POST /api/add**
   - Adds a new cost item.
   - Request body:
     ```json
     {
       "description": "Description of the cost",
       "category": "Category",
       "userid": "User ID",
       "sum": 100
     }
     ```
   - Response: JSON document describing the newly added cost item.

2. **GET /api/report?id=USER_ID&year=YEAR&month=MONTH**
   - Retrieves a monthly report for a specific user.
   - Query parameters: `id`, `year`, `month`
   - Response: JSON document containing cost items for the specified user.

3. **GET /api/users/:id**
   - Retrieves details of a specific user.
   - Response: JSON document containing the user’s first name, last name, ID, and total costs.

4. **GET /api/about**
   - Retrieves information about the development team.
   - Response: JSON document containing first and last names of each team member.

### Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/DvirUliel/Backend_Development_Project.git
   
2. Open the terminal in the folder project:
   ```bash
   cd Backend_Development_Project
   
3. Start the server:
   ```bash
   npm start

### Deployment

To deploy the project:

1. Ensure your MongoDB database is set up and connected using MongoDB Atlas.
2. Deploy the server to a cloud platform like Heroku, AWS, or any other platform of your choice.

### License

This project is licensed under the MIT License.

