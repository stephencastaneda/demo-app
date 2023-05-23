export default function handler(req, res) {
    if (req.method === 'POST') {
      // You can access the form data using req.body
      const { firstName, lastName, email, password } = req.body;
  
      // Perform registration logic here (e.g., store user in a database)
      // For this example, we'll just return the registered user data
      const registeredUser = {
        id: 3,
        firstName,
        lastName,
        email,
      };
  
      res.status(200).json({ success: true, data: registeredUser });
    } else {
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
  }
  