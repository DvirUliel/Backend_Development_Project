const request = require('supertest');
const app = require('../app');  

describe('Test API Endpoints', () => {

  // addCost
  // Test: Successfully adding a cost entry
  it('should successfully add a cost entry', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: "Test Cost",
        category: "food",
        userid: "123123",
        sum: 100,
        date: "2025-02-10"
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);  
    expect(response.body).toHaveProperty('description');
  });

  // Test: Missing required fields
  it('should return error when missing required fields', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        category: "Food"
      })
      .set('Content-Type', 'application/json');
  
    expect(response.status).toBe(400);  // 400 for bad request
    expect(response.body).toHaveProperty('error');
  });

  // Test: Invalid 'sum' type (string instead of number)
  it('should return error when sum is not a valid number', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: "Invalid Data",
        category: "food",
        userid: "123123",
        sum: "one hundred",  // This should fail
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);  // for bad request
    expect(response.body).toHaveProperty('error');
  });

  // Test: Negative value for 'sum'
  it('should return error when sum is negative', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: "Negative Test",
        category: "food",
        userid: "123123",
        sum: -50
      })
      .set('Content-Type', 'application/json');
  
    expect(response.status).toBe(400);  // for bad request
    expect(response.body).toHaveProperty('error', 'Cost validation failed: sum: Sum cannot be negative');
  });

  // getMonthlyReport
  // Test: Retrieving monthly report
  it('should retrieve monthly report', async () => {
    const response = await request(app).get('/api/report?id=123123&year=2025&month=2');
    expect(response.status).toBe(200);  // 200 for successful retrieval
    expect(response.body).toHaveProperty('costs'); // included costs in the output
    expect(Array.isArray(response.body.costs)).toBe(true); // it's an array
  });

  // Test: Missing required query parameters for monthly report
  it('should return error when missing query parameters for report', async () => {
    const response = await request(app).get('/api/report');
    expect(response.status).toBe(400);  // 400 for missing query parameters
    expect(response.body).toHaveProperty('error', 'Missing required query parameters');
  });

  // getUserDetails
  // Test: Fetch user details by valid user ID
  it('should return user details for a valid user', async () => {
    const response = await request(app).get('/api/users/123123');
    expect(response.status).toBe(200);  // 200 for successful retrieval
    expect(response.body).toHaveProperty('first_name', 'mosh'); 
    expect(response.body).toHaveProperty('last_name', 'israeli'); 
  });

  // Test: User not found
  it('should return error if user is not found', async () => {
    const response = await request(app).get('/api/users/99999');
    expect(response.status).toBe(404);  // 404 for user not found
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  // getAbout
  // Test: /about endpoint
  it('should return about information', async () => {
    const response = await request(app).get('/api/about');
    expect(response.status).toBe(200);  // 200 for successful retrieval
    expect(Array.isArray(response.body)).toBe(true); // must be an array
    expect(response.body).toHaveLength(2); // included two partners
    expect(response.body[0]).toHaveProperty('first_name', 'Dvir'); 
    expect(response.body[0]).toHaveProperty('last_name', 'Uliel'); 
    expect(response.body[1]).toHaveProperty('first_name', 'Moriya'); 
    expect(response.body[1]).toHaveProperty('last_name', 'Shalom');
  });

  // Test: Wrong method on /about
  it('should return 404 when POST method is used on /about', async () => {
    const response = await request(app).post('/api/about');
    expect(response.status).toBe(404);  // 405 for method not allowed
  });
});
