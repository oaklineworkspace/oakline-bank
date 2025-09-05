
export default function handler(req, res) {
  if (req.method === 'POST') {
    const applicationData = req.body;
    
    // Here you would normally save to database
    // For now, we'll simulate a successful response
    const applicationId = Date.now().toString();
    
    console.log('Application received:', applicationData);
    
    res.status(200).json({ 
      id: applicationId, 
      message: 'Application submitted successfully' 
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
