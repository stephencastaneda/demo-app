export default function handler(req, res) {
    if (req.method === 'POST') {
      // You can access the form data using req.body
      const { email, password } = req.body;
  
      // Perform authentication logic here (e.g., check against a database)
      // For this example, we'll just use some mock data
      const users = [
        { id: 1, email: 'test@example.com', password: 'password123' },
        { id: 2, email: 'user@example.com', password: 'test123' },
      ];
  
      const user = users.find((user) => user.email === email && user.password === password);
  
      if (user) {
        // Mock user data to return upon successful login
        const userData = {
          id: user.id,
          email: user.email,
          name: 'John Doe',
        };
  
        // Set a session or token to maintain user authentication
        // For this example, we'll just return the user data
        res.status(200).json({ success: true, data: userData });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
  }
  