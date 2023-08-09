// This is your test secret API key.
const stripe = require('stripe')('sk_test_51NbgtXSDWKDK1VWpTnNlRQsJ2RjTbr9kKs0W3eZq7d1BXOeEEZt1LYECCsfbb3jgI1PKh4pQ7Io27KffwpXQJK7900wrYTklst');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
 
  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));